'use client';

import { clientApi } from '../clientApi';

interface DisponibilidadeVaga {
  id?: string;
  vagaId: string;
  inicio: string;
  fim: string;
}

interface DisponibilidadeResponse {
  error?: boolean;
  message?: string;
  valores?: DisponibilidadeVaga;
  success?: boolean;
}

// ----------------------
// POST DISPONIBILIDADE VAGAS
// ----------------------
export async function addDisponibilidadeVagas(formData: FormData) {
  const vagaIds = formData.getAll('vagaid') as string[];

  const body = {
    listaVagaId: vagaIds,
    inicio: new Date(formData.get('inicio') as string).toISOString(),
    fim: new Date(formData.get('fim') as string).toISOString(),
  };

  try {
    const res = await clientApi('/petrocarga/disponibilidade-vagas/vagas', {
      method: 'POST',
      json: body,
    });
    return await res.json();
  } catch (err) {
    console.error('Erro ao adicionar disponibilidade:', err);
    throw err;
  }
}

// ----------------------
// GET DISPONIBILIDADE VAGAS
// ----------------------
export async function getDisponibilidadeVagas() {
  try {
    const res = await clientApi('/petrocarga/disponibilidade-vagas', {
      method: 'GET',
    });
    return await res.json();
  } catch (err) {
    console.error('Erro ao buscar disponibilidade:', err);
    throw err;
  }
}

// ----------------------
// PATCH DISPONIBILIDADE VAGAS
// ----------------------
export async function editarDisponibilidadeVagas(
  id: string,
  vagaId: string,
  inicio: string,
  fim: string
): Promise<DisponibilidadeResponse> {
  const body: DisponibilidadeVaga = { vagaId, inicio, fim };

  try {
    const res = await clientApi(`/petrocarga/disponibilidade-vagas/${id}`, {
      method: 'PATCH',
      json: body,
    });
    return { success: true, valores: body };
  } catch (err: unknown) {
    console.error('Erro ao atualizar disponibilidade:', err);
    return {
      error: true,
      message:
        err instanceof Error ? err.message : 'Erro desconhecido ao atualizar',
      valores: body,
    };
  }
}

// ----------------------
// DELETE DISPONIBILIDADE VAGAS
// ----------------------
export async function deleteDisponibilidadeVagas(disponibilidadeId: string) {
  if (!disponibilidadeId) {
    throw new Error('ID da disponibilidade não enviado.');
  }

  try {
    await clientApi(`/petrocarga/disponibilidade-vagas/${disponibilidadeId}`, {
      method: 'DELETE',
    });
    return true;
  } catch (err) {
    console.error('Erro ao deletar disponibilidade:', err);
    throw err;
  }
}
