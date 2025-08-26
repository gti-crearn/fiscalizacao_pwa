// src/components/FormCreateTeam.tsx
import React, { useState } from "react";
import axios from "axios";
import { api } from "@/services/api";
import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";

interface FormCreateTeamProps {
  onTeamCreated: () => void; // Callback para atualizar lista
  onClose: () => void;
}

export function FormCreateTeam ({ onTeamCreated, onClose }:FormCreateTeamProps){
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"ATIVO" | "INATIVO">("ATIVO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/team",
        {
          name,          
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      toast.success("Equipe criada com sucesso!")
      onTeamCreated(); // Atualiza a lista
      onClose(); // Fecha o modal
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar equipe.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Criar Nova Equipe</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Equipe
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Equipe 01"
          />
        </div>

{/*        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "ATIVO" | "INATIVO")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </select>
        </div> */}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          
          >
            <IoMdAdd size={18} />

            {loading ? "Criando..." : "Criar"}
          </button>
        </div>
      </form>
    </div>
  );
};
