import { NextResponse } from "next/server";
import { Vaga } from "@/lib/types";

const vagas: Vaga[] = [
  {
    id: 1,
    title: "Desenvolvedor Frontend",
    company: "Tech Corp",
    city: "São Paulo",
    salary: 5000,
    company_website: "https://techcorp.com",
    schedule: "full time",
    number_of_positions: 2,
    description: "Desenvolver interfaces em React.",
    requirements: "Conhecimento em React e Tailwind.",
  },
  {
    id: 2,
    title: "Analista de Dados",
    company: "Data Inc",
    city: "Rio de Janeiro",
    salary: 4500,
    company_website: "https://datainc.com",
    schedule: "part-time",
    number_of_positions: 1,
    description: "Analisar e estruturar dados.",
    requirements: "SQL, Python e PowerBI.",
  },
];

export async function GET() {
  return NextResponse.json(vagas);
}
