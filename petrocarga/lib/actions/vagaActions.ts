"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Vaga, OperacoesVaga } from "../types/vaga";

// Função para cadastrar vaga
export async function addVaga(formData: FormData, token: string) {
  console.log("FormData recebida:", formData);

  const diasSemanaRaw = formData.get("diaSemana") as string;
  console.log("diasSemanaRaw:", diasSemanaRaw);

  const diasSemana: {
    dia: string;
    horarioInicio: string;
    horarioFim: string;
  }[] = diasSemanaRaw ? JSON.parse(diasSemanaRaw) : [];
  console.log("diasSemana parsed:", diasSemana);

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

  console.log("Payload final:", payload);
  console.log("Token usado:", token);

  try {
    const res = await fetch(
      "https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/vagas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.log("Erro do backend:", errorData);
      return {
        error: true,
        message: errorData.message || "Erro ao cadastrar vaga",
        valores: payload,
      };
    }

    console.log("Vaga cadastrada com sucesso!");
    revalidatePath("/gestor/visualizar-vagas");

    return {
      error: false,
      message: "Vaga cadastrada com sucesso!",
      valores: null,
    };
  } catch (err) {
    console.error("Erro ao fazer fetch:", err);
    return {
      error: true,
      message: "Erro ao cadastrar vaga",
      valores: payload,
    };
  }
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
export async function atualizarVaga(
  prevState: unknown,
  formData: FormData,
  token: string
) {
  console.log("Token recebido:", token);

  // Certifique-se de enviar o ID no formData
  const id = formData.get("id") as string;
  console.log("ID da vaga:", id);

  // Extrair e montar o payload JSON
  const diasSemanaRaw = formData.get("diaSemana") as string;
  const diasSemana = diasSemanaRaw ? JSON.parse(diasSemanaRaw) : [];

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
    operacoesVaga: diasSemana.map((dia: OperacoesVaga) => ({
      codigoDiaSemana: Number(dia.codigoDiaSemana),
      horaInicio: dia.horaInicio,
      horaFim: dia.horaFim,
    })),
  };

  console.log("Payload montado:", payload);

  const res = await fetch(
    `https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/vagas/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // token no header
      },
      body: JSON.stringify(payload),
    }
  );

  console.log("Status da resposta:", res.status);

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Erro ao atualizar vaga:", errorData);
    return {
      error: true,
      message: errorData.message || "Erro ao atualizar vaga",
      valores: payload,
    };
  }

  // Revalida a lista e a página específica da vaga
  console.log("Atualização bem-sucedida! Revalidando páginas...");
  revalidatePath("/gestor/visualizar-vagas");
  revalidatePath(`/gestor/visualizar-vagas/${id}`);

  // Redireciona após sucesso
  console.log("Redirecionando para a vaga:", `/gestor/visualizar-vagas/${id}`);
  redirect(`/gestor/visualizar-vagas/${id}`);
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
