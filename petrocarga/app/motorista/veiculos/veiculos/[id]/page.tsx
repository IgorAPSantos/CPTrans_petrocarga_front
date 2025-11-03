import EditarVeiculo from "@/components/motorista/editar/edicao-veiculo";
import { Veiculo } from "@/lib/types/veiculo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

{/* Busca uma veiculo específica pelo ID */ }
async function buscarVeiculo(id: string): Promise<Veiculo | undefined> {
    const res = await fetch(`https://cptranspetrocargaback-production.up.railway.app/petrocarga/veiculos/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        console.error(`Erro ao buscar veículo ${id}:`, res.status); // Debug
        return undefined;
    }

    const veiculo: Veiculo = await res.json();
    return veiculo;
}

export default async function EditarVeiculoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    console.log("Tentando buscar veiculo com ID:", id); // Debug

    const veiculo = await buscarVeiculo(id);

    if (!veiculo) {
        console.error("Veiculo não encontrada, chamando notFound()"); // Debug
        notFound();
    }

    return (
        <div className="mx-auto max-w-5xl p-6">
            <div className="mb-6">
                <Link
                    href={`/veiculos/${id}`}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para todos os veículos
                </Link>
            </div>

            <EditarVeiculo veiculo={veiculo} />
        </div>
    );
}