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
    <div className="p-6 max-w-7xl mx-auto">
      {step === 1 && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mapa à esquerda */}
          <div className="lg:w-1/2 h-[500px] rounded-xl shadow-xl overflow-hidden border border-gray-200 relative">
            <MapReserva onClickVaga={handleSelectVaga} />

            {/* Overlay minimalista */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-lg text-sm text-gray-700 shadow">
              Clique em um marcador
            </div>
          </div>

          {/* Informações à direita */}
          <div className="lg:w-1/2 flex flex-col justify-center items-start p-4 bg-white rounded-xl shadow-lg border border-gray-200">
            <h1 className="text-2xl font-semibold mb-2">Escolha sua vaga</h1>
            <p className="text-gray-600 mb-4">
              Clique em um marcador azul no mapa para iniciar a reserva da vaga
              desejada.
            </p>

            <ul className="list-disc list-inside text-gray-700">
              <li>Veja detalhes da vaga ao clicar</li>
              <li>Reserve seu horário de forma rápida</li>
              <li>Confira o endereço e o veículo selecionado</li>
            </ul>
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
