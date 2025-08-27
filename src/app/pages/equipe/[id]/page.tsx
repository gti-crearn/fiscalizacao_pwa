// src/app/equipe/[id]/page.tsx
"use client"
import React, { useEffect, useState, use } from "react";
import { api } from "@/services/api"; // Nosso axios com interceptor de token
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { ButtonComponent } from "@/components/button";
import { IoIosList, IoMdPersonAdd } from "react-icons/io";
import { Modal } from "@/components/modal";
import { UserSelector } from "../components/userSelector";
import { AddUsersToTeamForm } from "../components/addUsersToTeamForm";
import { LuUsers } from "react-icons/lu";
import { CiViewList } from "react-icons/ci";
import { IoInformationCircleOutline } from "react-icons/io5";

// 👇 Em app directory, usamos `params` diretamente via props
type PageProps = {
    params: Promise<Params>; // 👈 params é uma Promise
};

type Params = {
    id: string;
};

// src/types/team.ts
export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

interface Targets {
    id: number,
    numeroArt: string,
    tipoArt: string,
    nomeProfissional: string,
    tituloProfissional: string,
    empresa: string,
    cnpj: string,
    contratante: string,
    nomeProprietario: string,
    telefoneProprietario: string,
    enderecoObra: null,
    capacidadeObra: null,
    teamId: number,
    latitude: string,
    longitude: string,
    status: string
}

export interface Team {
    id: number;
    name: string;
    status: "ATIVO" | "INATIVO";
    color: string;
    createdAt: string;
    updatedAt: string;
    users: User[];
    targets: Targets[]
}

