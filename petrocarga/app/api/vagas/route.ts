import { NextResponse } from "next/server";
import { Vaga } from "@/lib/types";

const vagas: Vaga[] = [
  {
    id: "1c2f6a5b-4e8a-4b0d-bb9b-112233445501",
    area: "AMARELA",
    numeroEndereco: "102",
    referenciaEndereco: "Em frente à Câmara Municipal",
    tipoVaga: "CARGA_DESCARGA",
    referenciaGeoInicio: "-22.508500,-43.164000",
    referenciaGeoFim: "-22.508700,-43.164200",
    comprimento: 12,
    status: "DISPONIVEL",
    operacoesVaga: {
      diaSemana: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"],
      horaInicio: "08:00:00",
      horaFim: "18:00:00",
    },
    enderecoVagaResponseDTO: {
      id: "e01aa7ab-5d6c-47f8-bf0f-111122223333",
      codidoPmp: "PET001",
      logradouro: "Rua do Imperador",
      bairro: "Centro",
    },
  },
  {
    id: "2b3d7c6e-5f9b-4c1e-aa8c-223344556602",
    area: "AZUL",
    numeroEndereco: "215",
    referenciaEndereco: "Próximo ao Hotel Quitandinha",
    tipoVaga: "CARGA_DESCARGA",
    referenciaGeoInicio: "-22.524300,-43.154000",
    referenciaGeoFim: "-22.524500,-43.154200",
    comprimento: 14,
    status: "OCUPADO",
    operacoesVaga: {
      diaSemana: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"],
      horaInicio: "07:00:00",
      horaFim: "17:00:00",
    },
    enderecoVagaResponseDTO: {
      id: "b11bc4b5-d7fe-4b89-8a77-444455556666",
      codidoPmp: "PET002",
      logradouro: "Avenida Barão do Rio Branco",
      bairro: "Quitandinha",
    },
  },
  {
    id: "3d4e8f7a-6a1d-4d9c-bb9f-334455667703",
    area: "VERDE",
    numeroEndereco: "980",
    referenciaEndereco: "Ao lado do posto BR",
    tipoVaga: "CARGA_DESCARGA",
    referenciaGeoInicio: "-22.520980,-43.192250",
    referenciaGeoFim: "-22.521100,-43.192460",
    comprimento: 10,
    status: "MANUTENCAO",
    operacoesVaga: {
      diaSemana: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"],
      horaInicio: "09:00:00",
      horaFim: "16:00:00",
    },
    enderecoVagaResponseDTO: {
      id: "c22cd5c6-e8ff-4ca0-9b88-777788889999",
      codidoPmp: "PET003",
      logradouro: "Rua Bingen",
      bairro: "Bingen",
    },
  },
];

export async function GET() {
  return NextResponse.json(vagas);
}
