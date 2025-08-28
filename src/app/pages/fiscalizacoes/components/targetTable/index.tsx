// src/components/TargetTable.tsx
"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonComponent } from "@/components/button";
import { SiGooglemaps } from "react-icons/si";
import { DataContext } from "@/context/AuthData";


interface TargetTableProps {
  onSelectionChange: (selectedTargetIds: number[]) => void;
}

export function TargetTable({ onSelectionChange }: TargetTableProps) {
  const { targets, filters: contextFilters, setFilters, loading, fetchTargets } = useContext(DataContext);

  const [selectedTargetIds, setSelectedTargetIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    numeroArt: "",
    teamId: "",
    status: "",
  });

  const router = useRouter();

  // ✅ Sincroniza filtros locais com os do contexto (opcional, para UI)
  useEffect(() => {
    setLocalFilters({
      numeroArt: contextFilters.numeroArt || "",
      teamId: contextFilters.teamId || "",
      status: contextFilters.status || "",
    });
  }, [contextFilters]);

  // ✅ Notifica pai sobre seleção
  useEffect(() => {
    onSelectionChange(selectedTargetIds);
  }, [selectedTargetIds, onSelectionChange]);

  // ✅ Reseta seleção quando os alvos mudarem
  useEffect(() => {
    setSelectedTargetIds([]);
    setSelectAll(false);
  }, [targets]);

  const handleSelectAll = () => {
    const availableTargets = targets.filter((t) => !t.teamId);
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

  const handleOpenMap = () => {
    // ✅ Os targets já estão no contexto, mas salvamos no sessionStorage para compatibilidade
    sessionStorage.setItem("userTargets", JSON.stringify(targets));
    router.push("/pages/minhas_fiscalizacoes/mapa");
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow overflow-hidden">
      <div className="w-fill flex items-center p-4 justify-end">
        <ButtonComponent
          variant="blue"
          onClick={handleOpenMap}
          icon={<SiGooglemaps size={18} />}
        >
          Ver no Mapa
        </ButtonComponent>
      </div>

      {/* Filtros */}
      <div className="p-4 border-b bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Nº ART</label>
          <input
            type="text"
            value={localFilters.numeroArt}
            onChange={(e) => {
              const value = e.target.value;
              setLocalFilters((prev) => ({ ...prev, numeroArt: value }));
              setFilters((prev) => ({ ...prev, numeroArt: value }));
            }}
            placeholder="72624476"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Equipe</label>
          <select
            value={localFilters.teamId}
            onChange={(e) => {
              const value = e.target.value;
              setLocalFilters((prev) => ({ ...prev, teamId: value }));
              setFilters((prev) => ({ ...prev, teamId: value || undefined }));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            {Array.from(new Set(targets.map(t => t.team?.id).filter(Boolean))).map(teamId => {
              const team = targets.find(t => t.team?.id === teamId)?.team;
              return (
                <option key={teamId} value={teamId}>
                  {team?.name}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <select
            value={localFilters.status}
            onChange={(e) => {
              const value = e.target.value;
              setLocalFilters((prev) => ({ ...prev, status: value }));
              setFilters((prev) => ({ ...prev, status: value || undefined }));
            }}
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
            onClick={() => {
              setLocalFilters({ numeroArt: "", teamId: "", status: "" });
              setFilters({}); // Limpa filtros no contexto
            }}
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
                  disabled={targets.filter((t) => !t.teamId).length === 0}
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
                        className={`flex items-center justify-center w-max px-2 py-[1px] border  text-xs font-medium rounded ${
                          target.status === "CONCLUÍDA"
                            ? "bg-green-200 text-green-700"
                            : target.status === "EM ANDAMENTO"
                            ? "bg-yellow-200 text-yellow-700 "
                            : target.status === "NÃO INICIADA"
                            ? "bg-blue-200 text-blue-700"
                            : "bg-gray-200 text-gray-700"
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