const TeamPage = ({ params }: PageProps) => {
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Simulação de alvos (até a API estar pronta)
    const mockTargets = [
        {
            cnpj: "95272825000189",
            name: "DR. EMILE BLANC",
            address: "AVENIDA FRANCISCO GLICERIO 1465",
            status: "Pendente",
        },
        {
            cnpj: "08335344000163",
            name: "CONDOMINIO EDIFICIO SANTA TEREZA",
            address: "RUA CONCEICAO 121",
            status: "Fiscalizado",
        },
        {
            cnpj: "26534827000179",
            name: "EDIFICIO JOSE NOGUEIRA",
            address: "AVENIDA CAMPOS SALLES 974",
            status: "Pendente",
        },
        {
            cnpj: "52366382000175",
            name: "CONDOMINIO EDIFICIO NOTREDAME",
            address: "RUA CONCEICAO 514",
            status: "Pendente",
        },
    ];


    // ✅ Desestruture o `id` usando `React.use()`
    const { id } = use<Params>(params);

    const fetchTeam = async () => {
        try {
            setLoading(true);
            setError(null);
            // ✅ Agora `id` é uma string normal
            const response = await api.get<Team>(`/team/${id}/users`);
            setTeam(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao carregar equipe.");
            console.error("Erro ao buscar equipe:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, [id]); // 👈 Use `id` como dependência

    if (loading) return <p className="p-6">Carregando equipe...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!team) return <p className="p-6">Equipe não encontrada.</p>;

    if (error) {
        return (
            <div className="p-6 text-red-600">
                <p><strong>Erro:</strong> {error}</p>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="p-6 text-gray-600">Equipe não encontrada.</div>
        );
    }

    // Formata datas
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* Nome da Equipe e Status */}
            <div className="flex items-center gap-3 mb-6">
                <span
                    className="px-4 py-2 rounded-full text-white font-semibold text-sm"
                    style={{ backgroundColor: team.color }}
                >
                    {team.name}
                </span>
                {/* <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            team.status === "ATIVO"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {team.status === "ATIVO" ? "Ativa" : "Inativa"}
        </span> */}
            </div>

            {/* Informações da Equipe */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm mb-6 p-4">
                <div className="flex items-center gap-2 mb-4">
                    <IoInformationCircleOutline size={18} />
                    <h2 className="text-lg font-semibold text-gray-800">Informações da Equipe</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold text-gray-700">Nome:</p>
                        <div className="flex items-center gap-2">
                            <span
                                className="inline-block w-4 h-4 rounded border"
                                style={{ backgroundColor: team.color }}
                            ></span>
                            <span className="text-gray-600">{team.name}</span>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700">Status:</p>
                        <span
                            className={`flex items-center justify-center w-max px-2 py-[1px] border font-medium rounded ${team.status === "ATIVO"
                                ? "bg-green-200 text-green-700"
                                : "bg-red-200 text-red-700"
                                }`}
                        >
                            {team.status === "ATIVO" ? "Ativa" : "Inativa"}
                        </span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700">Criada em:</p>
                        <p className="text-gray-600">{formatDate(team.createdAt)}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700">Última atualização:</p>
                        <p className="text-gray-600">{formatDate(team.updatedAt)}</p>
                    </div>
                </div>
            </div>

            {/* Membros da Equipe */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm mb-6 p-4">
                <div className="flex justify-between items-center gap-2 mb-4">
                    <div className="flex items-center gap-2 justify-center">
                        <LuUsers />
                        <h2 className="text-lg font-semibold text-gray-800">Membros da Equipe</h2>
                    </div>

                    <ButtonComponent variant="blue" type="button" onClick={() => setIsModalOpen(true)} >
                        <IoMdPersonAdd size={18} />
                        Vincular
                    </ButtonComponent>
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <div className="min-h-screen ">
                            <div className="max-w-4xl mx-auto">
                                <h1 className="text-2xl font-bold text-gray-800">Adicionar Membros {team?.name}</h1>
                                <p className="text-gray-600 mb-6">
                                    Selecione os usuários que deseja adicionar à equipe.
                                </p>

                                <AddUsersToTeamForm
                                    teamId={Number(id)}
                                    onCancel={handleCancel}
                                    reload={fetchTeam}
                                />
                            </div>
                        </div>

                    </Modal>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left font-semibold text-gray-700">Nome</th>
                                <th className="py-2 px-4 text-left font-semibold text-gray-700">Tipo</th>
                                <th className="py-2 px-4 text-left font-semibold text-gray-700">Email</th>
                                <th className="py-2 px-4 text-left font-semibold text-gray-700">Criado em</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-4 text-center text-gray-500">
                                        Nenhum membro nesta equipe.
                                    </td>
                                </tr>
                            ) : (
                                team.users.map((user: any) => (
                                    <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 flex items-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <span>{user.name} ({user.username})</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-block px-2 py-1 text-xs font-medium rounded ${user.role === "USER"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : user.role === "SUPERVISOR"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <span>
                                                {formatDate(user?.createdAt)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alvos Atribuídos */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2 mb-4">
                    <IoIosList size={18} />
                    <h2 className="text-lg font-semibold text-gray-800">Alvos Atribuídos</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left font-medium text-gray-700">ART</th>
                                <th className="py-2 px-4 text-left font-medium text-gray-700">Tipo ART</th>
                                <th className="py-2 px-4 text-left font-medium text-gray-700">Profissional</th>
                                <th className="py-2 px-4 text-left font-medium text-gray-700">Empresa</th>
                                <th className="py-2 px-4 text-left font-medium text-gray-700">CNPJ</th>
                                <th className="py-2 px-4 text-left font-medium text-gray-700">Endereço</th>
                                <th className="py-2 px-4 text-left font-medium text-gray-700">Status</th>
                                <th className="py-2 px-4 text-left font-medium text-gray-700">Ação</th>

                            </tr>
                        </thead>
                        <tbody>
                            {team.targets.map((target, index) => (
                                <tr key={index} className="border-t border-gray-200 text-gray-600 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-semibold text-gray-800">{target.numeroArt}</td>
                                    <td className="py-3 px-4">{target.tipoArt}</td>
                                    <td className="py-3 px-4">{target.nomeProfissional}</td>
                                    <td className="py-3 px-4">{target.empresa}</td>
                                    <td className="py-3 px-4">{target.cnpj}</td>
                                    <td className="py-3 px-4">{target.enderecoObra}</td>
                                    <td className="py-3 px-4">
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
                                    <td className="py-3 px-4">
                                        <button
                                            className="p-1 text-blue-600 cursor-pointer hover:bg-blue-100 rounded transition"
                                            aria-label="Ver detalhes"

                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7S3.732 16.057 2.458 12z"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeamPage;