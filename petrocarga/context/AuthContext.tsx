'use client';

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/service/api';

interface UserData {
  id: string;
  nome: string;
  email: string;
  permissao: 'ADMIN' | 'GESTOR' | 'MOTORISTA' | 'AGENTE';
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean; // Mantido nome original
  login: (data: { email: string; senha: string }) => Promise<UserData>; // Agora retorna UserData de novo
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// Inicializamos com 'as AuthContextData' para evitar erros de tipagem nos componentes
export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get('/petrocarga/auth/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async ({ email, senha }: { email: string; senha: string }) => {
      try {
        await api.post('petrocarga/auth/login', { email, senha });

        const response = await api.get('/petrocarga/auth/me');
        const userData = response.data;

        setUser(userData);
        return userData;
      } catch (error: unknown) {
        console.error('Erro no login:', error);
        throw error;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/petrocarga/auth/logout');
    } catch (error) {
      console.error('Erro ao notificar logout', error);
    } finally {
      setUser(null);
      router.push('/autorizacao/login');
    }
  }, [router]);

  // O useMemo é essencial para performance, garantindo que o contexto
  // só notifique mudanças quando realmente necessário.
  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      loading,
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
