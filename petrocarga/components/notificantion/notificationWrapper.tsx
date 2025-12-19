'use client';

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ReactNode } from "react";

interface NotificationWrapperProps {
  children: ReactNode;
}

export function NotificationWrapper({ children }: NotificationWrapperProps) {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
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