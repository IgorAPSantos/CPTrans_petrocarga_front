'use client';

import { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Truck,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from 'lucide-react';

const vehicleTypes = [
  {
    type: 'AUTOMOVEL',
    name: 'Automóvel (até 5m)',
    count: 150,
    percentage: 25,
  },
  {
    type: 'VUC',
    name: 'VUC (até 7m)',
    count: 200,
    percentage: 33,
  },
  {
    type: 'CAMINHONETA',
    name: 'Caminhoneta (até 8m)',
    count: 120,
    percentage: 20,
  },
  {
    type: 'CAMINHAO_MEDIO',
    name: 'Caminhão Médio (8m-12m)',
    count: 80,
    percentage: 13,
  },
  {
    type: 'CAMINHAO_LONGO',
    name: 'Caminhão Longo (13m-19m)',
    count: 50,
    percentage: 8,
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function VehicleTypeChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'combined' | 'pie' | 'bar'>(
    'combined'
  );

  const barChartData = useMemo(() => {
    return vehicleTypes.map((type) => ({
      name: type.name.split(' ')[0],
      fullName: type.name,
      Quantidade: type.count,
      percentage: type.percentage,
    }));
  }, []);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const renderCustomizedLabel = (props: any) => {
    const { name, percentage, x, y, cx } = props;
    const shortName = name.split(' ')[0];
    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={11}
        fontWeight="500"
      >
        {shortName}: {percentage}%
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
          <p className="font-medium text-gray-900 mb-2">
            {payload[0].payload.fullName}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Quantidade:</span>
              <span className="text-sm font-semibold">
                {payload[0].value} veículos
              </span>
            </div>
            {payload[0].payload.percentage && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Percentual:</span>
                <span className="text-sm font-semibold">
                  {payload[0].payload.percentage}%
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header com título */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Tipos de Veículos Utilizados
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Distribuição por tipo de veículo
        </p>
      </div>

      {/* Controles de visualização */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          onClick={() => setViewMode('combined')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
            viewMode === 'combined'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChartIcon className="h-4 w-4" />
          Combinado
        </button>
        <button
          onClick={() => setViewMode('pie')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
            viewMode === 'pie'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <PieChartIcon className="h-4 w-4" />
          Pizza
        </button>
        <button
          onClick={() => setViewMode('bar')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
            viewMode === 'bar'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChartIcon className="h-4 w-4" />
          Barras
        </button>
      </div>

      {/* Gráficos principais */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className={viewMode === 'combined' ? 'h-80' : 'h-72'}>
          {viewMode === 'combined' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Gráfico de Pizza */}
              <div className="h-full">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <PieChartIcon className="h-4 w-4 text-gray-600" />
                  <h4 className="text-sm font-medium text-gray-700">
                    Distribuição por Tipo (%)
                  </h4>
                </div>
                <div className="h-[calc(100%-2rem)]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vehicleTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="percentage"
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                      >
                        {vehicleTypes.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            strokeWidth={activeIndex === index ? 3 : 1}
                            stroke="#fff"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium text-gray-900">
                                  {data.name}
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                  {data.percentage}% • {data.count} veículos
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico de Barras */}
              <div className="h-full">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <BarChartIcon className="h-4 w-4 text-gray-600" />
                  <h4 className="text-sm font-medium text-gray-700">
                    Quantidade de Veículos
                  </h4>
                </div>
                <div className="h-[calc(100%-2rem)]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barChartData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        angle={0}
                        textAnchor="middle"
                        height={40}
                        fontSize={11}
                        tick={{ fill: '#4b5563' }}
                      />
                      <YAxis
                        fontSize={11}
                        tick={{ fill: '#4b5563' }}
                        width={40}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{
                          paddingTop: '10px',
                        }}
                      />
                      <Bar
                        dataKey="Quantidade"
                        name="Quantidade"
                        fill="#0088FE"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : viewMode === 'pie' ? (
            <div className="h-full">
              <div className="flex items-center justify-center gap-2 mb-3">
                <PieChartIcon className="h-4 w-4 text-gray-600" />
                <h4 className="text-sm font-medium text-gray-700">
                  Distribuição por Tipo de Veículo
                </h4>
              </div>
              <div className="h-[calc(100%-2rem)]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vehicleTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      innerRadius={20}
                      fill="#8884d8"
                      dataKey="percentage"
                      onMouseEnter={onPieEnter}
                      onMouseLeave={onPieLeave}
                    >
                      {vehicleTypes.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          strokeWidth={activeIndex === index ? 3 : 1}
                          stroke="#fff"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-medium text-gray-900">
                                {data.name}
                              </p>
                              <div className="mt-1 space-y-1">
                                <p className="text-sm text-gray-700">
                                  Percentual:{' '}
                                  <span className="font-semibold">
                                    {data.percentage}%
                                  </span>
                                </p>
                                <p className="text-sm text-gray-700">
                                  Quantidade:{' '}
                                  <span className="font-semibold">
                                    {data.count} veículos
                                  </span>
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{
                        paddingLeft: '20px',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-full">
              <div className="flex items-center justify-center gap-2 mb-3">
                <BarChartIcon className="h-4 w-4 text-gray-600" />
                <h4 className="text-sm font-medium text-gray-700">
                  Quantidade de Veículos por Tipo
                </h4>
              </div>
              <div className="h-[calc(100%-2rem)]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barChartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      angle={0}
                      textAnchor="middle"
                      height={40}
                      fontSize={11}
                      tick={{ fill: '#4b5563' }}
                    />
                    <YAxis
                      fontSize={11}
                      tick={{ fill: '#4b5563' }}
                      width={40}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} />
                    <Bar
                      dataKey="Quantidade"
                      name="Quantidade de Veículos"
                      fill="#0088FE"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legenda Detalhada */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Detalhes por Tipo de Veículo
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {vehicleTypes.map((type, index) => (
            <div
              key={type.type}
              className={`p-3 rounded-lg border transition-all text-center ${
                activeIndex === index
                  ? 'border-blue-300 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex flex-col items-center mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-xs font-medium text-gray-900 truncate w-full">
                    {type.name.split(' ')[0]}
                  </span>
                </div>
                <span className="text-xs font-semibold text-blue-600">
                  {type.percentage}%
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500">Veículos</span>
                  <span className="text-sm font-semibold">{type.count}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1 truncate w-full">
                  {type.name.split('(')[1].replace(')', '')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
