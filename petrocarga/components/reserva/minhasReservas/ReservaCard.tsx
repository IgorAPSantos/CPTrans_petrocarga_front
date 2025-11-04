"use client";

import { cn } from "@/lib/utils";
import { FileText, MapPin, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface Reserva {
  id: number;
  vaga?: {
    endereco?: {
      logradouro?: string;
    };
  };
  cidadeOrigem: string;
  inicio: string;
  fim: string;
  status: string;
}

interface ReservaCardProps {
  reserva: Reserva;
  onGerarDocumento?: (reserva: Reserva) => void;
}

export default function ReservaCard({
  reserva,
  onGerarDocumento,
}: ReservaCardProps) {
  const formatarData = (data: string) =>
    new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <article
      className={cn(
        "flex flex-col sm:flex-row justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4 w-full",
        reserva.status === "ATIVA" && "border-green-500",
        reserva.status === "CANCELADA" && "border-red-500",
        reserva.status === "FINALIZADA" && "border-gray-500"
      )}
    >
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            {reserva.vaga?.endereco?.logradouro || "Local não informado"}
          </h3>

          {/* Status (desktop) */}
          <span
            className={cn(
              "hidden sm:inline-block px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm",
              reserva.status === "ATIVA" && "bg-green-100 text-green-800",
              reserva.status === "CANCELADA" && "bg-red-100 text-red-800",
              reserva.status === "FINALIZADA" && "bg-gray-100 text-gray-800"
            )}
          >
            {reserva.status}
          </span>
        </div>

        {/* Cidade de origem */}
        <p className="text-sm sm:text-base text-gray-500 flex items-center gap-1 truncate">
          <MapPin className="w-4 h-4 text-gray-400" />
          {reserva.cidadeOrigem}
        </p>

        {/* Informações adicionais */}
        <div className="flex flex-wrap gap-2 sm:gap-3 text-sm sm:text-gray-600">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
            Início: {formatarData(reserva.inicio)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
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
            reserva.status === "ATIVA" && "bg-green-100 text-green-800",
            reserva.status === "CANCELADA" && "bg-red-100 text-red-800",
            reserva.status === "FINALIZADA" && "bg-gray-100 text-gray-800"
          )}
        >
          {reserva.status}
        </span>

        {/* Botão Gerar Documento */}
        <button
          onClick={() => onGerarDocumento?.(reserva)}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "text-sm sm:text-base w-full sm:w-auto text-center flex items-center justify-center gap-2"
          )}
        >
          <FileText className="w-4 h-4" />
          Gerar Documento
        </button>
      </div>
    </article>
  );
}
