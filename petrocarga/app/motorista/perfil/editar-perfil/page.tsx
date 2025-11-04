import EditarMotorista from "@/components/motorista/editar/edicao-perfil";
import { Motorista } from "@/lib/types/motorista";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

{/* Busca o perfil do motorista específica pelo ID */ }
async function buscarMotorista(id: string): Promise<Motorista | undefined> {
    const res = await fetch(`https://cptranspetrocargaback-production.up.railway.app/petrocarga/motorista/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        console.error(`Erro ao buscar o motorista ${id}:`, res.status); // Debug
        return undefined;
    }

    const motorista: Motorista = await res.json();
    return motorista;
}

export default async function EditarMotoristaPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    console.log("Tentando buscar motorista com ID:", id); // Debug

    const motorista = await buscarMotorista(id);

    if (!motorista) {
        console.error("Motorista não encontrada, chamando notFound()"); // Debug
        notFound();
    }

    return (
        <div className="mx-auto max-w-5xl p-6">
            <div className="mb-6">
                <Link
                    href={`/motorista/${id}`}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para perfil do motorista
                </Link>
            </div>

            <EditarMotorista motorista={motorista} />
        </div>
    );
}