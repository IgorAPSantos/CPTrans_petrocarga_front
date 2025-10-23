import EditarVaga from "@/components/gestor/editar/edicao-vaga";
import { Vaga } from "@/types/vaga";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

{/* Busca uma vaga específica pelo ID */ }
async function buscarVaga(id: string): Promise<Vaga | undefined> {
    const res = await fetch(`https://cptranspetrocargaback-production.up.railway.app/petrocarga/vagas/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        console.error(`Erro ao buscar vaga ${id}:`, res.status); // Debug
        return undefined;
    }

    const vaga: Vaga = await res.json();
    return vaga;
}

export default async function EditarVagaPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    console.log("Tentando buscar vaga com ID:", id); // Debug

    const vaga = await buscarVaga(id);

    if (!vaga) {
        console.error("Vaga não encontrada, chamando notFound()"); // Debug
        notFound();
    }

    return (
        <div className="mx-auto max-w-5xl p-6">
            <div className="mb-6">
                <Link
                    href={`/visualizar-vagas/${id}`}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para detalhes
                </Link>
            </div>

            <EditarVaga vaga={vaga} />
        </div>
    );
}