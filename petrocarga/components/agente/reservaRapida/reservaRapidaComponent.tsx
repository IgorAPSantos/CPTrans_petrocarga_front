"use client";

import { useState } from "react";
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
    reservedTimesStart,
    reservedTimesEnd,
    startHour,
    setStartHour,
    endHour,
    setEndHour,
    fetchHorariosDisponiveis,
    handleConfirm,
  } = reserva;

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState<boolean | null>(null);

  const onConfirm = async () => {
    const result = await handleConfirm();
    setSuccess(result);
    setStep(6);
  };

  const toMinutes = (h: string) => {
    const [hh, mm] = h.split(":").map(Number);
    return hh * 60 + mm;
  };

  return (
    <div className="p-4 sm:p-6 border rounded-xl shadow-lg max-w-2xl mx-auto bg-white min-h-[80vh] flex flex-col gap-4">
      {onBack && step < 6 && (
        <button
          onClick={onBack}
          className="px-3 py-2 w-fit bg-gray-200 rounded-lg text-sm sm:text-base hover:bg-gray-300 transition-colors"
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
        {/* STEP 1 - Cadastro veículo */}
        {step === 1 && (
          <div className="flex flex-col gap-5 p-2">
            <h3 className="text-md font-semibold text-gray-700">1. Informações do Veículo</h3>
            <div>
              <p className="font-medium mb-1">Tipo de veículo</p>
              <select
                value={tipoVeiculoAgente || ""}
                onChange={(e) => setTipoVeiculoAgente(e.target.value as Veiculo["tipo"])}
                className="w-full border rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                className="w-full border rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Digite a placa"
                maxLength={7}
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!tipoVeiculoAgente || placaAgente.length < 7}
              className={`py-3 rounded-lg mt-4 font-semibold transition-opacity ${
                !tipoVeiculoAgente || placaAgente.length < 7
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Próximo
            </button>
          </div>
        )}

        {/* STEP 2 - Seleção do dia */}
        {step === 2 && (
          <div className="p-2">
            <h3 className="text-md font-semibold text-gray-700 mb-4">2. Selecione o Dia</h3>
            <DaySelection
              selected={selectedDay}
              onSelect={async (day) => {
                setSelectedDay(day);
                
                // --- CORREÇÃO IMPORTANTE AQUI ---
                // No ReservaComponent você passa o 'vehicleId'.
                // Aqui, como é agente, passamos o 'tipoVeiculoAgente' como 3º argumento.
                // Verifique se o seu hook 'fetchHorariosDisponiveis' aceita (string | null) nesse argumento.
                await fetchHorariosDisponiveis(day, selectedVaga, tipoVeiculoAgente);
                
                setStep(3);
              }}
              availableDays={selectedVaga.operacoesVaga?.map((op) => op.diaSemanaAsEnum)}
            />
            <button
              onClick={() => setStep(1)}
              className="mt-6 bg-gray-200 py-3 rounded-lg w-full text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Voltar
            </button>
          </div>
        )}

        {/* STEP 3 - Seleção do horário inicial */}
        {step === 3 && selectedDay && (
          <div className="p-2">
            <h3 className="text-md font-semibold text-gray-700 mb-4">3. Horário Inicial</h3>
            <TimeSelection
              times={availableTimes}
              reserved={reservedTimesStart}
              selected={startHour}
              onSelect={(t) => {
                setStartHour(t);
                setEndHour(null); // Reseta o fim ao mudar o início
                setStep(4);
              }}
              onBack={() => setStep(2)}
              color="blue"
            />
          </div>
        )}

        {/* STEP 4 - Seleção do horário final */}
        {step === 4 && startHour && (
          <div className="p-2">
            <h3 className="text-md font-semibold text-gray-700 mb-4">4. Horário Final</h3>
            <TimeSelection
              // Filtra garantindo que só mostre horários POSTERIORES ao início
              times={availableTimes.filter((t) => toMinutes(t) > toMinutes(startHour))}
              reserved={reservedTimesEnd}
              selected={endHour}
              onSelect={(t) => {
                setEndHour(t);
                setStep(5);
              }}
              onBack={() => setStep(3)}
              color="blue"
            />
          </div>
        )}

        {/* STEP 5 - Resumo e confirmação */}
        {step === 5 && startHour && endHour && (
          <Confirmation
            day={selectedDay!}
            startHour={startHour!}
            endHour={endHour!}
            origin="Agente Local"
            destination={`${selectedVaga.endereco.logradouro}, ${selectedVaga.endereco.bairro}`}
            vehicleName={`${tipoVeiculoAgente} - ${placaAgente}`}
            onConfirm={onConfirm}
            onReset={() => setStep(4)}
          />
        )}

        {/* STEP 6 - Feedback */}
        {step === 6 && success !== null && (
          <div
            className={`text-center p-6 rounded-xl ${
              success
                ? "bg-green-50 text-green-800 border border-green-300"
                : "bg-red-50 text-red-800 border border-red-300"
            }`}
          >
            <p className="mb-4 font-extrabold text-xl">
              {success ? "Reserva confirmada ✅" : "Erro ao confirmar a reserva ❌"}
            </p>
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Fazer Nova Reserva
            </button>
            {success === false && (
              <button
                onClick={() => {
                  setStep(5);
                  setSuccess(null);
                }}
                className="mt-4 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg w-full sm:w-auto"
              >
                Tentar novamente
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}