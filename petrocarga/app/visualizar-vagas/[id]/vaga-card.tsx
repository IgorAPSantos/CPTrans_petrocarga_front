import { Vaga } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Ruler, Truck, Info } from "lucide-react";

type VagaDetalhesProps = {
  vaga: Vaga;
};

export default function VagaDetalhes({ vaga }: VagaDetalhesProps) {
  return (
    <article className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl border-l-8 border-blue-500 transition-shadow max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {vaga.enderecoVagaResponseDTO.bairro}
        </h2>
        <p className="text-gray-500 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" /> {vaga.localizacao}
        </p>
      </header>

      {/* Informações detalhadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-gray-400" />
          <span>
            <strong>Comprimento permitido:</strong> {vaga.comprimento} m
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>
            <strong>Horário:</strong> {vaga.horarioInicio} - {vaga.horarioFim}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-gray-400" />
          <span>
            <strong>Máx. eixos:</strong> {vaga.maxEixos}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            <strong>Status:</strong>
          </span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-sm font-semibold",
              vaga.status === "DISPONIVEL" && "bg-green-100 text-green-800",
              vaga.status === "OCUPADO" && "bg-red-100 text-red-800",
              vaga.status === "MANUTENCAO" && "bg-yellow-100 text-yellow-800"
            )}
          >
            {vaga.status}
          </span>
        </div>

        <div>
          <strong>Logradouro:</strong> {vaga.enderecoVagaResponseDTO.logradouro}
        </div>

        <div>
          <strong>Bairro:</strong> {vaga.enderecoVagaResponseDTO.bairro}
        </div>

        <div>
          <strong>Código PMP:</strong> {vaga.enderecoVagaResponseDTO.codidoPmp}
        </div>

        <div>
          <strong>Dias disponíveis:</strong>{" "}
          <div className="flex flex-wrap gap-1 mt-1">
            {vaga.diasSemana.map((dia) => (
              <span
                key={dia}
                className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {dia}
              </span>
            ))}
          </div>
        </div>

        <div>
          <strong>ID da vaga:</strong> {vaga.id}
        </div>
      </div>

      {/* Botão ou ação extra */}
      <div className="mt-6 flex justify-end">
        {/* Aqui você pode colocar ações, como "Editar vaga" ou "Reservar" */}
      </div>
    </article>
  );
}
