'use client';

import toast from 'react-hot-toast';
import { clientApi } from '../clientApi';
import { ConfirmResult } from '../types/confirmResult';
import { ReservaRapida } from '@/lib/types/reservaRapida';
import { ReservaPlaca } from '@/lib/types/reservaPlaca';

// ----------------------
// POST RESERVA MOTORISTA
// ----------------------
export async function reservarVaga(formData: FormData): Promise<ConfirmResult> {
  const body = {
    vagaId: formData.get('vagaId'),
    motoristaId: formData.get('motoristaId'),
    veiculoId: formData.get('veiculoId'),
    cidadeOrigem: formData.get('cidadeOrigem'),
    inicio: formData.get('inicio'),
    fim: formData.get('fim'),
    status: 'ATIVA',
  };

  try {
    await clientApi('/petrocarga/reservas', {
      method: 'POST',
      json: body,
    });
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao reservar vaga.';
    return { success: false, message };
  }
}

// ----------------------
// POST RESERVA CHECKOUT-FORÇADO
// ----------------------
export async function finalizarForcado(reservaID: string) {
  try {
    const res = await clientApi(
      `/petrocarga/reservas/${reservaID}/finalizar-forcado`,
      {
        method: 'POST',
      },
    );
    return res.json();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao finalizar reserva forçada.';
    throw new Error(message);
  }
}

// ----------------------
// GET RESERVAS POR USUARIO
// ----------------------
export async function getReservasPorUsuario(usuarioId: string) {
  try {
    const res = await clientApi(`/petrocarga/reservas/usuario/${usuarioId}`);
    return res.json();
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao buscar reservas do usuário.';
    throw new Error(message);
  }
}

// ----------------------
// GET RESERVAS
// ----------------------
export async function getReservas() {
  try {
    const res = await clientApi('/petrocarga/reservas/all');
    return res.json();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao buscar reservas.';
    throw new Error(message);
  }
}

// ----------------------
// GET RESERVAS BLOQUEIOS
// ----------------------
export async function getReservasBloqueios(
  vagaId: string,
  data: string,
  tipoVeiculo:
    | 'AUTOMOVEL'
    | 'VUC'
    | 'CAMINHONETA'
    | 'CAMINHAO_MEDIO'
    | 'CAMINHAO_LONGO',
) {
  const queryParams = new URLSearchParams({ data, tipoVeiculo }).toString();

  try {
    const res = await clientApi(
      `/petrocarga/reservas/bloqueios/${vagaId}?${queryParams}`,
    );
    return res.json();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao buscar bloqueios.';
    throw new Error(message);
  }
}

// ----------------------
// DELETE RESERVA POR ID
// ----------------------
export async function deleteReservaByID(reservaId: string, usuarioId: string) {
  try {
    await clientApi(`/petrocarga/reservas/${reservaId}/${usuarioId}`, {
      method: 'DELETE',
      cache: 'no-store',
    });
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao deletar reserva.';
    return { error: true, message };
  }
}

// ----------------------
// DOCUMENTO RESERVA ID PDF
// ----------------------

export async function getGerarComprovanteReserva(reservaID: string) {
  try {
    const res = await clientApi(
      `/petrocarga/documentos/reservas/${reservaID}/comprovante`,
    );

    if (!res.ok) {
      throw new Error('Erro ao gerar comprovante da reserva.');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `comprovante-${reservaID}.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao gerar comprovante da reserva.';
    throw new Error(message);
  }
}

// ----------------------
// PATCH RESERVA
// ----------------------
export async function atualizarReserva(
  body: {
    veiculoId: string;
    cidadeOrigem: string;
    inicio: string;
    fim: string;
    status: string;
  },
  reservaID: string,
  usuarioId: string,
) {
  console.log('📤 Enviando JSON para API Java:', body);

  const res = await clientApi(
    `/petrocarga/reservas/${reservaID}/${usuarioId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const errorBody = await res.json();

    console.error('❌ Erro do Backend:', errorBody);

    return {
      success: false,
      message: errorBody.erro ?? 'Erro ao reservar vaga',
      status: res.status,
    };
  }

  const data = await res.json();

  return {
    success: true,
    data,
  };
}

// ----------------------
// CHECKIN RESERVA
// ----------------------

export async function checkinReserva(reservaID: string) {
  try {
    const res = await clientApi(`/petrocarga/reservas/${reservaID}/checkin`, {
      method: 'POST',
    });
    toast.success('Checkin Realizado Com Sucesso!');
    return res.json();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao fazer checkin.';
    toast.error(message);
    throw new Error(message);
  }
}

// ----------------------
// CHECKOUT RESERVA
// ----------------------

export async function checkoutReserva(reservaID: string) {
  try {
    await clientApi(`/petrocarga/reservas/checkout/${reservaID}`, {
      method: 'PATCH',
    });

    toast.success('Checkout Realizado Com Sucesso!');
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao finalizar reserva.';
    toast.error(message);
    return { success: false, message };
  }
}

// =================================================================
// RESERVA RÁPIDA - AGENTE
// =================================================================

// ----------------------
// POST RESERVA AGENTE
// ----------------------
export async function reservarVagaAgente(
  formData: FormData,
): Promise<ConfirmResult> {
  const body = {
    vagaId: formData.get('vagaId'),
    tipoVeiculo: formData.get('tipoVeiculo'),
    placa: formData.get('placa'),
    inicio: formData.get('inicio'),
    fim: formData.get('fim'),
  };

  try {
    await clientApi('/petrocarga/reserva-rapida', {
      method: 'POST',
      json: body,
    });
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao confirmar reserva do agente.';
    return { success: false, message };
  }
}

// ----------------------
// GET RESERVAS
// ----------------------
export async function getReservasRapidas(
  usuarioId: string,
): Promise<ReservaRapida[]> {
  try {
    const res = await clientApi(`/petrocarga/reserva-rapida/${usuarioId}`);

    if (!res.ok) {
      throw new Error(`Erro na requisição: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao buscar reservas do agente.';
    throw new Error(message);
  }
}

// ----------------------
// GET RESERVAS POR PLACA
// ----------------------
export async function getReservasPorPlaca(
  placa: string,
): Promise<ReservaPlaca[]> {
  try {
    const res = await clientApi(
      `/petrocarga/reservas/placa?placa=${placa.trim().toUpperCase()}`,
      { method: 'GET' },
    );

    if (!res.ok) {
      throw new Error(`Erro na requisição: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao buscar reservas por placa.';
    throw new Error(message);
  }
}
