"use server";

import { serverApi } from "@/lib/serverApi";

// ----------------------
// POST RESERVA MOTORISTA
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
// POST RESERVA AGENTE
// ----------------------
export async function reservarVagaAgente(formData: FormData) {
  const body = {
    vagaId: formData.get("vagaId"),
    tipoVeiculo: formData.get("tipoVeiculo"),
    placa: formData.get("placa"),
    inicio: formData.get("inicio"),
    fim: formData.get("fim"),
  };

  const res = await serverApi("/petrocarga/reserva-rapida", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// ----------------------
// POST RESERVA CHECKOUT-FORÇADO
// ----------------------

export async function finalizarForcado(reservaID: string) {

  const res = await serverApi(`/petrocarga/reservas/${reservaID}/finalizar-forcado`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// ----------------------
// GET RESERVAS POR USUARIO
// ----------------------
export async function getReservasPorUsuario(usuarioId: string) {
  const res = await serverApi(`/petrocarga/reservas/usuario/${usuarioId}`);

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// ----------------------
// GET RESERVAS 
// ----------------------
export async function getReservas() {
  const res = await serverApi(`/petrocarga/reservas/all`);

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// ----------------------
// GET RESERVAS BLOQUEIOS
// ----------------------
export async function getReservasBloqueios(
  vagaId: string,
  data: string,
  tipoVeiculo: "AUTOMOVEL" | "VUC" | "CAMINHONETA" | "CAMINHAO_MEDIO" | "CAMINHAO_LONGO"
) {
  const queryParams = new URLSearchParams({
    data,
    tipoVeiculo,
  }).toString();

  const res = await serverApi(`/petrocarga/reservas/bloqueios/${vagaId}?${queryParams}`, {
    method: "GET",
  });

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

// ----------------------
// DOCUMENTO RESERVA
// ----------------------

export async function getDocumentoReserva(reservaID: string) {
  const res = await serverApi(`/petrocarga/documentos/reservas/${reservaID}`);

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
