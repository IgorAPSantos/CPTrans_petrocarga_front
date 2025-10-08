import { NextResponse } from "next/server";
import { Vaga } from "@/lib/types";

const vagas: Vaga[] = [
   {
    id: 1,
    area: "Centro Histórico",
    comprimento: 12, // metros permitidos
    horario_inicio: 8, // 08:00
    horario_fim: 18, // 18:00
    localizacao: "Rua do Imperador, em frente ao Museu Imperial",
    max_eixos: 3,
    status: "ativo",
    endereco_id: 101,
  },
  {
    id: 2,
    area: "Rua Teresa",
    comprimento: 10,
    horario_inicio: 7, // 07:00
    horario_fim: 20, // 20:00
    localizacao: "Rua Teresa, próximo ao número 700",
    max_eixos: 2,
    status: "inativo",
    endereco_id: 102,
  },
  {
    id: 3,
    area: "Bingen",
    comprimento: 15,
    horario_inicio: 6, // 06:00
    horario_fim: 22, // 22:00
    localizacao: "Avenida Getúlio Vargas, em frente ao posto BR",
    max_eixos: 4,
    status: "ativo",
    endereco_id: 103,
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
    endereco_id: 104,
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
    endereco_id: 105,
  },
];

export async function GET() {
  return NextResponse.json(vagas);
}
