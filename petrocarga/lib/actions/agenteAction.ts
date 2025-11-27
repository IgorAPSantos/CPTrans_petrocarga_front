"use server";
import { serverApi } from "../serverApi";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ----------------------
// ADD AGENTE
// ----------------------
export async function addAgente(_: unknown, formData: FormData) {
  const payload = {
    nome: formData.get("nome") as string,
    cpf: formData.get("cpf") as string,
    telefone: formData.get("telefone") as string,
    email: formData.get("email") as string,
    matricula: formData.get("matricula") as string,
  };

  const res = await serverApi(`/petrocarga/agentes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Erro ao cadastrar agente";

    try {
      const data = await res.json();
      msg = data.message ?? msg;
    } catch {}

    return { error: true, message: msg, valores: payload };
  }

  return { error: false, message: "Agente cadastrado com sucesso!" };
}

// ----------------------
// DELETE AGENTE
// ----------------------
export async function deleteAgente(agenteId: string) {
  const res = await serverApi(`/petrocarga/agentes/${agenteId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let msg = "Erro ao deletar agente";
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  revalidatePath("/agentes/veiculos&reservas");
  return { error: false, message: "agente deletado com sucesso!" };
}

// ----------------------
// ATUALIZAR AGENTE
// ----------------------
export async function atualizarAgente(formData: FormData) {
  const usuarioid = formData.get("id") as string;
  const senha = formData.get("senha") as string;
  
  const payload = {
    nome: formData.get("nome") as string,
    cpf: formData.get("cpf") as string,
    telefone: formData.get("telefone") as string,
    email: formData.get("email") as string,
    matricula: formData.get("matricula") as string,
    ...(senha ? { senha } : {}),
  };

  const res = await serverApi(`/petrocarga/agentes/${usuarioid}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Erro ao atualizar agente";

    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  revalidatePath("/gestor/agentes");
  revalidatePath("/agentes/perfil");

  redirect("/agente/perfil");
}
// ----------------------
// GET AGENTE BY USER ID
// ----------------------
export async function getAgenteByUserId(userId: string) {
  const res = await serverApi(`/petrocarga/agentes/${userId}`);

  if (!res.ok) {
    let msg = "Erro ao buscar agente";

    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, agenteId: data.id, agente: data };
}

// ----------------------
// GET AGENTES
// ----------------------
export async function getAgentes() {
  const res = await serverApi(`/petrocarga/agentes`); 
  
  if (!res.ok) {
    let msg = "Erro ao buscar agentes";
    
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, agentes: data };
}
// ----------------------