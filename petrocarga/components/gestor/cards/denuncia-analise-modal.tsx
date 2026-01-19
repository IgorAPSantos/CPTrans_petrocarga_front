'use client';

import { Denuncia } from '@/lib/types/denuncias';
import { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Send,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { finalizarAnaliseDenuncia } from '@/lib/api/denunciaApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  denuncia: Denuncia;
  onFinalizado: (status: 'PROCEDENTE' | 'IMPROCEDENTE') => void;
}

export function DenunciaAnaliseModal({
  isOpen,
  onClose,
  denuncia,
  onFinalizado,
}: Props) {
  const [resultado, setResultado] = useState<
    'PROCEDENTE' | 'IMPROCEDENTE' | ''
  >('');
  const [resposta, setResposta] = useState('');

  if (!isOpen) return null;

  const limite = 300;
  const isFormIncompleto = !resultado || !resposta.trim();

  const handleSubmit = async () => {
    if (isFormIncompleto) return;

    const payload = {
      status: resultado,
      resposta,
    };

    const response = await finalizarAnaliseDenuncia(denuncia.id, payload);

    if (response?.success) {
      onFinalizado(resultado);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Analisar Denúncia
            </h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Protocolo #{denuncia.id.slice(0, 8)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Resumo da Denúncia (Compacto) */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
              <span>
                {denuncia.enderecoVaga.logradouro}, {denuncia.numeroEndereco}
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <AlertCircle className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
              <p className="italic line-clamp-2">{denuncia.descricao}</p>
            </div>
          </div>

          {/* Seleção de Resultado (Cards em vez de Radios) */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">
              Resultado do Parecer
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setResultado('PROCEDENTE')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  resultado === 'PROCEDENTE'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200',
                )}
              >
                <CheckCircle2
                  className={cn(
                    'w-6 h-6',
                    resultado === 'PROCEDENTE'
                      ? 'text-emerald-600'
                      : 'text-slate-300',
                  )}
                />
                <span className="font-semibold text-sm">Procedente</span>
              </button>

              <button
                type="button"
                onClick={() => setResultado('IMPROCEDENTE')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  resultado === 'IMPROCEDENTE'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200',
                )}
              >
                <XCircle
                  className={cn(
                    'w-6 h-6',
                    resultado === 'IMPROCEDENTE'
                      ? 'text-rose-600'
                      : 'text-slate-300',
                  )}
                />
                <span className="font-semibold text-sm">Improcedente</span>
              </button>
            </div>
          </div>

          {/* Campo de Resposta */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-slate-700">
                Resposta Justificada
              </label>
              <span
                className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full',
                  resposta.length >= limite
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-slate-100 text-slate-500',
                )}
              >
                {resposta.length} / {limite}
              </span>
            </div>

            <textarea
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              maxLength={limite}
              rows={4}
              placeholder="Descreva o motivo da sua decisão para o cidadão..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Voltar
          </button>

          <button
            onClick={handleSubmit}
            disabled={isFormIncompleto}
            className={cn(
              'flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm',
              isFormIncompleto
                ? 'bg-slate-300 text-slate-100 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]',
            )}
          >
            <Send className="w-4 h-4" />
            Finalizar Análise
          </button>
        </div>
      </div>
    </div>
  );
}
