"use server";
import { Veiculo } from "@/lib/types/veiculo";
import { revalidatePath } from "next/cache";
import { serverApi } from "../serverApi";

function getCpfCnpj(formData: FormData) {
  const cpf = (formData.get("cpfProprietario") as string) || null;
  const cnpj = (formData.get("cnpjProprietario") as string) || null;

  if (!cpf && !cnpj) {
    return { error: "Preencha o CPF ou CNPJ do proprietário" };
  }

  if (cpf && cnpj) {
    return { error: "Preencha apenas CPF ou CNPJ, não ambos" };
  }

  return {
    cpf: cpf || null,
    cnpj: cnpj || null,
  };
}

function buildVeiculoPayload(
  formData: FormData,
  cpf: string | null,
  cnpj: string | null
) {
  return {
    placa: formData.get("placa") as string,
    marca: formData.get("marca") as string,
    modelo: formData.get("modelo") as string,
    tipo: (formData.get("tipo") as string)?.toUpperCase(),
    comprimento: Number(formData.get("comprimento")),
    cpfProprietario: cpf,
    cnpjProprietario: cnpj,
    usuarioId: formData.get("usuarioId"),
  };
}

function PutVeiculoPayload(
  formData: FormData,
  cpf: string | null,
  cnpj: string | null
) {
  return {
    placa: formData.get("placa") as string,
    marca: formData.get("marca") as string,
    modelo: formData.get("modelo") as string,
    tipo: (formData.get("tipo") as string)?.toUpperCase(),
    cpfProprietario: cpf || null,
    cnpjProprietario: cnpj || null,
    usuarioId: formData.get("usuarioId"),
  };
}
// ----------------------
// POST VEICULO
// ----------------------
export async function addVeiculo(formData: FormData) {
  const doc = getCpfCnpj(formData);
  const usuarioId = formData.get("usuarioId") as string;
  if ("error" in doc) {
    return { error: true, message: doc.error, valores: null };
  }

  const payload = buildVeiculoPayload(formData, doc.cpf, doc.cnpj);

  const res = await serverApi(`/petrocarga/veiculos/${usuarioId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      error: true,
      message: errorData.message || "Erro ao cadastrar veículo",
      valores: payload,
    };
  }

  revalidatePath("/motoristas/meus-veiculos");

  return {
    error: false,
    message: "Veículo cadastrado com sucesso!",
    valores: null,
  };
}

// ----------------------
// DELETE VEICULO
// ----------------------
export async function deleteVeiculo(veiculoId: string) {
  const res = await serverApi(`/petrocarga/veiculos/${veiculoId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      error: true,
      message: errorData.message || "Erro ao deletar veículo",
    };
  }

  revalidatePath("/motoristas/meus-veiculos");
  return { error: false, message: "Veículo deletado com sucesso!" };
}

// ----------------------
// PATCH VEICULO
// ----------------------
export async function atualizarVeiculo(formData: FormData) {
  const usuarioId = formData.get("usuarioId") as string;
  const id = formData.get("id") as string;

  const doc = getCpfCnpj(formData);
  if ("error" in doc) {
    return { error: true, message: doc.error, valores: null };
  }

  const payload = PutVeiculoPayload(formData, doc.cpf, doc.cnpj);

  const res = await serverApi(`/petrocarga/veiculos/${id}/${usuarioId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      error: true,
      message: errorData.message || "Erro ao atualizar veículo",
      valores: payload,
    };
  }

  revalidatePath(`/motorista/veiculos/meus-veiculos/${id}`);
  revalidatePath(`/motorista/veiculos/meus-veiculos`);
}

// ----------------------
// GET VEICULO POR USUARIO
// ----------------------
export async function getVeiculosUsuario(
  usuarioId: string
): Promise<GetVeiculosResult> {
  const res = await serverApi(`/petrocarga/veiculos/usuario/${usuarioId}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      error: true,
      message: errorData.message || "Erro ao buscar veículos do usuário",
      veiculos: [],
    };
  }

  const data: Veiculo[] = await res.json();
  return {
    error: false,
    message: "Veículos carregados com sucesso",
    veiculos: data,
  };
}

export async function getVeiculo(veiculoId: string) {
  const res = await serverApi(`/petrocarga/veiculos/${veiculoId}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      error: true,
      message: errorData.message || "Erro ao buscar veículo",
      veiculo: null as Veiculo | null,
    };
  }

  const data: Veiculo = await res.json();

  return {
    error: false,
    message: "Veículo carregado com sucesso",
    veiculo: data,
  };
}

interface GetVeiculosResult {
  error: boolean;
  message: string;
  veiculos: Veiculo[];
  veiculo?: Veiculo;
}
