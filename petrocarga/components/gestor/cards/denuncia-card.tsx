'use client';

import { Denuncia } from '@/lib/types/denuncias';
import { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, FileText, Tag, Clock } from 'lucide-react';
import { DenunciaAnaliseModal } from './denuncia-analise-modal';
import { iniciarAnaliseDenuncia } from '@/lib/api/denunciaApi';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

interface DenunciaCardProps {
  denuncia: Denuncia;
  /** Chamado quando a análise é finalizada, para o parent refazer o fetch */
  onRefresh?: () => void;
}

export default function DenunciaCard({
  denuncia,
  onRefresh,
}: DenunciaCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingInicio, setLoadingInicio] = useState(false);
  const [statusAtual, setStatusAtual] = useState(denuncia.status);

  const currentStatus = statusStyles[statusAtual] ?? statusStyles.DEFAULT;
  const podeAnalisar =
    statusAtual === 'ABERTA' || statusAtual === 'EM_ANALISE';

  const iniciarAnalise = useCallback(() => {
    if (statusAtual === 'ABERTA') setConfirmOpen(true);
    if (statusAtual === 'EM_ANALISE') setModalOpen(true);
  }, [statusAtual]);

  const confirmarInicio = useCallback(async () => {
    setLoadingInicio(true);
    try {
      await iniciarAnaliseDenuncia(denuncia.id);
      setConfirmOpen(false);
      setStatusAtual('EM_ANALISE');
      setModalOpen(true);
    } catch {
      toast.error('Erro ao iniciar análise. Tente novamente.');
    } finally {
      setLoadingInicio(false);
    }
  }, [denuncia.id]);

  const handleFinalizado = useCallback(
    (novoStatus: 'PROCEDENTE' | 'IMPROCEDENTE') => {
      setStatusAtual(novoStatus);
      setModalOpen(false);
      onRefresh?.();
    },
    [onRefresh],
  );

  const handleCloseModal = useCallback(() => setModalOpen(false), []);

  const denunciaParaModal = useMemo(
    () => ({ ...denuncia, status: statusAtual }),
    [denuncia, statusAtual],
  );

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

          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" aria-hidden />
              <span>
                {denuncia.enderecoVaga.logradouro}, {denuncia.numeroEndereco} —{' '}
                {denuncia.enderecoVaga.bairro}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Tag className="w-4 h-4 text-slate-400 shrink-0" aria-hidden />
              <span className="capitalize">
                {denuncia.tipo.toLowerCase().replaceAll('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" aria-hidden />
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
              <FileText className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" aria-hidden />
              <p className="line-clamp-2 italic">{denuncia.descricao}</p>
            </div>
          </div>
        </div>

        {podeAnalisar && (
          <div className="flex self-end sm:self-center">
            <Button
              onClick={iniciarAnalise}
              disabled={loadingInicio}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {statusAtual === 'ABERTA'
                ? loadingInicio
                  ? 'Iniciando...'
                  : 'Iniciar Análise'
                : 'Continuar Análise'}
            </Button>
          </div>
        )}
      </article>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Início</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja iniciar esta denúncia? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmarInicio} disabled={loadingInicio}>
              {loadingInicio ? 'Iniciando...' : 'Iniciar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DenunciaAnaliseModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        denuncia={denunciaParaModal}
        onFinalizado={handleFinalizado}
      />
    </>
  );
}
