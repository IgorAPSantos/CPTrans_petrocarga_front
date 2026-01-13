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
import {
  Route,
  Percent,
  Truck,
  MapPin,
  Layers,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

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

  // Dados mais realistas para rotas de acesso
  const routeData = useMemo(() => {
    // Ajustando valores para ser mais realista
    return entryPoints.map((entry, index) => {
      let vehicles: number;
      let multipleSpots: number;

      // Atribuindo valores mais realistas baseados no tipo de acesso
      if (entry.includes('BR-040')) {
        // BR-040 tem mais tráfego
        vehicles = Math.floor(Math.random() * 150) + 100; // 100-250 veículos
        multipleSpots = Math.floor(Math.random() * 50) + 40; // 40-90 veículos
      } else if (entry.includes('BR-495')) {
        // BR-495 tem tráfego médio
        vehicles = Math.floor(Math.random() * 80) + 50; // 50-130 veículos
        multipleSpots = Math.floor(Math.random() * 30) + 20; // 20-50 veículos
      } else if (entry.includes('RJ-')) {
        // RJ tem tráfego menor
        vehicles = Math.floor(Math.random() * 60) + 30; // 30-90 veículos
        multipleSpots = Math.floor(Math.random() * 20) + 10; // 10-30 veículos
      } else {
        // Outros acessos
        vehicles = Math.floor(Math.random() * 40) + 20; // 20-60 veículos
        multipleSpots = Math.floor(Math.random() * 15) + 5; // 5-20 veículos
      }

      return {
        name: entry.split(' - ')[1] || entry,
        fullName: entry,
        Veículos: vehicles,
        'Múltiplas Vagas': multipleSpots,
      };
    });
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

  // Classificação das rotas
  const classifiedRoutes = useMemo(() => {
    const totalVehicles = routeData.reduce(
      (sum, item) => sum + item['Veículos'],
      0
    );

    return routeData
      .map((route) => {
        const percentage = (route['Veículos'] / totalVehicles) * 100;
        const multiplePercentage =
          (route['Múltiplas Vagas'] / route['Veículos']) * 100;

        // Classificação baseada na participação no tráfego total
        let classification = '';
        let observation = '';

        if (percentage >= 15) {
          classification = 'PRINCIPAL';
          observation = 'Fluxo elevado de veículos';
        } else if (percentage >= 8) {
          classification = 'INTERMEDIÁRIO';
          observation = 'Fluxo moderado de veículos';
        } else {
          classification = 'SECUNDÁRIO';
          observation = 'Fluxo reduzido de veículos';
        }

        // Observação sobre uso múltiplo
        let multipleObservation = '';
        if (multiplePercentage >= 40) {
          multipleObservation = 'Alto uso de múltiplas vagas';
        } else if (multiplePercentage >= 25) {
          multipleObservation = 'Uso moderado de múltiplas vagas';
        } else {
          multipleObservation = 'Baixo uso de múltiplas vagas';
        }

        return {
          ...route,
          percentage: Math.round(percentage),
          multiplePercentage: Math.round(multiplePercentage),
          classification,
          observation,
          multipleObservation,
        };
      })
      .sort((a, b) => b['Veículos'] - a['Veículos']); // Ordenar por maior tráfego
  }, [routeData]);

  const getChartData = () => {
    switch (selectedView) {
      case 'routes':
        return classifiedRoutes.slice(0, 8).map((item) => ({
          name: item.name,
          Veículos: item['Veículos'],
        }));
      case 'multiple':
        return classifiedRoutes.slice(0, 8).map((item) => ({
          name: item.name,
          'Múltiplas Vagas': item['Múltiplas Vagas'],
          Percentual: item.multiplePercentage,
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

  // Função para obter cor baseada na classificação
  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'PRINCIPAL':
        return '#ef4444'; // Vermelho
      case 'INTERMEDIÁRIO':
        return '#f59e0b'; // Laranja
      case 'SECUNDÁRIO':
        return '#10b981'; // Verde
      default:
        return '#6b7280'; // Cinza
    }
  };

  // Função para obter ícone baseado na classificação
  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case 'PRINCIPAL':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'INTERMEDIÁRIO':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'SECUNDÁRIO':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Controles de visualização */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Acesso Viário e Uso de Vagas
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Análise das rotas de entrada e padrões de uso das vagas
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView('routes')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                selectedView === 'routes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Route className="h-4 w-4" />
              Rotas de Acesso
            </button>
            <button
              onClick={() => setSelectedView('multiple')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                selectedView === 'multiple'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Layers className="h-4 w-4" />
              Múltiplas Vagas
            </button>
          </div>
        </div>

        {/* Legenda das classificações */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Classificação das Rotas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div>
                <span className="text-sm font-medium">PRINCIPAL</span>
                <p className="text-xs text-gray-600">≥15% do tráfego total</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <div>
                <span className="text-sm font-medium">INTERMEDIÁRIO</span>
                <p className="text-xs text-gray-600">8-15% do tráfego total</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <span className="text-sm font-medium">SECUNDÁRIO</span>
                <p className="text-xs text-gray-600">&lt;8% do tráfego total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Gráfico principal */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {selectedView === 'multiple' ? (
                  <BarChart
                    data={getChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      fontSize={12}
                      tick={{ fill: '#4b5563' }}
                    />
                    <YAxis
                      fontSize={12}
                      tick={{ fill: '#4b5563' }}
                      label={{
                        value: 'Veículos',
                        angle: -90,
                        position: 'insideLeft',
                        offset: -10,
                      }}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'Percentual')
                          return [`${value}%`, 'Percentual'];
                        return [value, name];
                      }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      fontSize={12}
                      tick={{ fill: '#4b5563' }}
                    />
                    <YAxis
                      fontSize={12}
                      tick={{ fill: '#4b5563' }}
                      label={{
                        value: 'Veículos',
                        angle: -90,
                        position: 'insideLeft',
                        offset: -10,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                    <Bar
                      dataKey="Veículos"
                      name="Total de Veículos"
                      fill="#0088FE"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
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
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                    }}
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
                <span>
                  <strong>
                    {Math.round(
                      (multipleUsageData[1].value /
                        multipleUsageData.reduce((a, b) => a + b.value, 0)) *
                        100
                    )}
                    %
                  </strong>{' '}
                  dos veículos utilizam mais de uma vaga
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                <span>
                  <strong>BR-040</strong> concentra{' '}
                  <strong>
                    {Math.round(
                      (classifiedRoutes
                        .filter((r) => r.fullName.includes('BR-040'))
                        .reduce((sum, r) => sum + r['Veículos'], 0) /
                        classifiedRoutes.reduce(
                          (sum, r) => sum + r['Veículos'],
                          0
                        )) *
                        100
                    )}
                    %
                  </strong>{' '}
                  do fluxo
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                <span>Rotas principais têm maior % de múltiplas vagas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabela de informações detalhadas */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            {selectedView === 'routes' ? (
              <>
                <Route className="h-5 w-5" />
                Detalhes das Rotas de Acesso
              </>
            ) : (
              <>
                <Layers className="h-5 w-5" />
                Detalhes do Uso de Múltiplas Vagas
              </>
            )}
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ponto de Acesso
                </th>
                {selectedView === 'routes' ? (
                  <>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total de Veículos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % do Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Classificação
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Múltiplas Vagas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % por Rota
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nível de Uso
                    </th>
                  </>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classifiedRoutes.map((route, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {route.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {route.fullName}
                        </div>
                      </div>
                    </div>
                  </td>

                  {selectedView === 'routes' ? (
                    <>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">
                            {route['Veículos']}
                          </span>
                          <span className="text-sm text-gray-500">
                            veículos
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${route.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          {route.percentage}%
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getClassificationIcon(route.classification)}
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `${getClassificationColor(
                                route.classification
                              )}20`,
                              color: getClassificationColor(
                                route.classification
                              ),
                            }}
                          >
                            {route.classification}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {route.observation}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">
                            {route['Múltiplas Vagas']}
                          </span>
                          <span className="text-sm text-gray-500">
                            veículos
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-orange-500"
                            style={{ width: `${route.multiplePercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          {route.multiplePercentage}%
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {route.multiplePercentage >= 40 ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : route.multiplePercentage >= 25 ? (
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          )}
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor:
                                route.multiplePercentage >= 40
                                  ? '#fee2e2'
                                  : route.multiplePercentage >= 25
                                  ? '#fef3c7'
                                  : '#d1fae5',
                              color:
                                route.multiplePercentage >= 40
                                  ? '#dc2626'
                                  : route.multiplePercentage >= 25
                                  ? '#d97706'
                                  : '#059669',
                            }}
                          >
                            {route.multiplePercentage >= 40
                              ? 'ALTO'
                              : route.multiplePercentage >= 25
                              ? 'MODERADO'
                              : 'BAIXO'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {route.multipleObservation}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumo estatístico */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">
            Total de Veículos Monitorados
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {classifiedRoutes.reduce((sum, r) => sum + r['Veículos'], 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">em todas as rotas</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Rotas Principais</div>
          <div className="text-2xl font-bold text-red-600">
            {
              classifiedRoutes.filter((r) => r.classification === 'PRINCIPAL')
                .length
            }
          </div>
          <div className="text-xs text-gray-500 mt-1">pontos de acesso</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">
            Uso Médio de Múltiplas Vagas
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(
              classifiedRoutes.reduce(
                (sum, r) => sum + r.multiplePercentage,
                0
              ) / classifiedRoutes.length
            )}
            %
          </div>
          <div className="text-xs text-gray-500 mt-1">média entre as rotas</div>
        </div>
      </div>
    </div>
  );
}
