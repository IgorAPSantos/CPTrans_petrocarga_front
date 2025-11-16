"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverApi } from "../serverApi";

/* ------------------------------------------------------
📌 Função auxiliar — normaliza CPF/CNPJ
------------------------------------------------------ */
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

/* ------------------------------------------------------
📌 Função auxiliar — cria payload do veículo
------------------------------------------------------ */
function buildVeiculoPayload(formData: FormData, cpf: string | null, cnpj: string | null) {
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

/* ------------------------------------------------------
📌 Cadastrar veículo
------------------------------------------------------ */
export async function addVeiculo(formData: FormData) {
  const doc = getCpfCnpj(formData);
  if ("error" in doc) {
    return { error: true, message: doc.error, valores: null };
  }

  const payload = buildVeiculoPayload(formData, doc.cpf, doc.cnpj);

  const res = await serverApi("/petrocarga/veiculos", {
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

  revalidatePath("/motoristas/veiculos&reservas");

  return { error: false, message: "Veículo cadastrado com sucesso!", valores: null };
}

/* ------------------------------------------------------
📌 Deletar veículo
------------------------------------------------------ */
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

  revalidatePath("/motoristas/veiculos&reservas");
  return { error: false, message: "Veículo deletado com sucesso!" };
}

/* ------------------------------------------------------
📌 Atualizar veículo
------------------------------------------------------ */
export async function atualizarVeiculo(formData: FormData) {
  const id = formData.get("id") as string;

  const doc = getCpfCnpj(formData);
  if ("error" in doc) {
    return { error: true, message: doc.error, valores: null };
  }

  const payload = buildVeiculoPayload(formData, doc.cpf, doc.cnpj);

  const res = await serverApi(`/petrocarga/veiculos/${id}`, {
    method: "PATCH",
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

  revalidatePath("/motoristas/veiculos&reservas");
  redirect("/motoristas/veiculos&reservas");
}

/* ------------------------------------------------------
📌 Tipos
------------------------------------------------------ */
export type Veiculo = {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  tipo: string;
  comprimento: number;
  dono: {
    cpfProprietarioVeiculo: string | null;
    cnpjProprietarioVeiculo: string | null;
  };
};

interface GetVeiculosResult {
  error: boolean;
  message: string;
  veiculos: Veiculo[];
}

/* ------------------------------------------------------
📌 Buscar veículos por usuário
------------------------------------------------------ */
export async function getVeiculosUsuario(usuarioId: string): Promise<GetVeiculosResult> {
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
