"use client";

import { cn } from "@/lib/utils";
import { Award, Truck } from "lucide-react";
import { Veiculo } from "@/lib/types/veiculo";

interface VeiculoCardProps {
  veiculo: Veiculo;
}

export default function VeiculoCard({ veiculo }: VeiculoCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col sm:flex-row justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4 w-full",
        "border-blue-500"
      )}
    >
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            {veiculo.modelo}
          </h3>

          {/* Tipo do veículo (desktop) */}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm bg-blue-100 text-blue-800">
            {veiculo.tipo}
          </span>
        </div>

        {/* Informações */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Truck className="w-4 h-4 text-gray-400" />
            {veiculo.placa}
          </span>

          <span className="flex items-center gap-1">
            <Award className="w-4 h-4 text-gray-400" />
            {veiculo.marca}
          </span>
        </div>
      </div>
    </article>
  );
}
