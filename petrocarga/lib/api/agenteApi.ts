'use client';

import { clientApi } from '../clientApi';

interface Agente {
  id?: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  matricula: string;
  senha?: string;
}

export interface AgenteResponse {
  error?: boolean;
  message?: string;
  valores?: Agente;
  agenteId?: string;
  agente?: Agente;
  agentes?: Agente[];
}

// ----------------------
// ADD AGENTE
// ----------------------
export async function addAgente(_: unknown, formData: FormData) {
  const payload = {
    nome: formData.get('nome') as string,
    cpf: formData.get('cpf') as string,
    telefone: formData.get('telefone') as string,
    email: formData.get('email') as string,
    matricula: formData.get('matricula') as string,
  };

  const res = await clientApi(`/petrocarga/agentes`, {
    method: 'POST',
    json: payload,
  });

  if (!res.ok) {
    let msg = 'Erro ao cadastrar agente';

    try {
      const data = await res.json();
      msg = data.message ?? msg;
    } catch {}

    return { error: true, message: msg, valores: payload };
  }

  return { error: false, message: 'Agente cadastrado com sucesso!' };
}

// ----------------------
// DELETE AGENTE
// ----------------------
export async function deleteAgente(agenteId: string): Promise<AgenteResponse> {
  try {
    await clientApi(`/petrocarga/agentes/${agenteId}`, { method: 'DELETE' });
    return { error: false, message: 'Agente deletado com sucesso!' };
  } catch (err: unknown) {
    console.error('Erro ao deletar agente:', err);
    return {
      error: true,
      message: err instanceof Error ? err.message : 'Erro desconhecido',
    };
  }
}

// ----------------------
// ATUALIZAR AGENTE
// ----------------------
export async function atualizarAgente(
  formData: FormData,
): Promise<AgenteResponse> {
  const usuarioid = formData.get('id') as string;

  const payload: Agente = {
    nome: formData.get('nome') as string,
    cpf: formData.get('cpf') as string,
    telefone: formData.get('telefone') as string,
    email: formData.get('email') as string,
    matricula: formData.get('matricula') as string,
    senha: formData.get('senha') as string,
  };

  try {
    await clientApi(`/petrocarga/agentes/${usuarioid}`, {
      method: 'PATCH',
      json: payload,
    });

    return { error: false, message: 'Agente atualizado com sucesso!' };
  } catch (err: unknown) {
    console.error('Erro ao atualizar agente:', err);
    return {
      error: true,
      message: err instanceof Error ? err.message : 'Erro desconhecido',
    };
  }
}

// ----------------------
// GET AGENTE BY USER ID
// ----------------------
export async function getAgenteByUserId(userId: string) {
  const res = await clientApi(`/petrocarga/agentes/${userId}`);

  if (!res.ok) {
    let msg = 'Erro ao buscar agente';

    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, agenteId: data.id, agente: data };
}

// ----------------------
// GET AGENTES
// ----------------------
export async function getAgentes() {
  const res = await clientApi(`/petrocarga/agentes`);

  if (!res.ok) {
    let msg = 'Erro ao buscar agentes';

    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, agentes: data };
}
