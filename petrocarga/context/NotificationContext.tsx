'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
  useMemo,
} from 'react';
import { getNotificacoesUsuario } from '@/lib/api/notificacaoApi';
import { Notification, NotificationContextData } from '@/lib/types/notificacao';
import { logger } from '@/lib/logger';

// Contexto
const NotificationContext = createContext<NotificationContextData | undefined>(
  undefined
);

// Provider Props
interface NotificationProviderProps {
  children: ReactNode;
  usuarioId: string;
  maxNotifications?: number;
  enableSSE?: boolean;
  autoReconnect?: boolean;
  reconnectMaxAttempts?: number;
  reconnectInitialDelayMs?: number;
  reconnectMaxDelayMs?: number;
}

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

  // 🔴 CARREGAR HISTÓRICO (com merge inteligente)
  const loadHistorico = useCallback(
    async (silent = false) => {
      if (!usuarioId) return;

      logger.info('📥 Carregando histórico para usuário:', usuarioId);

      if (!silent) {
        setIsLoading(true);
      }

      try {
        const result = await getNotificacoesUsuario(usuarioId);

        if (result.error) {
          logger.error('❌ Erro ao carregar histórico:', result.message);
          setError(result.message || 'Erro ao carregar notificações');
        } else {
          const novasNotificacoes = result.notificacoes || [];

          logger.info(
            `✅ Histórico carregado: ${novasNotificacoes.length} notificações`
          );

          // 🆕 Merge inteligente: mantém notificações já existentes e adiciona novas
          setNotifications((prev) => {
            const notificacoesMap = new Map(prev.map((n) => [n.id, n]));

            // Adiciona/atualiza notificações do servidor
            novasNotificacoes.forEach((notif: Notification) => {
              notificacoesMap.set(notif.id, notif);
            });

            // Converte para array e ordena por timestamp (mais recente primeiro)
            const merged = Array.from(notificacoesMap.values()).sort(
              (a, b) =>
                new Date(b.criada_em).getTime() -
                new Date(a.criada_em).getTime()
            );

            return merged.slice(0, maxNotifications);
          });

          setError(null);
        }
      } catch (err) {
        logger.error('❌ Erro ao carregar histórico de notificações:', err);
        setError('Erro ao carregar notificações');
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [usuarioId, maxNotifications]
  );

  // 🔴 ADICIONAR NOTIFICAÇÃO (SSE)
  const addNotification = useCallback(
    (notification: Notification) => {
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) {
          logger.debug('⚠️ Notificação já existe, ignorando:', notification.id);
          return prev;
        }

        logger.info('🆕 Nova notificação adicionada:', notification.titulo);
        const newNotifications = [notification, ...prev];
        return newNotifications.slice(0, maxNotifications);
      });
    },
    [maxNotifications]
  );

  // 🔴 CONECTAR SSE
  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      logger.debug('SSE: Já conectado');
      return;
    }

    // Fecha conexão anterior se existir
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // Verificar se está no cliente
    if (typeof window === 'undefined') {
      logger.error('SSE: Tentativa de conexão no servidor');
      return;
    }

    // Verificar se há usuário
    if (!usuarioId) {
      logger.error('SSE: usuarioId não fornecido');
      return;
    }

    try {
      const baseUrl = `${apiUrlRef.current}/petrocarga/notificacoes/stream`;

      logger.info('SSE: Conectando via cookies para usuário:', usuarioId);

      // IMPORTANTE: withCredentials: true para enviar cookies
      const eventSource = new EventSource(baseUrl, {
        withCredentials: true,
      });

      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        logger.info('✅ SSE: Conexão estabelecida com sucesso via cookies!');
        setIsConnected(true);
        setError(null);
        retryCountRef.current = 0;

        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current as unknown as number);
          reconnectTimerRef.current = null;
        }

        // 🆕 Quando conectar, recarrega histórico para pegar notificações POST
        loadHistorico(true);
      };

      const handleIncoming = (data: string | null) => {
        if (!data) return;
        try {
          const trimmed = data.trim();
          if (!trimmed) return;
          const parsed = JSON.parse(trimmed);

          logger.debug('SSE: Notificação recebida:', parsed);

          // Normalizar para o formato do frontend
          const notification: Notification = {
            id: parsed.id,
            titulo: parsed.titulo,
            mensagem: parsed.mensagem,
            tipo: parsed.tipo,
            lida: parsed.lida || false,
            criada_em: parsed.criada_em || new Date().toISOString(),
            metadata: parsed.metadata,
          };

          logger.info('📨 SSE: Nova notificação:', notification.titulo);
          addNotification(notification);
        } catch (err) {
          logger.error('SSE: Erro ao parsear mensagem:', err, data);
        }
      };

      eventSource.onmessage = (event) => {
        handleIncoming(event.data);
      };

      eventSource.addEventListener('notification', (ev: Event) => {
        const me = ev as MessageEvent;
        handleIncoming(me.data);
      });

      eventSource.onerror = (err) => {
        logger.error('❌ SSE: Erro na conexão via cookies', {
          error: err,
          readyState: eventSource.readyState,
        });

        setIsConnected(false);
        setError('Conexão com servidor de notificações perdida');

        // Fecha a conexão atual
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }

        // Reconexão automática com backoff
        if (autoReconnect) {
          const attempts = reconnectMaxAttempts;
          if (attempts > 0 && retryCountRef.current >= attempts) {
            logger.warn('⚠️ SSE: Limite de tentativas de reconexão atingido');
            return;
          }

          retryCountRef.current += 1;
          const delay = Math.min(
            reconnectInitialDelayMs * Math.pow(2, retryCountRef.current - 1),
            reconnectMaxDelayMs
          );

          logger.info(
            `🔄 SSE: Reconectando em ${delay}ms (tentativa ${retryCountRef.current})`
          );

          if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current as unknown as number);
            reconnectTimerRef.current = null;
          }

          reconnectTimerRef.current = window.setTimeout(() => {
            reconnectTimerRef.current = null;
            connect();
          }, delay) as unknown as number;
        }
      };

      // Fechar SSE quando a aba/página for fechada
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
          }
        });
      }
    } catch (err) {
      logger.error('❌ SSE: Erro ao criar EventSource:', err);
      setError('Erro ao iniciar conexão em tempo real');
      setIsConnected(false);
    }
  }, [
    addNotification,
    usuarioId,
    autoReconnect,
    reconnectMaxAttempts,
    reconnectInitialDelayMs,
    reconnectMaxDelayMs,
    loadHistorico,
  ]);

  // 🔴 DESCONECTAR SSE
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current as unknown as number);
      reconnectTimerRef.current = null;
    }

    retryCountRef.current = 0;
    setIsConnected(false);
    logger.info('🔌 SSE: Conexão fechada');
  }, []);

  // 🔴 EFEITO: Carregar histórico UMA VEZ
  useEffect(() => {
    if (usuarioId && !hasLoadedInitialRef.current) {
      hasLoadedInitialRef.current = true;
      loadHistorico();
    }
  }, [usuarioId, loadHistorico]);

  // 🔴 EFEITO: Gerenciar conexão SSE
  useEffect(() => {
    if (!usuarioId || usuarioId.trim() === '') {
      return;
    }

    logger.info(
      '🚀 NotificationProvider: Iniciando SSE para usuário',
      usuarioId
    );

    let cancelled = false;

    const start = async () => {
      try {
        if (!hasLoadedInitialRef.current) {
          await loadHistorico();
          hasLoadedInitialRef.current = true;
        }

        if (cancelled) return;

        if (enableSSE) {
          connect();
        }
      } catch (err) {
        logger.error('NotificationProvider: Erro ao preparar SSE', err);
      }
    };

    start();

    return () => {
      cancelled = true;
      logger.debug('🧹 NotificationProvider: Cleanup SSE');
      disconnect();
    };
  }, [usuarioId, enableSSE, connect, disconnect, loadHistorico]);

  // 🔴 RECONECTAR MANUALMENTE
  const reconnect = useCallback(() => {
    logger.info('🔄 SSE: Reconexão manual solicitada');

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current as unknown as number);
      reconnectTimerRef.current = null;
    }

    retryCountRef.current = 0;
    disconnect();

    setTimeout(() => {
      connect();
    }, 500);
  }, [connect, disconnect]);

  // 🔴 OUTRAS FUNÇÕES
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, lida: true })));
  }, []);

  const refreshNotifications = useCallback(async () => {
    logger.info('🔄 Refresh manual solicitado');
    await loadHistorico();
  }, [loadHistorico]);

  // 🔴 VALOR DO CONTEXTO
  const contextValue = useMemo(
    () => ({
      notifications,
      isConnected,
      isLoading,
      error,
      addNotification,
      removeNotification,
      clearNotifications,
      markAsRead,
      markAllAsRead,
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
      clearNotifications,
      markAsRead,
      markAllAsRead,
      loadHistorico,
      refreshNotifications,
      reconnect,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook para usar o contexto
export function useNotifications() {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    return {
      notifications: [],
      isConnected: false,
      isLoading: false,
      error: null,
      addNotification: () => {},
      removeNotification: () => {},
      clearNotifications: () => {},
      markAsRead: () => {},
      markAllAsRead: () => {},
      loadHistorico: async () => {},
      refreshNotifications: async () => {},
      reconnect: () => {},
    };
  }

  return context;
}
