'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/hooks/useAuth';
import { getMotoristas } from '@/lib/api/motoristaApi';
import { Loader2 } from 'lucide-react';
import { Motorista } from '@/lib/types/motorista';
import MotoristaCard from '@/components/gestor/cards/motoristas-card';

export default function MotoristasPage() {
  const { user } = useAuth();
  const [Motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMotoristas = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getMotoristas();
        setMotoristas(result.motoristas);
      } catch (err) {
        console.error('Erro ao carregar os motoristas:', err);
        setError(
          'Erro ao buscar os motoristas cadastrados. Tente novamente mais tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMotoristas();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="text-gray-600">
          Carregando informação dos motoristas...
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
        Aqui estão os motoristas cadastrados.
      </h1>

      {Motoristas.length === 0 ? (
        <p className="text-gray-500 text-center">
          Nenhum motorista encontrado.
        </p>
      ) : (
        <div className="grid gap-4 w-full max-w-2xl">
          {Motoristas.map((motorista) => (
            <MotoristaCard key={motorista.usuario.id} motorista={motorista} />
          ))}
        </div>
      )}
    </div>
  );
}
