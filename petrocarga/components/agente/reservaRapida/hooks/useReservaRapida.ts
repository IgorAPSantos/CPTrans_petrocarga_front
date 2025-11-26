"use client";

import { useState } from "react";
import { Vaga } from "@/lib/types/vaga";


export function useReservaRapida(vaga: Vaga) {
  /* ------------------ STATES DE CONTROLE ------------------ */
  const [step, setStep] = useState(1);

  const [placa, setPlaca] = useState("");
  const [tipoVeiculo, setTipoVeiculo] = useState<"AUTOMOVEL" | "MOTOCICLETA" | "CAMINHONETE">("AUTOMOVEL");

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);

  const [startHour, setStartHour] = useState<string | null>(null);
  const [endHour, setEndHour] = useState<string | null>(null);

  const [success, setSuccess] = useState<boolean | null>(null);

  /* ------------------ BUSCAR HORÁRIOS ------------------ */
  const fetchHorariosDisponiveis = async (day: string) => {
    try {
      const res = await fetch(
        `/api/reservas/disponibilidade?vagaId=${vaga.id}&dia=${day}`
      );

      const data = await res.json();

      setAvailableTimes(data.disponiveis ?? []);
      setReservedTimes(data.ocupados ?? []);
    } catch (err) {
      console.error("Erro ao buscar horários:", err);
    }
  };

  /* ------------------ CONFIRMAR RESERVA ------------------ */
  const handleConfirm = async () => {
    if (!selectedDay || !startHour || !endHour) return false;

    // Gera ISO de início e fim
    const inicioISO = `${selectedDay}T${startHour}:00.000Z`;
    const fimISO = `${selectedDay}T${endHour}:00.000Z`;

    const payload = {
      vagaId: vaga.id,
      tipoVeiculo,
      placa,
      inicio: inicioISO,
      fim: fimISO,
    };

    try {
      const res = await fetch("/api/reservas/rapida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro na criação da reserva.");

      setSuccess(true);
      setStep(6);
      return true;
    } catch (err) {
      console.error("Erro ao confirmar reserva:", err);
      setSuccess(false);
      setStep(6);
      return false;
    }
  };

  /* ------------------ RESET ------------------ */
  const reset = () => {
    setStep(1);
    setPlaca("");
    setTipoVeiculo("AUTOMOVEL");
    setSelectedDay(null);
    setAvailableTimes([]);
    setReservedTimes([]);
    setStartHour(null);
    setEndHour(null);
    setSuccess(null);
  };

  return {
    step,
    setStep,

    placa,
    setPlaca,

    tipoVeiculo,
    setTipoVeiculo,

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
    success,
    setSuccess,

    reset,
  };
}
