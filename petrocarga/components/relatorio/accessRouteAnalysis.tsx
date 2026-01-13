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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Route, Percent } from 'lucide-react';

const entryPoints = [
  'BR-040 - Pórtico do Quitandinha',
  'BR-040 - Pórtico do Bingen',
  'BR-040 - Duarte da Silveira',
  'BR-040 - Mosela',
  'BR-040 - Trevo de Bonsucesso',
  'BR-040 - Itaipava (Arranha-Céu)',
  'BR-040 - Pedro do Rio',
  'BR-040 - Barra Mansa',
  'BR-495 - Est. Teresópolis',
  'RJ-107 - Serra da Estrela (Serra Velha)',
  'RJ-117 - Vale das Videiras',
  'RJ-123 - Secretário',
  'RJ-134 - Silveira da Motta (Posse)',
  'Est. União e Indústria (Posse-Gaby)',
];

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
];

export default function AccessRouteAnalysis() {
  const [selectedView, setSelectedView] = useState<'routes' | 'multiple'>(
    'routes'
  );

  // Dados para rotas de acesso
  const routeData = useMemo(() => {
    return entryPoints.map((entry, index) => ({
      name: entry.split(' - ')[1] || entry,
      fullName: entry,
      Veículos: Math.floor(Math.random() * 200) + 50,
      'Múltiplas Vagas': Math.floor(Math.random() * 80) + 20,
    }));
  }, []);

  // Dados para uso múltiplo de vagas
  const multipleUsageData = useMemo(() => {
    const totalVehicles = routeData.reduce(
      (sum, item) => sum + item['Veículos'],
      0
    );
    const totalMultiple = routeData.reduce(
      (sum, item) => sum + item['Múltiplas Vagas'],
      0
    );

    return [
      {
        name: 'Usam 1 vaga',
        value: totalVehicles - totalMultiple,
        color: '#00C49F',
      },
      { name: 'Usam 2+ vagas', value: totalMultiple, color: '#FF8042' },
    ];
  }, [routeData]);

  // Dados para distribuição por categoria
  const categoryData = useMemo(() => {
    return routeData.slice(0, 8).map((item) => ({
      name: item.name,
      'Veículos Leves': Math.floor(Math.random() * 40) + 10,
      'Veículos Médios': Math.floor(Math.random() * 60) + 20,
      'Veículos Pesados': Math.floor(Math.random() * 30) + 5,
    }));
  }, [routeData]);

  const getChartData = () => {
    switch (selectedView) {
      case 'routes':
        return routeData.slice(0, 8).map((item) => ({
          name: item.name,
          Veículos: item['Veículos'],
        }));
      case 'multiple':
        return routeData.slice(0, 8).map((item) => ({
          name: item.name,
          'Múltiplas Vagas': item['Múltiplas Vagas'],
          Percentual: Math.round(
            (item['Múltiplas Vagas'] / item['Veículos']) * 100
          ),
        }));
      default:
        return [];
    }
  };

  const getChartTitle = () => {
    switch (selectedView) {
      case 'routes':
        return 'Rotas de Acesso Mais Utilizadas';
      case 'multiple':
        return 'Uso de Múltiplas Vagas por Rota';
      default:
        return '';
    }
  };

  return (
    <div>
      {/* Controles de visualização */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedView('routes')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              selectedView === 'routes'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Route className="h-4 w-4" />
            Rotas
          </button>
          <button
            onClick={() => setSelectedView('multiple')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              selectedView === 'multiple'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Percent className="h-4 w-4" />
            Múltiplas Vagas
          </button>
        </div>

        <h3 className="text-lg font-medium text-gray-900">{getChartTitle()}</h3>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico principal */}
        <div className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {selectedView === 'multiple' ? (
                <BarChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'Percentual')
                        return [`${value}%`, 'Percentual'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="Múltiplas Vagas"
                    name="Veículos com múltiplas vagas"
                    fill="#FF8042"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <BarChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Veículos"
                    name="Total de Veículos"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estatísticas e insights */}
        <div className="space-y-6">
          {/* Estatísticas de uso múltiplo */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Uso de Múltiplas Vagas
            </h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={multipleUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {multipleUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} veículos`, 'Quantidade']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {multipleUsageData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">
                    {Math.round(
                      (item.value /
                        multipleUsageData.reduce((a, b) => a + b.value, 0)) *
                        100
                    )}
                    %
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Insights</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                <span>35% dos veículos utilizam mais de uma vaga</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                <span>BR-040 concentra 65% do fluxo de entrada</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Rota Mais Utilizada</div>
          <div className="font-medium">{routeData[0]?.fullName}</div>
          <div className="text-xs text-gray-500 mt-1">
            {routeData[0]?.['Veículos']} veículos •{' '}
            {Math.round(
              (routeData[0]?.['Múltiplas Vagas'] / routeData[0]?.['Veículos']) *
                100
            )}
            % múltiplas vagas
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">
            Maior % Múltiplas Vagas
          </div>
          <div className="font-medium">
            {
              routeData.reduce((prev, current) =>
                prev['Múltiplas Vagas'] / prev['Veículos'] >
                current['Múltiplas Vagas'] / current['Veículos']
                  ? prev
                  : current
              ).fullName
            }
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(
              (routeData.reduce((prev, current) =>
                prev['Múltiplas Vagas'] / prev['Veículos'] >
                current['Múltiplas Vagas'] / current['Veículos']
                  ? prev
                  : current
              )['Múltiplas Vagas'] /
                routeData.reduce((prev, current) =>
                  prev['Múltiplas Vagas'] / prev['Veículos'] >
                  current['Múltiplas Vagas'] / current['Veículos']
                    ? prev
                    : current
                )['Veículos']) *
                100
            )}
            % usam múltiplas vagas
          </div>
        </div>
      </div>
    </div>
  );
}
