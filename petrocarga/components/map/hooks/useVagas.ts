import { useEffect, useState } from "react";

// Tipagem das vagas
interface Vaga {
  id: string;
  area: string;
  localizacao: string; // "-22.509135, -43.171351"
  enderecoVagaResponseDTO: {
    logradouro: string;
    bairro: string;
  };
  coordinates?: [number, number];
}

export function useVagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/petrocarga/vagas");
        if (!res.ok) throw new Error("Erro ao buscar vagas");
        const data: Vaga[] = await res.json();

        const vagasFormatadas = data.map((vaga) => {
          const [latStr, lngStr] = vaga.localizacao.split(",");
          return {
            ...vaga,
            coordinates: [
              parseFloat(lngStr.trim()),
              parseFloat(latStr.trim()),
            ] as [number, number],
          };
        });

        setVagas(vagasFormatadas);
      } catch (err: unknown) {
        console.error("Erro ao carregar vagas:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVagas();
  }, []);

  return { vagas, loading, error };
}
