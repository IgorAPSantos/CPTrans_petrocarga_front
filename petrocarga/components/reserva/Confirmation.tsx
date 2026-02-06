'use client';

import { useTransition } from 'react';

interface ConfirmationProps {
  day: Date;
  startHour: string;
  endHour: string;
  origin?: string;
  entryCity?: string | null;
  destination?: string;
  vehicleName?: string;
  onConfirm: () => Promise<void> | void;
  onReset?: () => void;
}

export default function Confirmation({
  day,
  startHour,
  endHour,
  origin,
  destination,
  vehicleName,
  onConfirm,
  onReset,
}: ConfirmationProps) {
  // useTransition é perfeito para isso!
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    // Envolve a ação em startTransition
    startTransition(async () => {
      await onConfirm();
    });
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2">Resumo da Reserva</h3>
      <p>
        <strong>Data:</strong> {day.toLocaleDateString()}
      </p>
      <p>
        <strong>Horário:</strong> {startHour} - {endHour}
      </p>
      {origin && (
        <p>
          <strong>Endereço de Entrada:</strong> {origin}
        </p>
      )}
      {destination && (
        <p>
          <strong>Endereço da Vaga:</strong> {destination}
        </p>
      )}
      {vehicleName && (
        <p>
          <strong>Veículo:</strong> {vehicleName}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px] transition-all"
          onClick={handleConfirm}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2 align-middle"></div>
              Confirmando...
            </>
          ) : (
            'Confirmar'
          )}
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
          onClick={onReset}
          disabled={isPending}
        >
          Reiniciar
        </button>
      </div>

      {isPending && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          Processando sua reserva...
        </p>
      )}
    </div>
  );
}
