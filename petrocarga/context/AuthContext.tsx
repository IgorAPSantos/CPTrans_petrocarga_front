"use client";

import { createContext, useState, useEffect } from "react";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { api, removeAuthToken, setAuthToken } from "@/service/api";

interface DecodedToken {
  id: string;
  nome: string;
  email: string;
  permissao: "ADMIN" | "GESTOR" | "MOTORISTA" | "AGENTE";
  exp: number;
  iat: number;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: DecodedToken | null;
  loading: boolean;
  login: (data: { email: string; senha: string }) => Promise<DecodedToken>;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do cookie quando o app inicia
  useEffect(() => {
    const { "auth-token": token } = parseCookies();

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        console.error("Token inválido:", err);
        removeAuthToken();
      }
    }

    setLoading(false);
  }, []);

  const isAuthenticated = !!user;

  async function login({ email, senha }: { email: string; senha: string }) {
    const response = await api.post("petrocarga/auth/login", {
      email,
      senha,
    });

    const { token } = response.data;

    // salva cookie + header
    setAuthToken(token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // decodifica token
    const decoded = jwtDecode<DecodedToken>(token);
    setUser(decoded);

    return decoded; // 🔹 retorna o usuário decodificado
  }

  function logout() {
    removeAuthToken();
    setUser(null);
    window.location.href = "/autorizacao/login";
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
