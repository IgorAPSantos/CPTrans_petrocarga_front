'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode, useMemo } from 'react';
import { parseCookies } from 'nookies';
import { getNotificacoesUsuario } from '@/lib/actions/notificacaoAction';
import { Notification, NotificationContextData } from '@/lib/types/notificacao';

// Contexto
const NotificationContext = createContext<NotificationContextData | undefined>(undefined);

// Provider Props
interface NotificationProviderProps {
  children: ReactNode;
  usuarioId: string;
  maxNotifications?: number;
  enableSSE?: boolean;
}

export function NotificationProvider({ 
  children,
  usuarioId,
  maxNotifications = 50,
  enableSSE = true
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const hasLoadedInitialRef = useRef(false);
  const apiUrlRef = useRef(process.env.NEXT_PUBLIC_API_URL || '');

  // 🔴 CARREGAR HISTÓRICO
  const loadHistorico = useCallback(async () => {
    if (!usuarioId) return;
    
    console.log('Carregando histórico para usuário:', usuarioId);
    setIsLoading(true);
    try {
      const result = await getNotificacoesUsuario(usuarioId);
      
      if (result.error) {
        console.error('Erro ao carregar histórico:', result.message);
        setError(result.message || 'Erro ao carregar notificações');
      } else {
        console.log('Histórico carregado:', result.notificacoes?.length || 0, 'notificações');
        setNotifications(result.notificacoes || []);
        setError(null);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico de notificações:', err);
      setError('Erro ao carregar notificações');
    } finally {
      setIsLoading(false);
    }
  }, [usuarioId]);

  // 🔴 ADICIONAR NOTIFICAÇÃO
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => {
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      
      const newNotifications = [notification, ...prev];
      return newNotifications.slice(0, maxNotifications);
    });
  }, [maxNotifications]);

  // 🔴 CONECTAR SSE - SEM RECONEXÃO
  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      console.log('SSE: Já conectado');
      return;
    }

    // Fecha conexão anterior se existir
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const { "auth-token": token } = parseCookies();
    if (!token) {
      console.error('SSE: Token JWT não encontrado nos cookies');
      setError('Usuário não autenticado. Faça login novamente.');
      return;
    }

    try {
      const url = `${apiUrlRef.current}/petrocarga/notificacoes/stream`;
      
      console.log('SSE: Conectando...', url);
      
      const eventSource = new EventSource(url, {
        withCredentials: true
      });

      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('SSE: Conexão estabelecida com sucesso');
        setIsConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          if (event.data.trim().startsWith('{') || event.data.trim().startsWith('[')) {
            const notification: Notification = JSON.parse(event.data);
            console.log('SSE: Nova notificação:', notification.titulo);
            addNotification(notification);
          }
        } catch (err) {
          console.error('SSE: Erro ao parsear mensagem:', err, event.data);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE: Erro na conexão', err);
        setIsConnected(false);
        setError('Conexão com servidor de notificações perdida');
        
        // 🔴 APENAS FECHA A CONEXÃO, SEM TENTAR RECONECTAR
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
      };

    } catch (err) {
      console.error('SSE: Erro ao criar EventSource:', err);
      setError('Erro ao iniciar conexão em tempo real');
      setIsConnected(false);
    }
  }, [addNotification]);

  // 🔴 DESCONECTAR SSE
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      console.log('SSE: Conexão fechada');
    }
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
    if (!usuarioId || usuarioId.trim() === "" || !enableSSE) {
      return;
    }

    const { "auth-token": token } = parseCookies();
    if (!token) {
      return;
    }

    console.log('NotificationProvider: Iniciando SSE para usuário', usuarioId);
    
    // Pequeno delay para garantir que o histórico foi carregado
    const timer = setTimeout(() => {
      connect();
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      console.log('NotificationProvider: Cleanup SSE');
      disconnect();
    };
  }, [usuarioId, enableSSE, connect, disconnect]);

  // 🔴 FUNÇÃO PARA RECONECTAR MANUALMENTE (OPCIONAL)
  const reconnect = useCallback(() => {
    console.log('SSE: Reconexão manual solicitada');
    disconnect();
    setTimeout(() => {
      connect();
    }, 500);
  }, [connect, disconnect]);

  // 🔴 OUTRAS FUNÇÕES
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, lida: true }))
    );
  }, []);

  const refreshNotifications = useCallback(async () => {
    await loadHistorico();
  }, [loadHistorico]);

  // 🔴 VALOR DO CONTEXTO
  const contextValue = useMemo(() => ({
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
    reconnect, // 🔴 ADICIONADO PARA RECONEXÃO MANUAL
  }), [
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
  ]);

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
      reconnect: () => {}, // 🔴 ADICIONADO
    };
  }
  
  return context;
}