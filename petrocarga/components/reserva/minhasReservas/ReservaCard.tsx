'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  FileText,
  MapPin,
  Clock,
  Trash2,
  Pencil,
  Check,
  CheckCheck,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { ReservaGet } from '@/lib/types/reserva';
import ReservaEditarModal from './ReservaEditarModal/ReservaEditarModal';
import ReservaCheckinModal from './ReservaCheckinModal/ReservaCheckinModal';

interface ReservaCardProps {
  reserva: ReservaGet;
  onGerarDocumento?: (reservaId: string) => void;
  onExcluir?: (reservaId: string) => void;
  onCheckout?: (reserva: ReservaGet) => void;
}

export default function ReservaCard({
  reserva: reservaInicial, // Renomeado para diferenciar do estado
  onGerarDocumento,
  onExcluir,
  onCheckout,
}: ReservaCardProps) {
  // 1. Estado local para atualização instantânea (Optimistic UI)
  const [currentReserva, setCurrentReserva] =
    useState<ReservaGet>(reservaInicial);

  const [modalAberto, setModalAberto] = useState(false);
  const [modalAbertoCheckout, setModalAbertoCheckout] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalCheckinAberto, setModalCheckinAberto] = useState(false);
  const [agora, setAgora] = useState(new Date());

  // Atualizar o EDITAR e o CHECKIN

  useEffect(() => {
    const interval = setInterval(() => {
      setAgora(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  const inicioReserva = new Date(currentReserva.inicio);
  const fimReserva = new Date(currentReserva.fim);

  const minutosParaInicio =
    (inicioReserva.getTime() - agora.getTime()) / 1000 / 60;

  const podeEditar =
    currentReserva.status === 'RESERVADA' && minutosParaInicio > 30;

  const podeFazerCheckin =
    currentReserva.status === 'RESERVADA' &&
    agora >= new Date(inicioReserva.getTime() - 5 * 60 * 1000) &&
    agora <= fimReserva;

  const podeFazerCheckout =
    currentReserva.status === 'ATIVA' && agora < fimReserva;

  // Sincroniza se a lista pai atualizar
  useEffect(() => {
    setCurrentReserva(reservaInicial);
  }, [reservaInicial]);

  const formatarData = (data: string) =>
    new Date(data).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

  const handleExcluir = () => {
    onExcluir?.(currentReserva.id);
    setModalAberto(false);
  };

  // 2. Callback que o Modal chama quando salva com sucesso
  const handleUpdateSuccess = (updated: ReservaGet) => {
    setCurrentReserva(updated); // Atualiza o card na hora
    setModalEditarAberto(false); // Fecha o modal
  };

  return (
    <article
      className={cn(
        'flex flex-col bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4 w-full',
        'sm:flex-row sm:justify-between',
        'max-sm:gap-3 max-sm:p-3',
        // Usa currentReserva para refletir a cor nova se mudar status
        currentReserva.status === 'ATIVA' && 'border-green-900',
        currentReserva.status === 'CONCLUIDA' && 'border-b-blue-300',
        currentReserva.status === 'RESERVADA' && 'border-green-500',
        currentReserva.status === 'REMOVIDA' && 'border-red-500',
        currentReserva.status === 'CANCELADA' && 'border-b-blue-200',
      )}
    >
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate leading-tight">
            {`${currentReserva.logradouro} - ${currentReserva.bairro}` ||
              'Local não informado'}
          </h3>

          {/* Status (desktop) */}
          <span
            className={cn(
              'hidden sm:inline-block px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm',
              currentReserva.status === 'ATIVA' &&
                'bg-green-100 text-green-900',
              currentReserva.status === 'CONCLUIDA' &&
                'bg-gray-100 border-b-blue-300',
              currentReserva.status === 'RESERVADA' &&
                'bg-green-100 border-green-500',
              currentReserva.status === 'REMOVIDA' &&
                'bg-gray-100 border-red-500',
              currentReserva.status === 'CANCELADA' &&
                'bg-gray-100 border-b-blue-200',
            )}
          >
            {currentReserva.status}
          </span>
        </div>

        {/* Cidade de origem */}
        <p className="text-sm sm:text-base text-gray-500 flex items-center gap-1 truncate leading-tight">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
          {`Local de Origem: ${currentReserva.cidadeOrigem}`}
        </p>

        {/* Informações adicionais */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600">
          <span className="flex items-center gap-1 truncate">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            Início: {formatarData(currentReserva.inicio)}
          </span>
          <span className="flex items-center gap-1 truncate">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            Fim: {formatarData(currentReserva.fim)}
          </span>
        </div>
      </div>

      {/* Container botão + status mobile */}
      <div className="flex flex-col items-stretch sm:items-end gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
        {/* Status (mobile) */}
        <span
          className={cn(
            'sm:hidden px-3 py-1 rounded-full text-xs font-semibold shadow-sm text-center',
            currentReserva.status === 'ATIVA' && 'bg-green-100 text-green-900',
            currentReserva.status === 'CONCLUIDA' && 'bg-gray-100 text-red-800',
          )}
        >
          {currentReserva.status}
        </span>

        {/* Botão Gerar Documento */}
        <button
          onClick={() => onGerarDocumento?.(currentReserva.id)}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'text-sm w-full sm:w-auto text-center flex items-center justify-center gap-2 py-2',
          )}
        >
          <FileText className="w-4 h-4" />
          Gerar Documento
        </button>

        {/* Botões Editar / Excluir / Check-in */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2 w-full sm:w-auto">
          {/* EXCLUIR (continua sempre disponível enquanto RESERVADA) */}
          {currentReserva.status === 'RESERVADA' && (
            <button
              onClick={() => setModalAberto(true)}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'text-sm w-full sm:w-auto text-center flex items-center justify-center gap-2 py-2 text-red-600',
              )}
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          )}

          {/* EDITAR */}
          {podeEditar && (
            <button
              onClick={() => setModalEditarAberto(true)}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'text-sm w-full sm:w-auto text-center flex items-center justify-center gap-2 py-2',
              )}
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
          )}

          {/* CHECK-IN */}
          {podeFazerCheckin && (
            <button
              onClick={() => setModalCheckinAberto(true)}
              className={cn(
                buttonVariants({ variant: 'default' }),
                'text-sm w-full sm:w-auto text-center flex items-center justify-center gap-2 py-2 bg-green-600  hover:bg-green-700 transition disabled:opacity-60',
              )}
            >
              <Check className="w-4 h-4" />
              Check-in
            </button>
          )}

          {/* CHECK-OUT */}
          {podeFazerCheckout && (
            <button
              onClick={() => setModalAbertoCheckout(true)}
              className={cn(
                buttonVariants({ variant: 'default' }),
                'text-sm w-full sm:w-auto text-center flex items-center justify-center gap-2 py-2  bg-red-600  hover:bg-red-700 transition disabled:opacity-60',
              )}
            >
              <CheckCheck className="w-4 h-4" />
              Checkout
            </button>
          )}
        </div>
      </div>

      {/* Modal de Exclusão */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalAberto(false)}
          />

          <div className="relative bg-white rounded-2xl p-6 w-96 max-w-full shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
              Confirmar exclusão
            </h3>

            <p className="text-gray-600 mb-6 text-center">
              Tem certeza que deseja excluir esta Reserva? Esta ação não pode
              ser desfeita.
            </p>

            <div className="flex justify-center gap-3 w-full">
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleExcluir}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Checkout */}
      {modalAbertoCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalAbertoCheckout(false)}
          />

          <div className="relative bg-white rounded-2xl p-6 w-96 max-w-full shadow-2xl flex flex-col items-center">
            {/* Título Centralizado */}
            <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
              Confirmar Checkout
            </h3>

            {/* Texto Centralizado */}
            <p className="text-gray-600 mb-6 text-center">
              Tem certeza que deseja fazer Checkout? Esta ação não pode ser
              desfeita.
            </p>

            {/* Botões Centralizados */}
            <div className="flex justify-center gap-3 w-full">
              <button
                onClick={() => setModalAbertoCheckout(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  onCheckout?.(currentReserva);
                  setModalAbertoCheckout(false);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {modalEditarAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-0">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalEditarAberto(false)}
          />

          {/* Container do Modal */}
          <div
            className="
        relative
        bg-white
        rounded-2xl
        overflow-hidden
        animate-in
        fade-in
        zoom-in-95
        duration-200
        w-full
        sm:w-[600px]
        max-h-[90vh]
        flex
        flex-col
      "
          >
            {/* Conteúdo */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6">
              <ReservaEditarModal
                reserva={currentReserva}
                onClose={() => setModalEditarAberto(false)}
                onSuccess={handleUpdateSuccess}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Checkin */}

      {modalCheckinAberto && (
        <ReservaCheckinModal
          reserva={currentReserva}
          onClose={() => setModalCheckinAberto(false)}
          onCheckinSuccess={(reservaAtualizada) =>
            setCurrentReserva(reservaAtualizada)
          }
          onDenunciar={(id) => console.log('Denúncia da reserva', id)}
        />
      )}
    </article>
  );
}
