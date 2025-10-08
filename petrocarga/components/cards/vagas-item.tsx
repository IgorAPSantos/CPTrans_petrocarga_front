import { Vaga } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

type VagaItemProp = {
    vaga: Vaga;
};

export default function VagaItem({ vaga }: VagaItemProp) {
    return (
   <article className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 gap-4">
  {/* Info principal */}
  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 min-w-0">
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-semibold text-gray-800 truncate">
        {vaga.area}
      </h3>
      <p className="text-sm text-gray-500 truncate">
        {vaga.localizacao}
      </p>
    </div>

    <div className="flex flex-wrap gap-4 text-sm text-gray-600 min-w-0">
      <span className="truncate">Comprimento: {vaga.comprimento} m</span>
      <span
  className={cn(
    "truncate font-medium",
    vaga.status === "ativo" && "text-green-600",
    vaga.status === "inativo" && "text-red-600",
    vaga.status === "manutenção" && "text-yellow-600"
  )}
>
  Status: {vaga.status}
</span>
    </div>
  </div>

  {/* Botão */}
  <div className="mt-2 md:mt-0 flex-shrink-0">
    <Link
      href={`/visualizar-vagas/${vaga.id}`}
      className={cn(buttonVariants({ variant: "outline" }))}
    >
      Mais
    </Link>
  </div>
</article>
    );
}