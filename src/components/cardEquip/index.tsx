// src/components/CardEquip.tsx
"use client";

import React from "react";
import Link from "next/link";

interface CardEquipProps {
    name: string;
    status: string// Restringindo os valores possíveis
    members: number;
    color: string,
    goals: number;
    completedPercentage: number;
    link: string;
    updatedAt: string;
}

export function CardEquip({
    name,
    status,
    color,
    members = 0,
    goals = 0,
    completedPercentage = 0,
    link,
    updatedAt,
}: CardEquipProps) {
    // Define cores com base no status
    const statusColor = status === "ATIVO" ? "bg-green-500" : "bg-red-500";
    const statusText = status === "ATIVO" ? "Ativa" : "Inativa";

    // Define cor da barra de progresso
    const progressBarColor =
        completedPercentage === 100 ? "bg-green-500" : "bg-blue-500";

    return (
        <Link href={link} className="w-full block hover:bg-gray-200">
            <div className="w-full rounded-xl shadow-md bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
                {/* Cabeçalho */}
                <div className="flex justify-start items-center p-4 bg-gray-50 border-b">
                    <span className="px-3 py-1 text-sm font-semibold text-white rounded-full" style={{ background: `${color}` }}>
                        {name}
                    </span>
                    {/* <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor} text-white`}
                    >
                        {statusText}
                    </span> */}
                </div>

                {/* Métricas */}
                <div className="p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-lg font-bold text-blue-600">{members}</p>
                            <p className="text-sm text-gray-500">Membros</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-blue-600">{goals}</p>
                            <p className="text-sm text-gray-500">Fiscalizações</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-blue-600">{completedPercentage}%</p>
                            <p className="text-sm text-gray-500">Concluído</p>
                        </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all duration-300 ${progressBarColor}`}
                            style={{ width: `${completedPercentage}%` }}
                        ></div>
                    </div>

                    {/* Botão Detalhes
                    <button className="mt-3 flex items-center gap-1 text-blue-600 border border-blue-600 px-3 py-1.5 text-sm rounded hover:bg-blue-50 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7S3.732 16.057 2.458 12z" />
                        </svg>
                    </button> */}
                </div>
                {/* Rodapé */}
                <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Atualizado em {updatedAt}
                </div>
            </div>
        </Link>
    );
};
