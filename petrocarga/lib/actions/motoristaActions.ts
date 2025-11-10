"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addMotorista(prevState: unknown, formData: FormData) {
  const payload = {
    usuario: {
      nome: formData.get("nome") as string,
      cpf: formData.get("cpf") as string,
      telefone: formData.get("telefone") as string,
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
    },
    tipoCNH: (formData.get("tipoCNH") as string)?.toUpperCase(),
    numeroCNH: formData.get("numeroCNH") as string,
    dataValidadeCNH: formData.get("dataValidadeCNH") as string,
  };

  const res = await fetch(
    "https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/motoristas/cadastro",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    let errorMessage = "Erro ao cadastrar motorista";

    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      console.error("⚠️ Erro ao ler resposta da API (não era JSON).");
    }

    return {
      error: true,
      message: errorMessage,
      valores: payload,
    };
  }

  return {
    error: false,
    message: "Motorista cadastrado com sucesso!",
  };
}

export async function deleteMotorista(motoristaId: string, token: string) {
  const res = await fetch(
    `https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/motoristas/${motoristaId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    return {
      error: true,
      message: errorData.message || "Erro ao deletar motorista",
    };
  }

  revalidatePath("/motoristas/veiculos&reservas");
  return { error: false, message: "Motorista deletado com sucesso!" };
}

export async function atualizarMotorista(formData: FormData, token: string) {
  const id = formData.get("id") as string;

  const payload = {
    usuario: {
      nome: formData.get("nome") as string,
      cpf: formData.get("cpf") as string,
      telefone: formData.get("telefone") as string,
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
    },
    tipoCNH: (formData.get("tipoCNH") as string)?.toUpperCase(),
    numeroCNH: formData.get("numeroCNH") as string,
    dataValidadeCNH: formData.get("dataValidadeCNH") as string,
    empresaId: null, // substitua pelo ID correto se necessário
  };

  const res = await fetch(
    `https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/motoristas/${id}`,
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
      message: errorData.message || "Erro ao atualizar motorista",
      valores: payload,
    };
  }

  revalidatePath("/gestor/lista-motoristas");
  revalidatePath("/motoristas/perfil");

  redirect("/motoristas/perfil");
}

export async function getMotoristaByUserId(userId: string, token: string) {
  if (!token || !userId) {
    return { error: true, message: "Usuário ou token não fornecido" };
  }

  try {
    const res = await fetch(
      `https://cptranspetrocargaback-production-ccd6.up.railway.app/petrocarga/motoristas/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return {
        error: true,
        message: errorData.message || "Erro ao buscar motorista",
      };
    }

    const motorista = await res.json();
    return { error: false, motoristaId: motorista.id, motorista };
  } catch (error) {
    console.error("Erro ao buscar motorista:", error);
    return { error: true, message: "Erro interno ao buscar motorista" };
  }
}
