// src/components/TargetTable.tsx
"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/services/api";

interface TargetTableProps {
  onSelectionChange: (selectedTargetIds: number[]) => void;
}

// src/types/target.ts

export interface Team {
  id: number;
  name: string;
  status: string;
  color: string;
  coordinatorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Target {
  id: number;
  numeroArt: string;
  tipoArt: string;
  nomeProfissional: string;
  tituloProfissional: string;
  empresa: string;
  cnpj: string;
  contratante: string;
  nomeProprietario: string;
  telefoneProprietario: string;
  enderecoObra: string | null;
  capacidadeObra: string | null;
  latitude: string;
  longitude: string;
  status: string;
  teamId: number | null;
  createdAt: string;
  updatedAt: string;
  team?: Team;
}

export function TargetTable({ onSelectionChange }: TargetTableProps) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filters, setFilters] = useState({
    numeroArt: "",
    teamId: "",
    status: "",
  });

  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);

  // Buscar equipes para o select
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get("/team");
        setTeams(response.data);
      } catch (err) {
        console.error("Erro ao carregar equipes:", err);
      }
    };
    fetchTeams();
  }, []);

  // Buscar alvos com filtros
  const fetchTargets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.numeroArt) params.append("numeroArt", filters.numeroArt);
      if (filters.teamId) params.append("teamId", filters.teamId);
      if (filters.status) params.append("status", filters.status);

      const response = await api.get<Target[]>("/target", { params });
      setTargets(response.data);
    } catch (err: any) {
      console.error("Erro ao carregar alvos:", err);
      setTargets([]);
    } finally {
      setLoading(false);
    }
  };

  // Busca com debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTargets();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [filters]);

  // Resetar seleção ao mudar alvos
  useEffect(() => {
    setSelectedTargetIds([]);
    setSelectAll(false);
  }, [targets]);

  // Notificar pai sobre seleção
  useEffect(() => {
    onSelectionChange(selectedTargetIds);
  }, [selectedTargetIds, onSelectionChange]);

  const handleSelectAll = () => {
    const availableTargets = targets.filter((t) => !t.teamId); // Só os sem equipe
    if (selectAll) {
      setSelectedTargetIds([]);
    } else {
      setSelectedTargetIds(availableTargets.map((t) => t.id));
    }
    setSelectAll(!selectAll);
  };

  const handleToggle = (id: number) => {
    setSelectedTargetIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const clearFilters = () => {
    setFilters({
      numeroArt: "",
      teamId: "",
      status: "",
    });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow overflow-hidden">
      {/* Filtros */}
      <div className="p-4 border-b bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Nº ART</label>
          <input
            type="text"
            value={filters.numeroArt}
            onChange={(e) => setFilters((prev) => ({ ...prev, numeroArt: e.target.value }))}
            placeholder="72624476"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Equipe</label>
          <select
            value={filters.teamId}
            onChange={(e) => setFilters((prev) => ({ ...prev, teamId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="NÃO INICIADA">NÃO INICIADA</option>
            <option value="EM ANDAMENTO">EM ANDAMENTO</option>
            <option value="CONCLUÍDA">CONCLUÍDA</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-200 hover:bg-gray-300 rounded transition"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
      <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  disabled={targets.filter((t) => !t.teamId).length === 0} // Desabilita se não houver alvos disponíveis
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">ART</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Proprietário</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Endereço</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Equipe Atual</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Carregando...
                </td>
              </tr>
            ) : targets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Nenhum alvo encontrado com os filtros aplicados.
                </td>
              </tr>
            ) : (
              targets.map((target) => {
                const isAssigned = !!target.teamId;

                return (
                  <tr key={target.id} className={`border-t ${isAssigned ? "opacity-60" : "hover:bg-gray-50"}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedTargetIds.includes(target.id)}
                        onChange={() => handleToggle(target.id)}
                        disabled={isAssigned}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{target.numeroArt}</div>
                      <div className="text-xs text-gray-500">{target.tipoArt}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{target.nomeProprietario}</div>
                      <div className="text-xs text-gray-500">{target.cnpj}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{target.enderecoObra}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          target.status === "NÃO INICIADA"
                            ? "bg-gray-100 text-gray-800"
                            : target.status === "EM ATENDIMENTO"
                            ? "bg-yellow-100 text-yellow-800"
                            : target.status === "CONCLUÍDA"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {target.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {target.team ? (
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{ backgroundColor: `${target.team.color}30`, color: target.team.color }}
                        >
                          {target.team.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">Não vinculado</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}