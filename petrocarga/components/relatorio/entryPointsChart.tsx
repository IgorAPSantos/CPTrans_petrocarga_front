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
import { ChevronLeft } from 'lucide-react';

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

export default function EntryPointsChart() {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const entryData = useMemo(() => {
    return entryPoints.map((entry) => {
      const entryNeighborhoods = neighborhoods.map((neighborhood) => ({
        name: neighborhood,
        value: Math.floor(Math.random() * 40) + 10,
      }));

      const total = entryNeighborhoods.reduce(
        (sum, item) => sum + item.value,
        0
      );

      return {
        name: entry.split(' - ')[1] || entry,
        fullName: entry,
        total,
        neighborhoods: entryNeighborhoods,
        centro: Math.floor(Math.random() * 30) + 5,
        itaipava: Math.floor(Math.random() * 25) + 5,
        correas: Math.floor(Math.random() * 20) + 5,
        quitandinha: Math.floor(Math.random() * 15) + 5,
        altodaserra: Math.floor(Math.random() * 10) + 5,
        bingen: Math.floor(Math.random() * 10) + 5,
        cascatinha: Math.floor(Math.random() * 10) + 5,
        valparaiso: Math.floor(Math.random() * 10) + 5,
        independencia: Math.floor(Math.random() * 10) + 5,
        mosela: Math.floor(Math.random() * 10) + 5,
      };
    });
  }, []);

  const chartData = useMemo(() => {
    if (selectedEntry) {
      return (
        entryData.find((d) => d.fullName === selectedEntry)?.neighborhoods || []
      );
    }

    return entryData.map((d) => ({
      name: d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name,
      fullName: d.fullName,
      Entradas: d.total,
      Centro: d.centro,
      Itaipava: d.itaipava,
      Quitandinha: d.quitandinha,
      Corrêas: d.correas,
      'Alto da Serra': d.altodaserra,
      Bingen: d.bingen,
      Cascatinha: d.cascatinha,
      Valparaíso: d.valparaiso,
      Independência: d.independencia,
      Mosela: d.mosela,
    }));
  }, [selectedEntry, entryData]);

  const handleBarClick = (data: any) => {
    if (!selectedEntry && data && data.activePayload) {
      const entryName = data.activePayload[0]?.payload?.fullName;
      if (entryName) setSelectedEntry(entryName);
    }
  };

  const destinationColors = {
    'Total de Entradas': '#0088FE',
    'Destino: Centro': '#00C49F',
    'Destino: Itaipava': '#FFBB28',
    'Destino: Quitandinha': '#A594F9',
    'Destino: Corrêas': '#9D84B7',
    'Destino: Alto da Serra': '#1E1B18',
    'Destino: Bingen': '#C1292E',
    'Destino: Cascatinha': '#FF006E',
    'Destino: Valparaíso': '#8338EC',
    'Destino: Independência': '#06FFA5',
    'Destino: Mosela': '#3E92CC',
    'Veículos para este bairro': '#8884d8',
  };

  return (
    <div className="space-y-4">
      {/* Header com título e controles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedEntry
              ? `Destino dos veículos que entraram por: ${
                  selectedEntry.split(' - ')[1] || selectedEntry
                }`
              : 'Entradas para Petrópolis'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {selectedEntry
              ? 'Distribuição por bairro de destino'
              : 'Quantidade de entradas por ponto de acesso'}
          </p>
        </div>

        {selectedEntry && (
          <button
            onClick={() => setSelectedEntry(null)}
            className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para visão geral
          </button>
        )}
      </div>

      {/* Instrução */}
      {!selectedEntry && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 <strong>Clique em uma barra</strong> para ver detalhes do destino
            por bairro
          </p>
        </div>
      )}

      {/* Container principal do gráfico */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: selectedEntry ? 60 : 80,
              }}
              onClick={handleBarClick}
              style={{ cursor: selectedEntry ? 'default' : 'pointer' }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={selectedEntry ? 60 : 80}
                fontSize={11}
                tick={{ fill: '#4b5563' }}
              />
              <YAxis
                fontSize={11}
                tick={{ fill: '#4b5563' }}
                label={
                  selectedEntry
                    ? {
                        value: 'Veículos',
                        angle: -90,
                        position: 'insideLeft',
                        offset: -10,
                        style: { textAnchor: 'middle' },
                      }
                    : undefined
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value) => [`${value} veículos`, '']}
                labelFormatter={(label) =>
                  selectedEntry ? `Bairro: ${label}` : `Entrada: ${label}`
                }
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  paddingTop: '10px',
                }}
              />

              {selectedEntry ? (
                <Bar
                  dataKey="value"
                  name="Veículos para este bairro"
                  fill={destinationColors['Veículos para este bairro']}
                  radius={[4, 4, 0, 0]}
                />
              ) : (
                <>
                  {/* Gráfico de barras empilhadas */}
                  <Bar
                    dataKey="Entradas"
                    name="Total de Entradas"
                    fill={destinationColors['Total de Entradas']}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Centro"
                    name="Destino: Centro"
                    fill={destinationColors['Destino: Centro']}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Itaipava"
                    name="Destino: Itaipava"
                    fill={destinationColors['Destino: Itaipava']}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Quitandinha"
                    name="Destino: Quitandinha"
                    fill={destinationColors['Destino: Quitandinha']}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Corrêas"
                    name="Destino: Corrêas"
                    fill={destinationColors['Destino: Corrêas']}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Alto da Serra"
                    name="Destino: Alto da Serra"
                    fill={destinationColors['Destino: Alto da Serra']}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Bingen"
                    name="Destino: Bingen"
                    fill={destinationColors['Destino: Bingen']}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Cascatinha"
                    name="Destino: Cascatinha"
                    fill={destinationColors['Destino: Cascatinha']}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Valparaíso"
                    name="Destino: Valparaíso"
                    fill={destinationColors['Destino: Valparaíso']}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Independência"
                    name="Destino: Independência"
                    fill={destinationColors['Destino: Independência']}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Mosela"
                    name="Destino: Mosela"
                    fill={destinationColors['Destino: Mosela']}
                    radius={[4, 4, 0, 0]}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legenda compacta */}
      <div className="bg-gray-50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Destinos por Bairro
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(destinationColors)
            .filter(([key]) => key.includes('Destino:'))
            .map(([key, color]) => (
              <div
                key={key}
                className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-gray-200"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-700">
                  {key.replace('Destino: ', '')}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
