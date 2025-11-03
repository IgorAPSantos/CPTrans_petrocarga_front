import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMotoristaByUserId } from "@/lib/actions/motoristaActions";
import { getVeiculosUsuario } from "@/lib/actions/veiculoActions";
import { reservarVaga } from "@/lib/actions/reservaActions";
import { useAuth } from "@/context/AuthContext";
import { Vaga, DiaSemana } from "@/lib/types/vaga";

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

export function useReserva(selectedVaga: Vaga | null) {
  const { user, setUser, token } = useAuth();
  const router = useRouter();

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

  // 🔹 Buscar motorista
  useEffect(() => {
    async function fetchMotorista() {
      if (!user?.id || !token) return;
      if (!user.motoristaId) {
        try {
          const result = await getMotoristaByUserId(token, user.id);
          if (result.motoristaId) {
            setUser({ ...user, motoristaId: result.motoristaId });
          }
        } finally {
          setLoadingMotorista(false);
        }
      } else {
        setLoadingMotorista(false);
      }
    }
    fetchMotorista();
  }, [user, token, setUser]);

  // 🔹 Buscar veículos
  useEffect(() => {
    if (!user?.id || !token) return;
    const fetchVehicles = async () => {
      const result = await getVeiculosUsuario(user.id, token);
      if (!result.error) setVehicles(result.veiculos);
    };
    fetchVehicles();
  }, [user, token]);

  // 🔹 Reset ao trocar vaga
  useEffect(() => {
    reset();
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

  const formatDateTime = (day: Date, hour: string): string => {
    const [h, m] = hour.split(":").map(Number);
    const date = new Date(day);
    date.setHours(h, m, 0, 0);
    return date.toISOString();
  };

  const handleConfirm = async () => {
    if (!token || !user?.motoristaId) return alert("Faça login novamente.");
    if (
      !selectedVaga ||
      !selectedVehicleId ||
      !startHour ||
      !endHour ||
      !origin
    )
      return alert("Preencha todos os campos.");

    const formData = new FormData();
    formData.append("vagaId", selectedVaga.id);
    formData.append("motoristaId", user.motoristaId);
    formData.append("veiculoId", selectedVehicleId);
    formData.append("cidadeOrigem", origin);
    formData.append("inicio", formatDateTime(selectedDay!, startHour));
    formData.append("fim", formatDateTime(selectedDay!, endHour));

    try {
      await reservarVaga(formData, token);
      alert("Reserva confirmada ✅");
      reset();
      router.push("/motorista/minhas-reservas");
    } catch {
      alert("Erro ao tentar reservar a vaga.");
    }
  };

  return {
    step,
    setStep,
    selectedDay,
    setSelectedDay,
    availableTimes,
    setAvailableTimes,
    reservedTimes,
    startHour,
    setStartHour,
    endHour,
    setEndHour,
    origin,
    setOrigin,
    selectedVehicleId,
    setSelectedVehicleId,
    vehicles,
    loadingMotorista,
    fetchHorariosDisponiveis,
    handleConfirm,
    reset,
  };
}
