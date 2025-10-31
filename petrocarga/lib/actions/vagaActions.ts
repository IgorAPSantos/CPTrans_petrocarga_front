"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type OperacoesVaga = {
  dia: string;
  horarioInicio: string;
  horarioFim: string;
};

export async function addVaga(formData: FormData, token: string) {
  const diasSemanaRaw = formData.get("diaSemana") as string;
  const diasSemana = diasSemanaRaw ? JSON.parse(diasSemanaRaw) : [];

  const payload = {
    endereco: {
      codigoPMP: formData.get("codigo") as string,
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
    operacoesVaga: diasSemana.map((dia: OperacoesVaga) => ({
      codigoDiaSemana: Number(dia.dia),
      horaInicio: dia.horarioInicio,
      horaFim: dia.horarioFim,
    })),
  };

  const res = await fetch(
    "https://cptranspetrocargaback-production.up.railway.app/petrocarga/vagas",
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
    const errorData = await res.json();
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

export async function deleteVaga(id: string, token: string) {
  const res = await fetch(
    `https://cptranspetrocargaback-production.up.railway.app/petrocarga/vagas/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao deletar a vaga");
  }

  revalidatePath("/visualizar-vagas");
  return {
    error: false,
    message: "Vaga deletada com sucesso!",
  };
}

export async function atualizarVaga(formData: FormData, token: string) {
  const id = formData.get("id") as string;

  const diasSemanaRaw = formData.get("diaSemana") as string;
  const diasSemana = diasSemanaRaw ? JSON.parse(diasSemanaRaw) : [];

  const payload = {
    endereco: {
      codigoPMP: formData.get("codigo") as string,
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
      codigoDiaSemana: Number(dia.dia),
      horaInicio: dia.horarioInicio,
      horaFim: dia.horarioFim,
    })),
  };

  const res = await fetch(
    `https://cptranspetrocargaback-production.up.railway.app/petrocarga/vagas/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    return {
      error: true,
      message: errorData.message || "Erro ao atualizar vaga",
      valores: payload,
    };
  }

  revalidatePath("/visualizar-vagas");
  revalidatePath(`/visualizar-vagas/${id}`);

  redirect(`/visualizar-vagas/${id}`);
}

// vagaActions.ts
export async function getVagas(token?: string) {
  try {
    const res = await fetch(
      "https://cptranspetrocargaback-production.up.railway.app/petrocarga/vagas/all",
      {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    console.log("📡 Status da resposta:", res.status, res.statusText);
    console.log("🔑 Token enviado:", token);

    if (!res.ok) {
      const text = await res.text(); // captura o corpo mesmo se não for JSON
      console.error("❌ Erro da API:", text);
      throw new Error("Erro ao buscar vagas");
    }

    const data = await res.json().catch((err) => {
      console.error("⚠️ Erro ao fazer parse do JSON:", err);
      return null;
    });

    console.log("✅ Dados recebidos da API:", data);

    return Array.isArray(data) ? data : data?.vagas ?? [];
  } catch (err) {
    // qualquer erro de fetch retorna array vazio
    console.error("Erro em getVagas:", err);
    return [];
  }
}
