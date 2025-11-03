"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getReservasPorUsuario } from "@/lib/actions/reservaActions";
import { Loader2 } from "lucide-react";

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
    // Só tenta buscar se tiver user e token
    if (!user?.id || !token) return;

    const fetchReservas = async () => {
      setLoading(true);
      setError(null);

      try {
        // Aqui usamos user.id diretamente, que é o esperado pela API
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

  // 🔹 Renderizações condicionais
  if (loading) {
    return (
      <div className="p-4 flex items-center gap-2">
        <Loader2 className="animate-spin" />
        <span>Carregando suas reservas...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Bem-vindo às suas Reservas, {user?.nome || "motorista"}!
      </h1>

      {reservas.length === 0 ? (
        <p>Nenhuma reserva encontrada.</p>
      ) : (
        <div className="grid gap-4">
          {reservas.map((reserva) => (
            <ReservaCard key={reserva.id} reserva={reserva} />
          ))}
        </div>
      )}
    </div>
  );
}

// 🔹 Componente isolado para um card de reserva
function ReservaCard({ reserva }: { reserva: Reserva }) {
  const formatarData = (data: string) => new Date(data).toLocaleString("pt-BR");

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <p>
        <strong>Vaga:</strong>{" "}
        {reserva.vaga?.endereco?.logradouro || "Não informado"}
      </p>
      <p>
        <strong>Origem:</strong> {reserva.cidadeOrigem}
      </p>
      <p>
        <strong>Início:</strong> {formatarData(reserva.inicio)}
      </p>
      <p>
        <strong>Fim:</strong> {formatarData(reserva.fim)}
      </p>
      <p>
        <strong>Status:</strong> {reserva.status}
      </p>
    </div>
  );
}
