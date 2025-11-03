"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addMotorista(formData: FormData) {
  const payload = {
    nome: formData.get("nome") as string,
    cpf: formData.get("cpf") as string,
    telefone: formData.get("telefone") as string,
    email: formData.get("email") as string,
    senha: formData.get("senha") as string,
    numero_cnh: formData.get("numeroCnh") as string,
    categoria_cnh: (formData.get("categoriaCnh") as string)?.toUpperCase(),
    data_validade_cnh: formData.get("dataValidadeCnh") as string,
  };

  const res = await fetch(
    "https://cptranspetrocargaback-production.up.railway.app/petrocarga/motoristas",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    return {
      error: true,
      message: errorData.message || "Erro ao cadastrar motorista",
      valores: payload,
    };
  }

  revalidatePath("/gestor/lista-motoristas");
}

export async function deleteMotorista(motoristaId: string) {
  const res = await fetch(
    `https://cptranspetrocargaback-production.up.railway.app/petrocarga/motoristas/${motoristaId}`,
    { method: "DELETE" }
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

export async function atualizarMotorista(formData: FormData) {
  const id = formData.get("id") as string;

  const payload = {
    nome: formData.get("nome") as string,
    cpf: formData.get("cpf") as string,
    telefone: formData.get("telefone") as string,
    email: formData.get("email") as string,
    senha: formData.get("senha") as string,
    numero_cnh: formData.get("numeroCnh") as string,
    categoria_cnh: (formData.get("categoriaCnh") as string)?.toUpperCase(),
    data_validade_cnh: formData.get("dataValidadeCnh") as string,
  };

  const res = await fetch(
    `https://cptranspetrocargaback-production.up.railway.app/petrocarga/motoristas/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
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

export async function getMotoristaByUserId(token: string, userId: string) {
  if (!token || !userId) {
    return { error: true, message: "Usuário ou token não fornecido" };
  }

  try {
    const res = await fetch(
      `https://cptranspetrocargaback-production.up.railway.app/petrocarga/motoristas/${userId}`,
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