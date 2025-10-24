import VagaDetalhes from "@/components/gestor/cards/vaga-card";
import { Vaga } from "@/lib/types/vaga";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Busca uma vaga específica pelo ID
async function buscarVaga(vagaId: string): Promise<Vaga | undefined> {
  const res = await fetch(
    `https://cptranspetrocargaback-production.up.railway.app/petrocarga/vagas`, // Para usar o MOCK troque por `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/vagas`
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return undefined;

  const data: Vaga[] = await res.json();
  const vaga = data.find((v) => v.id === vagaId);

  return vaga;
}

export default async function VagaPosting({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vaga = await buscarVaga(id);

  if (!vaga) {
    notFound();
    return null;
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

      {/* Exibe os dados da vag */}
      <VagaDetalhes vaga={vaga} />
    </div>
  );
}
