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

  // Aguarda o mount completo
  if (!mounted || loading) {
    console.log('NotificationWrapper: Aguardando mount/loading...');
    return <>{children}</>;
  }

  // Se não está logado, não envolve com provider
  if (!isAuthenticated || !user?.id) {
    console.log('NotificationWrapper: Usuário não autenticado, pulando provider');
    return <>{children}</>;
  }

  // Usuário autenticado - envolve com provider
  console.log('NotificationWrapper: Envolvendo com provider para usuário:', user.id);
  
  return (
    <NotificationProvider
      usuarioId={user.id}
      maxNotifications={50}
      reconnectInterval={10000} // 10 segundos para reconexão
      enableSSE={true}
    >
      {children}
    </NotificationProvider>
  );
}