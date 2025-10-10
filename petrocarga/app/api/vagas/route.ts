import { NextResponse } from "next/server";
import { Vaga } from "@/lib/types";

const vagas: Vaga[] = [
  {
    id: "cf2b3407-cdd3-4aca-8a65-0a22103a9e14",
    endereco: {
      id: "d01f0f78-5ed9-42f5-9692-f107f0a5bf9d",
      codidoPmp: "Pb-1234",
      logradouro: "Rua Paulo Barbosa",
      bairro: "Centro",
    },
    area: "AMARELA",
    numeroEndereco: "Vaga 03",
    referenciaEndereco: "Em frente ao portão principal",
    tipoVaga: "PARALELA",
    referenciaGeoInicio: "-22.509135, -43.171351",
    referenciaGeoFim: "-22.509140, -43.171355",
    comprimento: 12,
    status: "DISPONIVEL",
    operacoesVaga: [
      {
        id: "afaeba6a-1a01-4896-8bda-7e1b052116e3",
        diaSemana: "SEGUNDA",
        horaInicio: "00:00:00",
        horaFim: "13:00:00",
      },
    ],
  },
  {
    id: "5245fe5f-ad99-43ca-9ef5-77f1069bf6e8",
    endereco: {
      id: "d1f1541a-25b0-427a-aaf1-87c3ec362f69",
      codidoPmp: "Pb-1235",
      logradouro: "Rua 16 de Março",
      bairro: "Centro",
    },
    area: "AZUL",
    numeroEndereco: "Vaga 07",
    referenciaEndereco: "Ao lado da Praça Dom Pedro",
    tipoVaga: "PARALELA",
    referenciaGeoInicio: "-22.509500, -43.182000",
    referenciaGeoFim: "-22.509550, -43.182050",
    comprimento: 10,
    status: "DISPONIVEL",
    operacoesVaga: [
      {
        id: "0845a2d9-80da-4f13-bb8e-8f9a649753d8",
        diaSemana: "QUARTA",
        horaInicio: "08:00:00",
        horaFim: "18:00:00",
      },
      {
        id: "9f0e3338-bee7-4826-9e84-cfce30ab60a9",
        diaSemana: "TERCA",
        horaInicio: "08:00:00",
        horaFim: "18:00:00",
      },
    ],
  },
];

export async function GET() {
  return NextResponse.json(vagas);
}
