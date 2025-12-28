'use client';

import { clientApi } from '../clientApi';

interface MotoristaUsuario {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
}

interface MotoristaPayload {
  usuario: MotoristaUsuario;
  tipoCnh: string;
  numeroCnh: string;
  dataValidadeCnh: string;
}

interface MotoristaResult {
  error: boolean;
  message?: string;
  valores?: MotoristaPayload;
  motoristaId?: string;
  motorista?: unknown;
  motoristas?: unknown[];
}

// ----------------------
// ADD MOTORISTA
// ----------------------
export async function addMotorista(
  formData: FormData
): Promise<MotoristaResult> {
  const payload: MotoristaPayload = {
    usuario: {
      nome: formData.get('nome') as string,
      cpf: formData.get('cpf') as string,
      telefone: formData.get('telefone') as string,
      email: formData.get('email') as string,
      senha: formData.get('senha') as string,
    },
    tipoCnh: (formData.get('tipoCnh') as string)?.toUpperCase(),
    numeroCnh: formData.get('numeroCnh') as string,
    dataValidadeCnh: formData.get('dataValidadeCnh') as string,
  };

  try {
    await clientApi('/petrocarga/motoristas/cadastro', {
      method: 'POST',
      json: payload,
    });
    return { error: false, message: 'Motorista cadastrado com sucesso!' };
  } catch (err: unknown) {
    return {
      error: true,
      message:
        err instanceof Error ? err.message : 'Erro ao cadastrar motorista',
      valores: payload,
    };
  }
}

// ----------------------
// DELETE MOTORISTA
// ----------------------
export async function deleteMotorista(
  motoristaId: string
): Promise<MotoristaResult> {
  try {
    await clientApi(`/petrocarga/motoristas/${motoristaId}`, {
      method: 'DELETE',
    });
    return { error: false, message: 'Motorista deletado com sucesso!' };
  } catch (err: unknown) {
    return {
      error: true,
      message: err instanceof Error ? err.message : 'Erro ao deletar motorista',
    };
  }
}

// ----------------------
// ATUALIZAR MOTORISTA
// ----------------------
export async function atualizarMotorista(
  formData: FormData
): Promise<MotoristaResult> {
  const id = formData.get('id') as string;

  const payload: MotoristaPayload = {
    usuario: {
      nome: formData.get('nome') as string,
      cpf: formData.get('cpf') as string,
      telefone: formData.get('telefone') as string,
      email: formData.get('email') as string,
      senha: formData.get('senha') as string,
    },
    tipoCnh: (formData.get('tipoCnh') as string)?.toUpperCase(),
    numeroCnh: formData.get('numeroCnh') as string,
    dataValidadeCnh: formData.get('dataValidadeCnh') as string,
  };

  try {
    await clientApi(`/petrocarga/motoristas/${id}`, {
      method: 'PATCH',
      json: payload,
    });
    return { error: false, message: 'Motorista atualizado com sucesso!' };
  } catch (err: unknown) {
    return {
      error: true,
      message:
        err instanceof Error ? err.message : 'Erro ao atualizar motorista',
    };
  }
}

// ----------------------
// GET MOTORISTA BY USER ID
// ----------------------
export async function getMotoristaByUserId(userId: string) {
  const res = await clientApi(`/petrocarga/motoristas/${userId}`);

  if (!res.ok) {
    let msg = 'Erro ao buscar motorista';

    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, motoristaId: data.id, motorista: data };
}

// ----------------------
// GET MOTORISTAS
// ----------------------
export async function getMotoristas() {
  const res = await clientApi(`/petrocarga/motoristas`);

  if (!res.ok) {
    let msg = 'Erro ao buscar motoristas';

    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, motoristas: data };
}
