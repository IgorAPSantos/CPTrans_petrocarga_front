"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Tipos
export interface OperacaoVaga {
  codigoDiaSemana: number;
  horaInicio: string;
  horaFim: string;
}

export interface Vaga {
  id: string;
  endereco: {
    codigoPmp: string;
    logradouro: string;
    bairro: string;
  };
  area: string;
  numeroEndereco: string;
  referenciaEndereco: string;
  tipoVaga: string;
  status: string;
  referenciaGeoInicio: string;
  referenciaGeoFim: string;
  comprimento: number;
  operacoesVaga: OperacaoVaga[];
}

// Função para cadastrar vaga
export async function addVaga(formData: FormData) {
  const diasSemanaRaw = formData.get("diaSemana") as string;
  const diasSemana: {
    dia: string;
    horarioInicio: string;
    horarioFim: string;
  }[] = diasSemanaRaw ? JSON.parse(diasSemanaRaw) : [];

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
      codigoDiaSemana: Number(dia.dia),
      horaInicio: dia.horarioInicio,
      horaFim: dia.horarioFim,
    })),
  };

  const res = await fetch(
    "https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/vagas",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      error: true,
      message: errorData.message || "Erro ao cadastrar vaga",
      valores: payload,
    };
  }

  revalidatePath("/visualizar-vagas");
  return {
    error: false,
    message: "Vaga cadastrada com sucesso!",
    valores: null,
  };
}

// Função para deletar vaga
export async function deleteVaga(id: string, token: string) {
  if (!token) throw new Error("Token de autenticação não fornecido");

  const res = await fetch(
    `https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/vagas/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Erro ao deletar a vaga");

  revalidatePath("/visualizar-vagas");
  return { error: false, message: "Vaga deletada com sucesso!" };
}

// Função para atualizar vaga
export async function atualizarVaga(formData: FormData, token?: string) {
  // ✅ ID da vaga
  const id = formData.get("id") as string;
  console.log("🆔 ID da vaga:", id);

  // ✅ Mostrar todos os campos do FormData
  console.log("📋 FormData entries:");
  formData.forEach((value, key) => console.log(`  ${key}:`, value));

  // ✅ Extrair dias da semana do form
  const diasSemanaRaw = formData.get("diaSemana") as string;
  const diasSemanaForm: {
    dia: string;
    horarioInicio: string;
    horarioFim: string;
  }[] = diasSemanaRaw ? JSON.parse(diasSemanaRaw) : [];
  console.log("📅 Dias da semana do formulário:", diasSemanaForm);

  // ✅ Transformar em OperacaoVaga
  const operacoesVaga: OperacaoVaga[] = diasSemanaForm.map((dia) => ({
    codigoDiaSemana: Number(dia.dia),
    horaInicio: dia.horarioInicio,
    horaFim: dia.horarioFim,
  }));
  console.log("📦 OperacoesVaga antes do envio:", operacoesVaga);

  // ✅ Montar payload
  const payload = {
    endereco: {
      codigoPmp: formData.get("codigoPmp") as string,
      logradouro: formData.get("logradouro") as string,
      bairro: formData.get("bairro") as string,
    },
    area: (formData.get("area") as string)?.toUpperCase(),
    numeroEndereco: formData.get("numeroEndereco") as string,
    referenciaEndereco: formData.get("referenciaEndereco") as string,
    tipoVaga: (formData.get("tipoVaga") as string)?.toUpperCase(),
    status: (formData.get("status") as string)?.toUpperCase(),
    referenciaGeoInicio: formData.get("referenciaGeoInicio") as string,
    referenciaGeoFim: formData.get("referenciaGeoFim") as string,
    comprimento: Number(formData.get("comprimento")),
    operacoesVaga,
  };
  console.log("📦 Payload final para envio:", payload);

  // ✅ Enviar PATCH
  const res = await fetch(
    `https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/vagas/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    }
  );

  // ✅ Tratar erros
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("❌ Erro ao atualizar vaga:", errorData);
    return {
      error: true,
      message: errorData.message || "Erro ao atualizar vaga",
      valores: payload,
    };
  }

  console.log("✅ Vaga atualizada com sucesso!");

  // ✅ Revalidar paths e redirecionar
  revalidatePath("/gestor/visualizar-vagas");
  revalidatePath(`/gestor/visualizar-vagas/${id}`);
  redirect(`/gestor/visualizar-vagas/${id}`);

  return { error: false, message: "Vaga atualizada com sucesso!" };
}
// Funções para buscar vagas
export async function getVagas(token?: string): Promise<Vaga[]> {
  try {
    const res = await fetch(
      "https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/vagas/all",
      {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    if (!res.ok) throw new Error("Erro ao buscar vagas");

    const data = await res.json().catch(() => []);
    return Array.isArray(data) ? data : data?.vagas ?? [];
  } catch (err) {
    console.error("Erro em getVagas:", err);
    return [];
  }
}

export async function getVagaById(
  id: string,
  token?: string
): Promise<Vaga | null> {
  try {
    const res = await fetch(
      `https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/vagas/${id}`,
      {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    if (!res.ok) throw new Error(`Erro ao buscar vaga de ID ${id}`);

    return await res.json().catch(() => null);
  } catch (err) {
    console.error(`Erro em getVagaById(${id}):`, err);
    return null;
  }
}
