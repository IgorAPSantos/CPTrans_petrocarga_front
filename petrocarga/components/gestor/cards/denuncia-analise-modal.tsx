'use client';

import { Denuncia } from '@/lib/types/denuncias';
import { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Send,
  MapPin,
  User,
  Phone,
  CarFront,
  AlignLeft,
  ChevronDown,
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
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isOpen) return null;

  const limite = 300;
  const isFormIncompleto = !resultado || !resposta.trim();

  const handleSubmit = async () => {
    if (isFormIncompleto) return;
    const response = await finalizarAnaliseDenuncia(denuncia.id, {
      status: resultado,
      resposta,
    });
    if (response?.success) {
      onFinalizado(resultado as 'PROCEDENTE' | 'IMPROCEDENTE');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-slate-50 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[92vh] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header Moderno */}
        <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">
              Análise Técnica
            </h2>
            <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block uppercase">
              Protocolo: {denuncia.id.slice(0, 8)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Seção de Informações: Colapsável para salvar espaço no teclado */}
          <div className="space-y-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between px-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Dados da Ocorrência
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform',
                  !isExpanded && '-rotate-90',
                )}
              />
            </button>

            {isExpanded && (
              <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                {/* 1. Localização */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Localização
                    </p>
                    <p className="text-sm font-semibold text-slate-700 leading-snug">
                      {denuncia.enderecoVaga.logradouro},{' '}
                      {denuncia.numeroEndereco}
                    </p>
                  </div>
                </div>

                {/* 2. Motorista */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Motorista
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {denuncia.nomeMotorista}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-slate-500">
                      <Phone className="w-3 h-3" />
                      <span className="text-xs">
                        {denuncia.telefoneMotorista}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Veículo */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <CarFront className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Veículo
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {denuncia.marcaVeiculo} {denuncia.modeloVeiculo}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-800 text-white text-[10px] font-bold rounded shadow-sm tracking-widest">
                      {denuncia.placaVeiculo}
                    </span>
                  </div>
                </div>

                {/* 4. Descrição */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <AlignLeft className="w-3 h-3" /> Descrição do Relato
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed break-words italic">
                    {denuncia.descricao}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-200 mx-2" />

          {/* ÁREA DE ENTRADA (Onde o foco acontece) */}
          <div className="space-y-6 pb-6">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-2">
                Parecer Final
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setResultado('PROCEDENTE')}
                  className={cn(
                    'group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95',
                    resultado === 'PROCEDENTE'
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'border-white bg-white text-slate-400',
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
                  <span
                    className={cn(
                      'text-xs font-bold',
                      resultado === 'PROCEDENTE'
                        ? 'text-emerald-700'
                        : 'text-slate-500',
                    )}
                  >
                    Procedente
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setResultado('IMPROCEDENTE')}
                  className={cn(
                    'group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95',
                    resultado === 'IMPROCEDENTE'
                      ? 'border-rose-500 bg-rose-50 shadow-md'
                      : 'border-white bg-white text-slate-400',
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
                  <span
                    className={cn(
                      'text-xs font-bold',
                      resultado === 'IMPROCEDENTE'
                        ? 'text-rose-700'
                        : 'text-slate-500',
                    )}
                  >
                    Improcedente
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-2 focus-within:translate-y-[-120px] sm:focus-within:translate-y-0 transition-transform duration-300">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Resposta Justificada
                </label>
                <span
                  className={cn(
                    'text-[10px] font-mono px-2 py-0.5 rounded-full',
                    resposta.length >= limite
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-slate-200 text-slate-500',
                  )}
                >
                  {resposta.length}/{limite}
                </span>
              </div>
              <textarea
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                onFocus={() => setIsExpanded(false)} // Fecha os detalhes ao focar no texto para subir o campo
                maxLength={limite}
                rows={4}
                placeholder="Informe ao cidadão o motivo da decisão..."
                className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Rodapé fixo com Botão de Ação */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <button
            onClick={handleSubmit}
            disabled={isFormIncompleto}
            className={cn(
              'w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-extrabold text-sm transition-all shadow-lg',
              isFormIncompleto
                ? 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-blue-200',
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
