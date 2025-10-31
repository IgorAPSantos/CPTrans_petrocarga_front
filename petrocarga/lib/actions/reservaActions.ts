"use server";

export async function reservarVaga(formData: FormData, token: string) {
  const vagaId = formData.get("vagaId");
  const motoristaId = formData.get("motoristaId");
  const veiculoId = formData.get("veiculoId");
  const cidadeOrigem = formData.get("cidadeOrigem");
  const inicio = formData.get("inicio");
  const fim = formData.get("fim");

  const body = {
    vagaId,
    motoristaId,
    veiculoId,
    cidadeOrigem,
    inicio,
    fim,
    status: "ATIVA",
  };

  try {
    const response = await fetch(
      "https://cptranspetrocargaback-production.up.railway.app/petrocarga/reservas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⚡ Aqui passa o token
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Erro: ${response.status} - ${err}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao reservar vaga:", error);
    throw error;
  }
}
