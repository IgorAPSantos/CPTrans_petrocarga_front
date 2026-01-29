import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// --- Configurações de Constantes ---
const LOGIN_PATH = '/autorizacao/login';

// 🚀 Instância Principal
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * INTERCEPTOR DE REQUISIÇÃO
 * Embora os cookies httpOnly sejam automáticos, manter o interceptor
 * permite adicionar logs de debug ou headers específicos no futuro.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Exemplo: Log de requisições em desenvolvimento
    // if (process.env.NODE_ENV === 'development') console.log(`🚀 Request: ${config.url}`);
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/**
 * INTERCEPTOR DE RESPOSTA
 * Tratamento global de erros e expiração de sessão.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isClient = typeof window !== 'undefined';

    // 401: Unauthorized (Sessão expirada ou Token inválido)
    if (error.response?.status === 401) {
      if (isClient) {
        const isLoginPage = window.location.pathname.includes(LOGIN_PATH);

        if (!isLoginPage) {
          // Limpeza opcional de algum dado no localStorage se houver
          // localStorage.removeItem('@Petrocarga:user');

          console.warn('Sessão expirada. Redirecionando...');
          window.location.href = LOGIN_PATH;
        }
      }
    }

    // Tratamento de erro padronizado para o console
    return Promise.reject(error);
  },
);
