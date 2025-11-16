import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/hooks/useAuth";
import { Veiculo } from "@/lib/types/veiculo";
import { Vaga } from "@/lib/types/vaga";
import { ReservaState } from "@/lib/types/reservaState";
import { getMotoristaByUserId } from "@/lib/actions/motoristaActions";
import { getVeiculosUsuario } from "@/lib/actions/veiculoActions";

import {
  gerarHorariosDia,
  gerarHorariosOcupados,
  getOperacaoDia,
  formatDateTime,
} from "./reservaHelpers";

import {
  fetchReservasAtivasDoDia,
  confirmarReserva,
} from "./reservaService";

interface GetVeiculosResult {
  error: boolean;
  message: string;
  veiculos: Veiculo[];
}

export function useReserva(selectedVaga: Vaga | null) {
  const { user } = useAuth();

  const [reservaState, setReservaState] = useState<ReservaState>({
    step: 1,
    selectedDay: undefined,
    availableTimes: [],
    reservedTimes: [],
    startHour: null,
    endHour: null,
    origin: "",
    selectedVehicleId: undefined,
  });

  const [motoristaId, setMotoristaId] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Veiculo[]>([]);
  const [loadingMotorista, setLoadingMotorista] = useState(true);

  // ================= Funções principais =================

  const reset = useCallback(() => {
    setReservaState({
      step: 1,
      selectedDay: undefined,
      availableTimes: [],
      reservedTimes: [],
      startHour: null,
      endHour: null,
      origin: "",
      selectedVehicleId: undefined,
    });
  }, []);

  const fetchHorariosDisponiveis = useCallback(
    async (day: Date, vaga: Vaga): Promise<string[]> => {
      const operacao = getOperacaoDia(day, vaga);
      if (!operacao) return [];

      const reservasAtivas = await fetchReservasAtivasDoDia(
        vaga.id,
        day,
      );

      const horariosOcupados = reservasAtivas.flatMap(gerarHorariosOcupados);
      const todosHorarios = gerarHorariosDia(operacao);

      setReservaState((prev) => ({
        ...prev,
        availableTimes: todosHorarios,
        reservedTimes: horariosOcupados,
      }));

      return todosHorarios;
    },
    []
  );

  const handleConfirm = useCallback(async (): Promise<boolean> => {
  if (!user?.id || !selectedVaga || !motoristaId) return false;

  const { selectedDay, selectedVehicleId, startHour, endHour, origin } = reservaState;

  if (!selectedDay || !selectedVehicleId || !startHour || !endHour || !origin)
    return false;

  const formData = new FormData();
  formData.append("vagaId", selectedVaga.id);
  formData.append("motoristaId", motoristaId); // <<< ID CORRETO
  formData.append("veiculoId", selectedVehicleId);
  formData.append("cidadeOrigem", origin);
  formData.append("inicio", formatDateTime(selectedDay, startHour));
  formData.append("fim", formatDateTime(selectedDay, endHour));

  const success = await confirmarReserva(formData);
  if (success) reset();

  return success;
}, [user, selectedVaga, motoristaId, reservaState, reset]);


  // ================= Effects =================

  useEffect(() => {
  if (!user?.id) return;

  const fetchMotorista = async () => {
    try {
      const result = await getMotoristaByUserId(user.id);

      if (!result.error) {
        setMotoristaId(result.motoristaId);  
      }

      console.log("TOKEN NO COOKIE:", document.cookie);
    } catch (error) {
      console.error("Erro ao buscar motorista:", error);
      console.log("TOKEN NO COOKIE:", document.cookie);
    } finally {
      setLoadingMotorista(false);
    }
  };

  fetchMotorista();
}, [user]);



  useEffect(() => {
    if (!user?.id) return;

    const fetchVehicles = async () => {
      try {
        const result: GetVeiculosResult = await getVeiculosUsuario(user.id);
        console.log("TOKEN NO COOKIE:", document.cookie);

        if (!result.error) setVehicles(result.veiculos);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        console.log("TOKEN NO COOKIE:", document.cookie);

      }
    };

    fetchVehicles();
  }, [user]);

  useEffect(() => {
    if (selectedVaga && reservaState.selectedDay) {
      fetchHorariosDisponiveis(reservaState.selectedDay, selectedVaga);
    }
  }, [selectedVaga, reservaState.selectedDay, fetchHorariosDisponiveis]);

  // ================= Setters =================

  const setStep = useCallback(
    (step: number) => setReservaState((prev) => ({ ...prev, step })),
    []
  );

  const setSelectedDay = useCallback(
    (selectedDay?: Date) =>
      setReservaState((prev) => ({ ...prev, selectedDay })),
    []
  );

  const setStartHour = useCallback(
    (startHour: string | null) =>
      setReservaState((prev) => ({ ...prev, startHour })),
    []
  );

  const setEndHour = useCallback(
    (endHour: string | null) =>
      setReservaState((prev) => ({ ...prev, endHour })),
    []
  );

  const setOrigin = useCallback(
    (origin: string) =>
      setReservaState((prev) => ({ ...prev, origin })),
    []
  );

  const setSelectedVehicleId = useCallback(
    (selectedVehicleId?: string) =>
      setReservaState((prev) => ({ ...prev, selectedVehicleId })),
    []
  );

  // ================= Return =================

  return {
    ...reservaState,
    vehicles,
    loadingMotorista,
    setStep,
    setSelectedDay,
    setStartHour,
    setEndHour,
    setOrigin,
    setSelectedVehicleId,
    fetchHorariosDisponiveis,
    handleConfirm,
    reset,
  };
}
