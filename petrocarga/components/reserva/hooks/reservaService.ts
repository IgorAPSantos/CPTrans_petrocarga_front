import {
  getReservasAtivas,
  getReservasBloqueios,
  reservarVaga,
  reservarVagaAgente,
} from '@/lib/api/reservaApi';
import { Reserva } from '@/lib/types/reserva';
import { ConfirmResult } from '@/lib/types/confirmResult';

// ----------------- RESERVAS -----------------
export const fetchReservasAtivasDoDia = async (
  vagaId: string,
  day: Date
): Promise<Reserva[]> => {
  try {
    const reservas = await getReservasAtivas(vagaId);
    return reservas.filter(
      (r: Reserva) => new Date(r.inicio).toDateString() === day.toDateString()
    );
  } catch (error) {
    console.error('Erro ao buscar reservas ativas:', error);
    return [];
  }
};

export const fetchReservasBloqueios = async (
  vagaId: string,
  data: string,
  tipoVeiculo:
    | 'AUTOMOVEL'
    | 'VUC'
    | 'CAMINHONETA'
    | 'CAMINHAO_MEDIO'
    | 'CAMINHAO_LONGO'
) => {
  try {
    const bloqueios = await getReservasBloqueios(vagaId, data, tipoVeiculo);
    return bloqueios;
  } catch (error) {
    console.error('Erro ao buscar bloqueios:', error);
    return [];
  }
};

// ----------------- CONFIRMAR RESERVA MOTORISTA -----------------
export const confirmarReserva = async (
  formData: FormData
): Promise<ConfirmResult> => {
  const result = await reservarVaga(formData);

  if (!result.success) {
    return {
      success: false,
      message: result.message,
    };
  }

  return { success: true };
};

// ----------------- CONFIRMAR RESERVA AGENTE -----------------
export const confirmarReservaAgente = async (
  formData: FormData
): Promise<ConfirmResult> => {
  const result = await reservarVagaAgente(formData);

  if (!result.success) {
    return {
      success: false,
      message: result.message,
    };
  }

  return { success: true };
};
