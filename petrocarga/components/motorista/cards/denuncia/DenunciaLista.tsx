'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Archive, AlertTriangle } from 'lucide-react';
import DenunciaCard from './denuncia-card';
import { Denuncia } from '@/lib/types/denuncias';

/* ---------------- Constantes ---------------- */

const PRIORIDADE: Record<string, number> = {
  ABERTA: 1,
  EM_ANALISE: 2,
  PROCEDENTE: 3,
  IMPROCEDENTE: 4,
};

const VISIBLE_STATUSES = new Set(['ABERTA', 'EM_ANALISE']);
const HIDDEN_STATUSES = new Set(['PROCEDENTE', 'IMPROCEDENTE']);

/* ---------------- Ordenação ---------------- */

const sortDenuncias = (a: Denuncia, b: Denuncia) => {
  const sa = (a.status || '').toUpperCase();
  const sb = (b.status || '').toUpperCase();
  return (PRIORIDADE[sa] ?? 999) - (PRIORIDADE[sb] ?? 999);
};

/* ---------------- Props ---------------- */

interface DenunciaListaProps {
  denuncias: Denuncia[];
}

/* ---------------- Componente ---------------- */

export default function DenunciaLista({ denuncias }: DenunciaListaProps) {
  const [mostrarOcultas, setMostrarOcultas] = useState(false);

  const { visiveis, ocultas } = useMemo(() => {
    const buckets = denuncias.reduce(
      (acc, d) => {
        const status = (d.status || '').toUpperCase();
        if (VISIBLE_STATUSES.has(status)) acc.visiveis.push(d);
        else if (HIDDEN_STATUSES.has(status)) acc.ocultas.push(d);
        return acc;
      },
      { visiveis: [] as Denuncia[], ocultas: [] as Denuncia[] },
    );

    return {
      visiveis: buckets.visiveis.sort(sortDenuncias),
      ocultas: buckets.ocultas.sort(sortDenuncias),
    };
  }, [denuncias]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* -------- Denúncias Ativas -------- */}
      <section className="flex flex-col gap-4 animate-in fade-in duration-500">
        {visiveis.length > 0 ? (
          visiveis.map((denuncia) => (
            <DenunciaCard key={denuncia.id} denuncia={denuncia} />
          ))
        ) : (
          <EmptyState />
        )}
      </section>

      {/* -------- Histórico -------- */}
      {ocultas.length > 0 && (
        <div className="border-t border-gray-100 pt-6">
          <button
            onClick={() => setMostrarOcultas((v) => !v)}
            className="group w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all active:scale-[0.99]"
            aria-expanded={mostrarOcultas}
            aria-controls="lista-denuncias-historico"
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

          {/* Collapse suave */}
          <div
            id="lista-denuncias-historico"
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              mostrarOcultas ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden min-h-0">
              <div className="flex flex-col gap-3 pb-2">
                {ocultas.map((denuncia) => (
                  <div
                    key={denuncia.id}
                    className="opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <DenunciaCard denuncia={denuncia} />
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

/* ---------------- Empty State ---------------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
      <div className="bg-white p-3 rounded-full shadow-sm mb-4">
        <AlertTriangle className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="text-gray-900 font-medium text-lg mb-1">
        Nenhuma denúncia ativa
      </h3>
      <p className="text-sm text-gray-500">
        Quando houver denúncias abertas ou em análise, elas aparecerão aqui.
      </p>
    </div>
  );
}
