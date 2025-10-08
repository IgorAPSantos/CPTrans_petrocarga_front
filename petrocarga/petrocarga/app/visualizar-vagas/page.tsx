"use client";

import { ViewMap } from "@/components/map/viewMap";
import { useState } from "react";

export default function Page() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <main className="container mx-auto flex flex-col md:flex-row items-stretch gap-4 mt-2 mb-2">
  {/* Container do mapa */}
  <div className="flex-1 h-[70vh] min-h-[300px]">
    <ViewMap selectedPlace={selectedPlace} />
  </div>

  {/* Lista de vagas */}
  <div className="flex-1 flex flex-col bg-blue-100 h-[70vh] min-h-[300px] p-4 rounded-lg shadow-md">
    <h1 className="text-lg font-bold text-center">Lista de Vagas</h1>
  </div>
</main>

  );
}
