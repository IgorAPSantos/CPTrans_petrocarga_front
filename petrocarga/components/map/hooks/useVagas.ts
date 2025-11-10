// useVagas.ts
import { useEffect, useState } from "react";
import { Vaga } from "@/lib/types/vaga";
import * as vagaActions from "@/lib/actions/vagaActions";
import { useAuth } from "@/context/AuthContext";

export function useVagas() {
  const { token } = useAuth();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token === undefined) return;
    if (!token) {
      setLoading(false);
      setVagas([]);
      return;
    }

    const fetchVagas = async () => {
      setLoading(true);
      try {
        const data: Vaga[] = await vagaActions.getVagas(token);
        setVagas(data);
      } catch (err) {
        console.error("Erro ao carregar vagas:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setVagas([]); // garante array vazio
      } finally {
        setLoading(false);
      }
    };

    fetchVagas();
  }, [token]);

  return { vagas, loading, error };
}
