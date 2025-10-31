"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EditarVaga from "@/components/gestor/editar/edicao-vaga";
import { Vaga } from "@/lib/types/vaga";
import { useAuth } from "@/context/AuthContext";
import { getVagaById } from "@/lib/actions/vagaActions";

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
      const vagaData = await getVagaById(id, token);
      if (!vagaData) {
        router.replace("/visualizar-vagas");
      } else {
        setVaga(vagaData);
      }
      setLoading(false);
    };

    fetchVaga();
  }, [id, token, router]);

  if (authLoading || loading) return <p>Carregando...</p>;
  if (!vaga) return <p>Vaga não encontrada</p>;

  return <EditarVaga vaga={vaga} />;
}
