"use client";
import Card from "@/components/card";
import { CardEquip } from "@/components/cardEquip";
import { FormCreateTeam } from "@/components/FormCreateTeam";
import { Modal } from "@/components/modal";
import DashboardHeader from "@/components/title";
import { api } from "@/services/api";
import { formatDateBR } from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaClock, FaCheckCircle, FaUsers, FaSync } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

interface User {
    id: number,
    name: string,
}
interface StatusCounts {
    naoIniciada: number,
    emAndamento: number,
    concluida: number,
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

interface Team {
    id: number;
    name: string;
    status: string;
    color: string;
    updatedAt: string
    users: User[]
    statusCounts: StatusCounts,
    targets: Targets[]
}


export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const refreshData = () => {
        window.location.reload()
    };

    const goToMap = () => {
        console.log("🗺️ Ir para o mapa...");
    };

    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);


    const fetchTeams = async () => {
        try {
            const response = await api.get("/team",);
            // ✅ aqui já é um array
            setTeams(response.data);

        } catch (error) {
            console.error("Erro ao buscar equipes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    if (loading) {
        return <p className="p-6 text-gray-600">Carregando equipes...</p>;
    }

    const handleTeamCreated = () => {
        fetchTeams();
    };

    return (
        <main>
            <div>
                <DashboardHeader
                    title="Dashboard de Fiscalização"
                    subtitle="Acompanhe o progresso das fiscalizações em tempo real"
                    actions={[
                        { label: "Atualizar", icon: <FaSync size={20} />, onClick: refreshData, color: "green" },
                    ]}
                />
                {/* Aqui entram os cards e gráficos */}
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                <Card
                    value={1191}
                    label="Total de Fiscalização"
                    bgColor="from-blue-700"
                    icon={<FaMapMarkerAlt />}
                    toColor="bg-blue-500"
                />
                <Card
                    value={1187}
                    label="Pendentes"
                    bgColor="from-yellow-700"
                    icon={<FaClock />}
                    toColor="bg-yellow-500"
                />
                <Card
                    value={4}
                    label="Fiscalizados"
                    bgColor="from-green-700"
                    icon={<FaCheckCircle />}
                    toColor="bg-green-500"
                />
                <Card
                    value={40}
                    label="Equipes Ativas"
                    bgColor="from-cyan-700"
                    icon={<FaUsers />}
                    toColor="bg-cyan-500"
                />
            </div>

            <div>
                <DashboardHeader
                    title="Equipes"
                    subtitle="Cadastre equipes e acompanhe processo de fiscalizações"
                    actions={[
                        { label: "Nova Equipe", icon: <IoMdAdd size={20} />, onClick: () => setIsModalOpen(true), color: "blue" },
                    ]}
                />
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {teams.length === 0 ? (
                        <p className="col-span-full text-gray-500 text-center">Nenhuma equipe encontrada.</p>
                    ) : (
                        teams.map((team) => {
                            // Conta alvos com status "CONCLUIDA" (case-insensitive)
                            const concluidos = team.targets?.filter(
                                (t) => t.status?.trim().toUpperCase() === "CONCLUÍDA"
                            ).length || 0;
                            const total = team.targets?.length || 0;
                            const completedPercentage = total > 0 ? Math.round((concluidos / total) * 100) : 0;
                            return (
                                <CardEquip
                                    key={team.id}
                                    name={team.name}
                                    status={team.status}
                                    color={team.color}
                                    members={team.users?.length || 0}
                                    goals={total}
                                    link={`/pages/equipe/${team.id}`}
                                    updatedAt={formatDateBR(team.updatedAt)}
                                    completedPercentage={completedPercentage}
                                />
                            );
                        })
                    )}
                </div>
          
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <FormCreateTeam
                    onTeamCreated={handleTeamCreated}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
        </main >
    );
}
