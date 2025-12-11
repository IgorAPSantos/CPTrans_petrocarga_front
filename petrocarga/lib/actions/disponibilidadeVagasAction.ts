"use server";

import { serverApi } from "../serverApi";
import { revalidatePath } from "next/cache";

// ----------------------
// POST DISPONIBILIDADE VAGAS
// ----------------------

export async function addDisponibilidadeVagas(formData: FormData) {
  const vagaIds = formData.getAll("vagaid") as string[];

  const body = {
    listaVagaId: vagaIds,
    inicio: new Date(formData.get("inicio") as string).toISOString(),
    fim: new Date(formData.get("fim") as string).toISOString(),
  };

  const res = await serverApi("/petrocarga/disponibilidade-vagas/vagas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(await res.text());

  return res.json();
}


// ----------------------
// GET DISPONIBILIDADE VAGAS
// ----------------------

export async function getDisponibilidadeVagas(){
    const res = await serverApi("/petrocarga/disponibilidade-vagas");

    if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// ----------------------
// PATCH DISPONIBILIDADE VAGAS
// ----------------------

export async function editarDisponibilidadeVagas(id: string, vagaId: string, inicio: string, fim: string) {
  const body = { vagaId, inicio, fim };

  console.log("Disponibilidade ID:", id);
  console.log("PUT body:", body);

  const res = await serverApi(`/petrocarga/disponibilidade-vagas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = "Erro ao atualizar disponibilidade";
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}
    console.log("PUT body com erro:", body);
    console.log("Mensagem de erro do servidor:", msg);
    return { error: true, message: msg, valores: body };
  }

  console.log("PUT sucesso:", body);
  return { success: true, valores: body };
}


export async function deleteDisponibilidadeVagas(formData: FormData) {
  const disponibilidadeId = formData.get("id") as string;

  if (!disponibilidadeId) {
    throw new Error("ID da disponibilidade não enviado.");
  }

  const res = await serverApi(
    `/petrocarga/disponibilidade-vagas/${disponibilidadeId}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erro ao deletar disponibilidade: ${errorText}`);
  }
revalidatePath("/gestor/disponibilidade-vagas");
  return true;
}
