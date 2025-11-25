import { getReservasAtivas, getReservasBloqueios, reservarVaga } from "@/lib/actions/reservaActions";
import { Reserva } from "@/lib/types/reserva";

export const fetchReservasAtivasDoDia = async (
  vagaId: string,
  day: Date,
): Promise<Reserva[]> => {

  try {
    const reservas = await getReservasAtivas(vagaId);
    return reservas.filter(
      (r: Reserva) => new Date(r.inicio).toDateString() === day.toDateString()
    );
  } catch (error) {
    console.error("Erro ao buscar reservas ativas:", error);
    return [];
  }
};

export const fetchReservasBloqueios = async (
  vagaId: string,
  data: string,
  tipoVeiculo: "AUTOMOVEL" | "VUC" | "CAMINHONETA" | "CAMINHAO_MEDIO" | "CAMINHAO_LONGO"
) => {
  try {
    const bloqueios = await getReservasBloqueios(vagaId, data, tipoVeiculo);
    return bloqueios;
  } catch (error) {
    console.error("Erro ao buscar bloqueios:", error);
    return [];
  }
};


export const confirmarReserva = async (formData: FormData) => {
  try {
    await reservarVaga(formData);
    return true;
  } catch (error) {
    console.error("Erro ao confirmar reserva:", error);
    return false;
  }
};
