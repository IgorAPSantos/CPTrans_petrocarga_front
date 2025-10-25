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

const reservedTimes = ["10:00", "13:30", "14:00"]; // Mock de horários ocupados
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
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [startHour, setStartHour] = useState<string | null>(null);
  const [endHour, setEndHour] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<
    string | undefined
  >();

  // Se já tiver vaga selecionada, podemos iniciar direto no step de origem/veículo
  useEffect(() => {
    if (selectedVaga) {
      setStep(1); // Começa do dia mesmo, você pode mudar para 4 se quiser pular direto
    }
  }, [selectedVaga]);

  const handleSelectDay = (day: Date) => {
    setSelectedDay(day);
    setStep(2);
  };

  const handleSelectStart = (time: string) => {
    setStartHour(time);
    setEndHour(null);
    setStep(3);
  };

  const handleSelectEnd = (time: string) => {
    setEndHour(time);
    setStep(4);
  };

  const handleConfirm = () => {
    alert("Reserva confirmada ✅ (mock)");
    reset();
  };

  const reset = () => {
    setStep(1);
    setSelectedDay(undefined);
    setStartHour(null);
    setEndHour(null);
    setOrigin("");
    setSelectedVehicleId(undefined);
  };

  return (
    <div className="p-6 border rounded-lg shadow-md max-w-4xl mx-auto">
      {onBack && (
        <button onClick={onBack} className="mb-4 px-3 py-1 bg-gray-200 rounded">
          Voltar ao mapa
        </button>
      )}

      <h2 className="text-xl font-semibold mb-4 text-center">
        Reservando vaga: {selectedVaga.endereco.logradouro} -{" "}
        {selectedVaga.endereco.bairro}
      </h2>

      <StepIndicator step={step} />

      {/* Step 1: selecionar dia */}
      {step === 1 && (
        <div>
          <DaySelection selected={selectedDay} onSelect={handleSelectDay} />
          {selectedDay && (
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setStep(2)}
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: horário início */}
      {step === 2 && selectedDay && (
        <TimeSelection
          times={allTimes}
          reserved={reservedTimes}
          selected={startHour}
          onSelect={handleSelectStart}
          onBack={() => setStep(1)}
          color="blue"
        />
      )}

      {/* Step 3: horário fim */}
      {step === 3 && startHour && (
        <TimeSelection
          times={allTimes.filter(
            (t) => allTimes.indexOf(t) > allTimes.indexOf(startHour)
          )}
          reserved={reservedTimes}
          selected={endHour}
          onSelect={handleSelectEnd}
          onBack={() => setStep(2)}
          color="green"
        />
      )}

      {/* Step 4: origem e veículo */}
      {step === 4 && (
        <OriginVehicleStep
          vehicles={mockVehicles} // Aqui você pode passar os veículos do usuário
          origin={origin}
          selectedVehicleId={selectedVehicleId}
          onOriginChange={setOrigin}
          onVehicleChange={setSelectedVehicleId}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}

      {/* Step 5: confirmação */}
      {step === 5 && selectedDay && startHour && endHour && (
        <Confirmation
          day={selectedDay}
          startHour={startHour}
          endHour={endHour}
          origin={origin} // endereço de entrada/origem
          destination={`${selectedVaga.endereco.logradouro}, ${selectedVaga.endereco.bairro}`} // endereço da vaga
          vehicleName={`${
            mockVehicles.find((v) => v.id === selectedVehicleId)?.name
          }, ${mockVehicles.find((v) => v.id === selectedVehicleId)?.plate}`} // veículo selecionado
          onConfirm={handleConfirm}
          onReset={reset}
        />
      )}
    </div>
  );
}
