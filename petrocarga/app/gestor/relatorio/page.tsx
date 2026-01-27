'use client';

import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Filter,
  Download,
  Calendar,
  MapPin,
  Truck,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Route,
  Layers,
  Home,
  Menu,
  X,
} from 'lucide-react';
import EntryPointsChart from '@/components/relatorio/entryPointsChart';
import VehicleTypeChart from '@/components/relatorio/vehicleTypeChart';
import ParkingUsageChart from '@/components/relatorio/parkingUsageChart';
import AccessRouteAnalysis from '@/components/relatorio/accessRouteAnalysis';
import VehicleUsageByParking from '@/components/relatorio/vehicleUsageByParking';

// Dados mockados
const parkingData = [
  { id: 1, name: 'Centro Comercial', usage: 85, totalUses: 450 },
  { id: 2, name: 'Supermercado A', usage: 72, totalUses: 320 },
  { id: 3, name: 'Shopping Center', usage: 92, totalUses: 520 },
  { id: 4, name: 'Distribuidora B', usage: 45, totalUses: 180 },
  { id: 5, name: 'Depósito Central', usage: 68, totalUses: 290 },
  { id: 6, name: 'Mercado Municipal', usage: 38, totalUses: 150 },
  { id: 7, name: 'Galpão Industrial', usage: 25, totalUses: 95 },
  { id: 8, name: 'Loja de Materiais', usage: 55, totalUses: 210 },
  { id: 9, name: 'Aeroporto Regional', usage: 30, totalUses: 110 },
  { id: 10, name: 'Terminal Rodoviário', usage: 75, totalUses: 340 },
];

const neighborhoods = [
  'Centro',
  'Quitandinha',
  'Corrêas',
  'Itaipava',
  'Alto da Serra',
  'Bingen',
  'Cascatinha',
  'Valparaíso',
  'Independência',
  'Mosela',
];

