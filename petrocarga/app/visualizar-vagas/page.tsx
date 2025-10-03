"use client";

import { ViewMap } from "@/components/map/viewMap";
import VagaItem from "@/components/cards/vagas-item";
import { Vaga } from "@/lib/types";
import { useState, useEffect } from "react";

export default function Page() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vagas").then((res) => res.json())
    .then((data) => {
      setVagas(data);
      setLoading(false);
    });
  }, []);

  

  return (
    <main className="container mx-auto flex flex-col md:flex-row items-stretch gap-4 mt-2 mb-2">
  {/* Container do mapa */}
  <div className="flex-1 h-[70vh] min-h-[300px]">
    <ViewMap selectedPlace={selectedPlace} />
  </div>

  {/* Lista de vagas */}
  <div className="flex-1 flex flex-col bg-blue-100 h-[70vh] min-h-[300px] p-4 rounded-lg shadow-md overflow-y-auto ">
    <h1 className="text-lg font-bold text-center">Lista de Vagas</h1>

    {loading ? (
      <p className="text-center text-gray-500">Carregando vagas...</p>
    ) : (
      <div className="space-y-2">
        {vagas.map((vaga) => (
          <VagaItem key={vaga.id} vaga={vaga} />
        ))}
      </div>
    )}
  </div>
</main>

  );
}
