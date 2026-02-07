'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VehicleRouteReport } from '@/lib/types/dashboard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronRight,
  Car,
  MapPin,
  Calendar,
  Clock,
  Navigation,
  FileText,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VehicleRoutesTableProps {
  routes?: VehicleRouteReport[];
}

export function VehicleRoutesTable({ routes = [] }: VehicleRoutesTableProps) {
  const [expandedPlates, setExpandedPlates] = useState<Set<string>>(new Set());

  const togglePlate = (placa: string) => {
    const newExpanded = new Set(expandedPlates);
    if (newExpanded.has(placa)) {
      newExpanded.delete(placa);
    } else {
      newExpanded.add(placa);
    }
    setExpandedPlates(newExpanded);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('pt-BR') +
      ' ' +
      date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} min`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  if (routes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 min-h-[200px]">
          <Navigation className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma rota disponível
          </h3>
          <p className="text-gray-600 text-center">
            Não há dados de trajetos de veículos no período selecionado
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Trajetos dos Veículos
          <Badge variant="outline" className="ml-2">
            {routes.length} veículos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="min-w-[120px]">Placa</TableHead>
                <TableHead className="min-w-[150px]">Período</TableHead>
                <TableHead className="min-w-[100px]">Paradas</TableHead>
                <TableHead className="min-w-[100px]">Tipo</TableHead>
                <TableHead className="min-w-[150px]">Vaga mais usada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <Collapsible
                  key={route.placa}
                  asChild
                  open={expandedPlates.has(route.placa)}
                >
                  <>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePlate(route.placa)}
                            className="h-8 w-8 p-0"
                          >
                            {expandedPlates.has(route.placa) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell className="font-mono font-bold">
                        {route.placa}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDateTime(route.periodStart)}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            até {formatDateTime(route.periodEnd)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {route.stops.length} parada(s)
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {route.stops.some((s) => s.source === 'RESERVA') && (
                            <Badge variant="secondary" className="text-xs">
                              Normal
                            </Badge>
                          )}
                          {route.stops.some(
                            (s) => s.source === 'RESERVA_RAPIDA',
                          ) && (
                            <Badge variant="outline" className="text-xs">
                              Rápida
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {route.stops[0]?.vagaLabel || 'N/A'}
                      </TableCell>
                    </TableRow>

                    {/* Detalhes expandidos */}
                    <CollapsibleContent asChild>
                      <TableRow className="bg-gray-50/50">
                        <TableCell colSpan={6} className="p-0">
                          <div className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Detalhes do Trajeto
                            </h4>

                            <div className="space-y-3 ml-8 relative">
                              {/* Linha vertical */}
                              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-300" />

                              {route.stops.map((stop, index) => (
                                <div key={index} className="relative">
                                  {/* Ponto na linha */}
                                  <div
                                    className={cn(
                                      'absolute left-3 w-2 h-2 rounded-full transform -translate-x-1',
                                      stop.source === 'RESERVA'
                                        ? 'bg-blue-500'
                                        : 'bg-orange-500',
                                    )}
                                  />

                                  <div className="ml-8 bg-white p-3 rounded-lg border shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant={
                                            stop.source === 'RESERVA'
                                              ? 'default'
                                              : 'outline'
                                          }
                                          className={cn(
                                            'text-xs',
                                            stop.source === 'RESERVA'
                                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                              : 'bg-orange-100 text-orange-800 hover:bg-orange-100',
                                          )}
                                        >
                                          {stop.source === 'RESERVA'
                                            ? 'Reserva Normal'
                                            : 'Reserva Rápida'}
                                        </Badge>
                                        <span className="font-medium">
                                          {stop.vagaLabel}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="h-3 w-3" />
                                        {formatDuration(stop.inicio, stop.fim)}
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <div className="flex items-center gap-1 mb-1">
                                          <Calendar className="h-3 w-3 text-gray-500" />
                                          <span className="font-medium">
                                            Início:
                                          </span>
                                        </div>
                                        <p className="text-gray-700">
                                          {formatDateTime(stop.inicio)}
                                        </p>
                                      </div>

                                      <div>
                                        <div className="flex items-center gap-1 mb-1">
                                          <Calendar className="h-3 w-3 text-gray-500" />
                                          <span className="font-medium">
                                            Término:
                                          </span>
                                        </div>
                                        <p className="text-gray-700">
                                          {formatDateTime(stop.fim)}
                                        </p>
                                      </div>

                                      {stop.cidadeOrigem && (
                                        <div>
                                          <div className="flex items-center gap-1 mb-1">
                                            <MapPin className="h-3 w-3 text-gray-500" />
                                            <span className="font-medium">
                                              Origem:
                                            </span>
                                          </div>
                                          <p className="text-gray-700">
                                            {stop.cidadeOrigem}
                                          </p>
                                        </div>
                                      )}

                                      {stop.entradaCidade && (
                                        <div>
                                          <div className="flex items-center gap-1 mb-1">
                                            <Car className="h-3 w-3 text-gray-500" />
                                            <span className="font-medium">
                                              Entrada:
                                            </span>
                                          </div>
                                          <p className="text-gray-700">
                                            {stop.entradaCidade}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
