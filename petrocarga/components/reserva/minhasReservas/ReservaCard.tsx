"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileText, MapPin, Clock, Trash2, Pencil } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ReservaGet } from "@/lib/types/reserva";

interface ReservaCardProps {
  reserva: ReservaGet;
  onGerarDocumento?: (reserva: ReservaGet) => void;
  onExcluir?: (reservaId: string) => void;
  onEditar?: (reserva: ReservaGet) => void;
}

export default function ReservaCard({
  reserva,
  onGerarDocumento,
  onExcluir,
  onEditar,
}: ReservaCardProps) {
  const [modalAberto, setModalAberto] = useState(false);

  const formatarData = (data: string) =>
    new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });

  // 🔥 Função chamada ao confirmar exclusão no modal
  const handleExcluir = () => {
    onExcluir?.(reserva.id);
    setModalAberto(false);
  };

  return (
    <article
      className={cn(
        "flex flex-col bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4 w-full",
        "sm:flex-row sm:justify-between",
        "max-sm:gap-3 max-sm:p-3",
        reserva.status === "ATIVA" && "border-green-900",
        reserva.status === "CONCLUIDA" && "border-b-blue-300",
        reserva.status === "RESERVADA" && "border-green-500",
        reserva.status === "REMOVIDA" && "border-red-500",
        reserva.status === "CANCELADA" && "border-b-blue-200"
      )}
    >
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate leading-tight">
            {`${reserva.logradouro} - ${reserva.bairro}` ||
              "Local não informado"}
          </h3>

          {/* Status (desktop) */}
          <span
            className={cn(
              "hidden sm:inline-block px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm",
              reserva.status === "ATIVA" && "bg-green-100 text-green-900",
              reserva.status === "CONCLUIDA" && "bg-gray-100 border-b-blue-300",
              reserva.status === "RESERVADA" && "bg-green-100 border-green-500",
              reserva.status === "REMOVIDA" && "bg-gray-100 border-red-500",
              reserva.status === "CANCELADA" && "bg-gray-100 border-b-blue-200"
            )}
          >
            {reserva.status}
          </span>
        </div>

        {/* Cidade de origem */}
        <p className="text-sm sm:text-base text-gray-500 flex items-center gap-1 truncate leading-tight">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
          {`Local de Origem: ${reserva.cidadeOrigem}`}
        </p>

        {/* Informações adicionais */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600">
          <span className="flex items-center gap-1 truncate">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            Início: {formatarData(reserva.inicio)}
          </span>
          <span className="flex items-center gap-1 truncate">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            Fim: {formatarData(reserva.fim)}
          </span>
        </div>
      </div>

      {/* Container botão + status mobile */}
      <div className="flex flex-col items-stretch sm:items-end gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
        {/* Status (mobile) */}
        <span
          className={cn(
            "sm:hidden px-3 py-1 rounded-full text-xs font-semibold shadow-sm text-center",
            reserva.status === "ATIVA" && "bg-green-100 text-green-900",
            reserva.status === "CONCLUIDA" && "bg-gray-100 text-red-800"
          )}
        >
          {reserva.status}
        </span>

        {/* Botão Gerar Documento */}
        <button
          onClick={() => onGerarDocumento?.(reserva)}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "text-sm w-full sm:w-auto text-center flex items-center justify-center gap-2 py-2"
          )}
        >
          <FileText className="w-4 h-4" />
          Gerar Documento
        </button>

        {/* Botões Editar / Excluir */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2 w-full sm:w-auto">
          {/* Excluir */}
          <button
            onClick={() => setModalAberto(true)}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "text-sm w-full sm:w-auto text-center flex items-center justify-center gap-2 py-2 text-red-600"
            )}
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>

          {/* Editar */}
          <button
            onClick={() => onEditar?.(reserva)}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "text-sm w-full sm:w-auto text-center flex items-center justify-center gap-2 py-2"
            )}
          >
            <Pencil className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>

      {/* Modal de Exclusão */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalAberto(false)}
          />

          <div className="relative bg-white rounded-2xl p-6 w-96 max-w-full shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Confirmar exclusão
            </h3>

            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir esta Reserva? Esta ação não pode
              ser desfeita.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleExcluir}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
