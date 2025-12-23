'use client';

import { useAuth } from '@/context/AuthContext'; // Use o hook correto
import { NotificationProvider } from '@/context/NotificationContext';
import { ReactNode } from 'react';

interface NotificationWrapperProps {
  children: ReactNode;
}

export function NotificationWrapper({ children }: NotificationWrapperProps) {
  const { isAuthenticated, user, loading } = useAuth(); // Use o hook

  if (loading) {
    return <>{children}</>;
  }

  if (!isAuthenticated || !user?.id) {
    return <>{children}</>;
  }

  return (
    <NotificationProvider
      usuarioId={user.id}
      maxNotifications={50}
      enableSSE={true}
    >
      {children}
    </NotificationProvider>
  );
}
