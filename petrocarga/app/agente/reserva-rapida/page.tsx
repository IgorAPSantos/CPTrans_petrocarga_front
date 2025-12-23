'use client';

import { useState } from 'react';
import { MapReserva } from '@/components/map/MapReserva';
import ReservaRapida from '@/components/agente/reservaRapida/reservaRapidaComponent';
import { Vaga } from '@/lib/types/vaga';

export default function ReservaRapidaPage() {
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
    <div className="px-2 md:p-6 max-w-6xl mx-auto mt-6 md:mt-10">
      {step === 1 && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-lg md:text-2xl font-semibold text-center mb-4">
            Selecione uma Vaga
          </h1>

          <div
            className="
            w-full
            h-[calc(88vh-120px)]
            md:h-[70vh]
            lg:h-[75vh]
            rounded-lg
            overflow-hidden
            shadow-md
            mb-4
          "
          >
            <MapReserva onClickVaga={handleSelectVaga} />
          </div>
        </div>
      )}

      {step === 2 && selectedVaga && (
        <ReservaRapida selectedVaga={selectedVaga} onBack={handleBackToMap} />
      )}
    </div>
  );
}
