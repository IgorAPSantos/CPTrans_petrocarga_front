interface Notification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'RESERVA' | 'VAGA' | 'VEICULO' | 'MOTORISTA' | 'SISTEMA';
  lida: boolean;
  timestamp: string;
  metada: JSON;
}

interface NotificationContextData {
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
}