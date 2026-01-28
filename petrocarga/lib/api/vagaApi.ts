'use client';

import { Vaga, OperacoesVaga } from '../types/vaga';
import { clientApi } from '../clientApi';

interface ApiError {
  status?: number;
  message: string;
}

function buildVagaPayload(formData: FormData) {
  const diasSemanaRaw = formData.get('diaSemana') as string;
  const diasSemana: OperacoesVaga[] = diasSemanaRaw
    ? JSON.parse(diasSemanaRaw)
    : [];

  return {
    endereco: {
      codigoPmp: formData.get('codigo') ?? formData.get('codigoPmp'),
      logradouro: formData.get('logradouro'),
      bairro: formData.get('bairro'),
    },
    area: (formData.get('area') as string)?.toUpperCase(),
    numeroEndereco: formData.get('numeroEndereco'),
    referenciaEndereco: formData.get('descricao'),
    tipoVaga: (formData.get('tipo') as string)?.toUpperCase(),
    status: (formData.get('status') as string)?.toUpperCase() ?? 'DISPONIVEL',
    referenciaGeoInicio: formData.get('localizacao-inicio'),
    referenciaGeoFim: formData.get('localizacao-fim'),
    comprimento: Number(formData.get('comprimento')),
    operacoesVaga: diasSemana.map((dia) => ({
      codigoDiaSemana: dia.codigoDiaSemana
        ? Number(dia.codigoDiaSemana)
        : undefined,
      horaInicio: dia.horaInicio,
      horaFim: dia.horaFim,
      ...(dia.diaSemanaAsEnum ? { diaSemanaAsEnum: dia.diaSemanaAsEnum } : {}),
    })),
  };
}

// ----------------------
// POST VAGA
// ----------------------
export async function addVaga(formData: FormData) {
  const payload = buildVagaPayload(formData);
  try {
    await clientApi('/petrocarga/vagas', { method: 'POST', json: payload });
    return {
      error: false,
      message: 'Vaga cadastrada com sucesso!',
      valores: null,
    };
  } catch (err) {
    const error = err as ApiError;
    console.error('Erro ao cadastrar vaga:', error);
    return { error: true, message: error.message, valores: payload };
  }
}

// ----------------------
// DELETE VAGA
// ----------------------
export async function deleteVaga(id: string) {
  try {
    await clientApi(`/petrocarga/vagas/${id}`, { method: 'DELETE' });
    return { error: false, message: 'Vaga deletada com sucesso!' };
  } catch (err) {
    const error = err as ApiError;
    console.error('Erro ao deletar vaga:', error);
    return { error: true, message: error.message };
  }
}

// ----------------------
// PATCH VAGA
// ----------------------
export async function atualizarVaga(formData: FormData) {
  const id = formData.get('id') as string;
  const payload = buildVagaPayload(formData);

  try {
    await clientApi(`/petrocarga/vagas/${id}`, {
      method: 'PATCH',
      json: payload,
    });
    return { error: false, message: 'Vaga atualizada com sucesso!' };
  } catch (err) {
    const error = err as ApiError;
    console.error('Erro ao atualizar vaga:', error);
    return { error: true, message: error.message, valores: payload };
  }
}

// ----------------------
// GET VAGAS
// ----------------------
export async function getVagas(status?: string): Promise<Vaga[]> {
  try {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';

    const res = await clientApi(`/petrocarga/vagas/all${query}`, {
      method: 'GET',
    });

    const data = await res.json();
    return Array.isArray(data) ? data : (data?.vagas ?? []);
  } catch (err) {
    const error = err as ApiError;
    console.error('Erro ao buscar vagas:', error);
    return [];
  }
}

// ----------------------
// GET VAGA POR ID
// ----------------------
export async function getVagaById(id: string): Promise<Vaga | null> {
  try {
    const res = await clientApi(`/petrocarga/vagas/${id}`, { method: 'GET' });
    return (await res.json()) ?? null;
  } catch (err) {
    const error = err as ApiError;
    console.error(`Erro ao buscar vaga ${id}:`, error);
    return null;
  }
}
