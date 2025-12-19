'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { parseCookies } from 'nookies';
import { getNotificacoesUsuario } from '@/lib/actions/notificacaoAction';

// Contexto
const NotificationContext = createContext<NotificationContextData | undefined>(undefined);

// Provider Props
interface NotificationProviderProps {
  children: ReactNode;
  usuarioId: string;
  maxNotifications?: number;
  reconnectInterval?: number;
  enableSSE?: boolean;
}

export function NotificationProvider({ 
  children,
  usuarioId,
  maxNotifications = 50,
  reconnectInterval = 5000,
  enableSSE = true
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(true);

  // Carregar histórico de notificações
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

  // Versão pública para refresh
  const refreshNotifications = useCallback(async () => {
    await loadHistorico();
  }, [loadHistorico]);

  // Adicionar notificação (recebida via SSE)
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => {
      // Evita duplicatas
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      
      const newNotifications = [notification, ...prev];
      // Limita o número máximo de notificações
      return newNotifications.slice(0, maxNotifications);
    });
  }, [maxNotifications]);

  // Remover notificação
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Limpar todas as notificações
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Marcar como lida
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  }, []);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, lida: true }))
    );
  }, []);

  // Conectar ao SSE
  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('SSE: Já conectado');
      return;
    }

    const { "auth-token": token } = parseCookies();
    if (!token) {
      console.error('SSE: Token JWT não encontrado nos cookies');
      setError('Usuário não autenticado. Faça login novamente.');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const url = `${apiUrl}/petrocarga/notificacoes/stream`;
      
      console.log('SSE: Conectando...', url);
      
      const eventSource = new EventSource(url, {
        withCredentials: true
      });

      eventSourceRef.current = eventSource;

      // Evento: conexão aberta
      eventSource.onopen = () => {
        console.log('SSE: Conexão estabelecida com sucesso');
        setIsConnected(true);
        setError(null);
      };

      // Evento: mensagem recebida
      eventSource.onmessage = (event) => {
        try {
          console.log('SSE: Mensagem recebida:', event.data);
          
          if (event.data.trim().startsWith('{') || event.data.trim().startsWith('[')) {
            const notification: Notification = JSON.parse(event.data);
            console.log('SSE: Nova notificação:', notification.titulo);
            addNotification(notification);
          } else {
            console.log('SSE: Mensagem não-JSON:', event.data);
          }
        } catch (err) {
          console.error('SSE: Erro ao parsear mensagem:', err, event.data);
        }
      };

      // Eventos customizados
      eventSource.addEventListener('notification', (event: MessageEvent) => {
        try {
          const notification: Notification = JSON.parse(event.data);
          console.log('SSE: Notificação customizada:', notification.titulo);
          addNotification(notification);
        } catch (err) {
          console.error('SSE: Erro ao parsear notificação customizada:', err);
        }
      });

      eventSource.addEventListener('ping', () => {
        console.log('SSE: Ping recebido');
      });

      // Evento: erro
      eventSource.onerror = (err) => {
        console.error('SSE: Erro na conexão', err);
        setIsConnected(false);
        setError('Conexão com servidor de notificações perdida');

        // Fecha a conexão atual
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }

        // Tenta reconectar SSE se permitido
        if (shouldReconnectRef.current) {
          console.log(`SSE: Tentando reconectar em ${reconnectInterval}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('SSE: Reconectando...');
            connect();
          }, reconnectInterval);
        }
      };

    } catch (err) {
      console.error('SSE: Erro ao criar EventSource:', err);
      setError('Erro ao iniciar conexão em tempo real');
      setIsConnected(false);
    }
  }, [addNotification, reconnectInterval]);

  // Desconectar SSE
  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;

    // Limpa timeout de reconexão
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Fecha conexão SSE
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      console.log('SSE: Conexão fechada');
    }
  }, []);

  // Efeito: carregar histórico ao montar
  useEffect(() => {
    if (usuarioId) {
      loadHistorico();
    }
  }, [usuarioId, loadHistorico]);

  // Efeito: gerenciar conexão SSE
  useEffect(() => {
    // Verificação rigorosa
    if (!usuarioId || usuarioId.trim() === "") {
      console.log('NotificationProvider: Sem usuarioId válido, não conectando');
      return;
    }

    const { "auth-token": token } = parseCookies();
    if (!token) {
      console.log('NotificationProvider: Token não encontrado');
      return;
    }

    console.log('NotificationProvider: Iniciando SSE para usuário', usuarioId);
    
    // Tenta conectar SSE se habilitado
    if (enableSSE) {
      shouldReconnectRef.current = true;
      connect();
    }

    // Cleanup
    return () => {
      console.log('NotificationProvider: Cleanup');
      disconnect();
    };
  }, [connect, disconnect, usuarioId, enableSSE]);

  // Valor do contexto
  const value: NotificationContextData = {
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
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook para usar o contexto
export function useNotifications() {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    // Retorna valores padrão se não estiver dentro do provider
    console.warn('useNotifications foi chamado fora do NotificationProvider. Retornando contexto vazio.');
    
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
      refreshNotifications: async () => {}
    };
  }
  
  return context;
}