"use client";

import { useState } from "react";
import { Vaga, DiaSemana } from "@/lib/types";
import { cn } from "@/lib/utils";

type VagaDetalhesProps = {
  vaga: Vaga;
};

const diasSemana: DiaSemana[] = [
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
  "DOMINGO",
];

export default function VagaDetalhes({ vaga }: VagaDetalhesProps) {
  const [diaSelecionado, setDiaSelecionado] = useState<DiaSemana | null>(null);

  const horariosPorDia = new Map<DiaSemana, string>();
  vaga.operacoesVaga.forEach((op) => {
    horariosPorDia.set(
      op.diaSemana,
      `${op.horaInicio.slice(0, 5)} - ${op.horaFim.slice(0, 5)}`
    );
  });

  return (
    <article className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl border-l-8 border-blue-500 transition-shadow max-w-4xl mx-auto">
      {/* Cabeçalho com título e botões */}
      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        {/* Status */}
        <div
          className={cn(
            "absolute top-4 right-4 w-4 h-4 rounded-full shadow-md",
            vaga.status === "DISPONIVEL" && "bg-green-500",
            vaga.status === "OCUPADO" && "bg-red-500",
            vaga.status === "MANUTENCAO" && "bg-yellow-400"
          )}
          title={vaga.status}
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-800 truncate">
            {vaga.endereco.logradouro}
          </h2>
          <p className="text-gray-600 mt-1 truncate">{vaga.endereco.bairro}</p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-5">
          <button className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition">
            Alterar
          </button>
          <button className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition">
            Excluir
          </button>
        </div>
      </header>

      {/* Mapa reservado */}
      <div className="w-full h-48 mb-6 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        Espaço para mapa
      </div>

      {/* Dias da semana */}
      <section className="mb-4 flex flex-wrap gap-2">
        {diasSemana.map((dia) => {
          const ativo = horariosPorDia.has(dia);
          const selecionado = diaSelecionado === dia;

          return (
            <button
              key={dia}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition",
                ativo
                  ? selecionado
                    ? "bg-green-500 text-white"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
              disabled={!ativo}
              onClick={() => setDiaSelecionado(ativo ? dia : null)}
            >
              {dia.slice(0, 3)}
            </button>
          );
        })}
      </section>

      {/* Exibe horário do dia selecionado */}
      {diaSelecionado && horariosPorDia.has(diaSelecionado) && (
        <p className="mb-6 text-gray-700 text-sm">
          <strong>Horário de {diaSelecionado}:</strong>{" "}
          {horariosPorDia.get(diaSelecionado)}
        </p>
      )}

      {/* Informações da vaga */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm mb-4">
        <p>
          <strong>Comprimento:</strong> {vaga.comprimento} m
        </p>
        <p>
          <strong>Área:</strong> {vaga.area}
        </p>
        <p>
          <strong>Tipo:</strong> {vaga.tipoVaga}
        </p>
      </section>

      {/* Informações complementares */}
      <section className="border-t pt-4 text-xs text-gray-500 space-y-1">
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
