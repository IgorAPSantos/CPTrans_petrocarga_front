"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Vaga, OperacoesVaga } from "../types/vaga";
import { serverApi } from "../serverApi";

/* -----------------------------------------------------
📌 Função auxiliar — monta payload da vaga
----------------------------------------------------- */
function buildVagaPayload(formData: FormData) {
  const diasSemanaRaw = formData.get("diaSemana") as string;
  const diasSemana: OperacoesVaga[] = diasSemanaRaw
    ? JSON.parse(diasSemanaRaw)
    : [];

  return {
    endereco: {
      codigoPmp: formData.get("codigo") ?? formData.get("codigoPmp"),
      logradouro: formData.get("logradouro"),
      bairro: formData.get("bairro"),
    },
    area: (formData.get("area") as string)?.toUpperCase(),
    numeroEndereco: formData.get("numeroEndereco"),
    referenciaEndereco: formData.get("descricao"),
    tipoVaga: (formData.get("tipo") as string)?.toUpperCase(),
    status: (formData.get("status") as string)?.toUpperCase() ?? "DISPONIVEL",
    referenciaGeoInicio: formData.get("localizacao-inicio"),
    referenciaGeoFim: formData.get("localizacao-fim"),
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
}

/* -----------------------------------------------------
📌 Cadastrar vaga
----------------------------------------------------- */
export async function addVaga(formData: FormData) {
  const payload = buildVagaPayload(formData);

  const res = await serverApi("/petrocarga/vagas", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("Erro ao cadastrar vaga:", await res.text());
    return { error: true, message: "Erro ao cadastrar vaga", valores: payload };
  }

  revalidatePath("/gestor/visualizar-vagas");
  return { error: false, message: "Vaga cadastrada com sucesso!", valores: null };
}

/* -----------------------------------------------------
📌 Deletar vaga
----------------------------------------------------- */
export async function deleteVaga(id: string) {
  const res = await serverApi(`/petrocarga/vagas/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    console.error("Erro ao deletar vaga:", await res.text());
    return { error: true, message: "Erro ao deletar vaga" };
  }

  revalidatePath("/gestor/visualizar-vagas");
  return { error: false, message: "Vaga deletada com sucesso!" };
}

/* -----------------------------------------------------
📌 Atualizar vaga
----------------------------------------------------- */
export async function atualizarVaga(formData: FormData) {
  const id = formData.get("id") as string;
  const payload = buildVagaPayload(formData);

  const res = await serverApi(`/petrocarga/vagas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("Erro ao atualizar vaga:", await res.text());
    return { error: true, message: "Erro ao atualizar vaga", valores: payload };
  }

  revalidatePath("/gestor/visualizar-vagas");
  revalidatePath(`/gestor/visualizar-vagas/${id}`);
  redirect(`/gestor/visualizar-vagas/${id}`);
}

/* -----------------------------------------------------
📌 Buscar todas as vagas
----------------------------------------------------- */
export async function getVagas(): Promise<Vaga[]> {
  const res = await serverApi("/petrocarga/vagas/all");

  if (!res.ok) {
    console.error("Erro em getVagas:", await res.text());
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data?.vagas ?? [];
}

/* -----------------------------------------------------
📌 Buscar vaga por ID
----------------------------------------------------- */
export async function getVagaById(id: string): Promise<Vaga | null> {
  const res = await serverApi(`/petrocarga/vagas/${id}`);

  if (!res.ok) {
    console.error(`Erro em getVagaById(${id}):`, await res.text());
    return null;
  }

  return (await res.json()) ?? null;
}
