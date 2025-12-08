"use server";

import { serverApi } from "@/lib/serverApi";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ----------------------
// ADD MOTORISTA
// ----------------------
export async function addMotorista(_: unknown, formData: FormData) {
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

  const res = await serverApi(`/petrocarga/motoristas/cadastro`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Erro ao cadastrar motorista";

    try {
      const data = await res.json();
      msg = data.message ?? msg;
    } catch {}

    return { error: true, message: msg, valores: payload };
  }

  return { error: false, message: "Motorista cadastrado com sucesso!" };
}

// ----------------------
// DELETE MOTORISTA
// ----------------------
export async function deleteMotorista(motoristaId: string) {
  const res = await serverApi(`/petrocarga/motoristas/${motoristaId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let msg = "Erro ao deletar motorista";
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  revalidatePath("/motoristas/veiculos&reservas");
  return { error: false, message: "Motorista deletado com sucesso!" };
}

// ----------------------
// ATUALIZAR MOTORISTA
// ----------------------
export async function atualizarMotorista(formData: FormData) {
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
  };

  const res = await serverApi(`/petrocarga/motoristas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Erro ao atualizar motorista";

    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  revalidatePath("/gestor/lista-motoristas");
  revalidatePath("/motoristas/perfil");
  redirect("/motorista/perfil");
}

// ----------------------
// GET MOTORISTA BY USER ID
// ----------------------
export async function getMotoristaByUserId(userId: string) {
  const res = await serverApi(`/petrocarga/motoristas/${userId}`);

  if (!res.ok) {
    let msg = "Erro ao buscar motorista";

    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, motoristaId: data.id, motorista: data };
}

// ----------------------
// GET MOTORISTAS
// ----------------------
export async function getMotoristas() {
  const res = await serverApi(`/petrocarga/motoristas`); 
  
  if (!res.ok) {
    let msg = "Erro ao buscar motoristas";
    
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, motoristas: data };
}
// ----------------------