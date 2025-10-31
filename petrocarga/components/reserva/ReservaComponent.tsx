"use client";

import { useState, useEffect } from "react";
import StepIndicator from "@/components/reserva/StepIndicator";
import DaySelection from "@/components/reserva/DaySelection";
import TimeSelection from "@/components/reserva/TimeSelection";
import OriginVehicleStep from "@/components/reserva/OriginVehicleStep";
import Confirmation from "@/components/reserva/Confirmation";
import { Vaga, DiaSemana } from "@/lib/types/vaga";

interface ReservaComponentProps {
  selectedVaga: Vaga;
  onBack?: () => void;
}

const mockVehicles = [
  { id: "v1", name: "Carro Pessoal - Sprinter", plate: "ABC-1234" },
];

export default function ReservaComponent({
  selectedVaga,
  onBack,
}: ReservaComponentProps) {
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]); // pode ser fetch do backend
  const [startHour, setStartHour] = useState<string | null>(null);
  const [endHour, setEndHour] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>();

  // Reset ao trocar vaga
  useEffect(() => {
    if (selectedVaga) reset();
  }, [selectedVaga]);

  // Reset completo
  const reset = () => {
    setStep(1);
    setSelectedDay(undefined);
    setAvailableTimes([]);
    setReservedTimes([]);
    setStartHour(null);
    setEndHour(null);
    setOrigin("");
    setSelectedVehicleId(undefined);
  };

  // Função para calcular horários disponíveis do dia
  const fetchHorariosDisponiveis = (day: Date, vaga: Vaga): string[] => {
    const dias: DiaSemana[] = [
      "DOMINGO",
      "SEGUNDA",
      "TERCA",
      "QUARTA",
      "QUINTA",
      "SEXTA",
      "SABADO",
    ];
    const diaSemana = dias[day.getDay()];

    const operacao = vaga.operacoesVaga?.find(
      (op) => op.diaSemanaEnum === diaSemana
    );
    if (!operacao) return [];

    const [hInicio, mInicio] = operacao.horaInicio.split(":").map(Number);
    const [hFim, mFim] = operacao.horaFim.split(":").map(Number);

    const times: string[] = [];
    let h = hInicio,
      m = mInicio;
    while (h < hFim || (h === hFim && m <= mFim)) {
      const pad = (n: number) => n.toString().padStart(2, "0");
      times.push(`${pad(h)}:${pad(m)}`);
      m += 30;
      if (m >= 60) {
        h += 1;
        m -= 60;
      }
    }

    // filtrar horários reservados
    return times.filter((t) => !reservedTimes.includes(t));
  };

  // Ao selecionar dia
  const handleDaySelect = (day: Date) => {
    setSelectedDay(day);
    if (!selectedVaga) return;
    const times = fetchHorariosDisponiveis(day, selectedVaga);
    setAvailableTimes(times);
    setStep(2);
  };

  const handleConfirm = () => {
    alert("Reserva confirmada ✅ (mock)");
    reset();
  };

  return (
    <div className="p-4 sm:p-6 border rounded-xl shadow-lg max-w-2xl mx-auto bg-white min-h-[80vh] flex flex-col gap-4">
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
        {/* Passo 1: Seleção do dia */}
        {step === 1 && (
          <DaySelection selected={selectedDay} onSelect={handleDaySelect} />
        )}

        {/* Passo 2: Seleção do horário inicial */}
        {step === 2 && selectedDay && (
          <TimeSelection
            times={availableTimes}
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

        {/* Passo 3: Seleção do horário final */}
        {step === 3 && startHour && (
          <TimeSelection
            times={availableTimes.filter(
              (t) =>
                availableTimes.indexOf(t) > availableTimes.indexOf(startHour)
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

        {/* Passo 4: Veículo e origem */}
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

        {/* Passo 5: Confirmação */}
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
