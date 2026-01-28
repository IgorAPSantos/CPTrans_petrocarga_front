'use client';

import { ReservaRapida } from '@/lib/types/reservaRapida';
import { cn } from '@/lib/utils';
import { Calendar, Clock, MapPin, Truck } from 'lucide-react';

interface ReservaRapidaCardProps {
  reserva: ReservaRapida;
}

// Função para obter classes CSS baseadas no status
const getStatusClasses = (status: string) => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case 'reservada':
      return 'bg-green-100 text-green-700 border-green-500';
    case 'concluida':
      return 'bg-blue-100 text-blue-700 border-b-blue-300';
    case 'ativa':
      return 'bg-green-100 text-green-700 border-green-900';
    case 'removida':
      return 'bg-red-100 text-red-700 border-red-500';
    case 'cancelada':
      return 'bg-gray-100 text-gray-700 border-b-blue-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

// Função para obter cor da borda esquerda baseada no status
const getBorderColor = (status: string) => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case 'reservada':
      return 'border-green-500';
    case 'concluida':
      return 'border-blue-300';
    case 'ativa':
      return 'border-green-900';
    case 'removida':
      return 'border-red-500';
    case 'cancelada':
      return 'border-b-blue-200';
    default:
      return 'border-green-500';
  }
};

export default function ReservaRapidaCard({ reserva }: ReservaRapidaCardProps) {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <article
      className={cn(
        'flex flex-col sm:flex-row justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4 w-full',
        getBorderColor(reserva.status),
      )}
    >
      <section className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Placa */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {reserva.placa}
          </h3>
          <span
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-full border',
              getStatusClasses(reserva.status),
            )}
          >
            {reserva.status}
          </span>
        </div>

        {/* Informações */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Truck className="w-4 h-4 text-gray-400" />
            {reserva.tipoVeiculo}
          </span>

          <span className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            {reserva.logradouro}, {reserva.bairro}
          </span>

          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            {formatDate(reserva.inicio)}
          </span>

          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
            {formatTime(reserva.inicio)} - {formatTime(reserva.fim)}
          </span>
        </div>
      </section>
    </article>
  );
}
