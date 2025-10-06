import { NextResponse } from "next/server";
import { Vaga } from "@/lib/types";

const vagas: Vaga[] = [
   {
    id: 1,
    area: "Centro Histórico",
    comprimento: 12,
    horario_inicio: 8,
    horario_fim: 18,
    localizacao: "Rua do Imperador, em frente ao Museu Imperial",
    max_eixos: 3,
    status: "ativo",
    descricao: "Vaga ampla e bem localizada, ideal para caminhões de médio porte.",
    endereco: {
      id: 101,
      codigo_PMP: "CH-101",
      logradouro: "Rua do Imperador",
      bairro: "Centro",
    },
    diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
  },
  {
    id: 2,
    area: "Rua Teresa",
    comprimento: 10,
    horario_inicio: 7,
    horario_fim: 20,
    localizacao: "Rua Teresa, próximo ao número 700",
    max_eixos: 2,
    status: "inativo",
    descricao: "Vaga localizada em área comercial, atualmente indisponível para uso.",
    endereco: {
      id: 102,
      codigo_PMP: "RT-102",
      logradouro: "Rua Teresa",
      bairro: "Mosela",
    },
    diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  },
  {
    id: 3,
    area: "Bingen",
    comprimento: 15,
    horario_inicio: 6,
    horario_fim: 22,
    localizacao: "Avenida Getúlio Vargas, em frente ao posto BR",
    max_eixos: 4,
    status: "ativo",
    descricao: "Vaga espaçosa para caminhões grandes, com fácil acesso à BR-040.",
    endereco: {
      id: 103,
      codigo_PMP: "BG-103",
      logradouro: "Av. Getúlio Vargas",
      bairro: "Bingen",
    },
    diasSemana: ["Todos os dias"],
  },
  {
    id: 4,
    area: "Quitandinha",
    comprimento: 8,
    horario_inicio: 9,
    horario_fim: 17,
    localizacao: "Avenida Ayrton Senna, próximo ao Hotel Quitandinha",
    max_eixos: 2,
    status: "manutenção",
    descricao: "Vaga em manutenção temporária. Previsão de liberação em breve.",
    endereco: {
      id: 104,
      codigo_PMP: "QT-104",
      logradouro: "Av. Ayrton Senna",
      bairro: "Quitandinha",
    },
    diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
  },
  {
    id: 5,
    area: "Rua Paulo Barbosa",
    comprimento: 12,
    horario_inicio: 7,
    horario_fim: 19,
    localizacao: "Rua Paulo Barbosa, ao lado do Terminal Centro",
    max_eixos: 3,
    status: "ativo",
    descricao: "Vaga estratégica ao lado do terminal, ideal para carga e descarga rápida.",
    endereco: {
      id: 105,
      codigo_PMP: "PB-105",
      logradouro: "Rua Paulo Barbosa",
      bairro: "Centro",
    },
    diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
  },
];

export async function GET() {
  return NextResponse.json(vagas);
}
