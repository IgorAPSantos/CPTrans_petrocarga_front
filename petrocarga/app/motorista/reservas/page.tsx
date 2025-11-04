"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getReservasPorUsuario } from "@/lib/actions/reservaActions";
import { Loader2 } from "lucide-react";
import ReservaCard from "@/components/reserva/minhasReservas/ReservaCard";

interface Reserva {
  id: number;
  vaga?: {
    endereco?: {
      logradouro?: string;
    };
  };
  cidadeOrigem: string;
  inicio: string;
  fim: string;
  status: string;
}

export default function MinhasReservas() {
  const { user, token } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id || !token) return;

    const fetchReservas = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getReservasPorUsuario(user.id, token);
        setReservas(data);
      } catch (err) {
        console.error("Erro ao carregar reservas:", err);
        setError("Erro ao buscar suas reservas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [user?.id, token]);

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full gap-2 text-center">
        <Loader2 className="animate-spin w-6 h-6" />
        <span>Carregando suas reservas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center text-red-600 h-full text-center">
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
