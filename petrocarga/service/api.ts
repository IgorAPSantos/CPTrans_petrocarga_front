import { parseCookies, setCookie, destroyCookie } from "nookies";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

const TOKEN_COOKIE_NAME = "auth-token";

const { [TOKEN_COOKIE_NAME]: token } = parseCookies();

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      destroyCookie(undefined, TOKEN_COOKIE_NAME);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const getUserFromToken = () => {
  const { [TOKEN_COOKIE_NAME]: token } = parseCookies();

  if (!token) return null;

  try {
    return jwtDecode(token) as {
      nome: string;
      id: string;
      permissao: "ADMIN" | "GESTOR" | "MOTORISTA" | "AGENTE";
      email: string;
    };
  } catch {
    return null;
  }
};

export const setAuthToken = (newToken: string) => {
  setCookie(undefined, TOKEN_COOKIE_NAME, newToken, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
};

export const removeAuthToken = () => {
  destroyCookie(undefined, TOKEN_COOKIE_NAME);
  delete api.defaults.headers.common["Authorization"];
};

export const checkPermission = (allowed: string[]) => {
  const user = getUserFromToken();

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return false;
  }

  if (!allowed.includes(user.permissao)) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return false;
  }

  return true;
};
