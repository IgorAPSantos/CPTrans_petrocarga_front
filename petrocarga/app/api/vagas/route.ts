import { NextResponse } from "next/server";
import { Vaga } from "@/lib/types";

const vagas: Vaga[] = [
  {
    id: "2c5c6b8d-3c05-45da-849d-103f24a396a5",
    area: "AMARELA",
    localizacao: "-22.509135, -43.171351",
    horarioInicio: "08:00:00",
    horarioFim: "18:00:00",
    maxEixos: 2,
    comprimento: 12,
    status: "DISPONIVEL",
    diasSemana: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"],
    enderecoVagaResponseDTO: {
      id: "c37a0ba7-eedd-49aa-9d4b-498194d29898",
      codidoPmp: "12345",
      logradouro: "Rua das Palmeiras",
      bairro: "Centro",
    },
  },
  {
    id: "a9f1c2e3-6d7b-4a91-8b0a-5c7f6b9d2f31",
    area: "VERDE",
    localizacao: "-22.506800, -43.177500",
    horarioInicio: "07:00:00",
    horarioFim: "19:00:00",
    maxEixos: 3,
    comprimento: 15,
    status: "DISPONIVEL",
    diasSemana: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"],
    enderecoVagaResponseDTO: {
      id: "f14b98e7-4bc5-4a13-befb-b13e91e6c871",
      codidoPmp: "54321",
      logradouro: "Avenida Koeler",
      bairro: "Centro",
    },
  },
  {
    id: "7b2d1c9a-8f64-4f93-bd44-82a1cfc23c9e",
    area: "AZUL",
    localizacao: "-22.507900, -43.180700",
    horarioInicio: "08:00:00",
    horarioFim: "20:00:00",
    maxEixos: 2,
    comprimento: 10,
    status: "OCUPADO",
    diasSemana: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"],
    enderecoVagaResponseDTO: {
      id: "b47c12d3-2a5f-445d-a6a8-fb124e91a123",
      codidoPmp: "67890",
      logradouro: "Rua do Imperador",
      bairro: "Centro",
    },
  },
  {
    id: "0d8f2b5a-5e3d-4f47-88e0-1b2a6f3a9c77",
    area: "VERMELHA",
    localizacao: "-22.509800, -43.185200",
    horarioInicio: "09:00:00",
    horarioFim: "17:00:00",
    maxEixos: 2,
    comprimento: 11,
    status: "DISPONIVEL",
    diasSemana: ["TERCA", "QUARTA", "QUINTA", "SEXTA"],
    enderecoVagaResponseDTO: {
      id: "e92f10c4-bc19-44db-915a-7f83fa2c92c8",
      codidoPmp: "98765",
      logradouro: "Rua Marechal Deodoro",
      bairro: "Centro",
    },
  },
  {
    id: "3f9c1b2d-7b8e-45c9-9233-f67e1a42c9b2",
    area: "LARANJA",
    localizacao: "-22.511200, -43.172800",
    horarioInicio: "06:00:00",
    horarioFim: "22:00:00",
    maxEixos: 4,
    comprimento: 18,
    status: "DISPONIVEL",
    diasSemana: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"],
    enderecoVagaResponseDTO: {
      id: "a13d2f44-c1e8-4a2e-bb1c-91f83b1a4c45",
      codidoPmp: "11111",
      logradouro: "Rua do Imperador",
      bairro: "Centro",
    },
  },
];

export async function GET() {
  return NextResponse.json(vagas);
}
