'use client';

import ReservaRapidaCard from '@/components/agente/cards/reservaRapida-card';
import { useAuth } from '@/components/hooks/useAuth';
import { getReservasRapidas } from '@/lib/api/reservaApi';
import { ReservaRapida } from '@/lib/types/reservaRapida';
import { Loader2 } from 'lucide-react';
import { use, useEffect, useState } from 'react';

export default function ReservaRapidaPage() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<ReservaRapida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchReservas = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getReservasRapidas(user.id);
        setReservas(result);
      } catch (err) {
        console.error('Erro ao carregar as reservas:', err);
        setError('Erro ao buscar as reservas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="text-gray-600">Carregando reservas rápidas...</span>
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
        Reservas Rápidas Criadas
      </h1>

      {reservas.length === 0 ? (
        <p className="text-gray-500 text-center">
          Você ainda não criou nenhuma reserva rápida.
        </p>
      ) : (
        <div className="grid gap-4 w-full max-w-2xl">
          {reservas.map((reserva) => (
            <ReservaRapidaCard key={reserva.id} reserva={reserva} />
          ))}
        </div>
      )}
    </div>
  );
}
