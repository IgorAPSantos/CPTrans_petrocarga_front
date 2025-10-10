import { Vaga } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Ruler, Truck, Info } from "lucide-react";

type VagaDetalhesProps = {
  vaga: Vaga;
};

export default function VagaDetalhes({ vaga }: VagaDetalhesProps) {
  return (
    <article className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl border-l-8 border-blue-500 transition-shadow max-w-4xl mx-auto">
      {/* Status bolinha no canto superior direito */}
      <div
        className={cn(
          "absolute top-4 right-4 w-4 h-4 rounded-full shadow-md",
          vaga.status === "DISPONIVEL" && "bg-green-500",
          vaga.status === "OCUPADO" && "bg-red-500",
          vaga.status === "MANUTENCAO" && "bg-yellow-400"
        )}
        title={vaga.status}
      />

      {/* Cabeçalho principal */}
      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-800 truncate">
            {vaga.endereco.logradouro}
          </h2>
          <p className="text-gray-600 flex items-center gap-2 mt-1 truncate">
            <MapPin className="w-4 h-4 text-gray-400" />
            {vaga.endereco.bairro}
          </p>
        </div>
      </header>

      {/* Informações principais */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
        {vaga.operacoesVaga.map((op, index) => (
          <div key={index} className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              <strong>{op.diaSemana}:</strong> {op.horaInicio.slice(0, 5)} -{" "}
              {op.horaFim.slice(0, 5)}
            </span>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>
            <strong>Comprimento:</strong> {vaga.comprimento} m
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>
            <strong>Tipo:</strong> {vaga.tipoVaga}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>
            <strong>Área:</strong> {vaga.area}
          </span>
        </div>
      </section>

      {/* Informações complementares */}
      <section className="mt-6 border-t pt-4 text-xs text-gray-500 space-y-1">
        <p>
          <strong>Código PMP:</strong> {vaga.endereco.codidoPmp}
        </p>
        <p>
          <strong>ID da vaga:</strong> {vaga.id}
        </p>
        <p>
          <strong>Referência do endereço:</strong> {vaga.referenciaEndereco}
        </p>
        <p>
          <strong>Número da vaga:</strong> {vaga.numeroEndereco}
        </p>
        <p>
          <strong>Localização GPS início:</strong> {vaga.referenciaGeoInicio}
        </p>
        <p>
          <strong>Localização GPS fim:</strong> {vaga.referenciaGeoFim}
        </p>
      </section>
    </article>
  );
}
