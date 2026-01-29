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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export default function RelatoriosPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(
    null,
  );
  const [kpisData, setKpisData] = useState<DashboardKPIs | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados separados para datas
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [activeTab, setActiveTab] = useState('overview');

  // Ref para controlar requisições em andamento
  const isFetching = useRef(false);

  // ✅ useCallback com dependências simplificadas
  const fetchDashboardData = useCallback(
    async (forceRefresh = false) => {
      // Evita múltiplas requisições simultâneas
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

        // Faz as duas requisições separadamente
        const [summaryResult, kpisResult] = await Promise.allSettled([
          RelatorioSumario(startDate || undefined, endDate || undefined),
          RelatorioKpis(startDate || undefined, endDate || undefined),
        ]);

        // Processa resultado do summary
        if (summaryResult.status === 'fulfilled') {
          const data = summaryResult.value;
          setDashboardData(data);
          console.log('Dashboard summary carregado:', data);
        } else {
          console.error('Erro ao carregar summary:', summaryResult.reason);
          setError('Erro ao carregar resumo do dashboard');
        }

        // Processa resultado dos KPIs
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

        // Se ambos falharem, mostra erro geral
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
  ); // ✅ Apenas dependências essenciais

  // ✅ useEffect que dispara quando fetchDashboardData muda
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ✅ Handler que apenas atualiza os estados
  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    // O useEffect vai disparar automaticamente quando startDate/endDate mudarem
  };

  const handleRefresh = () => {
    fetchDashboardData(true); // forceRefresh = true
  };

  if (loading && !dashboardData && !kpisData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600 mb-4" />
        <p className="text-gray-600">Carregando dados do dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Relatórios e Dashboard
            </h1>
            <p className="text-gray-600">
              Visualize métricas e estatísticas do sistema
            </p>
          </div>

          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Atualizar Dados
          </Button>
        </div>
      </div>

      {/* Mensagem de erro - mostra quando há erro */}
      {error && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Serviço Indisponível
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button
                  onClick={handleRefresh}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tentar Novamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Só mostra o conteúdo se não houver erro e houver dados */}
      {!error && (dashboardData || kpisData) ? (
        <>
          {/* Filtros */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DateRangePicker onDateChange={handleDateChange} />
              {startDate && endDate && (
                <p className="text-sm text-gray-500 mt-4">
                  Mostrando dados de {startDate} até {endDate}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="vehicles">Veículos</TabsTrigger>
              <TabsTrigger value="locations">Localizações</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* KPIs Grid */}
              {kpisData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPICard
                    title="Total de Vagas"
                    value={kpisData.totalSlots}
                    icon={ParkingSquare}
                    description="Vagas disponíveis no sistema"
                  />
                  <KPICard
                    title="Taxa de Ocupação"
                    value={`${kpisData.occupancyRate}%`}
                    icon={TrendingUp}
                    description="Uso das vagas"
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
                    description="Total de reservas finalizadas"
                  />
                  <KPICard
                    title="Reservas Canceladas"
                    value={kpisData.canceledReservations}
                    icon={XCircle}
                    description="Reservas canceladas"
                  />
                  <KPICard
                    title="Reservas Totais"
                    value={kpisData.totalReservations}
                    icon={BarChart3}
                    description="Total de todas as reservas"
                  />
                  <KPICard
                    title="Múltiplas Vagas"
                    value={kpisData.multipleSlotReservations}
                    icon={Car}
                    description="Reservas com mais de uma vaga"
                  />
                </div>
              )}

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dashboardData?.vehicleTypes &&
                dashboardData.vehicleTypes.length > 0 ? (
                  <VehicleTypesChart data={dashboardData.vehicleTypes} />
                ) : (
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center h-full p-6">
                      <Car className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 text-center">
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
                    <CardContent className="flex flex-col items-center justify-center h-full p-6">
                      <MapPin className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 text-center">
                        Nenhum dado de bairros disponível
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dashboardData?.vehicleTypes &&
                dashboardData.vehicleTypes.length > 0 ? (
                  <>
                    <VehicleTypesChart data={dashboardData.vehicleTypes} />

                    <Card>
                      <CardHeader>
                        <CardTitle>Detalhes por Tipo de Veículo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {dashboardData.vehicleTypes.map((vehicle) => (
                            <div
                              key={vehicle.type}
                              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg">
                                  {vehicle.type}
                                </h3>
                                <span className="text-sm text-gray-500">
                                  {vehicle.count} reservas
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-600">
                                    Veículos únicos:
                                  </p>
                                  <p className="text-2xl font-bold text-blue-600">
                                    {vehicle.uniqueVehicles}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-600">
                                    Média por veículo:
                                  </p>
                                  <p className="text-2xl font-bold text-green-600">
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
                      <CardContent className="flex flex-col items-center justify-center p-12">
                        <Car className="h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nenhum dado de veículos
                        </h3>
                        <p className="text-gray-600 text-center">
                          Não há dados de tipos de veículos disponíveis
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dashboardData?.districts &&
                dashboardData.districts.length > 0 ? (
                  <LocationStats
                    title="Bairros"
                    data={dashboardData.districts}
                    icon="district"
                  />
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center h-full p-6">
                      <MapPin className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 text-center">
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
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center h-full p-6">
                      <MapPin className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 text-center">
                        Nenhum dado de cidades de origem disponível
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Insights */}
              {(dashboardData?.districts || dashboardData?.origins) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Insights de Localização
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData?.districts?.[0] && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">
                            Localização Mais Popular
                          </h4>
                          <p className="text-blue-700">
                            {dashboardData.districts[0].name} é o bairro com
                            mais reservas (
                            {dashboardData.districts[0].reservationCount})
                          </p>
                        </div>
                      )}

                      {dashboardData?.origins?.[0] && (
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">
                            Origem Principal
                          </h4>
                          <p className="text-green-700">
                            {dashboardData.origins[0].name} é a cidade de origem
                            mais comum (
                            {dashboardData.origins[0].reservationCount}{' '}
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

          {/* Resumo do Período */}
          {kpisData && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resumo do Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Período analisado</p>
                    <p className="font-semibold">
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

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Reservas por vaga</p>
                    <p className="font-semibold">
                      {kpisData.totalSlots
                        ? (
                            kpisData.totalReservations / kpisData.totalSlots
                          ).toFixed(1)
                        : 0}{' '}
                      reservas/vaga
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Taxa de cancelamento
                    </p>
                    <p className="font-semibold">
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
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : !error && !loading ? (
        // Mensagem quando não há dados, erro ou loading
        <Card className="mb-6">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <BarChart3 className="h-16 w-16 text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum dado disponível
                </h3>
                <p className="text-gray-600">
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
