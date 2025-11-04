import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
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
import { fetchReservasAtivasDoDia, confirmarReserva } from "./reservaService";

interface GetVeiculosResult {
  error: boolean;
  message: string;
  veiculos: Veiculo[];
}

export function useReserva(selectedVaga: Vaga | null) {
  const { user, setUser, token } = useAuth();

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
      if (!token) return [];

      const operacao = getOperacaoDia(day, vaga);
      if (!operacao) return [];

      const reservasAtivas = await fetchReservasAtivasDoDia(
        vaga.id,
        day,
        token
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
    [token]
  );

  const handleConfirm = useCallback(async (): Promise<boolean> => {
    if (!token || !user?.motoristaId || !selectedVaga) return false;

    const { selectedDay, selectedVehicleId, startHour, endHour, origin } =
      reservaState;

    if (!selectedDay || !selectedVehicleId || !startHour || !endHour || !origin)
      return false;

    const formData = new FormData();
    formData.append("vagaId", selectedVaga.id);
    formData.append("motoristaId", user.motoristaId);
    formData.append("veiculoId", selectedVehicleId);
    formData.append("cidadeOrigem", origin);
    formData.append("inicio", formatDateTime(selectedDay, startHour));
    formData.append("fim", formatDateTime(selectedDay, endHour));

    const success = await confirmarReserva(formData, token);
    if (success) reset();
    return success;
  }, [token, user, selectedVaga, reservaState, reset]);

  // ================= Effects =================

  useEffect(() => {
    if (!user?.id || !token) return;

    const fetchMotorista = async () => {
      if (!user.motoristaId) {
        try {
          const result = await getMotoristaByUserId(token, user.id);
          if (result.motoristaId) {
            setUser({ ...user, motoristaId: result.motoristaId });
          }
        } catch (error) {
          console.error("Erro ao buscar motorista:", error);
        } finally {
          setLoadingMotorista(false);
        }
      } else {
        setLoadingMotorista(false);
      }
    };

    fetchMotorista();
  }, [user, token, setUser]);

  useEffect(() => {
    if (!user?.id || !token) return;

    const fetchVehicles = async () => {
      try {
        const result: GetVeiculosResult = await getVeiculosUsuario(
          user.id,
          token
        );
        if (!result.error) setVehicles(result.veiculos);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
      }
    };

    fetchVehicles();
  }, [user, token]);

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
    (origin: string) => setReservaState((prev) => ({ ...prev, origin })),
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
