"use client";
import { useState } from "react";
import StepIndicator from "@/components/reserva/StepIndicator";
import DaySelection from "@/components/reserva/DaySelection";
import TimeSelection from "@/components/reserva/TimeSelection";
import Confirmation from "@/components/reserva/Confirmation";
import OriginVehicleStep from "./OriginVehicleStep";

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

const mockVehicles = [
  { id: "v1", name: "Caminhão Azul" },
  { id: "v2", name: "Caminhão Vermelho" },
  { id: "v3", name: "Van Branca" },
];

const reservedTimes = ["10:00", "13:30", "14:00"]; // Mock

export default function ReservaComponent() {
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [startHour, setStartHour] = useState<string | null>(null);
  const [endHour, setEndHour] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<
    string | undefined
  >();

  const handleSelectStart = (time: string) => {
    setStartHour(time);
    setEndHour(null);
    setStep(3);
  };

  const handleSelectEnd = (time: string) => {
    setEndHour(time);
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setSelectedDay(undefined);
    setStartHour(null);
    setEndHour(null);
    setOrigin("");
    setSelectedVehicleId(undefined);
  };

  const confirm = () => alert("Reserva confirmada ✅ (mock)");

  return (
    <div className="p-6 max-w-4xl mx-auto mt-10 border rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Reserva de Vaga</h1>

      <StepIndicator step={step} />

      {/* Step 1: Dia */}
      {step === 1 && (
        <div>
          <DaySelection selected={selectedDay} onSelect={setSelectedDay} />
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

      {/* Step 2: Horário início */}
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

      {/* Step 3: Horário fim */}
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

      {/* Step 4: Origem e veículo */}
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

      {/* Step 5: Confirmação */}
      {step === 5 && startHour && endHour && selectedDay && (
        <Confirmation
          day={selectedDay}
          startHour={startHour}
          endHour={endHour}
          origin={origin}
          vehicleId={selectedVehicleId}
          onConfirm={confirm}
          onReset={reset}
        />
      )}
    </div>
  );
}
