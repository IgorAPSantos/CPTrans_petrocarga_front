import EditarVaga from "@/components/editar-vaga/editar-vaga"; // seu componente
import { Vaga } from "@/lib/types";

async function getVaga(id: string): Promise<Vaga> {
  const res = await fetch(`http://localhost:8000/petrocarga/vagas/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar vaga");
  }

  return res.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const vaga = await getVaga(params.id);

  return <EditarVaga vaga={vaga} />;
}
