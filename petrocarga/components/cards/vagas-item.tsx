import { Vaga } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { MapPin, Clock, Ruler, Truck } from "lucide-react";

type VagaItemProp = {
  vaga: Vaga;
};

export default function VagaItem({ vaga }: VagaItemProp) {
  return (
    <article
      className={cn(
        "flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4",
        vaga.area === "AMARELA" && "border-yellow-500",
        vaga.area === "AZUL" && "border-blue-500",
        vaga.area === "VERDE" && "border-green-500"
      )}
    >
      {/* Info principal */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {vaga.enderecoVagaResponseDTO.logradouro}
          </h3>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold",
              vaga.status === "DISPONIVEL" && "bg-green-100 text-green-800",
              vaga.status === "OCUPADO" && "bg-red-100 text-red-800",
              vaga.status === "MANUTENCAO" && "bg-yellow-100 text-yellow-800"
            )}
          >
            {vaga.status}
          </span>
        </div>

        <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
          <MapPin className="w-4 h-4 text-gray-400" />
          {vaga.enderecoVagaResponseDTO.bairro}
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
            {vaga.horarioInicio} - {vaga.horarioFim}
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="w-4 h-4 text-gray-400" />
            {vaga.comprimento} m
          </span>
          <span className="flex items-center gap-1">
            <Truck className="w-4 h-4 text-gray-400" />
            {vaga.maxEixos} eixos
          </span>
          <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
            Área {vaga.area}
          </span>
        </div>
      </div>

      {/* Botão */}
      <div className="mt-3 md:mt-0 flex-shrink-0 self-end md:self-center">
        <Link
          href={`/visualizar-vagas/${vaga.id}`}
          className={cn(buttonVariants({ variant: "outline" }), "text-sm")}
        >
          Ver mais
        </Link>
      </div>
    </article>
  );
}
