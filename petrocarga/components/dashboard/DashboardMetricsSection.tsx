'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  StayDurationStats,
  ActiveDuringPeriodStats,
  LengthOccupancyStats,
} from '@/lib/types/dashboard';
import { Clock, Users, Ruler, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

interface DashboardMetricsSectionProps {
  stayDurationStats?: StayDurationStats;
  activeDuringPeriodStats?: ActiveDuringPeriodStats;
  lengthOccupancyStats?: LengthOccupancyStats;
}

export function DashboardMetricsSection({
  stayDurationStats,
  activeDuringPeriodStats,
  lengthOccupancyStats,
}: DashboardMetricsSectionProps) {
  const formatMinutes = (minutes: number | null): string => {
    if (!minutes || minutes === null) return 'N/A';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const hasStayDurationData =
    stayDurationStats &&
    ((stayDurationStats.avgMinutes ?? 0) > 0 ||
      (stayDurationStats.minMinutes ?? 0) > 0 ||
      (stayDurationStats.maxMinutes ?? 0) > 0);

  const hasActivePeriodData =
    activeDuringPeriodStats && activeDuringPeriodStats.total > 0;

  const hasLengthOccupancyData =
    lengthOccupancyStats && lengthOccupancyStats.availableLengthMeters > 0;

  const stayDurationChartData = stayDurationStats
    ? [
        {
          name: 'Mínimo',
          value: stayDurationStats.minMinutes || 0,
          color: '#10b981',
        },
        {
          name: 'Médio',
          value: stayDurationStats.avgMinutes || 0,
          color: '#3b82f6',
        },
        {
          name: 'Máximo',
          value: stayDurationStats.maxMinutes || 0,
          color: '#f59e0b',
        },
      ].filter((item) => item.value > 0)
    : [];

  const activePeriodChartData = activeDuringPeriodStats
    ? [
        {
          name: 'Normais',
          value: activeDuringPeriodStats.reserva,
          color: '#3b82f6',
        },
        {
          name: 'Rápidas',
          value: activeDuringPeriodStats.reservaRapida,
          color: '#f59e0b',
        },
      ].filter((item) => item.value > 0)
    : [];

  const lengthOccupancyChartData = lengthOccupancyStats
    ? [
        {
          name: 'Ocupado',
          value: lengthOccupancyStats.occupiedLengthMeters,
          color: '#8b5cf6',
        },
        {
          name: 'Disponível',
          value: Math.max(
            0,
            lengthOccupancyStats.availableLengthMeters -
              lengthOccupancyStats.occupiedLengthMeters,
          ),
          color: '#d1d5db',
        },
      ].filter((item) => item.value > 0)
    : [];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Métricas Avançadas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {hasStayDurationData ? (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Tempo de Permanência
              </CardTitle>
              <span className="text-xs text-gray-500">Média</span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stayDurationChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value} min`, 'Tempo']} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                      {stayDurationChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatMinutes(stayDurationStats?.avgMinutes)}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Tempo médio por reserva
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="hover:shadow-lg transition-shadow opacity-50">
            <CardContent className="flex flex-col items-center justify-center h-full p-6 min-h-[200px]">
              <Clock className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500 text-center text-sm">
                Nenhum dado de tempo de permanência
              </p>
            </CardContent>
          </Card>
        )}

        {hasActivePeriodData ? (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                Reservas Ativas no Período
              </CardTitle>
              <span className="text-xs text-gray-500">Overlap</span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activePeriodChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [value, 'Reservas']} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                      {activePeriodChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {activeDuringPeriodStats?.total}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Reservas ativas em qualquer momento do período
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="hover:shadow-lg transition-shadow opacity-50">
            <CardContent className="flex flex-col items-center justify-center h-full p-6 min-h-[200px]">
              <Users className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500 text-center text-sm">
                Nenhum dado de reservas ativas
              </p>
            </CardContent>
          </Card>
        )}

        {hasLengthOccupancyData ? (
          <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Ruler className="h-4 w-4 text-purple-500" />
                Ocupação por Comprimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={lengthOccupancyChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      label
                    >
                      {lengthOccupancyChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} m`, 'Comprimento']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Taxa de ocupação:</span>
                  <span className="text-lg font-bold text-purple-600">
                    {lengthOccupancyStats?.occupancyRatePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1 opacity-50">
            <CardContent className="flex flex-col items-center justify-center h-full p-6 min-h-[200px]">
              <Ruler className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500 text-center text-sm">
                Nenhum dado de ocupação por comprimento
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
