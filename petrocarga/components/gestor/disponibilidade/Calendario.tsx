"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import { Vaga } from "@/lib/types/vaga";

/**
 * Toast simples sem bibliotecas externas
 */
function Toast({ msg, variant = "default", onClose }: any) {
  if (!msg) return null;
  return (
    <div
      className={`fixed top-6 right-6 z-[1000] max-w-sm px-4 py-3 rounded-md shadow-lg cursor-pointer
        ${
          variant === "destructive" ? "bg-red-600" : "bg-slate-800"
        } text-white`}
      onClick={onClose}
    >
      {msg}
    </div>
  );
}

type Disponibilidade = {
  vagaId: string;
  inicio: string;
  fim: string;
  criadoPorId: string;
};

export default function Calendario() {
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>(
    []
  );
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [vagaSelecionada, setVagaSelecionada] = useState("");
  const [inicio, setInicio] = useState<Date | null>(null);
  const [fim, setFim] = useState<Date | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [toastMsg, setToastMsg] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  useEffect(() => {
    if (!toastMsg) return;
    const id = setTimeout(() => setToastMsg(""), 4000);
    return () => clearTimeout(id);
  }, [toastMsg]);

  useEffect(() => {
    fetch(
      "http://localhost:8000/petrocarga/vagas" //https://cptranspetrocargaback-production.up.railway.app/petrocarga/vagas
    )
      .then((res) => res.json())
      .then((data) => setVagas(data));

    fetch("http://localhost:8000/petrocarga/disponibilidade-vagas")
      .then((res) => res.json())
      .then((data) => setDisponibilidades(data));
  }, []);

  const handleDateClick = (info: any) => {
    setDataSelecionada(info.dateStr); // salvar a data clicada
    setModalAberto(true);
  };

  const formatToInputValue = (d: Date | null) => {
    if (!d) return "";
    return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  };

  const parseFromInputValue = (str: string) => {
    return str ? new Date(str) : null;
  };

  const handleAdicionarDisponibilidade = async () => {
    if (!vagaSelecionada || !inicio || !fim) {
      setToastVariant("destructive");
      setToastMsg("Preencha todos os campos.");
      return;
    }

    const novoEvento: Disponibilidade = {
      vagaId: vagaSelecionada,
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
      criadoPorId: "b1f2801f-e980-4112-a2a2-8be95a87d40b",
    };

    setLoading(true);
    const res = await fetch(
      "http://localhost:8000/petrocarga/disponibilidade-vagas",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoEvento),
      }
    );

    setLoading(false);

    if (res.ok) {
      setDisponibilidades((prev) => [...prev, novoEvento]);
      fecharModal();
      setToastVariant("default");
      setToastMsg("Disponibilidade adicionada!");
    } else {
      const text = await res.text();
      setToastVariant("destructive");
      setToastMsg("Erro: " + text);
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
    setVagaSelecionada("");
    setInicio(null);
    setFim(null);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={disponibilidades.map((d) => {
          const vaga = vagas.find((v) => v.id === d.vagaId);
          return {
            title: vaga
              ? `Vaga ${vaga.endereco.logradouro} (${vaga.endereco.bairro})`
              : "Disponibilidade",
            start: d.inicio,
            end: d.fim,
          };
        })}
        dateClick={handleDateClick}
      />

      {/* ✅ Modal simples */}
      {modalAberto && dataSelecionada && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999]">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Disponibilidades - {dataSelecionada}
              </h3>
              <button className="text-xl font-bold" onClick={fecharModal}>
                &times;
              </button>
            </div>

            {/* Lista das disponibilidades do dia */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {disponibilidades
                .filter((d) => d.inicio.startsWith(dataSelecionada))
                .map((d) => {
                  const vaga = vagas.find((v) => v.id === d.vagaId);
                  return (
                    <div
                      key={d.vagaId + d.inicio}
                      className="p-2 border rounded flex justify-between items-center"
                    >
                      <span>
                        {vaga
                          ? `Vaga ${vaga.endereco.logradouro} (${vaga.numeroEndereco})`
                          : d.vagaId}
                        - {new Date(d.inicio).toLocaleTimeString()} às{" "}
                        {new Date(d.fim).toLocaleTimeString()}
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Botão de adicionar nova disponibilidade */}
            <button
              className="mt-2 w-full py-2 bg-blue-600 text-white rounded"
              onClick={() => {
                // pré-seleciona horário padrão para adicionar
                const base = new Date(dataSelecionada + "T09:00");
                setInicio(base);
                setFim(new Date(base.getTime() + 60 * 60 * 1000));
              }}
            >
              + Adicionar
            </button>

            {/* Formulário de adicionar (pode reutilizar inputs já existentes) */}
            {inicio && fim && (
              <div className="mt-4 space-y-2">
                <div>
                  <label className="block text-sm mb-1">Vaga:</label>
                  <select
                    className="w-full border px-3 py-2 rounded"
                    value={vagaSelecionada}
                    onChange={(e) => setVagaSelecionada(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {vagas.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.endereco.logradouro} - {v.endereco.bairro}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Início:</label>
                    <input
                      type="datetime-local"
                      className="w-full border rounded px-2 py-2"
                      value={formatToInputValue(inicio)}
                      onChange={(e) =>
                        setInicio(parseFromInputValue(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Fim:</label>
                    <input
                      type="datetime-local"
                      className="w-full border rounded px-2 py-2"
                      value={formatToInputValue(fim)}
                      onChange={(e) =>
                        setFim(parseFromInputValue(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 border rounded"
                    onClick={() => {
                      setInicio(null);
                      setFim(null);
                      setVagaSelecionada("");
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    disabled={loading}
                    onClick={handleAdicionarDisponibilidade}
                  >
                    {loading ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Toast
        msg={toastMsg}
        variant={toastVariant}
        onClose={() => setToastMsg("")}
      />
    </>
  );
}
