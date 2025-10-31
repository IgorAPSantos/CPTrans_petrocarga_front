import { Vaga } from "@/lib/types/vaga";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Ruler, ScanBarcodeIcon } from "lucide-react";

type VagaItemProp = {
  vaga: Vaga;
};

export default function VagaItem({ vaga }: VagaItemProp) {
  const operacao = vaga.operacoesVaga[0];

  return (
    <article
      className={cn(
        "flex flex-col sm:flex-row justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4 w-full",
        vaga.area === "AMARELA" && "border-yellow-500",
        vaga.area === "AZUL" && "border-blue-500",
        vaga.area === "VERMELHA" && "border-red-500",
        vaga.area === "BRANCA" && "border-gray-500"
      )}
    >
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            {vaga.endereco.logradouro}
          </h3>
          {/* Status para desktop */}
          <span
            className={cn(
              "hidden sm:inline-block px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm",
              vaga.status === "DISPONIVEL" && "bg-green-100 text-green-800",
              vaga.status === "INDISPONIVEL" && "bg-red-100 text-red-800",
              vaga.status === "MANUTENCAO" && "bg-yellow-100 text-yellow-800"
            )}
          >
            {vaga.status}
          </span>
        </div>

        {/* Número da vaga */}
        <p className="text-sm sm:text-base text-gray-500 flex items-center gap-1 truncate">
          <MapPin className="w-4 h-4 text-gray-400" />
          {vaga.numeroEndereco}
        </p>

        {/* Informações adicionais */}
        <div className="flex flex-wrap gap-2 sm:gap-3 text-sm sm:text-gray-600">
          {operacao && (
            <span className="flex items-center gap-1">
              <ScanBarcodeIcon className="w-4 h-4 text-gray-400" />
              {vaga?.endereco?.codigoPMP?.toUpperCase()}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Ruler className="w-4 h-4 text-gray-400" />
            {vaga.comprimento} m
          </span>
        </div>
      </div>

      {/* Container botão + status para mobile */}
      <div className="flex flex-col items-stretch sm:items-end gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
        {/* Status para mobile */}
        <span
          className={cn(
            "sm:hidden px-3 py-1 rounded-full text-xs font-semibold shadow-sm text-center",
            vaga.status === "DISPONIVEL" && "bg-green-100 text-green-800",
            vaga.status === "INDISPONIVEL" && "bg-red-100 text-red-800",
            vaga.status === "MANUTENCAO" && "bg-yellow-100 text-yellow-800"
          )}
        >
          {vaga.status}
        </span>

        {/* Botão */}
        <Link
          href={`/gestor/visualizar-vagas/${vaga.id}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "text-sm sm:text-base w-full sm:w-auto text-center"
          )}
        >
          Ver mais
        </Link>
      </div>
    </article>
  );
}
