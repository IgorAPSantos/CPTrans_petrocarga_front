"use client";

import { useState, useEffect } from "react";
import { useReserva } from "@/components/reserva/hooks/useReserva";
import { Vaga } from "@/lib/types/vaga";
import DaySelection from "@/components/reserva/DaySelection";
import TimeSelection from "@/components/reserva/TimeSelection";
import StepIndicator from "@/components/reserva/StepIndicator";
import Confirmation from "@/components/reserva/Confirmation";
import { Veiculo } from "@/lib/types/veiculo";

interface ReservaAgenteProps {
  selectedVaga: Vaga;
  onBack?: () => void;
}

export default function ReservaAgente({ selectedVaga, onBack }: ReservaAgenteProps) {
  const reserva = useReserva(selectedVaga);
  const {
    tipoVeiculoAgente,
    setTipoVeiculoAgente,
    placaAgente,
    setPlacaAgente,
    selectedDay,
    setSelectedDay,
    availableTimes,
    reservedTimes,
    startHour,
    setStartHour,
    endHour,
    setEndHour,
    fetchHorariosDisponiveis,
    handleConfirm,
  } = reserva;

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [, setLoadingTimes] = useState(false);

  const onConfirm = async () => {
    const result = await handleConfirm();
    setSuccess(result);
    setStep(6); // feedback
  };

  useEffect(() => {
    if (step !== 3) return;
    if (!selectedDay || !tipoVeiculoAgente) return;

    const loadTimes = async () => {
      setLoadingTimes(true);
      await fetchHorariosDisponiveis(selectedDay, selectedVaga);
      setLoadingTimes(false);
    };

    loadTimes();
  },);

  return (
    <div className="p-4 sm:p-6 border rounded-xl shadow-lg max-w-2xl mx-auto bg-white min-h-[80vh] flex flex-col gap-4">
      
      {onBack && step < 6 && (
        <button onClick={onBack} className="px-3 py-2 w-fit bg-gray-200 rounded-lg text-sm sm:text-base">
          Voltar ao mapa
        </button>
      )}

      <h2 className="text-lg sm:text-xl font-semibold text-center">
        Reservando vaga: <br className="sm:hidden" />
        {selectedVaga.endereco.logradouro} - {selectedVaga.endereco.bairro}
      </h2>

      {step < 6 && <StepIndicator step={step} />}

      <div className="flex-1 overflow-y-auto pb-4">
        {/* STEP 1 - Cadastro veículo */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-medium mb-1">Tipo de veículo</p>
              <select
                value={tipoVeiculoAgente || ""}
                onChange={(e) => setTipoVeiculoAgente(e.target.value as Veiculo["tipo"])}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione...</option>
                <option value="AUTOMOVEL">Automóvel</option>
                <option value="VUC">VUC</option>
                <option value="CAMINHONETA">Caminhoneta</option>
                <option value="CAMINHAO_MEDIO">Caminhão médio</option>
                <option value="CAMINHAO_LONGO">Caminhão longo</option>
              </select>
            </div>
            <div>
              <p className="font-medium mb-1">Placa</p>
              <input
                value={placaAgente}
                onChange={(e) => setPlacaAgente(e.target.value.toUpperCase())}
                className="w-full border rounded p-2"
                placeholder="Digite a placa"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!tipoVeiculoAgente || !placaAgente}
              className="bg-blue-600 text-white py-2 rounded-lg mt-2"
            >
              Próximo
            </button>
          </div>
        )}

        {/* STEP 2 - Seleção do dia */}
        {step === 2 && (
          <div>
            <DaySelection
              selected={selectedDay}
              onSelect={(day) => {
                setSelectedDay(day);
                setStep(3);
              }}
              availableDays={selectedVaga.operacoesVaga?.map((op) => op.diaSemanaAsEnum)}
            />
            <button onClick={() => setStep(1)} className="mt-4 bg-gray-200 py-2 rounded-lg w-full">
              Voltar
            </button>
          </div>
        )}

        {/* STEP 3 - Horário inicial */}
        {step === 3 && selectedDay && (
          <TimeSelection
            times={availableTimes}
            reserved={reservedTimes}
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

        {/* STEP 4 - Horário final */}
        {step === 4 && startHour && (
          <TimeSelection
            times={availableTimes.filter((t) => availableTimes.indexOf(t) > availableTimes.indexOf(startHour))}
            reserved={reservedTimes}
            selected={endHour}
            onSelect={(t) => {
              setEndHour(t);
              setStep(5);
            }}
            onBack={() => setStep(3)}
            color="blue"
          />
        )}

        {/* STEP 5 - Resumo e confirmação */}
        {step === 5 && startHour && endHour && (
          <Confirmation
            day={selectedDay!}
            startHour={startHour!}
            endHour={endHour!}
            origin="" 
            destination={`${selectedVaga.endereco.logradouro}, ${selectedVaga.endereco.bairro}`}
            vehicleName={`${tipoVeiculoAgente} - ${placaAgente}`}
            onConfirm={onConfirm}
            onReset={onBack}
          />
        )}

        {/* STEP 6 - Feedback */}
        {step === 6 && success === true && (
          <div className="text-center p-6 bg-green-100 text-green-800 rounded-lg">
            <p className="mb-4 font-semibold text-lg">Reserva confirmada ✅</p>
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Nova reserva
            </button>
          </div>
        )}
        {step === 6 && success === false && (
          <div className="text-center p-6 bg-red-100 text-red-800 rounded-lg">
            <p className="mb-4 font-semibold text-lg">Erro ao confirmar a reserva ❌</p>
            <button
              onClick={() => {
                setStep(5);
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
