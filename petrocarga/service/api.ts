import axios from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { jwtDecode } from 'jwt-decode';

const TOKEN_COOKIE_NAME = 'auth-token';

// axios sem token global — usado apenas no client e quando necessário
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// ---------------------
// Auth Helpers
// ---------------------

export const getUserFromToken = () => {
  const { [TOKEN_COOKIE_NAME]: token } = parseCookies();

  if (!token) return null;

  try {
    return jwtDecode<{
      nome: string;
      id: string;
      permissao: 'ADMIN' | 'GESTOR' | 'MOTORISTA' | 'AGENTE';
      email: string;
    }>(token);
  } catch {
    return null;
  }
};

export const setAuthToken = (newToken: string) => {
  setCookie(undefined, TOKEN_COOKIE_NAME, newToken, {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
};

export const removeAuthToken = () => {
  destroyCookie(undefined, TOKEN_COOKIE_NAME, { path: '/' });
};
