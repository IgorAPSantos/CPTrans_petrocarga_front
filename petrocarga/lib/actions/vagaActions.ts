"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Vaga, OperacoesVaga } from "../types/vaga";
import { api } from "@/service/api";

// Função para cadastrar vaga
export async function addVaga(formData: FormData) {
  const diasSemanaRaw = formData.get("diaSemana") as string;
  const diasSemana: OperacoesVaga[] = diasSemanaRaw
    ? JSON.parse(diasSemanaRaw)
    : [];

  const payload = {
    endereco: {
      codigoPmp: formData.get("codigo") as string,
      logradouro: formData.get("logradouro") as string,
      bairro: formData.get("bairro") as string,
    },
    area: (formData.get("area") as string)?.toUpperCase(),
    numeroEndereco: formData.get("numeroEndereco") as string,
    referenciaEndereco: formData.get("descricao") as string,
    tipoVaga: (formData.get("tipo") as string)?.toUpperCase(),
    status: "DISPONIVEL",
    referenciaGeoInicio: formData.get("localizacao-inicio") as string,
    referenciaGeoFim: formData.get("localizacao-fim") as string,
    comprimento: Number(formData.get("comprimento")),
    operacoesVaga: diasSemana.map((dia) => ({
      codigoDiaSemana: dia.codigoDiaSemana
        ? Number(dia.codigoDiaSemana)
        : undefined,
      horaInicio: dia.horaInicio,
      horaFim: dia.horaFim,
      diaSemanaAsEnum: dia.diaSemanaAsEnum,
    })),
  };

  try {
    const { data } = await api.post("/petrocarga/vagas", payload);
    revalidatePath("/gestor/visualizar-vagas");
    return {
      error: false,
      message: "Vaga cadastrada com sucesso!",
      valores: null,
    };
  } catch (err: unknown) {
    console.error("Erro ao cadastrar vaga:", err);
    return { error: true, message: "Erro ao cadastrar vaga", valores: payload };
  }
}

// Função para deletar vaga
export async function deleteVaga(id: string) {
  try {
    await api.delete(`/petrocarga/vagas/${id}`);
    revalidatePath("/gestor/visualizar-vagas");
    return { error: false, message: "Vaga deletada com sucesso!" };
  } catch (err: unknown) {
    console.error("Erro ao deletar vaga:", err);
    return { error: true, message: "Erro ao deletar vaga" };
  }
}

// Função para atualizar vaga
export async function atualizarVaga(formData: FormData) {
  const id = formData.get("id") as string;
  const diasSemanaRaw = formData.get("diaSemana") as string;
  const diasSemana: OperacoesVaga[] = diasSemanaRaw
    ? JSON.parse(diasSemanaRaw)
    : [];

  const payload = {
    endereco: {
      codigoPmp: formData.get("codigoPmp") as string,
      logradouro: formData.get("logradouro") as string,
      bairro: formData.get("bairro") as string,
    },
    area: (formData.get("area") as string)?.toUpperCase(),
    numeroEndereco: formData.get("numeroEndereco") as string,
    referenciaEndereco: formData.get("descricao") as string,
    tipoVaga: (formData.get("tipo") as string)?.toUpperCase(),
    status: (formData.get("status") as string)?.toUpperCase(),
    referenciaGeoInicio: formData.get("localizacao-inicio") as string,
    referenciaGeoFim: formData.get("localizacao-fim") as string,
    comprimento: Number(formData.get("comprimento")),
    operacoesVaga: diasSemana.map((dia) => ({
      codigoDiaSemana: dia.codigoDiaSemana
        ? Number(dia.codigoDiaSemana)
        : undefined,
      horaInicio: dia.horaInicio,
      horaFim: dia.horaFim,
      diaSemanaAsEnum: dia.diaSemanaAsEnum,
    })),
  };

  try {
    await api.patch(`/petrocarga/vagas/${id}`, payload);
    revalidatePath("/gestor/visualizar-vagas");
    revalidatePath(`/gestor/visualizar-vagas/${id}`);
    redirect(`/gestor/visualizar-vagas/${id}`);
  } catch (err: unknown) {
    console.error("Erro ao atualizar vaga:", err);
    return { error: true, message: "Erro ao atualizar vaga", valores: payload };
  }
}

// Função para buscar todas as vagas
export async function getVagas(): Promise<Vaga[]> {
  try {
    const { data } = await api.get("/petrocarga/vagas/all");
    return Array.isArray(data) ? data : data?.vagas ?? [];
  } catch (err: unknown) {
    console.error("Erro em getVagas:", err);
    return [];
  }
}

// Função para buscar vaga por ID
export async function getVagaById(id: string): Promise<Vaga | null> {
  try {
    const { data } = await api.get(`/petrocarga/vagas/${id}`);
    return data ?? null;
  } catch (err: unknown) {
    console.error(`Erro em getVagaById(${id}):`, err);
    return null;
  }
}
