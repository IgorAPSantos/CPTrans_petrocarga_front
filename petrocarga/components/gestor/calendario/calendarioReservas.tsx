"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import ptBr from "@fullcalendar/core/locales/pt-br";

import { getReservas } from "@/lib/actions/reservaActions";
import { getVagaById } from "@/lib/actions/vagaActions";

import { Reserva } from "@/lib/types/reserva";
import { Vaga } from "@/lib/types/vaga";

import { useEffect, useMemo, useState } from "react";
import type { EventClickArg, EventInput } from "@fullcalendar/core";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

/* ---------------------------
   cores por área 
   --------------------------- */
const areaColors: Record<string, string> = {
  VERMELHA: "#ef4444",
  AMARELA: "#facc15",
  AZUL: "#3b82f6",
  BRANCA: "#e5e7eb",
  DEFAULT: "#6b7280",
};

function getColorByArea(area?: string) {
  if (!area) return areaColors.DEFAULT;
  return areaColors[area.toUpperCase()] ?? areaColors.DEFAULT;
}

/* ---------------------------
   tipos de estado local
   --------------------------- */
interface GroupEvent {
  logradouro: string;
  dateStr: string; // YYYY-MM-DD
  vagaIds: string[]; // vagas únicas nesse logradouro/dia
  reservas: Reserva[]; // todas reservas daquele logradouro/dia
}

/* Modal states */
interface ModalGroupState {
  logradouro: string;
  dateStr: string;
  vagas: string[]; // vagaIds
  reservas: Reserva[]; // reservas daquele logradouro/data
}

interface ModalVagaState {
  vagaId: string;
  vagaInfo: Vaga | null;
  reservas: Reserva[]; // reservas dessa vaga naquele dia
}

interface ModalReservaState {
  reserva: Reserva;
  vagaInfo: Vaga | null;
}

/* util: converte ISO -> YYYY-MM-DD */
function toDateKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* util: começo do dia em ISO (00:00) */
function dayStartISO(dateKey: string): string {
  return `${dateKey}T00:00:00.000Z`;
}

