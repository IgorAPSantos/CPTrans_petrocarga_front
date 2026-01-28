'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  deletarNotificacao,
  getNotificacoesUsuario,
  marcarNotificacaoComoLida,
  marcarTodasNotificacoesComoLidas,
  deletarNotificacoesSelecionadas,
} from '@/lib/api/notificacaoApi';
import {
  Notification,
  NotificationContextData,
  NotificationProviderProps,
} from '@/lib/types/notificacao';

// Contexto
const NotificationContext = createContext<NotificationContextData | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
  usuarioId,
  maxNotifications = 50,
  enableSSE = true,
  autoReconnect = true,
  reconnectMaxAttempts = 5,
  reconnectInitialDelayMs = 1000,
  reconnectMaxDelayMs = 30000,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const hasLoadedInitialRef = useRef(false);
  const apiUrlRef = useRef(process.env.NEXT_PUBLIC_API_URL || '');
  const retryCountRef = useRef(0);
  const reconnectTimerRef = useRef<number | null>(null);

  // CARREGAR HISTÓRICO
  const loadHistorico = useCallback(
    async (silent = false) => {
      if (!usuarioId) return;

      if (!silent) setIsLoading(true);

      try {
        const result = await getNotificacoesUsuario(usuarioId);

        if (result.error) {
          setError(result.message || 'Erro ao carregar notificações');
        } else {
          const novasNotificacoes = result.notificacoes || [];

          setNotifications((prev) => {
            const map = new Map(prev.map((n) => [n.id, n]));
            novasNotificacoes.forEach((n: Notification) => map.set(n.id, n));

            return Array.from(map.values())
              .sort(
                (a, b) =>
                  new Date(b.criada_em).getTime() -
                  new Date(a.criada_em).getTime(),
              )
              .slice(0, maxNotifications);
          });

          setError(null);
        }
      } catch {
        setError('Erro ao carregar notificações');
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [usuarioId, maxNotifications],
  );

  // ADICIONAR NOTIFICAÇÃO
  const addNotification = useCallback(
    (notification: Notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev].slice(0, maxNotifications);
      });
    },
    [maxNotifications],
  );

  // REMOVER NOTIFICAÇÃO
  const removeNotification = useCallback(
    async (id: string) => {
      try {
        const result = await deletarNotificacao(usuarioId, id);
        if (!result.error) {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }
      } catch {}
    },
    [usuarioId],
  );

  // DELETAR SELECIONADAS
  const deleteSelectedNotifications = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;

      const result = await deletarNotificacoesSelecionadas(usuarioId, ids);
      if (!result.error) {
        setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
      } else {
        throw new Error(result.message);
      }
    },
    [usuarioId],
  );

  // MARCAR COMO LIDA
  const markAsRead = useCallback(async (id: string) => {
    const result = await marcarNotificacaoComoLida(id);
    if (!result.error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n)),
      );
    }
  }, []);

  // MARCAR SELECIONADAS COMO LIDAS
  const markSelectedAsRead = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;

      const result = await marcarTodasNotificacoesComoLidas(usuarioId, ids);
      if (!result.error) {
        setNotifications((prev) =>
          prev.map((n) => (ids.includes(n.id) ? { ...n, lida: true } : n)),
        );
      } else {
        throw new Error(result.message);
      }
    },
    [usuarioId],
  );

  // CONECTAR SSE
  const connect = useCallback(() => {
    if (
      eventSourceRef.current?.readyState === EventSource.OPEN ||
      !usuarioId ||
      typeof window === 'undefined'
    )
      return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const eventSource = new EventSource(
      `${apiUrlRef.current}/petrocarga/notificacoes/stream`,
      { withCredentials: true },
    );

    eventSourceRef.current = eventSource;

    const handleIncoming = (data: string | null) => {
      if (!data) return;
      try {
        const parsed = JSON.parse(data.trim());
        addNotification({
          id: parsed.id,
          titulo: parsed.titulo,
          mensagem: parsed.mensagem,
          tipo: parsed.tipo,
          lida: parsed.lida ?? false,
          criada_em:
            parsed.criadaEm ?? parsed.criada_em ?? new Date().toISOString(),
          metadata: parsed.metadata,
        });
      } catch {}
    };

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
      retryCountRef.current = 0;
      loadHistorico(true);
    };

    eventSource.onmessage = (e) => handleIncoming(e.data);
    eventSource.addEventListener('notificacao', (e) =>
      handleIncoming((e as MessageEvent).data),
    );

    eventSource.onerror = () => {
      setIsConnected(false);
      setError('Conexão com servidor de notificações perdida');
      eventSource.close();
      eventSourceRef.current = null;

      if (autoReconnect && retryCountRef.current < reconnectMaxAttempts) {
        retryCountRef.current += 1;
        const delay = Math.min(
          reconnectInitialDelayMs *
            Math.pow(2, retryCountRef.current - 1),
          reconnectMaxDelayMs,
        );

        reconnectTimerRef.current = window.setTimeout(connect, delay);
      }
    };
  }, [
    usuarioId,
    addNotification,
    autoReconnect,
    reconnectMaxAttempts,
    reconnectInitialDelayMs,
    reconnectMaxDelayMs,
    loadHistorico,
  ]);

  // DESCONECTAR SSE
  const disconnect = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    retryCountRef.current = 0;
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (usuarioId && !hasLoadedInitialRef.current) {
      hasLoadedInitialRef.current = true;
      loadHistorico();
    }
  }, [usuarioId, loadHistorico]);

  useEffect(() => {
    if (!usuarioId) return;

    connect();
    return disconnect;
  }, [usuarioId, connect, disconnect]);

  const refreshNotifications = useCallback(
    async () => loadHistorico(),
    [loadHistorico],
  );

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 500);
  }, [connect, disconnect]);

  const contextValue = useMemo(
    () => ({
      notifications,
      isConnected,
      isLoading,
      error,
      addNotification,
      removeNotification,
      markAsRead,
      markSelectedAsRead,
      deleteSelectedNotifications,
      loadHistorico,
      refreshNotifications,
      reconnect,
    }),
    [
      notifications,
      isConnected,
      isLoading,
      error,
      addNotification,
      removeNotification,
      markAsRead,
      markSelectedAsRead,
      deleteSelectedNotifications,
      loadHistorico,
      refreshNotifications,
      reconnect,
    ],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook
export function useNotifications() {
  return (
    useContext(NotificationContext) ?? {
      notifications: [],
      isConnected: false,
      isLoading: false,
      error: null,
      addNotification: () => {},
      removeNotification: async () => {},
      markAsRead: async () => {},
      markSelectedAsRead: async () => {},
      deleteSelectedNotifications: async () => {},
      loadHistorico: async () => {},
      refreshNotifications: async () => {},
      reconnect: () => {},
    }
  );
}
