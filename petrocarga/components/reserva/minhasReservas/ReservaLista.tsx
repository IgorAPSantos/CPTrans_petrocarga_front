'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Archive, CopyPlus } from 'lucide-react';
import Link from 'next/link';
import ReservaCard from './ReservaCard';
import { ReservaGet } from '@/lib/types/reserva';
import { Button } from '@/components/ui/button';

// CONSTANTES (Fora do componente para não recriar na renderização)
const PRIORIDADE: Record<string, number> = {
  ATIVA: 1,
  RESERVADA: 2,
  CONCLUIDA: 3,
  CANCELADA: 4,
  REMOVIDA: 5,
};

const VISIBLE_STATUSES = new Set(['ATIVA', 'RESERVADA']);
const HIDDEN_STATUSES = new Set(['CONCLUIDA', 'CANCELADA', 'REMOVIDA']);

// Função auxiliar de ordenação
const sortReservas = (a: ReservaGet, b: ReservaGet) => {
  const statusA = (a.status || '').toUpperCase();
  const statusB = (b.status || '').toUpperCase();
  const pa = PRIORIDADE[statusA] ?? 999;
  const pb = PRIORIDADE[statusB] ?? 999;
  return pa - pb;
};

interface ReservaListaProps {
  reservas: ReservaGet[];
  onGerarDocumento: (reserva: ReservaGet) => void;
  onExcluir: (id: string) => void;
  onCheckout: (reserva: ReservaGet) => void;
}

export default function ReservaLista({
  reservas,
  onGerarDocumento,
  onExcluir,
  onCheckout,
}: ReservaListaProps) {
  const [mostrarOcultas, setMostrarOcultas] = useState(false);

  // Otimização: Separação em um único pass (Reduce) e ordenação individual
  const { visiveis, ocultas } = useMemo(() => {
    const buckets = reservas.reduce(
      (acc, r) => {
        const status = (r.status || '').toUpperCase();
        if (VISIBLE_STATUSES.has(status)) {
          acc.visiveis.push(r);
        } else if (HIDDEN_STATUSES.has(status)) {
          acc.ocultas.push(r);
        }
        return acc;
      },
      { visiveis: [] as ReservaGet[], ocultas: [] as ReservaGet[] }
    );

    return {
      visiveis: buckets.visiveis.sort(sortReservas),
      ocultas: buckets.ocultas.sort(sortReservas),
    };
  }, [reservas]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* --- SEÇÃO PRINCIPAL (Visíveis) --- */}
      <section className="flex flex-col gap-4 animate-in fade-in duration-500">
        {visiveis.length > 0 ? (
          visiveis.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              onGerarDocumento={onGerarDocumento}
              onExcluir={onExcluir}
              onCheckout={onCheckout}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </section>

      {/* --- SEÇÃO SECUNDÁRIA (Ocultas/Histórico) --- */}
      {ocultas.length > 0 && (
        <div className="border-t border-gray-100 pt-6">
          <button
            onClick={() => setMostrarOcultas((s) => !s)}
            className="group w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all active:scale-[0.99]"
            aria-expanded={mostrarOcultas}
            aria-controls="lista-ocultas"
          >
            <div className="flex items-center gap-3 text-gray-600">
              <Archive className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-medium">
                {mostrarOcultas ? 'Ocultar histórico' : 'Ver histórico'}
              </span>
              <span className="bg-gray-200 text-gray-600 text-xs py-0.5 px-2 rounded-full">
                {ocultas.length}
              </span>
            </div>

            {mostrarOcultas ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* Wrapper para animação suave de altura (Smooth Collapse) */}
          <div
            id="lista-ocultas"
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              mostrarOcultas ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden min-h-0">
              <div className="flex flex-col gap-3 pb-2">
                {ocultas.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <ReservaCard
                      reserva={reserva}
                      onGerarDocumento={onGerarDocumento}
                      onExcluir={onExcluir}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente visual para quando não há reservas
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
      {/* Ícone de Destaque */}
      <div className="bg-white p-3 rounded-full shadow-sm mb-4">
        <CopyPlus className="w-8 h-8 text-gray-400" />
      </div>

      {/* Título e Descrição */}
      <h3 className="text-gray-900 font-medium text-lg mb-2">
        Nenhuma Reserva Ativa
      </h3>
      {/* Botão Principal com Melhorias de UI/UX */}
      <div className="flex flex-col sm:flex-row justify-center">
        <Link href="/motorista/reservar-vaga">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-sm md:text-base"
          >
            Fazer Reserva
          </Button>
        </Link>
      </div>
    </div>
  );
}
