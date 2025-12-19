'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/reserva/StepIndicator';
import DaySelection from '@/components/reserva/DaySelection';
import TimeSelection from '@/components/reserva/TimeSelection';
import OriginVehicleStep from '@/components/reserva/OriginVehicleStep';
import Confirmation from '@/components/reserva/Confirmation';
import { useReserva } from './hooks/useReserva';
import { Vaga } from '@/lib/types/vaga';

interface ReservaComponentProps {
  selectedVaga: Vaga;
  onBack?: () => void;
}

export default function ReservaComponent({
  selectedVaga,
  onBack,
}: ReservaComponentProps) {
  const router = useRouter();
  const reserva = useReserva(selectedVaga);
  const {
    step,
    setStep,
    selectedDay,
    setSelectedDay,
    availableTimes,
    reservedTimesStart,
    reservedTimesEnd,
    startHour,
    setStartHour,
    endHour,
    setEndHour,
    origin,
    setOrigin,
    selectedVehicleId,
    setSelectedVehicleId,
    vehicles,
    fetchHorariosDisponiveis,
    handleConfirm,
    reset,
  } = reserva;

  const [success, setSuccess] = useState<boolean | null>(null);

  const vehiclesForStep = vehicles.map((v) => ({
    id: v.id,
    name: `${v.marca} ${v.modelo}`,
    plate: v.placa,
  }));

  // confirmação da reserva
  const onConfirm = async () => {
    const result = await handleConfirm();
    setSuccess(result);
    setStep(6); // step 6 = feedback visual
  };

  const toMinutes = (h: string) => {
    const [hh, mm] = h.split(':').map(Number);
    return hh * 60 + mm;
  };

  return (
    <div className="p-4 sm:p-6 border rounded-xl shadow-lg max-w-2xl mx-auto bg-white min-h-[80vh] flex flex-col gap-4">
      {onBack && step < 6 && (
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

      {step < 6 && <StepIndicator step={step} />}

      <div className="flex-1 overflow-y-auto pb-4">
        {/* STEP 1 - Seleção do dia */}
        {step === 1 && (
          <DaySelection
            selected={selectedDay}
            onSelect={async (day) => {
              setSelectedDay(day);
              setStep(2);
            }}
            availableDays={selectedVaga.operacoesVaga?.map(
              (op) => op.diaSemanaAsEnum,
            )}
          />
        )}

        {/* STEP 2 - Origem e veículo */}
        {step === 2 && (
          <OriginVehicleStep
            vehicles={vehiclesForStep}
            origin={origin}
            selectedVehicleId={selectedVehicleId}
            onOriginChange={setOrigin}
            onVehicleChange={setSelectedVehicleId}
            onNext={async (origin, vehicleId) => {
              if (!selectedDay) return;
              setOrigin(origin);
              setSelectedVehicleId(vehicleId);
              await fetchHorariosDisponiveis(
                selectedDay,
                selectedVaga,
                vehicleId,
              );

              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}

        {/* STEP 3 - Seleção do horário inicial */}
        {step === 3 && selectedDay && (
          <TimeSelection
            times={availableTimes}
            reserved={reservedTimesStart}
            selected={startHour}
            onSelect={(t) => {
              setStartHour(t);
              setEndHour(null);
              setStep(4);
            }}
            onBack={() => setStep(2)}
            color="blue"
          />
        )}

        {/* STEP 4 - Seleção do horário final */}
        {step === 4 && startHour && (
          <TimeSelection
            times={availableTimes.filter(
              (t) => toMinutes(t) > toMinutes(startHour),
            )}
            reserved={reservedTimesEnd} // aqui você só marca
            selected={endHour}
            onSelect={(t) => {
              setEndHour(t);
              setStep(5);
            }}
            onBack={() => setStep(3)}
            color="blue"
          />
        )}

        {/* STEP 5 - Confirmação */}
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
            onConfirm={onConfirm}
            onReset={reset}
          />
        )}

        {/* STEP 6 - Feedback */}
        {step === 6 && success === true && (
          <div className="text-center p-6 bg-green-100 text-green-800 rounded-lg">
            <p className="mb-4 font-semibold text-lg">Reserva confirmada ✅</p>
            <button
              onClick={() => router.push('/motorista/reservas')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Ir para minhas reservas
            </button>
          </div>
        )}

        {step === 6 && success === false && (
          <div className="text-center p-6 bg-red-100 text-red-800 rounded-lg">
            <p className="mb-4 font-semibold text-lg">
              Erro ao confirmar a reserva ❌
            </p>
            <button
              onClick={() => {
                setStep(5); // voltar para confirmação
                setSuccess(null);
              }}
              className="px-6 py-2 bg-gray-300 rounded-lg"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
