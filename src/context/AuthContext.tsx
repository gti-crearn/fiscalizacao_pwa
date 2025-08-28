// src/context/AuthContext.tsx
"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { api } from "../services/api";
import {jwtDecode} from "jwt-decode";


// Tipagem do payload do token (conforme o que sua API coloca dentro do JWT)
interface JwtPayload {
    sub: number;
    email: string;
    username: string;
    name?: string;   // 👈 adicionando o name (opcional caso a API nem sempre envie)
    roles: string[];
    iat: number;
    exp: number;
  }
  
  // Tipagem do usuário que vamos armazenar no contexto
  interface User {
    id: number;
    email: string;
    username: string;
    name?: string;   // 👈 também aqui
    roles: string[];
  }

// Tipagem do contexto
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
}

// Tipagem para o Provider
interface AuthProviderProps {
  children: ReactNode;
}

// Criando o Context tipado
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useAuth = (): AuthContextType => {
  
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Provider do contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  

  const API_URL = "/auth/login";

  // Verifica se já existe um token ao carregar o app
  useEffect(() => {
    const token = Cookies.get("authToken");
    const userData = Cookies.get("user");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
    setLoading(false); // Finaliza o carregamento inicial
  }, []);

 // Dentro da função login:
const login = async (username: string, password: string) => {
    try {
      setError("");
      setLoading(true);
  
      const response = await api.post("/auth/login", { username, password }, {
        headers: { "Content-Type": "application/json" },
      });
  
      const { access_token } = response.data;
  
      // 🔑 Decodifica o JWT
      const decoded = jwtDecode<JwtPayload>(access_token);
  
      // Monta o objeto usuário
      const userData: User = {
        id: decoded.sub,
        email: decoded.email,
        username: decoded.username,
        name: decoded.name,  // 👈 agora captura também o name
        roles: decoded.roles,
      };
  
      // Salva no cookie
      Cookies.set("authToken", access_token, { expires: 7 });
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });
  
      setUser(userData);
      return { access_token, user: userData };
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao fazer login";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // Função de logout
  const logout = () => {
    Cookies.remove("authToken");
    Cookies.remove("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
