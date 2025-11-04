import { getReservasAtivas, reservarVaga } from "@/lib/actions/reservaActions";
import { Reserva } from "@/lib/types/reserva";

export const fetchReservasAtivasDoDia = async (
  vagaId: string,
  day: Date,
  token?: string
): Promise<Reserva[]> => {
  if (!token) return [];

  try {
    const reservas = await getReservasAtivas(vagaId, token);
    return reservas.filter(
      (r: Reserva) => new Date(r.inicio).toDateString() === day.toDateString()
    );
  } catch (error) {
    console.error("Erro ao buscar reservas ativas:", error);
    return [];
  }
};

export const confirmarReserva = async (formData: FormData, token: string) => {
  try {
    await reservarVaga(formData, token);
    return true;
  } catch (error) {
    console.error("Erro ao confirmar reserva:", error);
    return false;
  }
};
