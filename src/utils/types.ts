export interface Target {
    id: number;
    numeroArt: string;
    tipoArt: "Projeto" | "Execução"; // pode expandir conforme regras do sistema
    nomeProfissional: string;
    tituloProfissional: string;
    empresa: string;
    cnpj: string;
    contratante: string;
    nomeProprietario: string;
    telefoneProprietario: string;
    enderecoObra: string;
    capacidadeObra: string;
    latitude: string;
    longitude: string;
    status: "NÃO INICIADA" | "EM ANDAMENTO" | "CONCLUÍDA"; // enum dos status
    teamId: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }
  
  export interface Team {
    id: number;
    name: string;
    status: string,
    color: string;
    targets: Target[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    role: string
    teams: Team[];
    createdAt: string;
    updatedAt: string;
  }
  