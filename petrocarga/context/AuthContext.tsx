"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
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
  setToken: Dispatch<SetStateAction<string | undefined>>;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  }, []);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  /**
   * 🔹 Logout limpa tudo
   */
  const logout = () => {
    setTokenState(undefined);
    setUserState(undefined);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setToken: setTokenState,
        setUser: setUserState,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
