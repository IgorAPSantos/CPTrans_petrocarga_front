'use client';

import { clientApi } from '../clientApi';

interface GestorPayload {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha?: string;
}

interface GestorResult {
  error: boolean;
  message?: string;
  valores?: GestorPayload;
  gestorId?: string;
  gestor?: unknown;
  gestores?: unknown[];
}

// ----------------------
// ADD GESTOR
// ----------------------
export async function addGestor(_: unknown, formData: FormData) {
  const payload = {
    nome: formData.get('nome') as string,
    cpf: formData.get('cpf') as string,
    telefone: formData.get('telefone') as string,
    email: formData.get('email') as string,
  };

  const res = await clientApi(`/petrocarga/gestores`, {
    method: 'POST',
    json: payload
  });

  if (!res.ok) {
    let msg = 'Erro ao cadastrar gestor';

    try {
      const data = await res.json();
      msg = data.message ?? msg;
    } catch { }

    return { error: true, message: msg, valores: payload };
  }

  return { error: false, message: 'Gestor cadastrado com sucesso!' };
}


// ----------------------
// DELETE GESTOR
// ----------------------
export async function deleteGestor(gestorId: string): Promise<GestorResult> {
  try {
    await clientApi(`/petrocarga/gestores/${gestorId}`, { method: 'DELETE' });
    return { error: false, message: 'Gestor deletado com sucesso!' };
  } catch (err: unknown) {
    return {
      error: true,
      message: err instanceof Error ? err.message : 'Erro ao deletar gestor',
    };
  }
}

// ----------------------
// ATUALIZAR GESTOR
// ----------------------
export async function atualizarGestor(
  formData: FormData
): Promise<GestorResult> {
  const usuarioId = formData.get('id') as string;

  const payload: GestorPayload = {
    nome: formData.get('nome') as string,
    cpf: formData.get('cpf') as string,
    telefone: formData.get('telefone') as string,
    email: formData.get('email') as string,
    senha: formData.get('senha') as string,
  };

  try {
    await clientApi(`/petrocarga/gestores/${usuarioId}`, {
      method: 'PATCH',
      json: payload,
    });
    return { error: false, message: 'Gestor atualizado com sucesso!' };
  } catch (err: unknown) {
    return {
      error: true,
      message: err instanceof Error ? err.message : 'Erro ao atualizar gestor',
      valores: payload,
    };
  }
}

// ----------------------
// GET GESTOR
// ----------------------
export async function getGestores() {
  const res = await clientApi(`/petrocarga/gestores`, {
    method: 'GET',
  });
  if (!res.ok) {
    let msg = 'Erro ao buscar gestores';

    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch { }

    return { error: true, message: msg };
  }

  const gestores = await res.json();
  return { error: false, gestores };
}

// ----------------------
// GET GESTOR BY USER ID
// ----------------------
export async function getGestorByUserId(userId: string) {
  const res = await clientApi(`/petrocarga/gestores/${userId}`);

  if (!res.ok) {
    let msg = 'Erro ao buscar gestor';

    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch { }

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, gestorId: data.id, gestor: data };
}
