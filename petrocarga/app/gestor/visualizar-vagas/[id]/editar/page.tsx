"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EditarVaga from "@/components/gestor/editar/edicao-vaga";
import { Vaga } from "@/lib/types/vaga";
import { useAuth } from "@/context/AuthContext";
import { getVagaById } from "@/lib/actions/vagaActions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditarVagaPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { token, loading: authLoading } = useAuth();
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id || !token) return;

    const fetchVaga = async () => {
      setLoading(true);
      try {
        const vagaData = await getVagaById(id, token);
        if (!vagaData) {
          // Redireciona para lista de vagas se não encontrar
          router.replace("/gestor/visualizar-vagas");
        } else {
          setVaga(vagaData);
        }
      } catch (err) {
        console.error("Erro ao buscar vaga:", err);
        router.replace("/gestor/visualizar-vagas");
      } finally {
        setLoading(false);
      }
    };

    fetchVaga();
  }, [id, token, router]);

  if (authLoading || loading) {
    return <p>Carregando vaga...</p>;
  }

  if (!vaga) {
    return (
      <div>
        <p>Vaga não encontrada</p>
        <Link
          href="/visualizar-vagas"
          className="text-blue-600 hover:underline"
        >
          Voltar para lista de vagas
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <Link
          href={`/gestor/visualizar-vagas/${id}`}
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
