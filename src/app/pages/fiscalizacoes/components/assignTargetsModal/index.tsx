// src/components/AssignTargetsModal.tsx
"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/services/api";

interface AssignTargetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetIds: number[];
  onSuccess: () => void;
}

export function AssignTargetsModal({ isOpen, onClose, targetIds, onSuccess }: AssignTargetsModalProps) {
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);
  const [teamId, setTeamId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get("/team");
        setTeams(response.data);
      } catch (err) {
        setError("Erro ao carregar equipes.");
      }
    };
    if (isOpen) fetchTeams();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) return;

    try {
      setLoading(true);
      setError(null);

      await api.post(`/team/${teamId}/assign-targets`, {
        targetIds,
      });

      alert(`✅ ${targetIds.length} alvo(s) atribuído(s) à equipe.`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao atribuir alvos.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4">Atribuir Alvos à Equipe</h3>
          {error && <p className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Selecionar Equipe</label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione uma equipe</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Atribuindo..." : "Atribuir"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}