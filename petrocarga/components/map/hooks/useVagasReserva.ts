import { useEffect, useState } from "react";
import { Vaga } from "@/lib/types/vaga";

export function useVagasReserva() {
  const [Vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://cptranspetrocargaback-production.up.railway.app/petrocarga/disponibilidade-vagas"
        ); // Para usar o MOCK troque por /api/vagas
        if (!res.ok) throw new Error("Erro ao buscar vagas");

        const data: Vaga[] = await res.json();

        setVagas(data);
      } catch (err) {
        console.error("Erro ao carregar vagas:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchVagas();
  }, []);

  return { Vagas, loading, error };
}
