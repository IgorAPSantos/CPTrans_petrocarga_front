"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  nome: string;
  email: string;
  permissao: string;
  motoristaId?: string;
}

interface AuthContextType {
  token?: string;
  user?: User;
  setToken: (token?: string) => void;
  setUser: (user?: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | undefined>(undefined);
  const [user, setUserState] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token") || undefined;
    const savedUser = sessionStorage.getItem("user");
    setTokenState(savedToken);
    if (savedUser) {
      try {
        setUserState(JSON.parse(savedUser));
      } catch {
        setUserState(undefined);
      }
    }
    setLoading(false);

    if (savedToken)
      console.log("🎯 Token carregado do sessionStorage:", savedToken);
    if (savedUser)
      console.log("🎯 Usuário carregado do sessionStorage:", savedUser);
  }, []);

  const setToken = (newToken?: string) => {
    if (newToken) {
      sessionStorage.setItem("token", newToken);
      console.log("💾 Token salvo no sessionStorage:", newToken);
    } else {
      sessionStorage.removeItem("token");
      console.log("🧹 Token removido do sessionStorage");
    }
    setTokenState(newToken);
  };

  const setUser = (newUser?: User) => {
    if (newUser) {
      sessionStorage.setItem("user", JSON.stringify(newUser));
      console.log("💾 Usuário salvo no sessionStorage:", newUser);
    } else {
      sessionStorage.removeItem("user");
      console.log("🧹 Usuário removido do sessionStorage");
    }
    setUserState(newUser);
  };

  const logout = () => {
    setToken(undefined);
    setUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, setToken, setUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
