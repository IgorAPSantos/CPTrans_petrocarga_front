"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addMotorista(prevState: unknown, formData: FormData) {
  {
    /* Extrair e montar o payload JSON */
  }
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
      headers: {
        "Content-Type": "application/json",
      },
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
    {
      method: "DELETE",
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
  return {
    error: false,
    message: "Motorista deletado com sucesso!",
  };
}

export async function atualizarMotorista(
  prevState: unknown,
  formData: FormData
) {
  {
    /* Certifique-se de enviar o ID no formData */
  }
  const id = formData.get("id") as string;

  {
    /* Extrair e montar o payload JSON */
  }
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
      headers: {
        "Content-Type": "application/json",
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

  {
    /* Revalida a página de listagem de motoristas */
  }
  revalidatePath("/gestor/lista-motoristas");
  revalidatePath("/motoristas/perfil");
  return {
    error: false,
    message: "Perfil atualizado com sucesso!",
    valores: null,
  };

  {
    /* Redirecionar para a página de perfil do motorista */
  }
  redirect("/motoristas/perfil");
}
