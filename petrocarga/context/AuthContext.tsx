'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { parseCookies } from 'nookies';
import {
  api,
  removeAuthToken,
  setAuthToken,
  getUserFromToken,
  getCurrentToken,
} from '@/service/api';

interface DecodedToken {
  id: string;
  nome: string;
  email: string;
  permissao: 'ADMIN' | 'GESTOR' | 'MOTORISTA' | 'AGENTE';
  exp: number;
  iat: number;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: DecodedToken | null;
  loading: boolean;
  login: (data: { email: string; senha: string }) => Promise<DecodedToken>;
  logout: () => void;
  refreshUser: () => void; // 🆕 Nova função para atualizar usuário
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do cookie quando o app inicia
  useEffect(() => {
    const loadUser = () => {
      const userData = getUserFromToken();
      setUser(userData);
      setLoading(false);

      if (userData) {
        console.log('✅ Usuário carregado do cookie:', userData.nome);
      } else {
        console.log('ℹ️ Nenhum usuário autenticado encontrado');
      }
    };

    loadUser();
  }, []);

  const isAuthenticated = !!user;

  // 🆕 Função para recarregar usuário (útil quando token é atualizado)
  const refreshUser = () => {
    const userData = getUserFromToken();
    setUser(userData);
  };

  async function login({ email, senha }: { email: string; senha: string }) {
    try {
      const response = await api.post('petrocarga/auth/login', {
        email,
        senha,
      });

      const { token } = response.data;

      if (!token) {
        throw new Error('Token não recebido do servidor');
      }

      // 🔥 Salva o token como COOKIE (para SSE funcionar)
      setAuthToken(token);

      // Recarrega os dados do usuário
      refreshUser();

      console.log('✅ Login realizado com sucesso');
      return getUserFromToken()!;
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  }

  function logout() {
    removeAuthToken();
    setUser(null);
    window.location.href = '/autorizacao/login';
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        refreshUser, // 🆕 Exporta a função
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
