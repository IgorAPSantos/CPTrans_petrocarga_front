"use client";

import { useState } from "react";
import { MapReserva } from "@/components/map/MapReserva";
import ReservaComponent from "@/components/reserva/ReservaComponent";
import { Vaga } from "@/lib/types/vaga";

export default function ReservaPage() {
  const [step, setStep] = useState(1); // Step 1 = mapa, Step 2 = reserva
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);

  const handleSelectVaga = (vaga: Vaga) => {
    setSelectedVaga(vaga);
    setStep(2);
  };

  const handleBackToMap = () => {
    setStep(1);
    setSelectedVaga(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {step === 1 && (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className=" md:text-2xl font-semibold text-center mb-4">
            Escolha uma vaga
          </h1>
          <div className="h-[500px] w-full">
            <MapReserva onClickVaga={handleSelectVaga} />
          </div>
        </div>
      )}

      {step === 2 && selectedVaga && (
        <ReservaComponent
          selectedVaga={selectedVaga}
          onBack={handleBackToMap}
        />
      )}
    </div>
  );
}
