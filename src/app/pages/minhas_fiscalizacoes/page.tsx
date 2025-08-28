// src/app/minhas-fiscalizacoes/page.tsx
"use client";

import { ButtonComponent } from "@/components/button";
import { DataContext } from "@/context/AuthData";
import { Target } from "@/utils/types";
import { useContext, useState } from "react";
import { SiGooglemaps } from "react-icons/si";
import { useRouter } from "next/navigation";

export default function MinhasFiscalizacoesPage() {
  const { userData } = useContext(DataContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Extrai todos os targets das equipes do usuário
  const allTargets: Target[] = userData[0]?.teams?.flatMap((team: any) => team.targets) || [];

  const handleOpenMap = () => {
    // Salvamos os targets no contexto antes de ir para o mapa
    // Ou você pode usar sessionStorage para persistência simples
    sessionStorage.setItem("userTargets", JSON.stringify(allTargets));
    router.push("/pages/minhas_fiscalizacoes/mapa");
  };

  return (
    <div className="p-6 max-full mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meus Alvos</h1>


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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>

                <th className="px-4 py-3 text-left font-medium text-gray-700">ART</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Proprietário</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Endereço</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Ação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : allTargets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    Nenhum alvo encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                allTargets.map((target) => {
                  const isAssigned = !!target.teamId;

                  return (
                    <tr key={target.id} className={`border-t ${isAssigned ? "opacity-60" : "hover:bg-gray-50"}`}>

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
                          className={`flex items-center justify-center w-max px-2 py-[1px] border  text-xs font-medium rounded ${target.status === "CONCLUÍDA"
                            ? "bg-green-200 text-green-700"
                            : target.status === "EM ANDAMENTO"
                              ? "bg-yellow-200 text-yellow-700 "
                              : target.status === "NÃO INICIADA"
                                ? "bg-blue-200 text-blue-700"
                                : "bg-gray-200 text-gray-700" // padrão para outros
                            }`}
                        >
                          {target.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}