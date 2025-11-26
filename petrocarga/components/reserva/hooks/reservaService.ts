import { getReservasAtivas, getReservasBloqueios, reservarVaga } from "@/lib/actions/reservaActions";
import { reservarVagaAgente } from "@/lib/actions/reservaActions"; // importa a função do agente
import { Reserva } from "@/lib/types/reserva";

// ----------------- RESERVAS -----------------
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

// ----------------- CONFIRMAR RESERVA MOTORISTA -----------------
export const confirmarReserva = async (formData: FormData) => {
  try {
    await reservarVaga(formData);
    return true;
  } catch (error) {
    console.error("Erro ao confirmar reserva:", error);
    return false;
  }
};

// ----------------- CONFIRMAR RESERVA AGENTE -----------------
export const confirmarReservaAgente = async (formData: FormData) => {
  try {
    await reservarVagaAgente(formData);
    return true;
  } catch (error) {
    console.error("Erro ao confirmar reserva do agente:", error);
    return false;
  }
};
