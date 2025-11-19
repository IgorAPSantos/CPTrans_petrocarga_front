import { useEffect, useState } from "react";
import { getReservas } from "@/lib/actions/reservaActions";
import { Reserva } from "@/lib/types/reserva";

export function useReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);

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

  return { reservas, setReservas, loading };
}
