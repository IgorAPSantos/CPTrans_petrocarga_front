import VagaDetalhes from "./vaga-card";
import { Vaga } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Busca uma vaga específica pelo ID do mock local
async function buscarVaga(vagaId: string): Promise<Vaga | undefined> {
  const res = await fetch("http://localhost:8000/petrocarga/vagas", {
    cache: "no-store",
  });

  if (!res.ok) return undefined;

  const data: Vaga[] = await res.json();
  const vaga = data.find((v) => v.id === vagaId);

  return vaga;
}

export default async function JobPosting({
  params,
}: {
  params: { id: string };
}) {
  const vagaId = params.id;
  const vaga = await buscarVaga(vagaId);

  if (!vaga) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <Link
          href="/visualizar-vagas"
          className="text-muted-foreground hover:text-foreground inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Todas as Vagas
        </Link>
      </div>

      {/* Exibe os dados da vaga */}
      <VagaDetalhes vaga={vaga} />
    </div>
  );
}
