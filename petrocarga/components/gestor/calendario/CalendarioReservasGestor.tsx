"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBr from "@fullcalendar/core/locales/pt-br";
import { useReservas } from "./hooks/useReservas";
import { ReservaModal } from "./ReservaModal";
import { useState, useMemo } from "react";
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
  | { type: "group"; data: { dateStr: string; logradouros: ReservasPorLogradouro } }
  | { type: "vagasLogradouro"; data: { logradouro: string; reservasDoLogradouro: Reserva[] } }
  | { type: "vaga"; data: { vagaId: string; vagaInfo: Vaga | null; reservas: Reserva[] } }
  | { type: "reserva"; data: { reserva: Reserva; vagaInfo: Vaga | null } }
  | { type: null; data: null };

/* -------------------- Componente -------------------- */
export default function CalendarioReservasGestor() {
  const { reservas, setReservas } = useReservas();
  const [vagaCache, setVagaCache] = useState<Record<string, Vaga | null>>({});
  const [modalState, setModalState] = useState<ModalState>({ type: null, data: null });

  const reservasPorDia = useMemo<ReservasPorDia>(() => {
    const map: ReservasPorDia = {};
    reservas.forEach(r => {
      const dateKey = toDateKey(r.inicio);
      if (!map[dateKey]) map[dateKey] = {};
      if (!map[dateKey][r.logradouro]) map[dateKey][r.logradouro] = [];
      map[dateKey][r.logradouro].push(r);
    });
    return map;
  }, [reservas]);

  const eventosCalendario: EventInput[] = useMemo(() => {
    return Object.entries(reservasPorDia).map(([dateStr, logradouros]) => {
      const todasFinalizadas = Object.values(logradouros).flat().every(r => r.status === "FINALIZADA");
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

  const ensureVagasInCache = async (vagaIds: string[]) => {
    const missing = vagaIds.filter(id => !vagaCache[id]);
    if (!missing.length) return;
    await Promise.all(
      missing.map(async id => {
        try {
          const v = await getVagaById(id);
          if (v) setVagaCache(prev => ({ ...prev, [id]: v }));
        } catch (err) {
          console.error("Erro ao buscar vaga", id, err);
        }
      })
    );
  };

  const handleGroupClick = async (info: EventClickArg) => {
    info.jsEvent.preventDefault();
    info.jsEvent.stopPropagation();
    const logradouros = (info.event.extendedProps as { logradouros: ReservasPorLogradouro }).logradouros;
    const todosVagaIds = Array.from(new Set(Object.values(logradouros).flat().map(r => r.vagaId)));
    await ensureVagasInCache(todosVagaIds);
    setModalState({ type: "group", data: { dateStr: info.event.startStr.slice(0, 10), logradouros } });
  };

  const closeModal = () => setModalState({ type: null, data: null });

  return (
    <div className="p-2 md:p-4">
      <ReservaModal
        modalState={modalState}
        vagaCache={vagaCache}
        close={closeModal}
        openVagasLogradouro={(l, r) =>
          setModalState({ type: "vagasLogradouro", data: { logradouro: l, reservasDoLogradouro: r } })
        }
        openVagaModal={async (vagaId, reservasDoLogradouro) => {
          await ensureVagasInCache([vagaId]);
          setModalState({
            type: "vaga",
            data: { vagaId, vagaInfo: vagaCache[vagaId] ?? null, reservas: reservasDoLogradouro.filter(r => r.vagaId === vagaId) },
          });
        }}
        openReservaModal={async reserva => {
          if (!vagaCache[reserva.vagaId]) {
            const v = await getVagaById(reserva.vagaId);
            if (v) setVagaCache(prev => ({ ...prev, [reserva.vagaId]: v }));
          }
          setModalState({ type: "reserva", data: { reserva, vagaInfo: vagaCache[reserva.vagaId] ?? null } });
        }}
        checkoutForcado={async reservaId => {
          try {
            const res = await fetch("/api/reservas/checkout-forcado", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reservaId }),
            });
            if (!res.ok) throw new Error(await res.text());
            setReservas(prev => prev.filter(r => r.id !== reservaId));
            closeModal();
            alert("Checkout forçado executado com sucesso.");
          } catch (err) {
            console.error(err);
            alert("Erro ao executar checkout forçado.");
          }
        }}
      />

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locale={ptBr}
        initialView="dayGridMonth"
        height="82vh"
        events={eventosCalendario}
        eventClick={handleGroupClick}
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth" }}
        buttonText={{ today: "Hoje", month: "Mês" }}
        dayMaxEventRows={false}
        eventDidMount={info => {
          Object.assign(info.el.style, {
            fontWeight: "600",
            borderRadius: "6px",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
          });
        }}
      />
    </div>
  );
}
