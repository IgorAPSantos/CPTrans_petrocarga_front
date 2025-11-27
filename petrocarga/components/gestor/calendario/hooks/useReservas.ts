import { useEffect, useState } from "react";
import { getReservas, finalizarForcado } from "@/lib/actions/reservaActions";
import { Reserva } from "@/lib/types/reserva";

export function useReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);


  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      try {
        const data = await getReservas();
        setReservas(data);
      } catch (err) {
        console.error("Erro ao carregar reservas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, []);

  async function finalizarReservaForcada(reservaID: string) {
    setActionLoading(true);
    try {
      const result = await finalizarForcado(reservaID);

      setReservas(prev =>
        prev.map(r =>
          r.id === reservaID ? { ...r, status: "CONCLUIDA" } : r
        )
      );

      return result;
    } catch (err) {
      console.error("Erro ao finalizar reserva:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }

  return {
    reservas,
    loading,
    actionLoading,
    finalizarReservaForcada,
    setReservas,
  };
}
