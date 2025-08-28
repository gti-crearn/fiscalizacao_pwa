// context/DataContext.tsx
"use client";

import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import { User, Target } from "@/utils/types";

// ✅ Importe as novas funções
import {
  salvarUserData,
  carregarTodosUsers,
  salvarTargets,
  carregarTodosTargets,
} from "@/services/idb";

type ProviderProps = { children: React.ReactNode };

interface Filters {
  numeroArt?: string;
  teamId?: string;
  status?: string;
}

interface AppContextInterface {
  userData: User[];
  isOffline: boolean;
  targets: Target[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  loading: boolean;
  fetchTargets: () => Promise<void>;
}

export const DataContext = createContext<AppContextInterface>({
  userData: [],
  isOffline: false,
  targets: [],
  filters: {},
  setFilters: () => {},
  loading: false,
  fetchTargets: async () => {},
});

export function DataProvider({ children }: ProviderProps) {
  const { user } = useAuth();

  const [userData, setUserData] = useState<User[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(false);

  /** Busca usuário logado (com fallback offline) */
  async function getUser() {
    if (!user?.id) return;
    try {
      const { data } = await api.get<User | User[]>(`/user/${user.id}`);
      const arr = Array.isArray(data) ? data : [data];
      setUserData(arr);
      await salvarUserData(arr);
      setIsOffline(false);
    } catch (error) {
      const all = await carregarTodosUsers();
      const onlyThisUser = all.filter((u) => String(u.id) === String(user.id));
      setUserData(onlyThisUser);
      setIsOffline(true);
    }
  }

  /** Busca alvos com filtros */
  const fetchTargets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.numeroArt) params.append("numeroArt", filters.numeroArt);
      if (filters.teamId) params.append("teamId", filters.teamId);
      if (filters.status) params.append("status", filters.status);

      const response = await api.get<Target[]>("/target", { params });
      const data = response.data;

      setTargets(data);
      // ✅ Salva no IndexedDB para uso offline
      await salvarTargets(data);
      setIsOffline(false);
    } catch (err) {
      console.error("Erro ao carregar alvos:", err);
      // ✅ Em caso de erro, carrega os dados offline
      const offlineTargets = await carregarTodosTargets();
      setTargets(offlineTargets);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  /** Recarrega targets sempre que filtros mudam (com debounce) */
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTargets();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [filters]);

  useEffect(() => {
    getUser();
    // Recarrega dados quando voltar online
    const onOnline = () => {
      getUser();
      fetchTargets();
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [user?.id]);

  // ✅ Carregar targets offline ao montar o componente
  useEffect(() => {
    async function carregarOffline() {
      const offlineTargets = await carregarTodosTargets();
      if (offlineTargets.length > 0 && targets.length === 0) {
        setTargets(offlineTargets);
      }
    }
    carregarOffline();
  }, []);

  return (
    <DataContext.Provider
      value={{
        userData,
        isOffline,
        targets,
        filters,
        setFilters,
        loading,
        fetchTargets,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}