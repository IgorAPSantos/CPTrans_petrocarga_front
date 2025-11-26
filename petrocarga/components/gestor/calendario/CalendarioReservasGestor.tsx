"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBr from "@fullcalendar/core/locales/pt-br";
import { useReservas } from "./hooks/useReservas";
import { ReservaModal } from "./ReservaModal";
import { useState, useMemo, useRef } from "react";
import { toDateKey, dayStartISO } from "./utils/utils";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import { getVagaById } from "@/lib/actions/vagaActions";
import type { Reserva } from "@/lib/types/reserva";
import type { Vaga } from "@/lib/types/vaga";

/* -------------------- Tipos -------------------- */
interface ReservasPorLogradouro {
  [logradouro: string]: Reserva[];
}

interface ReservasPorDia {
  [dateKey: string]: ReservasPorLogradouro;
}

type ModalState =
  | {
      type: "group";
      data: { dateStr: string; logradouros: ReservasPorLogradouro };
    }
  | {
      type: "vagasLogradouro";
      data: { logradouro: string; reservasDoLogradouro: Reserva[] };
    }
  | {
      type: "vaga";
      data: { vagaId: string; vagaInfo: Vaga | null; reservas: Reserva[] };
    }
  | { type: "reserva"; data: { reserva: Reserva; vagaInfo: Vaga | null } }
  | { type: null; data: null };

/* -------------------- Componente -------------------- */
export default function CalendarioReservasGestor() {
  const { reservas } = useReservas();
  const [vagaCache, setVagaCache] = useState<Record<string, Vaga | null>>({});
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    data: null,
  });

  /* -------------------- Histórico para VOLTAR -------------------- */
  const lastGroupRef = useRef<ModalState>({ type: null, data: null });
  const lastVagasLogradouroRef = useRef<ModalState>({ type: null, data: null });
  const lastVagaRef = useRef<ModalState>({ type: null, data: null });

  const goBack = () => {
    setModalState((prev) => {
      switch (prev.type) {
        case "vagasLogradouro":
          return lastGroupRef.current;

        case "vaga":
          return lastVagasLogradouroRef.current;

        case "reserva":
          return lastVagaRef.current;

        default:
          return prev;
      }
    });
  };

  /* -------------------- Agrupar reservas -------------------- */
  const reservasPorDia = useMemo<ReservasPorDia>(() => {
    const map: ReservasPorDia = {};
    reservas.forEach((r) => {
      const dateKey = toDateKey(r.inicio);
      if (!map[dateKey]) map[dateKey] = {};
      if (!map[dateKey][r.logradouro]) map[dateKey][r.logradouro] = [];
      map[dateKey][r.logradouro].push(r);
    });
    return map;
  }, [reservas]);

  const eventosCalendario: EventInput[] = useMemo(() => {
    return Object.entries(reservasPorDia).map(([dateStr, logradouros]) => {
      const todasFinalizadas = Object.values(logradouros)
        .flat()
        .every((r) => r.status === "FINALIZADA");
      return {
        id: dateStr,
        title: "● Reservas",
        start: dayStartISO(dateStr),
        allDay: true,
        color: todasFinalizadas ? "#ef4444" : "#22c55e",
        extendedProps: { logradouros },
      };
    });
  }, [reservasPorDia]);

  /* -------------------- Garantir que vagas estejam no cache -------------------- */
  const ensureVagasInCache = async (vagaIds: string[]) => {
    const missing = vagaIds.filter((id) => !vagaCache[id]);
    if (!missing.length) return;

    await Promise.all(
      missing.map(async (id) => {
        try {
          const v = await getVagaById(id);
          if (v) setVagaCache((prev) => ({ ...prev, [id]: v }));
        } catch (err) {
          console.error("Erro ao buscar vaga", id, err);
        }
      })
    );
  };

  /* -------------------- Ao clicar no evento do calendário -------------------- */
  const handleGroupClick = async (info: EventClickArg) => {
    info.jsEvent.preventDefault();
    info.jsEvent.stopPropagation();

    const logradouros = (
      info.event.extendedProps as { logradouros: ReservasPorLogradouro }
    ).logradouros;

    const todosVagaIds = Array.from(
      new Set(Object.values(logradouros).flat().map((r) => r.vagaId))
    );

    await ensureVagasInCache(todosVagaIds);

    setModalState({
      type: "group",
      data: { dateStr: info.event.startStr.slice(0, 10), logradouros },
    });
  };

  const closeModal = () => setModalState({ type: null, data: null });

  /* -------------------- Render -------------------- */
  return (
    <div className="p-2 md:p-4">
      <ReservaModal
        modalState={modalState}
        vagaCache={vagaCache}
        close={closeModal}
        goBack={goBack}
        openVagasLogradouro={(l, r) => {
          lastGroupRef.current = modalState; // <--- SALVA STEP ANTERIOR
          setModalState({
            type: "vagasLogradouro",
            data: { logradouro: l, reservasDoLogradouro: r },
          });
        }}
        openVagaModal={async (vagaId, reservasDoLogradouro) => {
          lastVagasLogradouroRef.current = modalState; // <--- SALVA STEP ANTERIOR

          await ensureVagasInCache([vagaId]);

          setModalState({
            type: "vaga",
            data: {
              vagaId,
              vagaInfo: vagaCache[vagaId] ?? null,
              reservas: reservasDoLogradouro.filter((r) => r.vagaId === vagaId),
            },
          });
        }}
        openReservaModal={async (reserva) => {
          lastVagaRef.current = modalState; // <--- SALVA STEP ANTERIOR

          if (!vagaCache[reserva.vagaId]) {
            const v = await getVagaById(reserva.vagaId);
            if (v) setVagaCache((prev) => ({ ...prev, [reserva.vagaId]: v }));
          }

          setModalState({
            type: "reserva",
            data: { reserva, vagaInfo: vagaCache[reserva.vagaId] ?? null },
          });
        }}
        checkoutForcado={(reservaId) => {
          alert("Checkout forçado concluído para a reserva " + reservaId);
        }}
      />

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locale={ptBr}
        initialView="dayGridMonth"
        height="82vh"
        events={eventosCalendario}
        eventClick={handleGroupClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
        buttonText={{ today: "Hoje", month: "Mês" }}
      />
    </div>
  );
}
