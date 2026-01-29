'use client';

import { Denuncia } from '@/lib/types/denuncias';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, FileText, Tag, Clock } from 'lucide-react';
import { DenunciaAnaliseModal } from './denuncia-analise-modal';
import { iniciarAnaliseDenuncia } from '@/lib/api/denunciaApi';

interface DenuProps {
  denuncia: Denuncia;
}

const statusStyles: Record<
  string,
  { label: string; class: string; border: string }
> = {
  ABERTA: {
    label: 'Aberta',
    class: 'bg-blue-100 text-blue-700',
    border: 'border-l-blue-500',
  },
  EM_ANALISE: {
    label: 'Em Análise',
    class: 'bg-yellow-100 text-yellow-700',
    border: 'border-l-yellow-500',
  },
  PROCEDENTE: {
    label: 'Procedente',
    class: 'bg-green-100 text-green-700',
    border: 'border-l-green-500',
  },
  IMPROCEDENTE: {
    label: 'Improcedente',
    class: 'bg-red-100 text-red-700',
    border: 'border-l-red-500',
  },
  DEFAULT: {
    label: 'Outro',
    class: 'bg-slate-100 text-slate-700',
    border: 'border-l-slate-400',
  },
};

export default function Denu({ denuncia }: DenuProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statusAtual, setStatusAtual] = useState(denuncia.status);

  const currentStatus = statusStyles[statusAtual] || statusStyles.DEFAULT;

  const podeAnalisar = statusAtual === 'ABERTA' || statusAtual === 'EM_ANALISE';

  function iniciarAnalise() {
    if (statusAtual === 'ABERTA') {
      setConfirmOpen(true);
    }

    if (statusAtual === 'EM_ANALISE') {
      setModalOpen(true);
    }
  }

  async function confirmarInicio() {
    setConfirmOpen(false);

    try {
      await iniciarAnaliseDenuncia(denuncia.id);

      setStatusAtual('EM_ANALISE');

      setModalOpen(true);
    } catch (err) {
      console.error('Erro ao iniciar análise da denúncia:', err);
    }
  }

  return (
    <>
      <article
        className={cn(
          'flex flex-col sm:flex-row justify-between items-start sm:items-center',
          'bg-white p-5 rounded-xl border border-slate-200 border-l-4 shadow-sm',
          'hover:shadow-md hover:border-slate-300 transition-all gap-4 w-full',
          currentStatus.border,
        )}
      >
        <div className="space-y-3 flex-1">
          {/* Header */}
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              Denúncia #{denuncia.id.slice(0, 5).toUpperCase()}
            </h2>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider',
                currentStatus.class,
              )}
            >
              {currentStatus.label}
            </span>
          </div>

          {/* Infos */}
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
              <span>
                {denuncia.enderecoVaga.logradouro}, {denuncia.numeroEndereco} —{' '}
                {denuncia.enderecoVaga.bairro}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Tag className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="capitalize">
                {denuncia.tipo.toLowerCase().replaceAll('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {new Date(denuncia.criadoEm).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="flex items-start gap-2 text-sm text-slate-500 italic">
              <FileText className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
              <p className="line-clamp-2 italic">{denuncia.descricao}</p>
            </div>
          </div>
        </div>

        {/* Botão Gestor */}
        {podeAnalisar && (
          <div className="flex self-end sm:self-center">
            <button
              onClick={iniciarAnalise}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              {statusAtual === 'ABERTA'
                ? 'Iniciar Análise'
                : 'Continuar Análise'}
            </button>
          </div>
        )}
      </article>

      {/* Modal de confirmação */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setConfirmOpen(false)}
          />

          <div className="relative bg-white rounded-2xl p-6 w-96 max-w-full shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
              Confirmar Início
            </h3>

            <p className="text-gray-600 mb-6 text-center">
              Tem certeza que deseja iníciar está Denúncia? Está ação não pode
              ser desfeita.
            </p>

            <div className="flex justify-center gap-3 w-full">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarInicio}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
              >
                Iniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de análise */}
      <DenunciaAnaliseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        denuncia={{ ...denuncia, status: statusAtual }}
        onFinalizado={(novoStatus) => {
          setStatusAtual(novoStatus);
          setModalOpen(false);
        }}
      />
    </>
  );
}
