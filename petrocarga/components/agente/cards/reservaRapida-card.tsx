'use client';

import { ReservaRapida } from '@/lib/types/reservaRapida';
import { cn } from '@/lib/utils';
import { Calendar, Clock, MapPin, Truck } from 'lucide-react';

interface ReservaRapidaCardProps {
  reserva: ReservaRapida;
}

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
        'border-green-500'
      )}
    >
      <section className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Placa */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {reserva.placa}
          </h3>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
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