export default function CalendarioReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [vagaCache, setVagaCache] = useState<Record<string, Vaga>>({});

  const [groupModal, setGroupModal] = useState<ModalGroupState | null>(null);
  const [vagaModal, setVagaModal] = useState<ModalVagaState | null>(null);
  const [reservaModal, setReservaModal] = useState<ModalReservaState | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(false);

  /* 1) buscar reservas */
  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      try {
        const data = await getReservas();
        setReservas(data);
      } catch (err) {
        console.error("Erro ao carregar reservas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, []);

  /* 2) agrupar reservas por logradouro + dia */
  const groupedByLogradouroAndDay = useMemo(() => {
    const map: Record<string, GroupEvent> = {};
    for (const r of reservas) {
      const dateKey = toDateKey(r.inicio);
      const key = `${r.logradouro}::${dateKey}`;
      if (!map[key]) {
        map[key] = {
          logradouro: r.logradouro,
          dateStr: dateKey,
          vagaIds: [],
          reservas: [],
        };
      }
      map[key].reservas.push(r);
      if (!map[key].vagaIds.includes(r.vagaId)) {
        map[key].vagaIds.push(r.vagaId);
      }
    }
    return Object.values(map);
  }, [reservas]);

  /* 3) transformar em eventos do FullCalendar (um por logradouro/dia) */
  const eventosCalendario: EventInput[] = groupedByLogradouroAndDay.map(
    (g) => ({
      id: `${g.logradouro}::${g.dateStr}`,
      title: `${g.logradouro} — ${g.vagaIds.length} vaga(s)`,
      start: dayStartISO(g.dateStr),
      allDay: true,
      extendedProps: {
        logradouro: g.logradouro,
        dateStr: g.dateStr,
      },
    })
  );

  /* helper: carregar info de várias vagas (cache) */
  const ensureVagasInCache = async (vagaIds: string[]) => {
    const missing = vagaIds.filter((id) => !vagaCache[id]);
    if (missing.length === 0) return;
    for (const id of missing) {
      try {
        const v = await getVagaById(id);
        if (v) setVagaCache((prev) => ({ ...prev, [id]: v }));
      } catch (err) {
        console.error("Erro ao buscar vaga", id, err);
      }
    }
  };

  /* 4) clique no agrupamento (logradouro) -> abrir modal com vagas daquele logradouro/dia */
 const handleGroupClick = async (info: EventClickArg) => {
  // remove popovers existentes
  const popovers = document.querySelectorAll('.fc-popover');
  popovers.forEach(p => p.remove());

  // previne o comportamento padrão
  info.jsEvent.preventDefault();
  info.jsEvent.stopPropagation();

  const props = info.event.extendedProps as {
    logradouro: string;
    dateStr: string;
  };

  const logradouro = props.logradouro;
  const dateStr = props.dateStr;

  const reservasDoGrupo = reservas.filter(
    (r) => r.logradouro === logradouro && toDateKey(r.inicio) === dateStr
  );

  const vagaIdsUnicos = Array.from(
    new Set(reservasDoGrupo.map((r) => r.vagaId))
  );

  await ensureVagasInCache(vagaIdsUnicos);

  setGroupModal({
    logradouro,
    dateStr,
    vagas: vagaIdsUnicos,
    reservas: reservasDoGrupo,
  });
};


  /* 5) ao clicar em vaga dentro do modal do logradouro -> abrir modal de vaga com reservas do dia */
  const openVagaModal = async (vagaId: string, dateStr: string) => {
    await ensureVagasInCache([vagaId]);
    const v = vagaCache[vagaId] ?? (await getVagaById(vagaId)) ?? null;

    const reservasDaVagaNoDia = reservas.filter(
      (r) => r.vagaId === vagaId && toDateKey(r.inicio) === dateStr
    );

    setVagaModal({
      vagaId,
      vagaInfo: v,
      reservas: reservasDaVagaNoDia,
    });
  };

  /* 6) abrir modal de reserva específica */
  const openReservaModal = async (reserva: Reserva) => {
    if (!vagaCache[reserva.vagaId]) {
      const v = await getVagaById(reserva.vagaId);
      if (v) setVagaCache((prev) => ({ ...prev, [reserva.vagaId]: v }));
    }
    setReservaModal({
      reserva,
      vagaInfo: vagaCache[reserva.vagaId] ?? null,
    });
  };

  const checkoutForcado = async (reservaId: string) => {
    try {
      const res = await fetch("/api/reservas/checkout-forcado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservaId }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro no checkout");
      }
      setReservas((prev) => prev.filter((r) => r.id !== reservaId));
      setReservaModal(null);
      setVagaModal(null);
      setGroupModal(null);
      alert("Checkout forçado executado com sucesso.");
    } catch (err) {
      console.error("Erro no checkout:", err);
      alert("Erro ao executar checkout forçado.");
    }
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-2 md:p-4">
      {/* Modal: lista de vagas por logradouro/dia */}
      <Dialog open={!!groupModal} onOpenChange={() => setGroupModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {groupModal
                ? `Vagas em ${groupModal.logradouro} — ${groupModal.dateStr}`
                : "Vagas"}
            </DialogTitle>
          </DialogHeader>

          {groupModal && (
            <div className="space-y-3 max-h-[60vh] overflow-auto">
              {groupModal.vagas.map((vagaId) => {
                const vagaInfo = vagaCache[vagaId] ?? null;
                const reservasDaVaga = groupModal.reservas.filter(
                  (r) => r.vagaId === vagaId
                );
                const area = vagaInfo?.area;
                const color = getColorByArea(area);

                return (
                  <div
                    key={vagaId}
                    className="flex items-center justify-between p-3 rounded-md border"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: color }}
                        aria-hidden
                      />
                      <div>
                        <div className="font-medium">
                          {vagaInfo?.endereco?.logradouro ??
                            vagaInfo?.referenciaEndereco ??
                            vagaId}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reservasDaVaga.length} reserva(s) neste dia
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openVagaModal(vagaId, groupModal.dateStr)}
                      >
                        Ver horários
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setGroupModal(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: horários da vaga */}
      <Dialog open={!!vagaModal} onOpenChange={() => setVagaModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {vagaModal
                ? `Horários - ${vagaModal.vagaInfo?.endereco?.logradouro ?? vagaModal.vagaId}`
                : "Horários"}
            </DialogTitle>
          </DialogHeader>

          {vagaModal && (
            <div className="space-y-2 max-h-[60vh] overflow-auto">
              {vagaModal.reservas.length === 0 && (
                <div className="text-sm text-muted-foreground p-2">
                  Nenhuma reserva neste dia.
                </div>
              )}

              {vagaModal.reservas
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.inicio).getTime() - new Date(b.inicio).getTime()
                )
                .map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-2 rounded-md bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">
                        {formatTime(r.inicio)} — {formatTime(r.fim)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {r.bairro} • {r.cidadeOrigem}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => openReservaModal(r)}>
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setVagaModal(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: reserva específica */}
      <Dialog open={!!reservaModal} onOpenChange={() => setReservaModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
          </DialogHeader>

          {reservaModal && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Vaga:</strong>{" "}
                {reservaModal.vagaInfo?.endereco?.logradouro ??
                  reservaModal.vagaInfo?.referenciaEndereco ??
                  reservaModal.reserva.vagaId}
              </p>
              <p>
                <strong>Área:</strong> {reservaModal.vagaInfo?.area ?? "—"}
              </p>
              <p>
                <strong>Início:</strong>{" "}
                {new Date(reservaModal.reserva.inicio).toLocaleString()}
              </p>
              <p>
                <strong>Fim:</strong>{" "}
                {new Date(reservaModal.reserva.fim).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {reservaModal.reserva.status}
              </p>
              <p>
                <strong>Bairro:</strong> {reservaModal.reserva.bairro}
              </p>
              <p>
                <strong>Cidade Origem:</strong> {reservaModal.reserva.cidadeOrigem}
              </p>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                if (reservaModal) checkoutForcado(reservaModal.reserva.id);
              }}
            >
              Checkout Forçado
            </Button>
            <Button onClick={() => setReservaModal(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------- */}
      {/* CALENDÁRIO: apenas mês */}
      {/* ------------------------------------------- */}
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
        buttonText={{
          today: "Hoje",
          month: "Mês",
        }}
        dayMaxEventRows={2}
        eventDidMount={(info) => {
          // removido alteração de cor no calendário
          info.el.style.fontWeight = "600";
          info.el.style.borderRadius = "6px";
          info.el.style.padding = "4px";
        }}
      />
    </div>
  );
}
