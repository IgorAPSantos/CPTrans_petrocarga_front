"use client";
import StepIndicator from "@/components/reserva/StepIndicator";
import DaySelection from "@/components/reserva/DaySelection";
import TimeSelection from "@/components/reserva/TimeSelection";
import OriginVehicleStep from "@/components/reserva/OriginVehicleStep";
import Confirmation from "@/components/reserva/Confirmation";
import { useReserva } from "./hooks/useReserva";
import { Vaga } from "@/lib/types/vaga";

interface ReservaComponentProps {
  selectedVaga: Vaga;
  onBack?: () => void;
}

export default function ReservaComponent({
  selectedVaga,
  onBack,
}: ReservaComponentProps) {
  const reserva = useReserva(selectedVaga);
  const {
    step,
    setStep,
    selectedDay,
    setSelectedDay,
    availableTimes,
    reservedTimes,
    startHour,
    setStartHour,
    endHour,
    setEndHour,
    origin,
    setOrigin,
    selectedVehicleId,
    setSelectedVehicleId,
    setAvailableTimes,
    vehicles,
    fetchHorariosDisponiveis,
    handleConfirm,
    reset,
  } = reserva;

  const vehiclesForStep = vehicles.map((v) => ({
    id: v.id,
    name: `${v.marca} ${v.modelo}`,
    plate: v.placa,
  }));

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

      <h2 className="text-lg sm:text-xl font-semibold text-center">
        Reservando vaga: <br className="sm:hidden" />
        {selectedVaga.endereco.logradouro} - {selectedVaga.endereco.bairro}
      </h2>

      <StepIndicator step={step} />

      <div className="flex-1 overflow-y-auto pb-4">
        {step === 1 && (
          <DaySelection
            selected={selectedDay}
            onSelect={(day) => {
              setSelectedDay(day);
              setAvailableTimes(fetchHorariosDisponiveis(day, selectedVaga));
              setStep(2);
            }}
            availableDays={selectedVaga.operacoesVaga?.map(
              (op) => op.diaSemanaAsEnum
            )}
          />
        )}

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

        {step === 4 && (
          <OriginVehicleStep
            vehicles={vehiclesForStep}
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
              vehiclesForStep.find((v) => v.id === selectedVehicleId)?.name
            } - ${
              vehiclesForStep.find((v) => v.id === selectedVehicleId)?.plate
            }`}
            onConfirm={handleConfirm}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}
