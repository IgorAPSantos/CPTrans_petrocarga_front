import { Vaga } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Ruler, Truck, Info } from "lucide-react";

type VagaDetalhesProps = {
  vaga: Vaga;
};

export default function VagaDetalhes({ vaga }: VagaDetalhesProps) {
  return (
    <article className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl border-l-8 border-blue-500 transition-shadow max-w-4xl mx-auto">
      {/* Cabeçalho principal */}
      <header className="mb-6">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {vaga.endereco.logradouro}
            </h2>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              {vaga.endereco.bairro}
            </p>
          </div>

          <span
            className={cn(
              "px-3 py-1 rounded-full text-sm font-semibold shadow-sm",
              vaga.status === "DISPONIVEL" && "bg-green-100 text-green-800",
              vaga.status === "OCUPADO" && "bg-red-100 text-red-800",
              vaga.status === "MANUTENCAO" && "bg-yellow-100 text-yellow-800"
            )}
          >
            {vaga.status}
          </span>
        </div>
      </header>

      {/* Informações principais */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
        {vaga.operacoesVaga.map((op, index) => (
          <div key={index} className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>
              <strong>Horário ({op.diaSemana}):</strong> {op.horaInicio} -{" "}
              {op.horaFim}
            </span>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-gray-400" />
          <span>
            <strong>Comprimento:</strong> {vaga.comprimento} m
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-gray-400" />
          <span>
            <strong>Tipo:</strong> {vaga.tipoVaga}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-400" />
          <span>
            <strong>Área:</strong> {vaga.area}
          </span>
        </div>
      </section>

      {/* Informações complementares */}
      <section className="mt-6 border-t pt-4 text-xs text-gray-500">
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
