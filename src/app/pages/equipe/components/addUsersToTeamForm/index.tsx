"use client";
import React, { useState } from "react";
import { api } from "@/services/api";
import { UserSelector } from "../userSelector";
import { toast } from "react-toastify";

interface AddUsersToTeamFormProps {
    teamId: number;
    onCancel: () => void;
    reload: () => void
}

export function AddUsersToTeamForm({ teamId, onCancel, reload }: AddUsersToTeamFormProps) {
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUserIds.length === 0) {
            alert("Selecione pelo menos um usuário.");
            return;
        }
        try {
            setLoading(true);
            setError(null);
            await api.post(`/team/${teamId}/users`, { userIds: selectedUserIds });
            toast.success("Membros adicionados com sucesso!")
            onCancel()
            reload()
            setSelectedUserIds([]);
        } catch (err: any) {
            const message = err.response?.data?.message || "Erro ao adicionar membros.";
            setError(message);
            console.error("Erro ao adicionar membros:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className=" rounded-lg shadow-sm">
            <div>
                <UserSelector onSelectedUsersChange={setSelectedUserIds} />
                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || selectedUserIds.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Adicionando..." : `Adicionar (${selectedUserIds.length})`}
                    </button>
                </div>
            </div>
        </form>
    );
}