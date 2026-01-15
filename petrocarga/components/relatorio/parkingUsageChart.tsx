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
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Minus,
  Maximize2,
  Minimize2,
} from 'lucide-react';

const parkingData = [
  {
    id: 1,
    name: 'Shopping Center',
    usage: 92,
    totalUses: 520,
    trend: 'up',
  },
  {
    id: 2,
    name: 'Centro Comercial',
    usage: 85,
    totalUses: 450,
    trend: 'up',
  },
  {
    id: 3,
    name: 'Terminal Rodoviário',
    usage: 75,
    totalUses: 340,
    trend: 'up',
  },
  {
    id: 4,
    name: 'Supermercado A',
    usage: 72,
    totalUses: 320,
    trend: 'up',
  },
  {
    id: 5,
    name: 'Depósito Central',
    usage: 68,
    totalUses: 290,
    trend: 'stable',
  },
  {
    id: 6,
    name: 'Loja de Materiais',
    usage: 55,
    totalUses: 210,
    trend: 'up',
  },
  {
    id: 7,
    name: 'Distribuidora B',
    usage: 45,
    totalUses: 180,
    trend: 'up',
  },
  {
    id: 8,
    name: 'Mercado Municipal',
    usage: 38,
    totalUses: 150,
    trend: 'up',
  },
  {
    id: 9,
    name: 'Aeroporto Regional',
    usage: 30,
    totalUses: 110,
    trend: 'up',
  },
  {
    id: 10,
    name: 'Galpão Industrial',
    usage: 25,
    totalUses: 95,
    trend: 'up',
  },
];

