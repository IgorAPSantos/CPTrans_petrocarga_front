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
  confirmarReservaAgente
} from "./reservaService";

interface GetVeiculosResult {
  error: boolean;
  message: string;
  veiculos: Veiculo[];
}

export function useReserva(selectedVaga: Vaga | null) {
  const { user } = useAuth();
  const isAgente = user?.permissao === "AGENTE";

  const [reservaState, setReservaState] = useState<ReservaState>({
    step: 1,
    selectedDay: undefined,
    availableTimes: [],
    reservedTimes: [],
    startHour: null,
    endHour: null,
    origin: "",
    selectedVehicleId: undefined,
    tipoVeiculoAgente: undefined,
    placaAgente: "",
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
      tipoVeiculoAgente: undefined,
      placaAgente: "",
    });
  }, []);

  const fetchHorariosDisponiveis = useCallback(
    async (
      day: Date,
      vaga: Vaga,
      vehicleId?: string
    ): Promise<string[]> => {
      const operacao = getOperacaoDia(day, vaga);
      if (!operacao) return [];

      let tipoVeiculo: Veiculo["tipo"] | undefined;

      // motorista
      if (!isAgente) {
        const v = vehicles.find((x) => x.id === vehicleId);
        if (!v) return [];
        tipoVeiculo = v.tipo;
      }

      // agente
      if (isAgente) {
        tipoVeiculo = reservaState.tipoVeiculoAgente;
      }

      if (!tipoVeiculo) return [];

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
    [vehicles, reservaState.tipoVeiculoAgente, isAgente]
  );

  const handleConfirm = useCallback(async (): Promise<boolean> => {
  if (!user?.id || !selectedVaga) return false;

  const {
    selectedDay,
    selectedVehicleId,
    tipoVeiculoAgente,
    placaAgente,
    startHour,
    endHour,
    origin,
  } = reservaState;

  if (!selectedDay || !startHour || !endHour) return false;

  const formData = new FormData();
  formData.append("vagaId", selectedVaga.id);

  if (isAgente) {
    // AGENTE
    if (!tipoVeiculoAgente || !placaAgente) return false;
    formData.append("tipoVeiculo", tipoVeiculoAgente);
    formData.append("placa", placaAgente);
  } else {
    // MOTORISTA
    if (!motoristaId || !selectedVehicleId || !origin) return false;
    formData.append("motoristaId", motoristaId);
    formData.append("veiculoId", selectedVehicleId);
    formData.append("cidadeOrigem", origin);
  }

  // Ambos usam inicio/fim
  formData.append("inicio", formatDateTime(selectedDay, startHour));
  formData.append("fim", formatDateTime(selectedDay, endHour));

  const success = isAgente
    ? await confirmarReservaAgente(formData)
    : await confirmarReserva(formData);

  if (success) reset();

  return success;
}, [user, selectedVaga, motoristaId, reservaState, isAgente, reset]);


  // ================= Effects =================

  useEffect(() => {
    if (!user?.id || isAgente) return;

    const fetchMotorista = async () => {
      try {
        const result = await getMotoristaByUserId(user.id);
        if (!result.error) {
          setMotoristaId(result.motoristaId);
        }
      } catch (e) {
        console.error("Erro ao buscar motorista:", e);
      } finally {
        setLoadingMotorista(false);
      }
    };

    fetchMotorista();
  }, [user, isAgente]);

  useEffect(() => {
    if (!user?.id || isAgente) return;

    const loadVehicles = async () => {
      try {
        const r: GetVeiculosResult = await getVeiculosUsuario(user.id);
        if (!r.error) setVehicles(r.veiculos);
      } catch (e) {
        console.error("Erro ao buscar veículos:", e);
      }
    };

    loadVehicles();
  }, [user, isAgente]);

  useEffect(() => {
    if (!selectedVaga || !reservaState.selectedDay) return;

    if (isAgente && reservaState.tipoVeiculoAgente) {
      fetchHorariosDisponiveis(reservaState.selectedDay, selectedVaga);
    }

    if (!isAgente && reservaState.selectedVehicleId) {
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
    reservaState.tipoVeiculoAgente,
    fetchHorariosDisponiveis,
    isAgente,
  ]);

  // ================= Setters =================

  const setStep = useCallback(
    (step: number) =>
      setReservaState((prev) => ({ ...prev, step })),
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

  const setTipoVeiculoAgente = useCallback(
    (tipo: Veiculo["tipo"]) =>
      setReservaState((prev) => ({ ...prev, tipoVeiculoAgente: tipo })),
    []
  );

  const setPlacaAgente = useCallback(
    (placa: string) =>
      setReservaState((prev) => ({ ...prev, placaAgente: placa })),
    []
  );

  // ================= Return =================

  return {
    ...reservaState,
    isAgente,
    vehicles,
    loadingMotorista,

    // setters
    setStep,
    setSelectedDay,
    setStartHour,
    setEndHour,
    setOrigin,
    setSelectedVehicleId,
    setTipoVeiculoAgente,
    setPlacaAgente,

    fetchHorariosDisponiveis,
    handleConfirm,
    reset,
  };
}
