'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/components/hooks/useAuth';
import { RelatorioSumario, RelatorioKpis } from '@/lib/api/dashboardApi';
import { DashboardSummary, DashboardKPIs } from '@/lib/types/dashboard';
import { KPICard } from '@/components/dashboard/KPICard';
import { VehicleTypesChart } from '@/components/dashboard/VehicleTypesChart';
import { LocationStats } from '@/components/dashboard/LocationStats';
import { DateRangePicker } from '@/components/dashboard/DateRangePicker';
import {
  Loader2,
  BarChart3,
  ParkingSquare,
  CheckCircle,
  XCircle,
  Car,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  AlertCircle,
  RefreshCw,
  Menu,
  Clock,
  Trash2,
  DoorOpen,
} from 'lucide-react'; // NOVOS ÍCONES
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function RelatoriosPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(
    null,
  );
  const [kpisData, setKpisData] = useState<DashboardKPIs | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isFetching = useRef(false);

  const fetchDashboardData = useCallback(
    async (forceRefresh = false) => {
      if (isFetching.current && !forceRefresh) return;
      if (!user?.id) return;

      isFetching.current = true;
      setLoading(true);
      setError(null);

      try {
        console.log('Buscando dados do dashboard com filtros:', {
          startDate,
          endDate,
        });

        const [summaryResult, kpisResult] = await Promise.allSettled([
          RelatorioSumario(startDate || undefined, endDate || undefined),
          RelatorioKpis(startDate || undefined, endDate || undefined),
        ]);

        if (summaryResult.status === 'fulfilled') {
          const data = summaryResult.value;
          setDashboardData(data);
          console.log('Dashboard summary carregado:', data);
        } else {
          console.error('Erro ao carregar summary:', summaryResult.reason);
          setError('Erro ao carregar resumo do dashboard');
        }

        if (kpisResult.status === 'fulfilled') {
          const data = kpisResult.value;
          setKpisData(data);
          console.log('Dashboard KPIs carregado:', data);
        } else {
          console.error('Erro ao carregar KPIs:', kpisResult.reason);
          setError((prev) =>
            prev
              ? `${prev}; Erro ao carregar KPIs`
              : 'Erro ao carregar KPIs do dashboard',
          );
        }

        if (
          summaryResult.status === 'rejected' &&
          kpisResult.status === 'rejected'
        ) {
          setError(
            'Não foi possível carregar os dados do dashboard. Verifique se o serviço está disponível.',
          );
        }
      } catch (err) {
        console.error('Erro inesperado ao carregar dados do dashboard:', err);
        setError('Erro interno ao processar os dados');
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    },
    [user?.id, startDate, endDate],
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  if (loading && !dashboardData && !kpisData) {
    return (
      <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[60vh] md:min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 md:w-12 md:h-12 text-blue-600 mb-4" />
        <p className="text-gray-600 text-sm md:text-base">
          Carregando dados do dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Responsivo */}
      <div className="mb-4 md:mb-6 lg:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center justify-between md:justify-start gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                <div className="py-6">
                  <h2 className="text-lg font-semibold mb-4">Filtros</h2>
                  <DateRangePicker onDateChange={handleDateChange} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2 md:gap-3">
              <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-blue-600 flex-shrink-0" />
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                  Relatórios e Dashboard
                </h1>
                <p className="text-gray-600 text-sm md:text-base hidden md:block">
                  Visualize métricas e estatísticas do sistema
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm md:hidden mt-2">
            Visualize métricas e estatísticas do sistema
          </p>

          <div className="flex items-center gap-2 md:gap-3 mt-3 md:mt-0">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2 w-full md:w-auto"
              disabled={loading}
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
              )}
              <span className="hidden sm:inline">
                {loading ? 'Atualizando...' : 'Atualizar'}
              </span>
              <span className="sm:hidden">Atualizar</span>
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Card className="mb-4 md:mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
              </div>
              <div className="text-center">
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                  Serviço Indisponível
                </h3>
                <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 break-words">
                  {error}
                </p>
                <Button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 w-full md:w-auto"
                  size="sm"
                >
                  <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
                  Tentar Novamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!error && (dashboardData || kpisData) ? (
        <>
          <Card className="mb-4 md:mb-6 hidden md:block">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <DateRangePicker onDateChange={handleDateChange} />
              {startDate && endDate && (
                <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
                  Mostrando dados de{' '}
                  {new Date(startDate.split('T')[0]).toLocaleDateString(
                    'pt-BR',
                  )}{' '}
                  até{' '}
                  {new Date(endDate.split('T')[0]).toLocaleDateString('pt-BR')}
                </p>
              )}
            </CardContent>
          </Card>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4 md:space-y-6"
          >
            <div className="overflow-x-auto pb-2 md:pb-0">
              <TabsList className="inline-flex h-10 w-full min-w-[300px] md:w-auto md:grid md:grid-cols-3 md:max-w-md">
                <TabsTrigger value="overview" className="flex-1 min-w-[100px]">
                  <span className="truncate">Visão Geral</span>
                </TabsTrigger>
                <TabsTrigger value="vehicles" className="flex-1 min-w-[100px]">
                  <span className="truncate">Veículos</span>
                </TabsTrigger>
                <TabsTrigger value="locations" className="flex-1 min-w-[100px]">
                  <span className="truncate">Localizações</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab - ATUALIZADO COM NOVOS KPIs */}
            <TabsContent value="overview" className="space-y-4 md:space-y-6">
              {kpisData && (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <KPICard
                    title="Total de Vagas"
                    value={kpisData.totalSlots}
                    icon={ParkingSquare}
                    description="Vagas disponíveis"
                  />
                  <KPICard
                    title="Taxa de Ocupação"
                    value={`${kpisData.occupancyRate}%`}
                    icon={TrendingUp}
                    description="Uso das vagas"
                  />
                  <KPICard
                    title="Reservas Pendentes"
                    value={kpisData.pendingReservations} // NOVO KPI
                    icon={Clock}
                    description="Reservas aguardando"
                  />
                  <KPICard
                    title="Reservas Ativas"
                    value={kpisData.activeReservations}
                    icon={Users}
                    description="Reservas em andamento"
                  />
                  <KPICard
                    title="Reservas Concluídas"
                    value={kpisData.completedReservations}
                    icon={CheckCircle}
                    description="Reservas finalizadas"
                  />
                  <KPICard
                    title="Reservas Canceladas"
                    value={kpisData.canceledReservations}
                    icon={XCircle}
                    description="Reservas canceladas"
                  />
                  <KPICard
                    title="Reservas Removidas"
                    value={kpisData.removedReservations} // NOVO KPI
                    icon={Trash2}
                    description="Reservas removidas"
                  />
                  <KPICard
                    title="Reservas Totais"
                    value={kpisData.totalReservations}
                    icon={BarChart3}
                    description="Total de reservas"
                  />
                  <KPICard
                    title="Múltiplas Vagas"
                    value={kpisData.multipleSlotReservations}
                    icon={Car}
                    description="Reservas com +1 vaga"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {dashboardData?.vehicleTypes &&
                dashboardData.vehicleTypes.length > 0 ? (
                  <VehicleTypesChart data={dashboardData.vehicleTypes} />
                ) : (
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center h-full p-4 md:p-6 min-h-[300px]">
                      <Car className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mb-2 md:mb-3" />
                      <p className="text-gray-600 text-center text-sm md:text-base">
                        Nenhum dado de tipos de veículo disponível
                      </p>
                    </CardContent>
                  </Card>
                )}

                {dashboardData?.districts &&
                dashboardData.districts.length > 0 ? (
                  <LocationStats
                    title="Bairros com Mais Reservas"
                    data={dashboardData.districts}
                    icon="district"
                  />
                ) : (
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center h-full p-4 md:p-6 min-h-[300px]">
                      <MapPin className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mb-2 md:mb-3" />
                      <p className="text-gray-600 text-center text-sm md:text-base">
                        Nenhum dado de bairros disponível
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Vehicles Tab - MANTIDO IGUAL */}
            <TabsContent value="vehicles" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {dashboardData?.vehicleTypes &&
                dashboardData.vehicleTypes.length > 0 ? (
                  <>
                    <VehicleTypesChart data={dashboardData.vehicleTypes} />
                    <Card>
                      <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-base md:text-lg">
                          Detalhes por Tipo de Veículo
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 pt-0">
                        <div className="space-y-3 md:space-y-4">
                          {dashboardData.vehicleTypes.map((vehicle) => (
                            <div
                              key={vehicle.type}
                              className="p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-sm md:text-lg truncate mr-2">
                                  {vehicle.type}
                                </h3>
                                <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                                  {vehicle.count} reservas
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs md:text-sm text-gray-600">
                                    Veículos únicos:
                                  </p>
                                  <p className="text-lg md:text-2xl font-bold text-blue-600">
                                    {vehicle.uniqueVehicles}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs md:text-sm text-gray-600">
                                    Média por veículo:
                                  </p>
                                  <p className="text-lg md:text-2xl font-bold text-green-600">
                                    {vehicle.uniqueVehicles > 0
                                      ? (
                                          vehicle.count / vehicle.uniqueVehicles
                                        ).toFixed(1)
                                      : 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="col-span-2">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6 md:p-12 min-h-[300px]">
                        <Car className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mb-3 md:mb-4" />
                        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2 text-center">
                          Nenhum dado de veículos
                        </h3>
                        <p className="text-gray-600 text-center text-sm md:text-base">
                          Não há dados de tipos de veículos disponíveis
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Locations Tab - ATUALIZADO COM ENTRY ORIGINS */}
            <TabsContent value="locations" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {dashboardData?.districts &&
                dashboardData.districts.length > 0 ? (
                  <LocationStats
                    title="Bairros"
                    data={dashboardData.districts}
                    icon="district"
                  />
                ) : (
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center h-full p-4 md:p-6 min-h-[300px]">
                      <MapPin className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mb-2 md:mb-3" />
                      <p className="text-gray-600 text-center text-sm md:text-base">
                        Nenhum dado de bairros disponível
                      </p>
                    </CardContent>
                  </Card>
                )}

                {dashboardData?.origins && dashboardData.origins.length > 0 ? (
                  <LocationStats
                    title="Cidades de Origem"
                    data={dashboardData.origins}
                    icon="origin"
                  />
                ) : (
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center h-full p-4 md:p-6 min-h-[300px]">
                      <MapPin className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mb-2 md:mb-3" />
                      <p className="text-gray-600 text-center text-sm md:text-base">
                        Nenhum dado de cidades de origem disponível
                      </p>
                    </CardContent>
                  </Card>
                )}

                {dashboardData?.entryOrigins &&
                dashboardData.entryOrigins.length > 0 ? (
                  <LocationStats
                    title="Cidades de Entrada"
                    data={dashboardData.entryOrigins}
                    icon="entry-origin"
                  />
                ) : (
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center h-full p-4 md:p-6 min-h-[300px]">
                      <DoorOpen className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mb-2 md:mb-3" />
                      <p className="text-gray-600 text-center text-sm md:text-base">
                        Nenhum dado de cidades de entrada disponível
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {(dashboardData?.districts ||
                dashboardData?.origins ||
                dashboardData?.entryOrigins) && (
                <Card>
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                      Insights de Localização
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="space-y-3 md:space-y-4">
                      {dashboardData?.districts?.[0] && (
                        <div className="p-3 md:p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2 text-sm md:text-base">
                            Localização Mais Popular
                          </h4>
                          <p className="text-blue-700 text-sm md:text-base">
                            <span className="font-semibold">
                              {dashboardData.districts[0].name}
                            </span>{' '}
                            é o bairro com mais reservas (
                            {dashboardData.districts[0].reservationCount})
                          </p>
                        </div>
                      )}

                      {dashboardData?.origins?.[0] && (
                        <div className="p-3 md:p-4 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2 text-sm md:text-base">
                            Origem Principal
                          </h4>
                          <p className="text-green-700 text-sm md:text-base">
                            <span className="font-semibold">
                              {dashboardData.origins[0].name}
                            </span>{' '}
                            é a cidade de origem mais comum (
                            {dashboardData.origins[0].reservationCount}{' '}
                            reservas)
                          </p>
                        </div>
                      )}

                      {dashboardData?.entryOrigins?.[0] && (
                        <div className="p-3 md:p-4 bg-purple-50 rounded-lg">
                          <h4 className="font-medium text-purple-900 mb-2 text-sm md:text-base">
                            Entrada Principal
                          </h4>
                          <p className="text-purple-700 text-sm md:text-base">
                            <span className="font-semibold">
                              {dashboardData.entryOrigins[0].name}
                            </span>{' '}
                            é a cidade de entrada mais comum (
                            {dashboardData.entryOrigins[0].reservationCount}{' '}
                            reservas)
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {kpisData && (
            <Card className="mt-4 md:mt-6">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">
                  Resumo do Período
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600">
                      Período analisado
                    </p>
                    <p className="font-semibold text-sm md:text-base truncate">
                      {kpisData.startDate
                        ? new Date(kpisData.startDate).toLocaleDateString(
                            'pt-BR',
                          )
                        : 'Data inicial'}{' '}
                      -{' '}
                      {kpisData.endDate
                        ? new Date(kpisData.endDate).toLocaleDateString('pt-BR')
                        : 'Data final'}
                    </p>
                  </div>

                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600">
                      Reservas por vaga
                    </p>
                    <p className="font-semibold text-sm md:text-base">
                      {kpisData.totalSlots
                        ? (
                            kpisData.totalReservations / kpisData.totalSlots
                          ).toFixed(1)
                        : 0}{' '}
                      reservas/vaga
                    </p>
                  </div>

                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600">
                      Taxa de cancelamento
                    </p>
                    <p className="font-semibold text-sm md:text-base">
                      {kpisData.totalReservations
                        ? (
                            (kpisData.canceledReservations /
                              kpisData.totalReservations) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>

                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600">
                      Taxa de conclusão
                    </p>
                    <p className="font-semibold text-sm md:text-base">
                      {kpisData.totalReservations
                        ? (
                            (kpisData.completedReservations /
                              kpisData.totalReservations) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : !error && !loading ? (
        <Card className="mb-4 md:mb-6">
          <CardContent className="p-6 md:p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
              <BarChart3 className="h-12 w-12 md:h-16 md:w-16 text-gray-400" />
              <div>
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                  Nenhum dado disponível
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Não há dados para exibir no momento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
