"use client";

import { cn } from "@/lib/utils";
import { FileText, Truck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Veiculo } from "@/lib/types/veiculo";

interface VeiculoCardProps {
  veiculo: Veiculo;
  onGerarDocumento?: (veiculo: Veiculo) => void;
}

export default function VeiculoCard({
  veiculo,
  onGerarDocumento,
}: VeiculoCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col sm:flex-row justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4 w-full",
        "border-blue-500"
      )}
    >
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            {veiculo.marca} {veiculo.modelo}
          </h3>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm bg-gray-100 text-gray-800">
            {veiculo.tipo}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Truck className="w-4 h-4 text-gray-400" />
            Placa: {veiculo.placa}
          </span>
          {veiculo.cpfProprietario && (
            <span>CPF: {veiculo.cpfProprietario}</span>
          )}
          {veiculo.cnpjProprietario && (
            <span>CNPJ: {veiculo.cnpjProprietario}</span>
          )}
        </div>
      </div>

      {/* Container botão */}
      <div className="flex flex-col items-stretch sm:items-end gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
        <span className="sm:hidden px-3 py-1 rounded-full text-xs font-semibold shadow-sm text-center bg-gray-100 text-gray-800">
          {veiculo.tipo}
        </span>

        <button
          onClick={() => onGerarDocumento?.(veiculo)}
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
