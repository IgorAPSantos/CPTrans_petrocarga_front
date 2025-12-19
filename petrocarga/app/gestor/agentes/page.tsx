'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/hooks/useAuth';
import { getAgentes } from '@/lib/actions/agenteAction';
import { Loader2 } from 'lucide-react';
import { Agente } from '@/lib/types/agente';
import AgenteCard from '@/components/gestor/cards/agentes-card';

export default function AgentesPage() {
  const { user } = useAuth();
  const [Agentes, setAgentes] = useState<Agente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAgentes = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAgentes();
        setAgentes(result.agentes);
      } catch (err) {
        console.error('Erro ao carregar os agentes:', err);
        setError(
          'Erro ao buscar os agentes cadastrados. Tente novamente mais tarde.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAgentes();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="text-gray-600">
          Carregando informação dos agentes...
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
        Aqui estão os agentes cadastrados.
      </h1>

      {Agentes.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum agente encontrado.</p>
      ) : (
        <div className="grid gap-4 w-full max-w-2xl">
          {Agentes.map((agente) => (
            <AgenteCard key={agente.usuario.id} agente={agente} />
          ))}
        </div>
      )}
    </div>
  );
}
