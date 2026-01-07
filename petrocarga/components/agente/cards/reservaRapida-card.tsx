'use client';

import { ReservaState } from '@/lib/types/reservaState';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Truck } from 'lucide-react';

interface ReservaRapidaCardProps {
  reserva: ReservaState;
}

export default function ReservaRapidaCard({ reserva }: ReservaRapidaCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col sm:flex-row justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4 w-full',
        'border-green-500'
      )}
    >
      {/* Informações */}
      <section className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Placa do Motorista */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {reserva.placaAgente}
          </h3>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            Placa
          </span>
        </div>

        {/* Informaçôes Adicionais */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
          <span className="text-sm text-gray-600">
            <Truck className="w-4 h-4 text-gray-400" />
            Tipo Veículo: {reserva.tipoVeiculoAgente}
          </span>

          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
            {reserva.startHour} - {reserva.endHour}
          </span>

          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            {reserva.selectedDay?.getDate()}
          </span>
        </div>
      </section>
    </article>
  );
}
