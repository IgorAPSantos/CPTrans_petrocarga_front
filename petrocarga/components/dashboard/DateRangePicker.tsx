'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  onDateChange: (startDate: string, endDate: string) => void;
  defaultStartDate?: Date;
  defaultEndDate?: Date;
}

export function DateRangePicker({
  onDateChange,
  defaultStartDate = new Date(),
  defaultEndDate = new Date(),
}: DateRangePickerProps) {
  const [dateFrom, setDateFrom] = useState<Date>(defaultStartDate);
  const [dateTo, setDateTo] = useState<Date>(defaultEndDate);

  const handleDateChangeCallback = useCallback(() => {
    if (dateFrom && dateTo) {
      const startDate = dateFrom.toISOString();
      const endDate = dateTo.toISOString();
      onDateChange(startDate, endDate);
    }
  }, [dateFrom, dateTo, onDateChange]);

  useEffect(() => {
    handleDateChangeCallback();
  }, [handleDateChangeCallback]);

  const handleToday = () => {
    const today = new Date();
    setDateFrom(today);
    setDateTo(today);
  };

  const handleYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setDateFrom(yesterday);
    setDateTo(yesterday);
  };

  const handleLast7Days = () => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    setDateFrom(lastWeek);
    setDateTo(today);
  };

  return (
    <div className="space-y-3">
      {/* Botões rápidos responsivos */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToday}
          className="text-xs flex-1 min-w-[80px]"
        >
          Hoje
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleYesterday}
          className="text-xs flex-1 min-w-[80px]"
        >
          Ontem
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLast7Days}
          className="text-xs flex-1 min-w-[80px]"
        >
          Últimos 7 dias
        </Button>
      </div>

      {/* Seletor de datas responsivo */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full sm:flex-1 justify-start text-left font-normal',
                !dateFrom && 'text-muted-foreground',
              )}
              size="sm"
            >
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {dateFrom
                  ? format(dateFrom, 'dd/MM/yyyy', { locale: ptBR })
                  : 'Data inicial'}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={(day) => day && setDateFrom(day)}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>

        <div className="hidden sm:flex items-center justify-center text-gray-500">
          até
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full sm:flex-1 justify-start text-left font-normal',
                !dateTo && 'text-muted-foreground',
              )}
              size="sm"
            >
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {dateTo
                  ? format(dateTo, 'dd/MM/yyyy', { locale: ptBR })
                  : 'Data final'}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={(day) => day && setDateTo(day)}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Indicador "até" para mobile */}
      <div className="sm:hidden text-center text-xs text-gray-500">até</div>
    </div>
  );
}
