"use client";

import { useState, useEffect } from "react";
import StepIndicator from "@/components/reserva/StepIndicator";
import DaySelection from "@/components/reserva/DaySelection";
import TimeSelection from "@/components/reserva/TimeSelection";
import OriginVehicleStep from "@/components/reserva/OriginVehicleStep";
import Confirmation from "@/components/reserva/Confirmation";
import { Vaga } from "@/lib/types/vaga";

interface ReservaComponentProps {
  selectedVaga: Vaga;
  onBack?: () => void;
}

const allTimes = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

const reservedTimes = ["10:00", "13:30", "14:00"];

const mockVehicles = [
  { id: "v1", name: "Carro Pessoal - Sprinter", plate: "ABC-1234" },
  { id: "v2", name: "Moto - Honda CG", plate: "XYZ-5678" },
  { id: "v3", name: "Carro Pessoal - VW Gol", plate: "DEF-9012" },
];

export default function ReservaComponent({
  selectedVaga,
  onBack,
}: ReservaComponentProps) {
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [startHour, setStartHour] = useState<string | null>(null);
  const [endHour, setEndHour] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>();

  useEffect(() => {
    if (selectedVaga) setStep(1);
  }, [selectedVaga]);

  const reset = () => {
    setStep(1);
    setSelectedDay(undefined);
    setStartHour(null);
    setEndHour(null);
    setOrigin("");
    setSelectedVehicleId(undefined);
  };

  const handleConfirm = () => {
    alert("Reserva confirmada ✅ (mock)");
    reset();
  };

  return (
    <div
      className="p-4 sm:p-6 border rounded-xl shadow-lg 
      max-w-2xl mx-auto bg-white 
      min-h-[80vh] flex flex-col gap-4"
    >
      {onBack && (
        <button
          onClick={onBack}
          className="px-3 py-2 w-fit bg-gray-200 rounded-lg text-sm sm:text-base"
        >
          Voltar ao mapa
        </button>
      )}

      <h2 className="text-lg sm:text-xl font-semibold text-center leading-tight">
        Reservando vaga: <br className="sm:hidden" />
        {selectedVaga.endereco.logradouro} - {selectedVaga.endereco.bairro}
      </h2>

      <StepIndicator step={step} />

      <div className="flex-1 overflow-y-auto pb-4">
        {step === 1 && (
          <>
            <DaySelection
              selected={selectedDay}
              onSelect={(day) => setSelectedDay(day)}
            />
            {selectedDay && (
              <div className="flex justify-center mt-4">
                <button
                  className="px-6 py-3 text-white text-sm bg-blue-600 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                  onClick={() => setStep(2)}
                >
                  Próximo
                </button>
              </div>
            )}
          </>
        )}

        {step === 2 && selectedDay && (
          <TimeSelection
            times={allTimes}
            reserved={reservedTimes}
            selected={startHour}
            onSelect={(t) => {
              setStartHour(t);
              setEndHour(null);
              setStep(3);
            }}
            onBack={() => setStep(1)}
            color="blue"
          />
        )}

        {step === 3 && startHour && (
          <TimeSelection
            times={allTimes.filter(
              (t) => allTimes.indexOf(t) > allTimes.indexOf(startHour)
            )}
            reserved={reservedTimes}
            selected={endHour}
            onSelect={(t) => {
              setEndHour(t);
              setStep(4);
            }}
            onBack={() => setStep(2)}
            color="blue"
          />
        )}

        {step === 4 && (
          <OriginVehicleStep
            vehicles={mockVehicles}
            origin={origin}
            selectedVehicleId={selectedVehicleId}
            onOriginChange={setOrigin}
            onVehicleChange={setSelectedVehicleId}
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        )}

        {step === 5 && (
          <Confirmation
            day={selectedDay!}
            startHour={startHour!}
            endHour={endHour!}
            origin={origin}
            destination={`${selectedVaga.endereco.logradouro}, ${selectedVaga.endereco.bairro}`}
            vehicleName={`${
              mockVehicles.find((v) => v.id === selectedVehicleId)?.name
            } - ${mockVehicles.find((v) => v.id === selectedVehicleId)?.plate}`}
            onConfirm={handleConfirm}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}
