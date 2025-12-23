import axios from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { jwtDecode } from 'jwt-decode';

const TOKEN_COOKIE_NAME = 'auth-token';

// 🚀 axios configurado para ENVIAR COOKIES automaticamente
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 🔥 CRÍTICO: Envia cookies automaticamente
});

// ---------------------
// Auth Helpers
// ---------------------

export const getUserFromToken = () => {
  // Verifica se estamos no cliente (cookies só existem no cliente)
  if (typeof window === 'undefined') {
    return null;
  }

  const { [TOKEN_COOKIE_NAME]: token } = parseCookies();

  if (!token) return null;

  try {
    const decoded = jwtDecode<{
      nome: string;
      id: string;
      permissao: 'ADMIN' | 'GESTOR' | 'MOTORISTA' | 'AGENTE';
      email: string;
      exp: number;
      iat: number;
    }>(token);

    // Verificar se o token expirou
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      console.warn('Token expirado, removendo cookie');
      removeAuthToken();
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};

export const setAuthToken = (newToken: string) => {
  setCookie(null, TOKEN_COOKIE_NAME, newToken, {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'none', // ⚠️ Mudança crítica
    secure: true,
  });

  // 🚨 ATENÇÃO: EventSource NÃO usa headers axios, apenas cookies
  // O withCredentials: true já garante que o cookie será enviado
  console.log('Token salvo como cookie para SSE');
};

export const removeAuthToken = () => {
  destroyCookie(null, TOKEN_COOKIE_NAME, { path: '/' });

  // Limpa cache do axios se necessário
  delete api.defaults.headers.common['Authorization'];
};

// ---------------------
// Interceptors para debug e tratamento de erros
// ---------------------

// Interceptor de request (debug)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const { [TOKEN_COOKIE_NAME]: token } = parseCookies();

      // DEBUG: Log das requisições em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('🌐 API Request:', {
          url: config.url,
          method: config.method,
          hasToken: !!token,
          withCredentials: config.withCredentials,
        });
      }

      // Se tiver token, adiciona como Bearer (para compatibilidade)
      if (token && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response (tratamento de erros)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Token inválido ou expirado
      if (status === 401) {
        console.warn('🔐 Token inválido/expirado, removendo cookie');
        removeAuthToken();

        // Se estiver no cliente, redireciona para login
        if (typeof window !== 'undefined') {
          window.location.href = '/autorizacao/login';
        }
      }

      // DEBUG: Log de erros em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ API Response Error:', {
          status: error.response.status,
          url: error.config?.url,
          method: error.config?.method,
          data: error.response.data,
        });
      }
    }

    return Promise.reject(error);
  }
);

// ---------------------
// Utilitários para verificar autenticação
// ---------------------

/**
 * Verifica se o usuário está autenticado (tem cookie válido)
 */
export const isAuthenticated = (): boolean => {
  return !!getUserFromToken();
};

/**
 * Obtém o token JWT atual do cookie
 */
export const getCurrentToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const { [TOKEN_COOKIE_NAME]: token } = parseCookies();
  return token || null;
};

/**
 * Verifica se o token está próximo de expirar (menos de 1 hora)
 */
export const isTokenNearExpiry = (): boolean => {
  const user = getUserFromToken();
  if (!user || !user.exp) return false;

  const now = Math.floor(Date.now() / 1000);
  const oneHour = 60 * 60;

  return user.exp - now < oneHour;
};
