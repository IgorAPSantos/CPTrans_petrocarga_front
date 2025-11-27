"use server";

import { serverApi } from "@/lib/serverApi";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ----------------------
// ADD GESTOR
// ----------------------
export async function addGestor(_: unknown, formData: FormData) {
  const payload = {
    nome: formData.get("nome") as string,
    cpf: formData.get("cpf") as string,
    telefone: formData.get("telefone") as string,
    email: formData.get("email") as string,
  };

  const res = await serverApi(`/petrocarga/gestor`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Erro ao cadastrar gestor";

    try {
      const data = await res.json();
      msg = data.message ?? msg;
    } catch {}

    return { error: true, message: msg, valores: payload };
  }

  return { error: false, message: "Gestor cadastrado com sucesso!" };
}

// ----------------------
// DELETE GESTOR
// ----------------------
export async function deleteGestor(gestorId: string) {
  const res = await serverApi(`/petrocarga/gestor/${gestorId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let msg = "Erro ao deletar gestor";

    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  return { error: false, message: "Gestor deletado com sucesso!" };
}

// ----------------------
// ATUALIZAR GESTOR
// ----------------------
export async function atualizarGestor(formData: FormData) {
  const usuarioId = formData.get("id") as string;
  const senha = formData.get("senha") as string;

  const payload = {
    nome: formData.get("nome") as string,
    cpf: formData.get("cpf") as string,
    telefone: formData.get("telefone") as string,
    email: formData.get("email") as string,
    ...(senha ? { senha } : {}),
  };

  const res = await serverApi(`/petrocarga/gestores/${usuarioId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Erro ao atualizar gestor"; 
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg, valores: payload };
  }
  
  return { error: false, message: "Gestor atualizado com sucesso!" };

  revalidatePath("/gestor/perfil");
  revalidatePath("/gestor/gestores");
  
  redirect("/gestor/perfil");
}


// ----------------------
// GET GESTOR
// ----------------------
export async function getGestor() {
  const res = await serverApi(`/petrocarga/gestores`, {
    method: "GET",
  });
  if (!res.ok) {
    let msg = "Erro ao buscar gestor";

    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const gestor = await res.json();
  return { error: false, gestor };
}

// ----------------------
// GET GESTOR BY USER ID
// ----------------------
export async function getGestorByUserId(userId: string) {
  const res = await serverApi(`/petrocarga/gestores/${userId}`);

  if (!res.ok) {
    let msg = "Erro ao buscar gestor";
    
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, gestorId: data.id, gestor: data };
}