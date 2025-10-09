import { useEffect, useState } from "react";

// Tipagem das vagas
interface Vaga {
  id: string;
  area: string;
  referenciaGeoInicio: string; // "-22.509135, -43.171351"
  enderecoVagaResponseDTO: {
    logradouro: string;
    bairro: string;
  };
  coordinates?: [number, number];
}

export function useVagas() {
  const [buscarVagas, setBuscarVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/vagas"); // Para usar o MOCK troque por /api/vagas
        if (!res.ok) throw new Error("Erro ao buscar vagas");
        const data: Vaga[] = await res.json();

        const vagasFormatadas = data.map((vaga) => {
          const [latStr, lngStr] = vaga.referenciaGeoInicio.split(",");
          return {
            ...vaga,
            coordinates: [
              parseFloat(lngStr.trim()),
              parseFloat(latStr.trim()),
            ] as [number, number],
          };
        });

        setBuscarVagas(vagasFormatadas);
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

  return { buscarVagas, loading, error };
}
