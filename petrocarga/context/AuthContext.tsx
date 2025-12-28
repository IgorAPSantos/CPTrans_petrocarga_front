'use client';

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { api } from '@/service/api';

// Ajustei a interface. Como não decodificamos mais o token,
// dependemos do que a rota /me retorna.
interface UserData {
  id: string;
  nome: string;
  email: string;
  permissao: 'ADMIN' | 'GESTOR' | 'MOTORISTA' | 'AGENTE';
  // exp e iat geralmente não vêm na rota /me, a menos que o back retorne explicitamente
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  login: (data: { email: string; senha: string }) => Promise<UserData>;
  logout: () => void;
  refreshUser: () => Promise<void>; // Agora é assíncrona
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Função centralizada para buscar dados do usuário no Backend
  const refreshUser = useCallback(async () => {
    try {
      // O cookie httpOnly vai automaticamente aqui
      const response = await api.get('/petrocarga/auth/me');
      setUser(response.data);
    } catch (error) {
      // Se der erro (ex: 401), o usuário não está logado
      setUser(null);
    }
  }, []);

  // 1. Carregar usuário ao iniciar o App
  useEffect(() => {
    async function init() {
      await refreshUser();
      setLoading(false);
    }
    init();
  }, [refreshUser]);

  const isAuthenticated = !!user;

  // 2. Login
  async function login({ email, senha }: { email: string; senha: string }) {
    try {
      // Passo A: Envia credenciais. Backend define o Cookie httpOnly
      await api.post('petrocarga/auth/login', { email, senha });

      // Passo B: Valida imediatamente chamando o /me
      const response = await api.get('/petrocarga/auth/me');
      const userData = response.data;

      setUser(userData);

      console.log('✅ Login realizado via HttpOnly');

      // Retornamos os dados para a página de Login poder fazer o switch/redirect
      return userData;
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  }

  // 3. Logout
  async function logout() {
    try {
      // Avisa o backend para invalidar o cookie
      await api.post('/petrocarga/auth/logout');
    } catch (error) {
      console.error('Erro ao notificar logout ao servidor', error);
    } finally {
      setUser(null);
      // Força limpeza total e redirecionamento
      window.location.href = '/autorizacao/login';
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
