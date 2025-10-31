"use client";

import { useState, useEffect } from "react";
import StepIndicator from "@/components/reserva/StepIndicator";
import DaySelection from "@/components/reserva/DaySelection";
import TimeSelection from "@/components/reserva/TimeSelection";
import OriginVehicleStep from "@/components/reserva/OriginVehicleStep";
import Confirmation from "@/components/reserva/Confirmation";
import { Vaga, DiaSemana } from "@/lib/types/vaga";
import { getVeiculosUsuario } from "@/lib/actions/veiculoActions";
import { useAuth } from "@/context/AuthContext";
import { reservarVaga } from "@/lib/actions/reservaActions";
import { getMotoristaByUserId } from "@/lib/actions/motoristaActions";
import { useRouter } from "next/navigation";

interface ReservaComponentProps {
  selectedVaga: Vaga;
  onBack?: () => void;
}

interface Veiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  tipo: string;
  comprimento: number;
  usuarioId: string;
  cpfProprietario?: string | null;
  cnpjProprietario?: string | null;
}

export default function ReservaComponent({
  selectedVaga,
  onBack,
}: ReservaComponentProps) {
  const { user, setUser, token, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [startHour, setStartHour] = useState<string | null>(null);
  const [endHour, setEndHour] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>();
  const [vehicles, setVehicles] = useState<Veiculo[]>([]);
  const [loadingMotorista, setLoadingMotorista] = useState(true);
  const router = useRouter();

  // Buscar motorista ID do usuário e salvar no contexto
  useEffect(() => {
    async function fetchMotorista() {
      if (!user?.id || !token) return;

      // Só busca se ainda não tiver motoristaId
      if (!user.motoristaId) {
        try {
          const result = await getMotoristaByUserId(token, user.id);
          if (!result.error && result.motoristaId) {
            setUser({
              ...user,
              motoristaId: result.motoristaId,
            });
            console.log("Motorista ID salvo:", result.motoristaId);
          } else {
            console.error("Erro ao buscar motorista:", result.message);
          }
        } catch (err) {
          console.error("Erro ao buscar motorista:", err);
        } finally {
          setLoadingMotorista(false);
        }
      } else {
        setLoadingMotorista(false);
      }
    }

    fetchMotorista();
  }, [user, token, setUser]);

  // Carrega veículos do usuário
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user?.id || !token) return;
      const result = await getVeiculosUsuario(user.id, token);
      if (!result.error) setVehicles(result.veiculos as Veiculo[]);
      else console.error(result.message);
    };
    fetchVehicles();
  }, [user, token]);

  // Reset ao trocar vaga
  useEffect(() => {
    if (selectedVaga) reset();
  }, [selectedVaga]);

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

  function formatDateTime(day: Date, hour: string): string {
    const [h, m] = hour.split(":").map(Number);
    const date = new Date(day);
    date.setHours(h, m, 0, 0);
    return date.toISOString();
  }

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
      (op) => op.diaSemanaAsEnum === diaSemana
    );
    if (!operacao) return [];

    const [hInicio, mInicio] = operacao.horaInicio.split(":").map(Number);
    const [hFim, mFim] = operacao.horaFim.split(":").map(Number);

    const times: string[] = [];
    let h = hInicio,
      m = mInicio;
    while (h < hFim || (h === hFim && m < mFim)) {
      const pad = (n: number) => n.toString().padStart(2, "0");
      times.push(`${pad(h)}:${pad(m)}`);
      m += 30;
      if (m >= 60) {
        h += 1;
        m -= 60;
      }
    }

    return times.filter((t) => !reservedTimes.includes(t));
  };

  const handleDaySelect = (day: Date) => {
    setSelectedDay(day);
    setAvailableTimes(fetchHorariosDisponiveis(day, selectedVaga));
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!token || !user) {
      alert("Usuário ou token não disponível. Faça login novamente.");
      return;
    }
    if (!user.motoristaId) {
      alert("Motorista não encontrado. Verifique seu cadastro.");
      return;
    }
    if (
      !selectedVaga ||
      !selectedVehicleId ||
      !startHour ||
      !endHour ||
      !origin
    ) {
      alert("Preencha todos os campos antes de confirmar a reserva.");
      return;
    }

    const formData = new FormData();
    formData.append("vagaId", selectedVaga.id);
    formData.append("motoristaId", user.motoristaId);
    formData.append("veiculoId", selectedVehicleId);
    formData.append("cidadeOrigem", origin);
    formData.append("inicio", formatDateTime(selectedDay!, startHour));
    formData.append("fim", formatDateTime(selectedDay!, endHour));

    try {
      console.log("Payload de reserva:", {
        vagaId: selectedVaga.id,
        motoristaId: user.motoristaId,
        veiculoId: selectedVehicleId,
        cidadeOrigem: origin,
        inicio: formatDateTime(selectedDay!, startHour),
        fim: formatDateTime(selectedDay!, endHour),
        status: "ATIVA",
      });

      await reservarVaga(formData, token);
      alert("Reserva confirmada ✅");
      reset();
      router.push("/motorista/minhas-reservas");
    } catch (err) {
      console.error("Erro ao reservar vaga:", err);
      alert("Erro ao tentar reservar a vaga. Tente novamente.");
    }
  };

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

      <h2 className="text-lg sm:text-xl font-semibold text-center leading-tight">
        Reservando vaga: <br className="sm:hidden" />
        {selectedVaga.endereco.logradouro} - {selectedVaga.endereco.bairro}
      </h2>

      <StepIndicator step={step} />

      <div className="flex-1 overflow-y-auto pb-4">
        {step === 1 && (
          <DaySelection selected={selectedDay} onSelect={handleDaySelect} />
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
          <>
            {vehiclesForStep.length > 0 ? (
              <OriginVehicleStep
                vehicles={vehiclesForStep}
                origin={origin}
                selectedVehicleId={selectedVehicleId}
                onOriginChange={setOrigin}
                onVehicleChange={setSelectedVehicleId}
                onNext={() => setStep(5)}
                onBack={() => setStep(3)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-10">
                <p className="text-gray-700 text-center">
                  Você ainda não tem veículos cadastrados.
                </p>
                <button
                  onClick={() => alert("Redirecionar para cadastro de veículo")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Cadastrar veículo
                </button>
              </div>
            )}
          </>
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
