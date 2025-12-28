import axios from 'axios';

// 🚀 CONFIGURAÇÃO PRINCIPAL
// O withCredentials: true é o segredo. Ele diz ao navegador:
// "Envie os cookies httpOnly ocultos junto com essa requisição"
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// ---------------------
// Interceptors Limpos
// ---------------------

// REQUEST: Não precisamos fazer NADA.
// O navegador injeta o cookie automaticamente antes de sair.
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE: Tratamento global de erros (Sessão Expirada)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se recebermos 401 (Unauthorized), significa que o cookie
    // expirou, foi adulterado ou não existe.
    if (error.response?.status === 401) {
      // Verificação para rodar apenas no browser (client-side)
      if (typeof window !== 'undefined') {
        // 🛡️ Proteção contra Loop Infinito:
        // Só redireciona se o usuário JÁ NÃO ESTIVER na tela de login.
        if (!window.location.pathname.includes('/autorizacao/login')) {
          console.warn('Sessão expirada. Redirecionando para login...');
          window.location.href = '/autorizacao/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
