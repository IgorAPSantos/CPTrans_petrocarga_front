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
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  loadHistorico: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  reconnect: () => void;
}
