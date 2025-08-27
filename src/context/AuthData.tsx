"use client";
import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import { User } from "@/utils/types";
import { salvarUserData, carregarTodosUsers } from "@/services/idb";

type ProviderProps = { children: React.ReactNode };

interface AppContextInterface {
  userData: User[];      // SEMPRE array
  isOffline: boolean;    // opcional, útil para UI
}

export const DataContext = createContext<AppContextInterface>({
  userData: [],
  isOffline: false,
});

export function DataProvider({ children }: ProviderProps) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  async function getUser() {
    if (!user?.id) return;

    try {
      // tipa a resposta como User | User[]
      const { data } = await api.get<User | User[]>(`/user/${user.id}`);

      // normaliza para array
      const arr = Array.isArray(data) ? data : [data];

      setUserData(arr);
      await salvarUserData(arr);
      setIsOffline(false);
    } catch (error) {
      // OFFLINE: carrega do IndexedDB e (opcional) filtra pelo id do usuário
      const all = await carregarTodosUsers();
      const onlyThisUser = all.filter((u) => String(u.id) === String(user.id));
      setUserData(onlyThisUser);
      setIsOffline(true);
      console.log("Sem internet, usando IndexedDB", error);
    }
  }

  useEffect(() => {
    getUser();
    // opcional: revalidar quando voltar a conexão
    const onOnline = () => getUser();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <DataContext.Provider value={{ userData, isOffline }}>
      {children}
    </DataContext.Provider>
  );
}
