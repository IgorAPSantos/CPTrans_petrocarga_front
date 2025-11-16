"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/hooks/useAuth";
import { getReservasPorUsuario } from "@/lib/actions/reservaActions";
import { Loader2 } from "lucide-react";
import ReservaCard from "@/components/reserva/minhasReservas/ReservaCard";
import { Reserva } from "@/lib/types/reserva";

export default function MinhasReservas() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchReservas = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getReservasPorUsuario(user.id);
        if ("veiculos" in data) {
          // caso use algum retorno com wrapper
          setReservas(data.reservas || []);
        } else {
          setReservas(data);
        }
      } catch (err) {
        console.error("Erro ao carregar reservas:", err);
        setError("Erro ao buscar suas reservas. Tente novamente mais tarde.");
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
        <span className="text-gray-600">Carregando suas reservas...</span>
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
    <div className="p-4 flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Bem-vindo às suas Reservas, {user?.nome || "motorista"}!
      </h1>

      {reservas.length === 0 ? (
        <p className="text-gray-600 text-center">Nenhuma reserva encontrada.</p>
      ) : (
        <div className="grid gap-4 w-full max-w-2xl">
          {reservas.map((reserva) => (
            <ReservaCard key={reserva.id} reserva={reserva} />
          ))}
        </div>
      )}
    </div>
  );
}
