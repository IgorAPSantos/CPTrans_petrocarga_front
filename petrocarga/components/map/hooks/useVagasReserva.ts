// useVagas.ts
import { useEffect, useState } from 'react';
import { Vaga } from '@/lib/types/vaga';
import { getVagas } from '@/lib/api/vagaApi';

export function useVagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVagas = async () => {
      setLoading(true);
      try {
        const data: Vaga[] = await getVagas();
        setVagas(data);
      } catch (err) {
        console.error('Erro ao carregar vagas:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setVagas([]); // garante array vazio
      } finally {
        setLoading(false);
      }
    };

    fetchVagas();
  });

  return { vagas, loading, error };
}
