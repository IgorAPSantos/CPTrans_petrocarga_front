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
  login: string;
  permissao: 'ADMIN' | 'GESTOR' | 'MOTORISTA' | 'AGENTE';
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  login: (data: { login: string; senha: string }) => Promise<UserData>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

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
    async ({
      login: identificador,
      senha,
    }: {
      login: string;
      senha: string;
    }) => {
      try {
        // Determinar se é email ou CPF
        const isEmail = identificador.includes('@');

        // Formatar dados conforme backend Java espera
        const dadosLogin = isEmail
          ? { email: identificador.trim(), senha }
          : { cpf: identificador.replace(/\D/g, ''), senha };

        await api.post('petrocarga/auth/login', dadosLogin);

        const response = await api.get('/petrocarga/auth/me');
        const userData = response.data;

        setUser(userData);
        return userData;
      } catch (error: any) {
        console.error('Erro no login:', error);

        // Tratamento básico de erros
        let mensagemErro = 'Credenciais inválidas ou conta não ativada.';

        if (error.response?.data?.includes?.('Usuário desativado')) {
          mensagemErro = 'Usuário desativado.';
        } else if (error.response?.status === 400) {
          mensagemErro = 'Formato inválido. Use email ou CPF válido.';
        }

        throw new Error(mensagemErro);
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