export default function ReportPage() {
  const [viewMode, setViewMode] = useState<'most' | 'least'>('most');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-12-31',
  });
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<string>('Todos');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filtrar dados por uso
  const filteredParkingData = useMemo(() => {
    const sorted = [...parkingData].sort((a, b) => b.usage - a.usage);
    return viewMode === 'most'
      ? sorted.slice(0, 8) // Vagas mais utilizadas
      : sorted.slice(-8).reverse(); // Vagas menos utilizadas
  }, [viewMode]);

  // Dados para gráfico de uso de vagas
  const usageChartData = useMemo(() => {
    return filteredParkingData.map((item) => ({
      name:
        item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      'Uso (%)': item.usage,
      'Total de Usos': item.totalUses / 10,
    }));
  }, [filteredParkingData]);

  // Dados para distribuição por bairro
  const neighborhoodDistribution = useMemo(() => {
    const baseValues: { [key: string]: number } = {
      Centro: 180,
      Quitandinha: 145,
      Corrêas: 120,
      Itaipava: 95,
      'Alto da Serra': 80,
      Bingen: 65,
      Cascatinha: 50,
      Valparaíso: 40,
      Independência: 35,
      Mosela: 25,
    };

    return neighborhoods.map((neighborhood) => ({
      name:
        neighborhood.length > 8
          ? neighborhood.substring(0, 8) + '...'
          : neighborhood,
      fullName: neighborhood,
      Entradas: baseValues[neighborhood] || Math.floor(Math.random() * 80) + 20,
    }));
  }, []);

  const handleExport = () => {
    alert('Relatório exportado com sucesso!');
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    setDateRange((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Cabeçalho com menu mobile */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600" />
                <span className="text-base sm:text-xl md:text-2xl">
                  Relatório de Vagas
                </span>
              </h1>
            </div>

            <button
              onClick={handleExport}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 sm:gap-2 transition-colors whitespace-nowrap text-sm sm:text-base"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Exportar</span>
              <span className="sm:hidden">Exp.</span>
            </button>
          </div>

          <p className="text-gray-600 text-xs sm:text-sm md:text-base ml-0 lg:ml-11">
            Análise detalhada do uso de vagas por veículos de carga no município
          </p>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  Data Final
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-3 w-3 mr-1" />
                  Bairro
                </label>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="Todos">Todos os Bairros</option>
                  {neighborhoods.map((neighborhood) => (
                    <option key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Modo de Visualização
                </label>
                <div className="flex gap-2 h-10">
                  <button
                    onClick={() => {
                      setViewMode('most');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'most'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    Mais Usadas
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('least');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'least'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <TrendingDown className="inline h-3 w-3 mr-1" />
                    Menos Usadas
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros desktop */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros do Relatório
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data Inicial
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data Final
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Bairro
              </label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="Todos">Todos os Bairros</option>
                {neighborhoods.map((neighborhood) => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modo de Visualização
              </label>
              <div className="flex gap-2 h-11">
                <button
                  onClick={() => setViewMode('most')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'most'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  Mais Usadas
                </button>
                <button
                  onClick={() => setViewMode('least')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'least'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <TrendingDown className="inline h-4 w-4 mr-1" />
                  Menos Usadas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Total de Vagas
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {parkingData.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">pontos monitorados</p>
            </div>
            <Layers className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Utilização Média
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {Math.round(
                  parkingData.reduce((acc, curr) => acc + curr.usage, 0) /
                    parkingData.length,
                )}
                %
              </p>
              <p className="text-xs text-gray-500 mt-1">
                taxa média de ocupação
              </p>
            </div>
            <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Total de Usos
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {parkingData.reduce((acc, curr) => acc + curr.totalUses, 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                utilizações registradas
              </p>
            </div>
            <Route className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 opacity-80" />
          </div>
        </div>
      </div>

      {/* Gráfico Principal - Uso de Vagas */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            {viewMode === 'most'
              ? 'Vagas Mais Utilizadas'
              : 'Vagas Menos Utilizadas'}
          </h2>
          <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
            Período: {new Date(dateRange.start).toLocaleDateString('pt-BR')} -{' '}
            {new Date(dateRange.end).toLocaleDateString('pt-BR')}
          </div>
        </div>

        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={usageChartData}
              margin={{ top: 20, right: 10, left: 0, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={50}
                fontSize={10}
                tick={{ fill: '#4b5563' }}
              />
              <YAxis fontSize={10} tick={{ fill: '#4b5563' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={30}
                wrapperStyle={{
                  paddingTop: '10px',
                  fontSize: '11px',
                }}
              />
              <Bar
                dataKey="Uso (%)"
                fill="#8884d8"
                name="Uso (%)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Total de Usos"
                fill="#82ca9d"
                name="Total de Usos"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Observação:</span> O "Total de Usos"
            representa o número de vezes que cada vaga foi utilizada durante o
            período selecionado, ajustado para melhor visualização.
          </p>
        </div>
      </div>

      {/* Gráficos em Grid - Primeira Linha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
        {/* Entradas para a cidade */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <EntryPointsChart />
        </div>

        {/* Tipos de Veículos */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <VehicleTypeChart />
        </div>
      </div>

      {/* Análise de Rotas de Acesso */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-8 sm:mb-10">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <Route className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          Análise de Acesso Viário e Uso de Vagas
        </h2>
        <AccessRouteAnalysis />
      </div>

      {/* Distribuição por Bairro */}
      <div className="mb-8 sm:mb-10">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-3">
              <Home className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              Distribuição de Veículos por Bairro
            </h2>
            <div className="text-xs text-gray-500 bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full">
              Veículos de carga por bairro
            </div>
          </div>

          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={neighborhoodDistribution}
                margin={{ top: 20, right: 10, left: 0, bottom: 40 }}
                barSize={25}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  tick={{ fill: '#4b5563' }}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  tick={{ fill: '#4b5563' }}
                  width={35}
                />
                <Tooltip
                  formatter={(value) => [`${value} veículos`, 'Quantidade']}
                  labelFormatter={(label) => `Bairro: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="Entradas"
                  name="Veículos de Carga"
                  fill="#4F46E5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 mb-1">MAIOR FLUXO</p>
                <p className="text-sm font-semibold text-gray-900">Centro</p>
                <p className="text-xs text-gray-600">180 veículos</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-700 mb-1">FLUXO MÉDIO</p>
                <p className="text-sm font-semibold text-gray-900">Corrêas</p>
                <p className="text-xs text-gray-600">120 veículos</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-700 mb-1">MENOR FLUXO</p>
                <p className="text-sm font-semibold text-gray-900">Mosela</p>
                <p className="text-xs text-gray-600">25 veículos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Uso de Vagas */}
      <div className="mb-8 sm:mb-10">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-3">
              <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              Análise de Uso
            </h2>
            <div className="text-xs text-gray-500 bg-green-50 text-green-700 px-2 sm:px-3 py-1 rounded-full">
              Selecione as vagas para análise
            </div>
          </div>
          <ParkingUsageChart />
        </div>
      </div>

      {/* Tipos de Caminhões por Vaga */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-8 sm:mb-10">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          Tipos de Veículos por Vaga Ocupada
        </h2>
        <VehicleUsageByParking />
      </div>

      {/* Rodapé */}
      <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-2 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 rounded-xl">
            <p className="text-xs sm:text-sm text-gray-600">
              Relatório gerado em {new Date().toLocaleDateString('pt-BR')} às{' '}
              {new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Período analisado:{' '}
              {new Date(dateRange.start).toLocaleDateString('pt-BR')} a{' '}
              {new Date(dateRange.end).toLocaleDateString('pt-BR')}
            </p>
            <p className="text-gray-700 font-medium text-xs sm:text-sm mt-1 sm:mt-2">
              Companhia Petropolitana de Trânsito e Transporte - CPTRANS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
