import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/hooks/useAuth";
import { Veiculo } from "@/lib/types/veiculo";
export type { Veiculo };
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
  fetchReservasBloqueios,
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

  // ================= Funções =================

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
    async (day: Date, vaga: Vaga, vehicleId: string): Promise<string[]> => {
      const operacao = getOperacaoDia(day, vaga);
      if (!operacao) return [];

      const vehicle = vehicles.find((v) => v.id === vehicleId);
      if (!vehicle) return [];

      const tipoVeiculo = vehicle.tipo;

      const dataFormatada = day.toISOString().split("T")[0];

      const bloqueios = await fetchReservasBloqueios(
        vaga.id,
        dataFormatada,
        tipoVeiculo
      );

      const horariosOcupados = bloqueios.flatMap(gerarHorariosOcupados);
      const todosHorarios = gerarHorariosDia(operacao);

      setReservaState((prev) => ({
        ...prev,
        availableTimes: todosHorarios,
        reservedTimes: horariosOcupados,
      }));

      return todosHorarios;
    },
    [vehicles]
  );

  const handleConfirm = useCallback(async (): Promise<boolean> => {
    if (!user?.id || !selectedVaga || !motoristaId) return false;

    const { selectedDay, selectedVehicleId, startHour, endHour, origin } =
      reservaState;

    if (!selectedDay || !selectedVehicleId || !startHour || !endHour || !origin)
      return false;

    const formData = new FormData();
    formData.append("vagaId", selectedVaga.id);
    formData.append("motoristaId", motoristaId);
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

      } catch (error) {
        console.error("Erro ao buscar motorista:", error);
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

        if (!result.error) setVehicles(result.veiculos);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
      }
    };

    fetchVehicles();
  }, [user]);

  useEffect(() => {
    if (
      selectedVaga &&
      reservaState.selectedDay &&
      reservaState.selectedVehicleId
    ) {
      fetchHorariosDisponiveis(
        reservaState.selectedDay,
        selectedVaga,
        reservaState.selectedVehicleId
      );
    }
  }, [
    selectedVaga,
    reservaState.selectedDay,
    reservaState.selectedVehicleId,
    fetchHorariosDisponiveis,
  ]);

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
