'use client';

import { Veiculo } from '@/lib/types/veiculo';
import { clientApi } from '../clientApi';

function getCpfCnpj(formData: FormData) {
  const cpf = (formData.get('cpfProprietario') as string) || null;
  const cnpj = (formData.get('cnpjProprietario') as string) || null;

  if (!cpf && !cnpj) return { error: 'Preencha o CPF ou CNPJ do proprietário' };
  if (cpf && cnpj) return { error: 'Preencha apenas CPF ou CNPJ, não ambos' };

  return { cpf, cnpj };
}

function buildVeiculoPayload(
  formData: FormData,
  cpf: string | null,
  cnpj: string | null
) {
  return {
    placa: formData.get('placa') as string,
    marca: formData.get('marca') as string,
    modelo: formData.get('modelo') as string,
    tipo: (formData.get('tipo') as string)?.toUpperCase(),
    comprimento: Number(formData.get('comprimento')),
    cpfProprietario: cpf,
    cnpjProprietario: cnpj,
    usuarioId: formData.get('usuarioId'),
  };
}

// ----------------------
// POST VEICULO
// ----------------------
export async function addVeiculo(formData: FormData) {
  const doc = getCpfCnpj(formData);
  const usuarioId = formData.get('usuarioId') as string;
  if ('error' in doc) return { error: true, message: doc.error, valores: null };

  const payload = buildVeiculoPayload(formData, doc.cpf, doc.cnpj);

  try {
    await clientApi(`/petrocarga/veiculos/${usuarioId}`, {
      method: 'POST',
      json: payload,
    });

    return {
      error: false,
      message: 'Veículo cadastrado com sucesso!',
      valores: null,
    };
  } catch (err: unknown) {
    console.error('Erro ao cadastrar veículo:', err);
    const message =
      err instanceof Error ? err.message : 'Erro ao cadastrar veículo';
    return { error: true, message, valores: payload };
  }
}

// ----------------------
// DELETE VEICULO
// ----------------------
export async function deleteVeiculo(veiculoId: string) {
  try {
    await clientApi(`/petrocarga/veiculos/${veiculoId}`, { method: 'DELETE' });
    return { error: false, message: 'Veículo deletado com sucesso!' };
  } catch (err: unknown) {
    console.error('Erro ao deletar veículo:', err);
    const message =
      err instanceof Error ? err.message : 'Erro ao deletar veículo';
    return { error: true, message };
  }
}

// ----------------------
// PATCH VEICULO
// ----------------------
export async function atualizarVeiculo(formData: FormData) {
  const id = formData.get('id') as string;
  const doc = getCpfCnpj(formData);
  if ('error' in doc) return { error: true, message: doc.error, valores: null };

  const payload = buildVeiculoPayload(formData, doc.cpf, doc.cnpj);
  const usuarioId = formData.get('usuarioId') as string;

  try {
    await clientApi(`/petrocarga/veiculos/${id}/${usuarioId}`, {
      method: 'PATCH',
      json: payload,
    });

    return {
      error: false,
      message: 'Veículo atualizado com sucesso!',
      valores: null,
    };
  } catch (err: unknown) {
    console.error('Erro ao atualizar veículo:', err);
    const message =
      err instanceof Error ? err.message : 'Erro ao atualizar veículo';
    return { error: true, message, valores: payload };
  }
}

// ----------------------
// GET VEICULO POR USUARIO
// ----------------------
export async function getVeiculosUsuario(usuarioId: string) {
  try {
    const res = await clientApi(`/petrocarga/veiculos/usuario/${usuarioId}`);
    const data: Veiculo[] = await res.json();
    return {
      error: false,
      message: 'Veículos carregados com sucesso',
      veiculos: data,
    };
  } catch (err: unknown) {
    console.error('Erro ao buscar veículos do usuário:', err);
    const message =
      err instanceof Error ? err.message : 'Erro ao buscar veículos do usuário';
    return { error: true, message, veiculos: [] };
  }
}

// ----------------------
// GET VEICULO POR ID
// ----------------------
export async function getVeiculo(veiculoId: string) {
  try {
    const res = await clientApi(`/petrocarga/veiculos/${veiculoId}`);
    const data: Veiculo = await res.json();
    return {
      error: false,
      message: 'Veículo carregado com sucesso',
      veiculo: data,
    };
  } catch (err: unknown) {
    console.error(`Erro ao buscar veículo ${veiculoId}:`, err);
    const message =
      err instanceof Error ? err.message : 'Erro ao buscar veículo';
    return { error: true, message, veiculo: null };
  }
}

export interface GetVeiculosResult {
  error: boolean;
  message: string;
  veiculos: Veiculo[];
  veiculo?: Veiculo | null;
}
