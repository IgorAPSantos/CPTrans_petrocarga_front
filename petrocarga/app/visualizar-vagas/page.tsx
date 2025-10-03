"use client";

import { ViewMap } from "@/components/map/viewMap";
import VagaItem from "@/components/cards/vagas-item";

import { useState } from "react";
import { ListaVagas } from "@/components/lista/listaVagas";

export default function Page() {
  const [selectedPlace, setSelectedPlace] = useState(null);
 
  

  return (
    <main className="container mx-auto flex flex-col md:flex-row items-stretch gap-4 mt-2 mb-2">
  {/* Container do mapa */}
  <div className="flex-1 h-[70vh] min-h-[300px]">
    <ViewMap selectedPlace={selectedPlace} />
  </div>

  {/* Lista de vagas */}
  <div className="flex-1 flex flex-col bg-blue-100 h-[70vh] min-h-[300px] p-4 rounded-lg shadow-md overflow-y-auto  ">
    <ListaVagas/>
  </div>
</main>

  );
}
