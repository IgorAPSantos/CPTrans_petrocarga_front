'use client';

import toast from 'react-hot-toast';
import { clientApi } from '../clientApi';
import { ConfirmResult } from '../types/confirmResult';

// ----------------------
// POST DENUNCIA
// ----------------------

export async function Denunciar(formData: FormData): Promise<ConfirmResult> {
  const body = {
    descricao: formData.get('descricao'),
    reservaId: formData.get('reservaId'),
    tipo: formData.get('tipo'),
  };

  try {
    await clientApi('/petrocarga/denuncias', {
      method: 'POST',
      json: body,
    });
    toast.success('Denuncia Enviada Com Sucesso!');
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao Denunciar Reserva.';
    toast.error(message);
    return { success: false, message };
  }
}

// ----------------------
// GET TODAS AS DENUNCIAS (GESTOR)
// ----------------------

export async function getDenuncias() {
  try {
    const res = await clientApi('/petrocarga/denuncias/all');
    return res.json();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao buscar todas as denuncias.';
    throw new Error(message);
  }
}

// ----------------------
// GET DENUNCIAS POR USUARIO
// ----------------------

export async function getDenunciasByUsuario(usuarioId: string) {
  try {
    const res = await clientApi(`/petrocarga/denuncias/byUsuario/${usuarioId}`);
    return res.json();
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao buscar as denuncias por usuario.';
    throw new Error(message);
  }
}

// ----------------------
// PATCH DENUNCIA INICIAR ANALISE
// ----------------------

export async function iniciarAnaliseDenuncia(denunciaId: string) {
  try {
    await clientApi(`/petrocarga/denuncias/iniciarAnalise/${denunciaId}`, {
      method: 'PATCH',
    });
    toast.success('Análise Iniciada Com Sucesso!');
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao Iniciar Denúncia Reserva.';
    toast.error(message);
    return { success: false, message };
  }
}

// ----------------------
// PATCH DENUNCIA FINALIZAR ANALISE
// ----------------------

export async function finalizarAnaliseDenuncia(
  denunciaId: string,
  body: {
    status: 'PROCEDENTE' | 'IMPROCEDENTE';
    resposta: string;
  },
) {
  try {
    await clientApi(`/petrocarga/denuncias/finalizarAnalise/${denunciaId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    toast.success('Análise Finalizada com sucesso!');
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao finalizar análise da denúncia.';

    toast.error(message);
    return { success: false, message };
  }
}
