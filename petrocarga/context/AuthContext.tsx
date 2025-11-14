// "use client";
// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
//   Dispatch,
//   SetStateAction,
// } from "react";

// interface User {
//   id: string;
//   nome: string;
//   email: string;
//   permissao: string;
//   motoristaId?: string;
// }

// interface AuthContextType {
//   token?: string;
//   user?: User;
//   setToken: Dispatch<SetStateAction<string | undefined>>;
//   setUser: Dispatch<SetStateAction<User | undefined>>;
//   logout: () => void;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [token, setTokenState] = useState<string | undefined>(undefined);
//   const [user, setUserState] = useState<User | undefined>(undefined);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const savedToken = sessionStorage.getItem("token") || undefined;
//     const savedUser = sessionStorage.getItem("user");

//     setTokenState(savedToken);

//     if (savedUser) {
//       try {
//         setUserState(JSON.parse(savedUser));
//       } catch {
//         setUserState(undefined);
//       }
//     }

//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     if (token) {
//       sessionStorage.setItem("token", token);
//     } else {
//       sessionStorage.removeItem("token");
//     }
//   }, [token]);

//   useEffect(() => {
//     if (user) {
//       sessionStorage.setItem("user", JSON.stringify(user));
//     } else {
//       sessionStorage.removeItem("user");
//     }
//   }, [user]);

//   /**
//    * 🔹 Logout limpa tudo
//    */
//   const logout = () => {
//     setTokenState(undefined);
//     setUserState(undefined);
//     sessionStorage.removeItem("token");
//     sessionStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         setToken: setTokenState,
//         setUser: setUserState,
//         logout,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// /**
//  * Hook para acessar o contexto de autenticação
//  */
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth deve ser usado dentro de um AuthProvider");
//   }
//   return context;
// }

'use client';

import { createContext, useState, useEffect } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { jwtDecode }from 'jwt-decode';
import { api, removeAuthToken, setAuthToken } from '@/service/api';

interface User {
  id: string;
  nome: string;
  email: string;
  permissao: 'ADMIN' | 'USER' | 'MOTORISTA';
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>; // Corrigir tipagem para email e senha
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { 'petrocarga.user': token } = parseCookies();7
    if (token) {
      try {
        const decodedToken = jwtDecode<User>(token)
        setUser(decodedToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.error('Token inválido', e);
        removeAuthToken();
      }
    }
    setLoading(false);
  }, []);

  const isAuthenticated = !!user;

  async function login({ email, password }: any) { 
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    setAuthToken(token);
    const decodedToken = jwtDecode<User>(token);
    setUser(decodedToken);
    // TODO: redirecionar usuario apos login
  }

  function logout() {
    removeAuthToken();
    setUser(null);
    //TODO: redirecionar para tela de login
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};