export default function ParkingUsageChart() {
  const [sortBy, setSortBy] = useState<'usage' | 'total'>('usage');
  const [filter, setFilter] = useState<'all' | 'high' | 'low'>('all');
  const [selectedParkings, setSelectedParkings] = useState<string[]>(
    parkingData.map((p) => p.id.toString())
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [tableExpanded, setTableExpanded] = useState(true);
  const [tableHeight, setTableHeight] = useState<
    'normal' | 'compact' | 'expanded'
  >('normal');

  // Filtrar dados por uso
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...parkingData];

    // Filtrar por seleção de vagas
    filtered = filtered.filter((item) =>
      selectedParkings.includes(item.id.toString())
    );

    // Aplicar filtro de uso
    if (filter === 'high') {
      filtered = filtered.filter((item) => item.usage >= 70);
    } else if (filter === 'low') {
      filtered = filtered.filter((item) => item.usage < 50);
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      if (sortBy === 'usage') return b.usage - a.usage;
      return b.totalUses - a.totalUses;
    });

    return filtered;
  }, [sortBy, filter, selectedParkings]);

  const chartData = useMemo(() => {
    return filteredAndSortedData.map((item) => ({
      name:
        item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name,
      fullName: item.name,
      'Uso (%)': item.usage,
      'Total Usos': item.totalUses / 10, // Ajuste de escala
      trend: item.trend,
    }));
  }, [filteredAndSortedData]);

  const getColor = (usage: number) => {
    if (usage >= 80) return '#ef4444'; // Vermelho para alto uso
    if (usage >= 60) return '#f59e0b'; // Amarelo para médio uso
    return '#10b981'; // Verde para baixo uso
  };

  const handleParkingToggle = (parkingId: string) => {
    setSelectedParkings((prev) => {
      if (prev.includes(parkingId)) {
        return prev.filter((id) => id !== parkingId);
      } else {
        return [...prev, parkingId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedParkings.length === parkingData.length) {
      setSelectedParkings([]);
    } else {
      setSelectedParkings(parkingData.map((p) => p.id.toString()));
    }
  };

  const selectedCount = selectedParkings.length;
  const totalCount = parkingData.length;

  return (
    <div>
      {/* Controles */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Dropdown de seleção de vagas */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecionar Estabelecimentos ({selectedCount}/{totalCount})
            </label>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="truncate">
                  {selectedCount === totalCount
                    ? 'Todos os estabelecimentos selecionados'
                    : selectedCount === 0
                    ? 'Nenhum estabelecimento selecionado'
                    : `${selectedCount} estabelecimento${
                        selectedCount !== 1 ? 's' : ''
                      } selecionado${selectedCount !== 1 ? 's' : ''}`}
                </span>
                {showDropdown ? (
                  <ChevronUp className="h-4 w-4 text-gray-500 ml-2 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500 ml-2 flex-shrink-0" />
                )}
              </button>

              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  <div className="p-2 border-b border-gray-100">
                    <button
                      onClick={handleSelectAll}
                      className="w-full text-left px-2 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      {selectedParkings.length === parkingData.length
                        ? 'Deselecionar todos'
                        : 'Selecionar todos'}
                    </button>
                  </div>
                  <div className="py-1">
                    {parkingData.map((parking) => (
                      <label
                        key={parking.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedParkings.includes(
                            parking.id.toString()
                          )}
                          onChange={() =>
                            handleParkingToggle(parking.id.toString())
                          }
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div className="ml-2 flex-1">
                          <span className="text-sm text-gray-700 font-medium">
                            {parking.name}
                          </span>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{parking.usage}% de uso</span>
                            <span>{parking.totalUses} usos</span>
                            <span
                              className={`flex items-center ${
                                parking.trend === 'up'
                                  ? 'text-green-600'
                                  : parking.trend === 'down'
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                              }`}
                            >
                              {parking.trend === 'up' ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : parking.trend === 'down' ? (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              ) : null}
                              {parking.trend === 'up'
                                ? 'Crescendo'
                                : parking.trend === 'down'
                                ? 'Decrescendo'
                                : 'Estável'}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ordenação */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'usage' | 'total')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="usage">Percentual de Uso</option>
              <option value="total">Total de Usos</option>
            </select>
          </div>

          {/* Filtro */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por uso:
            </label>
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as 'all' | 'high' | 'low')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">Todos os níveis</option>
              <option value="high">Alta Utilização (≥70%)</option>
              <option value="low">Baixa Utilização (&lt;50%)</option>
            </select>
          </div>
        </div>

        {/* Legenda de cores */}
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Alta Utilização (≥80%)
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            Média Utilização (60-79%)
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Baixa Utilização (&lt;60%)
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
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
            <YAxis fontSize={12} tick={{ fill: '#4b5563' }} />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'Uso (%)')
                  return [`${value}%`, 'Percentual de Uso'];
                if (name === 'Total Usos')
                  return [`${Number(value) * 10} usos`, 'Total de Usos'];
                return [value, name];
              }}
              labelFormatter={(label) => {
                const fullName = chartData.find(
                  (d) => d.name === label
                )?.fullName;
                return fullName || label;
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                paddingTop: '10px',
              }}
            />
            <Bar
              dataKey="Uso (%)"
              name="Percentual de Uso"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry['Uso (%)'])} />
              ))}
            </Bar>
            <Bar
              dataKey="Total Usos"
              name="Total de Usos"
              fill="#82ca9d"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela de dados - AGORA RECOLHÍVEL */}
      <div className="mt-6">
        {/* Cabeçalho da tabela com controles de expansão */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900">
            Tabela de Estabelecimentos
            <span className="ml-2 text-sm text-gray-500">
              ({filteredAndSortedData.length} itens)
            </span>
          </h3>

          <div className="flex items-center gap-2">
            {/* Controles de altura da tabela */}
            {tableExpanded && (
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setTableHeight('compact')}
                  className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 ${
                    tableHeight === 'compact'
                      ? 'bg-white shadow text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Altura compacta"
                >
                  <Minimize2 className="h-3 w-3" />
                  Compacta
                </button>
                <button
                  onClick={() => setTableHeight('normal')}
                  className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 ${
                    tableHeight === 'normal'
                      ? 'bg-white shadow text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Altura normal"
                >
                  <Minus className="h-3 w-3" />
                  Normal
                </button>
                <button
                  onClick={() => setTableHeight('expanded')}
                  className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 ${
                    tableHeight === 'expanded'
                      ? 'bg-white shadow text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Altura expandida"
                >
                  <Maximize2 className="h-3 w-3" />
                  Expandida
                </button>
              </div>
            )}

            {/* Botão de expandir/recolher */}
            <button
              onClick={() => setTableExpanded(!tableExpanded)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {tableExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Recolher Tabela
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expandir Tabela
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabela - Condicionalmente renderizada */}
        {tableExpanded ? (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estabelecimento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Usos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tendência
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedData.length > 0 ? (
                  filteredAndSortedData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50"
                      style={{
                        height:
                          tableHeight === 'compact'
                            ? '40px'
                            : tableHeight === 'expanded'
                            ? '60px'
                            : '48px',
                      }}
                    >
                      <td className="px-4 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${item.usage}%`,
                                backgroundColor: getColor(item.usage),
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {item.usage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 text-sm text-gray-900">
                        {item.totalUses}
                      </td>
                      <td className="px-4">
                        {item.trend === 'up' ? (
                          <div className="inline-flex items-center text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span className="text-xs">Crescendo</span>
                          </div>
                        ) : item.trend === 'down' ? (
                          <div className="inline-flex items-center text-red-600">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            <span className="text-xs">Decrescendo</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Estável</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Nenhum estabelecimento selecionado. Selecione
                      estabelecimentos no dropdown acima para visualizar os
                      dados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Altura máxima para scroll quando em modo expandido */}
            <style jsx>{`
              div.overflow-x-auto {
                ${tableHeight === 'expanded' ? 'max-height: 400px;' : ''}
                ${tableHeight === 'compact' ? 'max-height: 250px;' : ''}
                ${tableHeight === 'normal' ? 'max-height: 320px;' : ''}
                overflow-y: auto;
              }
            `}</style>
          </div>
        ) : (
          /* Mensagem quando tabela está recolhida */
          <div className="text-center py-6 border border-gray-200 border-dashed rounded-lg bg-gray-50">
            <p className="text-gray-500">
              Tabela recolhida.
              <button
                onClick={() => setTableExpanded(true)}
                className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clique aqui para expandir
              </button>
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Mostrando {filteredAndSortedData.length} estabelecimento(s)
              selecionado(s)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
