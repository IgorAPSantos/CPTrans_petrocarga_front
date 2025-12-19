"use client";

import { useRouter } from "next/navigation";

export default function OfflinePage() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>PetroCarga está Offline</h1>
      <p>Parece que você está sem conexão com a internet.</p>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Tentar Novamente
        </button>
        <button onClick={() => router.back()} className="btn-secondary">
          Voltar para página anterior
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>
          Suas reservas salvas ainda podem ser visualizadas na aba de Reservas.
        </p>
      </div>
    </div>
  );
}
