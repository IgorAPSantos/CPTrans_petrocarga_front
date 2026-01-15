import { ReactNode } from 'react';

export interface Notification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'RESERVA' | 'VAGA' | 'VEICULO' | 'MOTORISTA' | 'SISTEMA';
  lida: boolean;
  criada_em: string;
  metadata: Record<string, unknown>;
}

export interface NotificationContextData {
  notifications: Notification[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markSelectedAsRead: (ids: string[]) => Promise<void>;
  deleteSelectedNotifications: (ids: string[]) => Promise<void>;
  loadHistorico: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  reconnect: () => void;
}

export interface NotificationProviderProps {
  children: ReactNode;
  usuarioId: string;
  maxNotifications?: number;
  enableSSE?: boolean;
  autoReconnect?: boolean;
  reconnectMaxAttempts?: number;
  reconnectInitialDelayMs?: number;
  reconnectMaxDelayMs?: number;
}
