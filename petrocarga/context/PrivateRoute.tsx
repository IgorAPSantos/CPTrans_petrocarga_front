// src/components/PrivateRoute.tsx (Crie este arquivo)
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/hooks/useAuth'; // Ajuste o caminho
import { useRouter } from 'next/navigation';

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/autorizacao/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    // Pode colocar um Spinner bonito aqui
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
