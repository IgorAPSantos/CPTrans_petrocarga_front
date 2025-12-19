'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/hooks/useAuth';
import { getGestores } from '@/lib/actions/gestorActions';
import { Loader2 } from 'lucide-react';
import GestorCard from '@/components/gestor/cards/gestores-card';
import { Gestor } from '@/lib/types/gestor';

export default function GestoresPage() {
  const { user } = useAuth();
  const [Gestores, setGestores] = useState<Gestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchGestores = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getGestores();
        setGestores(result.gestores);
      } catch (err) {
        console.error('Erro ao carregar os gestores:', err);
        setError(
          'Erro ao buscar os gestores cadastrados. Tente novamente mais tarde.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGestores();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="text-gray-600">
          Carregando informação dos gestores...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center text-red-600 min-h-[60vh] text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center w-full min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-2 text-center">
        Aqui estão os gestores cadastrados.
      </h1>

      {Gestores.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum gestor encontrado.</p>
      ) : (
        <div className="grid gap-4 w-full max-w-2xl">
          {Gestores.map((gestor) => (
            <GestorCard key={gestor.id} gestor={gestor} />
          ))}
        </div>
      )}
    </div>
  );
}
