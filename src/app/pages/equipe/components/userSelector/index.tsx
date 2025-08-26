// src/components/UserSelector.tsx
"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/services/api";

interface UserSelectorProps {
  onSelectedUsersChange: (selectedUserIds: number[]) => void;
}

// src/types/user.ts
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }
  interface AddUsersToTeamFormProps {
    teamId: number;
    onSuccess?: () => void; // Callback após sucesso
    onCancel?: () => void;
  }

  export function UserSelector({ onSelectedUsersChange }: UserSelectorProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
  
    // Carregar usuários
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const response = await api.get<User[]>("/user");
          setUsers(response.data);
          setFilteredUsers(response.data);
        } catch (err: any) {
          setError("Erro ao carregar usuários.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers();
    }, []);
  
    // Filtrar usuários
    useEffect(() => {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
  
      if (filtered.length < users.length) {
        setSelectAll(false);
      }
    }, [searchTerm, users]);
  
    // Atualiza o estado local de seleção
    const handleUserToggle = (userId: number) => {
      setSelectedUserIds((prev) => {
        const updated = prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId];
        
        console.log("✅ IDs selecionados (local):", updated); // 🔍 Debug
        return updated;
      });
    };
  
    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedUserIds([]);
      } else {
        const allIds = filteredUsers.map((u) => u.id);
        setSelectedUserIds(allIds);
      }
      setSelectAll(!selectAll);
    };
  
    // Sempre que selectedUserIds mudar, notifique o pai
    useEffect(() => {
      onSelectedUsersChange(selectedUserIds);
      console.log("📤 Enviando para o pai:", selectedUserIds); // 🔍 Debug
    }, [selectedUserIds, onSelectedUsersChange]);
  
    if (loading) return <p>Carregando usuários...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedUserIds.length === 0) {
          alert("Selecione pelo menos um usuário.");
          return;
        }
    
        try {
          setLoading(true);
          setError(null);
    
          await api.post(`/team/${1}/users`, {
            userIds: selectedUserIds,
          });
    
          alert(`✅ ${selectedUserIds.length} usuário(s) adicionado(s) à equipe ${1}.`);
          
          // Limpa seleção e notifica sucesso
          setSelectedUserIds([]);         
        } catch (err: any) {
          const message = err.response?.data?.message || "Erro ao adicionar usuários.";
          setError(message);
          console.error("Erro na API:", err);
        } finally {
          setLoading(false);
        }
      };
  
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        
        {/* Barra de busca */}
        <div className="p-4 border-b bg-gray-50">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute right-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
  
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="select-all"
              checked={selectAll}
              disabled={filteredUsers.length === 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="select-all" className="font-medium text-gray-800">
              Selecionar todos ({selectedUserIds.length} de {filteredUsers.length})
            </label>
          </div>
        </div>
  
        {/* Lista */}
        <div className="max-h-96 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">
              {searchTerm ? `Nenhum usuário encontrado para "${searchTerm}".` : "Nenhum usuário disponível."}
            </p>
          ) : (
            <ul>
              {filteredUsers.map((user) => (
                <li key={user.id} className="flex items-center gap-3 p-4 border-b last:border-b-0 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="flex gap-2 text-sm text-gray-600">
                      <span>{user.email}</span>
                      {/* <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">
                        {user.role}
                      </span> */}
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
  
        <div className="p-3 bg-gray-50 text-xs text-gray-500 text-right">
          {selectedUserIds.length} usuário(s) selecionado(s)
        </div>
        
      </div>
    );
  }