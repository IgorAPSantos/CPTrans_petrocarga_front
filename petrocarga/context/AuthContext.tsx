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

  const identificarTipoLogin = useCallback(
    (identificador: string): 'email' | 'cpf' | 'invalido' => {
      if (!identificador.trim()) return 'invalido';

      const apenasNumeros = identificador.replace(/\D/g, '');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailRegex.test(identificador)) {
        return 'email';
      } else if (apenasNumeros.length === 11 && /^\d+$/.test(identificador)) {
        return 'cpf';
      } else if (apenasNumeros.length > 0 && /^\d+$/.test(identificador)) {
        return 'cpf';
      }

      return 'invalido';
    },
    [],
  );

  const login = useCallback(
    async ({
      login: identificador,
      senha,
    }: {
      login: string;
      senha: string;
    }) => {
      try {
        const tipo = identificarTipoLogin(identificador);

        if (tipo === 'invalido') {
          throw new Error(
            'Formato inválido. Use email ou CPF (apenas números)',
          );
        }

        const dadosLogin =
          tipo === 'email'
            ? {
                email: identificador.trim().toLowerCase(),
                senha,
              }
            : {
                cpf: identificador.replace(/\D/g, ''),
                senha,
              };

        console.log('Tentando login com:', dadosLogin);

        await api.post('petrocarga/auth/login', dadosLogin);

        const response = await api.get('/petrocarga/auth/me');
        const userData = response.data;

        setUser(userData);
        return userData;
      } catch (error: any) {
        console.error('Erro no login:', error);

        let mensagemErro = 'Credenciais inválidas ou conta não ativada.';

        if (error.response?.data?.message) {
          const backendMessage = String(
            error.response.data.message,
          ).toLowerCase();

          if (backendMessage.includes('cpf')) {
            mensagemErro = 'CPF inválido. Verifique o formato.';
          } else if (backendMessage.includes('email')) {
            mensagemErro = 'Email inválido. Verifique o formato.';
          } else if (
            backendMessage.includes('senha') ||
            backendMessage.includes('password')
          ) {
            mensagemErro = 'Senha incorreta.';
          } else if (
            backendMessage.includes('formato') ||
            backendMessage.includes('format')
          ) {
            mensagemErro =
              'Formato inválido. Use email ou CPF (apenas números).';
          } else if (
            backendMessage.includes('desativado') ||
            backendMessage.includes('inativo')
          ) {
            mensagemErro = 'Usuário desativado.';
          } else {
            mensagemErro = error.response.data.message || mensagemErro;
          }
        } else if (error.response?.status === 400) {
          mensagemErro = 'Erro na requisição. Verifique seus dados.';
        } else if (error.response?.status === 401) {
          mensagemErro = 'CPF/Email ou senha incorretos.';
        } else if (error.response?.status === 403) {
          mensagemErro =
            'Conta não ativada. Por favor, ative sua conta primeiro.';
        } else if (error.response?.status === 404) {
          mensagemErro = 'Usuário não encontrado. Verifique seu CPF/Email.';
        }

        throw new Error(mensagemErro);
      }
    },
    [identificarTipoLogin],
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
