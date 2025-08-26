// src/app/alvos/page.tsx
"use client";

import React, { useState } from "react";

import DashboardHeader from "@/components/title";
import { TargetTable } from "./components/targetTable";
import { AssignTargetsModal } from "./components/assignTargetsModal";

export default function TargetsPage() {
  const [selectedTargetIds, setSelectedTargetIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectionChange = (ids: number[]) => {
    setSelectedTargetIds(ids);
  };

  const handleAssign = () => {
    // Atualiza a lista de alvos
    console.log("Alvos atribuídos:", selectedTargetIds);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <DashboardHeader
        title="Gestão de Alvos"
        subtitle="Selecione alvos e atribua a equipes para fiscalização"
      />

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={selectedTargetIds.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Atribuir a Equipe ({selectedTargetIds.length})
        </button>
      </div>

      <TargetTable onSelectionChange={handleSelectionChange} />

      <AssignTargetsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetIds={selectedTargetIds}
        onSuccess={handleAssign}
      />
    </div>
  );
}