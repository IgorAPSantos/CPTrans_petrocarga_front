"use server";

import { serverApi } from "@/lib/serverApi";

// ----------------------
// POST RESERVA
// ----------------------

export async function reservarVaga(formData: FormData) {
  const body = {
    vagaId: formData.get("vagaId"),
    motoristaId: formData.get("motoristaId"),
    veiculoId: formData.get("veiculoId"),
    cidadeOrigem: formData.get("cidadeOrigem"),
    inicio: formData.get("inicio"),
    fim: formData.get("fim"),
    status: "ATIVA",
  };

  const res = await serverApi("/petrocarga/reservas", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await res.text());
    
  }

  return res.json();
}

// ----------------------
// GET RESERVAS
// ----------------------
export async function getReservasPorUsuario(usuarioId: string) {
  const res = await serverApi(`/petrocarga/reservas/usuario/${usuarioId}`);

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// ----------------------
// GET RESERVAS ATIVAS
// ----------------------
export async function getReservasAtivas(vagaId: string) {
  const res = await serverApi(`/petrocarga/reservas/ativas/${vagaId}`);

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
