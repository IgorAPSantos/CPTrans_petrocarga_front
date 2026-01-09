'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/components/hooks/useAuth';
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
  Filter,
  Download,
  Calendar,
  MapPin,
  Truck,
  Clock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Search,
  Filter as FilterIcon,
  Layers,
  Route,
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

// Tipos de dados atualizados
type TipoVeiculo =
  | 'AUTOMOVEL'
  | 'VUC'
  | 'CAMINHONETA'
  | 'CAMINHAO_MEDIO'
  | 'CAMINHAO_LONGO';

interface RelatorioVaga {
  id: string;
  endereco: string;
  bairro: string;
  utilizacao: number; // porcentagem 0-100
  tempoMedioOcupacao: number; // em minutos
  totalUtilizacoes: number;
  veiculosPorTipo: Record<TipoVeiculo, number>;
  horarioPico: string; // HH:MM
}

interface TrajetoVeiculo {
  id: string;
  placa: string;
  tipoVeiculo: TipoVeiculo;
  origem: {
    municipio: string;
    estado: string;
    pontoAcesso: string;
  };
  destino: {
    municipio: string;
    estado: string;
    pontoAcesso: string;
  };
  dataEntrada: Date;
  dataSaida: Date;
  vagasUtilizadas: Array<{
    vagaId: string;
    endereco: string;
    entrada: Date;
    saida: Date;
    duracao: number; // minutos
  }>;
  rotaEntrada: string[];
  tempoTotalMunicipio: number; // minutos
}

interface FiltrosRelatorio {
  periodo: {
    inicio: Date;
    fim: Date;
  };
  tiposVeiculo: TipoVeiculo[];
  minUtilizacao: number;
  maxUtilizacao: number;
}

export default function RelatoriosPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Estados para os dados
  const [vagas, setVagas] = useState<RelatorioVaga[]>([]);
  const [trajetos, setTrajetos] = useState<TrajetoVeiculo[]>([]);
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    periodo: {
      inicio: new Date(new Date().setDate(new Date().getDate() - 30)), // Últimos 30 dias
      fim: new Date(),
    },
    tiposVeiculo: [],
    minUtilizacao: 0,
    maxUtilizacao: 100,
  });

  // Estados para controle da UI
  const [viewMode, setViewMode] = useState<'VAGAS' | 'TRAJETOS'>('VAGAS');
  const [selectedVaga, setSelectedVaga] = useState<string | null>(null);
  const [selectedVeiculo, setSelectedVeiculo] = useState<string | null>(null);
  const [buscaTrajeto, setBuscaTrajeto] = useState(''); // Busca por rua nos trajetos

  // Cores para gráficos
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
  ];

  // Lista de pontos de acesso
  const pontosAcesso = [
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

  // Tipos de veículo com descrição
  const tiposVeiculoInfo: Record<TipoVeiculo, string> = {
    AUTOMOVEL: 'Automóvel (até 5m)',
    VUC: 'VUC (até 7m)',
    CAMINHONETA: 'Caminhoneta (até 8m)',
    CAMINHAO_MEDIO: 'Caminhão Médio (8m-12m)',
    CAMINHAO_LONGO: 'Caminhão Longo (13m-19m)',
  };

  useEffect(() => {
    const fetchDadosRelatorios = async () => {
      setLoading(true);
      try {
        // Dados mockados de vagas atualizados
        const mockVagas: RelatorioVaga[] = [
          {
            id: '1',
            endereco: 'Rua do Imperador, 123',
            bairro: 'Centro',
            utilizacao: 85,
            tempoMedioOcupacao: 45,
            totalUtilizacoes: 124,
            veiculosPorTipo: {
              AUTOMOVEL: 10,
              VUC: 40,
              CAMINHONETA: 15,
              CAMINHAO_MEDIO: 35,
              CAMINHAO_LONGO: 24,
            },
            horarioPico: '14:30',
          },
          {
            id: '2',
            endereco: 'Av. Koeler, 456',
            bairro: 'Centro',
            utilizacao: 72,
            tempoMedioOcupacao: 60,
            totalUtilizacoes: 98,
            veiculosPorTipo: {
              AUTOMOVEL: 5,
              VUC: 30,
              CAMINHONETA: 25,
              CAMINHAO_MEDIO: 28,
              CAMINHAO_LONGO: 10,
            },
            horarioPico: '10:15',
          },
          {
            id: '3',
            endereco: 'Rua Teresa, 789',
            bairro: 'Centro',
            utilizacao: 45,
            tempoMedioOcupacao: 90,
            totalUtilizacoes: 67,
            veiculosPorTipo: {
              AUTOMOVEL: 15,
              VUC: 30,
              CAMINHONETA: 12,
              CAMINHAO_MEDIO: 8,
              CAMINHAO_LONGO: 2,
            },
            horarioPico: '11:45',
          },
          {
            id: '4',
            endereco: 'Rua do Imperador, 321',
            bairro: 'Centro',
            utilizacao: 92,
            tempoMedioOcupacao: 55,
            totalUtilizacoes: 156,
            veiculosPorTipo: {
              AUTOMOVEL: 8,
              VUC: 45,
              CAMINHONETA: 20,
              CAMINHAO_MEDIO: 60,
              CAMINHAO_LONGO: 23,
            },
            horarioPico: '15:45',
          },
          {
            id: '5',
            endereco: 'Av. Ipiranga, 101',
            bairro: 'Corrêas',
            utilizacao: 38,
            tempoMedioOcupacao: 120,
            totalUtilizacoes: 45,
            veiculosPorTipo: {
              AUTOMOVEL: 20,
              VUC: 15,
              CAMINHONETA: 5,
              CAMINHAO_MEDIO: 4,
              CAMINHAO_LONGO: 1,
            },
            horarioPico: '09:30',
          },
          {
            id: '6',
            endereco: 'Rua Bingen, 202',
            bairro: 'Bingen',
            utilizacao: 25,
            tempoMedioOcupacao: 75,
            totalUtilizacoes: 32,
            veiculosPorTipo: {
              AUTOMOVEL: 18,
              VUC: 10,
              CAMINHONETA: 3,
              CAMINHAO_MEDIO: 1,
              CAMINHAO_LONGO: 0,
            },
            horarioPico: '13:15',
          },
          {
            id: '7',
            endereco: 'Estrada União e Indústria, 303',
            bairro: 'Itaipava',
            utilizacao: 65,
            tempoMedioOcupacao: 85,
            totalUtilizacoes: 89,
            veiculosPorTipo: {
              AUTOMOVEL: 10,
              VUC: 25,
              CAMINHONETA: 15,
              CAMINHAO_MEDIO: 30,
              CAMINHAO_LONGO: 9,
            },
            horarioPico: '16:20',
          },
          {
            id: '8',
            endereco: 'Rua do Imperador, 404',
            bairro: 'Centro',
            utilizacao: 78,
            tempoMedioOcupacao: 50,
            totalUtilizacoes: 112,
            veiculosPorTipo: {
              AUTOMOVEL: 12,
              VUC: 40,
              CAMINHONETA: 18,
              CAMINHAO_MEDIO: 35,
              CAMINHAO_LONGO: 7,
            },
            horarioPico: '14:00',
          },
        ];

        // Dados mockados de trajetos atualizados
        const mockTrajetos: TrajetoVeiculo[] = [
          {
            id: 't1',
            placa: 'ABC-1234',
            tipoVeiculo: 'CAMINHAO_MEDIO',
            origem: {
              municipio: 'Rio de Janeiro',
              estado: 'RJ',
              pontoAcesso: 'BR-040 - Pórtico do Quitandinha',
            },
            destino: {
              municipio: 'Petrópolis',
              estado: 'RJ',
              pontoAcesso: 'RJ-107 - Serra da Estrela (Serra Velha)',
            },
            dataEntrada: new Date('2024-01-15T08:30:00'),
            dataSaida: new Date('2024-01-15T12:45:00'),
            vagasUtilizadas: [
              {
                vagaId: '1',
                endereco: 'Rua do Imperador, 123',
                entrada: new Date('2024-01-15T09:00:00'),
                saida: new Date('2024-01-15T10:30:00'),
                duracao: 90,
              },
              {
                vagaId: '4',
                endereco: 'Rua do Imperador, 321',
                entrada: new Date('2024-01-15T11:00:00'),
                saida: new Date('2024-01-15T12:00:00'),
                duracao: 60,
              },
            ],
            rotaEntrada: ['BR-040', 'RJ-107', 'Av. Koeler'],
            tempoTotalMunicipio: 255,
          },
          {
            id: 't2',
            placa: 'DEF-5678',
            tipoVeiculo: 'CAMINHAO_MEDIO',
            origem: {
              municipio: 'Teresópolis',
              estado: 'RJ',
              pontoAcesso: 'BR-495 - Est. Teresópolis',
            },
            destino: {
              municipio: 'São Paulo',
              estado: 'SP',
              pontoAcesso: 'BR-040 - Barra Mansa',
            },
            dataEntrada: new Date('2024-01-15T10:15:00'),
            dataSaida: new Date('2024-01-15T14:30:00'),
            vagasUtilizadas: [
              {
                vagaId: '2',
                endereco: 'Av. Koeler, 456',
                entrada: new Date('2024-01-15T11:00:00'),
                saida: new Date('2024-01-15T13:30:00'),
                duracao: 150,
              },
            ],
            rotaEntrada: ['BR-495', 'RJ-107', 'Av. Koeler'],
            tempoTotalMunicipio: 255,
          },
          {
            id: 't3',
            placa: 'GHI-9012',
            tipoVeiculo: 'VUC',
            origem: {
              municipio: 'Petrópolis',
              estado: 'RJ',
              pontoAcesso: 'Est. União e Indústria (Posse-Gaby)',
            },
            destino: {
              municipio: 'Petrópolis',
              estado: 'RJ',
              pontoAcesso: 'Est. União e Indústria (Posse-Gaby)',
            },
            dataEntrada: new Date('2024-01-15T13:00:00'),
            dataSaida: new Date('2024-01-15T15:30:00'),
            vagasUtilizadas: [
              {
                vagaId: '3',
                endereco: 'Rua Teresa, 789',
                entrada: new Date('2024-01-15T13:30:00'),
                saida: new Date('2024-01-15T15:00:00'),
                duracao: 90,
              },
            ],
            rotaEntrada: ['Est. União e Indústria'],
            tempoTotalMunicipio: 150,
          },
          {
            id: 't4',
            placa: 'JKL-3456',
            tipoVeiculo: 'CAMINHAO_LONGO',
            origem: {
              municipio: 'Belo Horizonte',
              estado: 'MG',
              pontoAcesso: 'BR-040 - Duarte da Silveira',
            },
            destino: {
              municipio: 'Niterói',
              estado: 'RJ',
              pontoAcesso: 'BR-040 - Mosela',
            },
            dataEntrada: new Date('2024-01-16T07:45:00'),
            dataSaida: new Date('2024-01-16T11:15:00'),
            vagasUtilizadas: [
              {
                vagaId: '7',
                endereco: 'Estrada União e Indústria, 303',
                entrada: new Date('2024-01-16T08:30:00'),
                saida: new Date('2024-01-16T10:45:00'),
                duracao: 135,
              },
            ],
            rotaEntrada: ['BR-040', 'RJ-107', 'Estrada União e Indústria'],
            tempoTotalMunicipio: 210,
          },
        ];

        setVagas(mockVagas);
        setTrajetos(mockTrajetos);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDadosRelatorios();
  }, []);

  // Função para aplicar filtros às vagas
  const vagasFiltradas = useMemo(() => {
    return vagas.filter((vaga) => {
      // Filtro por faixa de utilização
      if (
        vaga.utilizacao < filtros.minUtilizacao ||
        vaga.utilizacao > filtros.maxUtilizacao
      ) {
        return false;
      }

      // Filtro por tipo de veículo
      if (filtros.tiposVeiculo.length > 0) {
        // Verifica se a vaga tem algum dos tipos de veículo selecionados
        const temTipoSelecionado = filtros.tiposVeiculo.some(
          (tipo) => vaga.veiculosPorTipo[tipo] > 0
        );
        if (!temTipoSelecionado) {
          return false;
        }
      }

      return true;
    });
  }, [vagas, filtros]);

  // Dados processados para gráficos
  const dadosGraficoVagas = useMemo(() => {
    return vagasFiltradas
      .map((v) => ({
        nome:
          v.endereco.split(',')[0].substring(0, 15) +
          (v.endereco.split(',')[0].length > 15 ? '...' : ''),
        endereco: v.endereco,
        utilizacao: v.utilizacao,
        totalUtilizacoes: v.totalUtilizacoes,
        tempoMedio: v.tempoMedioOcupacao,
        bairro: v.bairro,
      }))
      .sort((a, b) => b.utilizacao - a.utilizacao);
  }, [vagasFiltradas]);

  const dadosGraficoTiposVeiculo = useMemo(() => {
    const tipos: Record<string, number> = {};

    vagas.forEach((vaga) => {
      Object.entries(vaga.veiculosPorTipo).forEach(([tipo, quantidade]) => {
        if (!tipos[tipo]) tipos[tipo] = 0;
        tipos[tipo] += quantidade;
      });
    });

    return Object.entries(tipos).map(([tipo, value]) => ({
      name: tiposVeiculoInfo[tipo as TipoVeiculo],
      value,
    }));
  }, [vagas]);

  const dadosOrigemDestino = useMemo(() => {
    const origemMap = new Map<string, number>();
    const destinoMap = new Map<string, number>();

    trajetos.forEach((trajeto) => {
      const origemKey = `${trajeto.origem.municipio} - ${trajeto.origem.estado}`;
      const destinoKey = `${trajeto.destino.municipio} - ${trajeto.destino.estado}`;

      origemMap.set(origemKey, (origemMap.get(origemKey) || 0) + 1);
      destinoMap.set(destinoKey, (destinoMap.get(destinoKey) || 0) + 1);
    });

    return {
      origens: Array.from(origemMap.entries()).map(([name, value]) => ({
        name,
        value,
      })),
      destinos: Array.from(destinoMap.entries()).map(([name, value]) => ({
        name,
        value,
      })),
    };
  }, [trajetos]);

  // Trajetos filtrados por busca de rua
  const trajetosFiltrados = useMemo(() => {
    if (!buscaTrajeto.trim()) return trajetos;

    const termoBusca = buscaTrajeto.toLowerCase().trim();
    return trajetos.filter(
      (trajeto) =>
        trajeto.vagasUtilizadas.some((vaga) =>
          vaga.endereco.toLowerCase().includes(termoBusca)
        ) ||
        trajeto.placa.toLowerCase().includes(termoBusca) ||
        trajeto.origem.municipio.toLowerCase().includes(termoBusca) ||
        trajeto.destino.municipio.toLowerCase().includes(termoBusca)
    );
  }, [trajetos, buscaTrajeto]);

  const toggleTipoVeiculoFilter = (tipo: TipoVeiculo) => {
    setFiltros((prev) => ({
      ...prev,
      tiposVeiculo: prev.tiposVeiculo.includes(tipo)
        ? prev.tiposVeiculo.filter((t) => t !== tipo)
        : [...prev.tiposVeiculo, tipo],
    }));
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600 mb-4" />
        <span className="text-gray-600">Carregando relatórios...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Relatórios de Utilização - CPTRANS
        </h1>
        <p className="text-gray-600">
          Análise detalhada das vagas de carga/descarga e trajetos dos veículos
          no município
        </p>
      </div>

      {/* Seletor de modo de visualização */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setViewMode('VAGAS')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            viewMode === 'VAGAS'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Layers className="h-4 w-4" />
          Relatório de Vagas
        </button>
        <button
          onClick={() => setViewMode('TRAJETOS')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            viewMode === 'TRAJETOS'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Route className="h-4 w-4" />
          Relatório de Trajetos
        </button>

        <div className="flex-1"></div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FilterIcon className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filtros</h3>
          {/* Contador de filtros ativos */}
          {(filtros.tiposVeiculo.length > 0 ||
            filtros.minUtilizacao > 0 ||
            filtros.maxUtilizacao < 100) && (
            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {(filtros.tiposVeiculo.length > 0 ? 1 : 0) +
                (filtros.minUtilizacao > 0 || filtros.maxUtilizacao < 100
                  ? 1
                  : 0)}{' '}
              filtro(s) ativo(s)
            </span>
          )}
          {/* Botão para limpar filtros */}
          {(filtros.tiposVeiculo.length > 0 ||
            filtros.minUtilizacao > 0 ||
            filtros.maxUtilizacao < 100) && (
            <button
              onClick={() =>
                setFiltros({
                  periodo: {
                    inicio: new Date(
                      new Date().setDate(new Date().getDate() - 30)
                    ),
                    fim: new Date(),
                  },
                  tiposVeiculo: [],
                  minUtilizacao: 0,
                  maxUtilizacao: 100,
                })
              }
              className="ml-auto text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Limpar todos
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Filtro por período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={filtros.periodo.inicio.toISOString().split('T')[0]}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    periodo: {
                      ...prev.periodo,
                      inicio: new Date(e.target.value),
                    },
                  }))
                }
              />
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={filtros.periodo.fim.toISOString().split('T')[0]}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    periodo: { ...prev.periodo, fim: new Date(e.target.value) },
                  }))
                }
              />
            </div>
          </div>

          {/* Filtro por utilização */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faixa de Utilização (%)
            </label>
            <div className="space-y-4 pt-2">
              {/* Slider para mínimo */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">Mínimo:</span>
                  <span className="text-xs font-medium">
                    {filtros.minUtilizacao}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filtros.minUtilizacao}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      minUtilizacao: Math.min(
                        parseInt(e.target.value),
                        prev.maxUtilizacao
                      ),
                    }))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Slider para máximo */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">Máximo:</span>
                  <span className="text-xs font-medium">
                    {filtros.maxUtilizacao}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filtros.maxUtilizacao}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      maxUtilizacao: Math.max(
                        parseInt(e.target.value),
                        prev.minUtilizacao
                      ),
                    }))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Filtro por tipo de veículo */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Veículo
              </label>
              {filtros.tiposVeiculo.length > 0 && (
                <button
                  onClick={() =>
                    setFiltros((prev) => ({ ...prev, tiposVeiculo: [] }))
                  }
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Limpar
                </button>
              )}
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto p-1 border border-gray-200 rounded">
              {(Object.keys(tiposVeiculoInfo) as TipoVeiculo[]).map((tipo) => (
                <div
                  key={tipo}
                  className="flex items-center hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    id={`tipo-${tipo}`}
                    checked={filtros.tiposVeiculo.includes(tipo)}
                    onChange={() => toggleTipoVeiculoFilter(tipo)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label
                    htmlFor={`tipo-${tipo}`}
                    className="ml-2 text-sm text-gray-700 flex-1 cursor-pointer"
                  >
                    {tiposVeiculoInfo[tipo]}
                  </label>
                  {filtros.tiposVeiculo.includes(tipo) && (
                    <span className="text-blue-600 text-xs">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal baseado no modo de visualização */}
      {viewMode === 'VAGAS' ? (
        <>
          {/* KPIs das vagas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Vagas</p>
                  <p className="text-xl font-bold text-gray-900">
                    {vagasFiltradas.length}
                  </p>{' '}
                </div>
                <Layers className="h-6 w-6 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilização Média</p>
                  <p className="text-xl font-bold text-gray-900">
                    {vagasFiltradas.length > 0
                      ? Math.round(
                          vagasFiltradas.reduce(
                            (acc, v) => acc + v.utilizacao,
                            0
                          ) / vagasFiltradas.length
                        )
                      : 0}
                    %
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tempo Médio</p>
                  <p className="text-xl font-bold text-gray-900">
                    {vagasFiltradas.length > 0
                      ? Math.round(
                          vagasFiltradas.reduce(
                            (acc, v) => acc + v.tempoMedioOcupacao,
                            0
                          ) / vagasFiltradas.length
                        )
                      : 0}{' '}
                    min
                  </p>
                </div>
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vagas Acima de 80%</p>
                  <p className="text-xl font-bold text-gray-900">
                    {vagasFiltradas.filter((v) => v.utilizacao > 80).length}{' '}
                  </p>
                </div>
                <MapPin className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>

          {/* Gráficos principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Gráfico de barras - Utilização por vaga */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Utilização por Vaga (Top 10)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dadosGraficoVagas.slice(0, 10)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="nome"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      interval={0}
                      fontSize={12}
                    />
                    <YAxis
                      label={{
                        value: '% Utilização',
                        angle: -90,
                        position: 'insideLeft',
                        offset: -10,
                      }}
                      fontSize={12}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Utilização']}
                      labelFormatter={(label, payload) => {
                        const item = payload[0]?.payload;
                        return item ? `Vaga: ${item.endereco}` : label;
                      }}
                    />
                    <Bar
                      dataKey="utilizacao"
                      name="% de Utilização"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico de tipos de veículos */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Distribuição por Tipo de Veículo
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dadosGraficoTiposVeiculo}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      name="Quantidade de Usos"
                      fill="#00C49F"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tabela de vagas detalhada */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Search className="h-5 w-5" />
                Lista Detalhada de Vagas
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endereço
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bairro
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilização
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tempo Médio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Usos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horário Pico
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vagas.map((vaga) => (
                    <tr
                      key={vaga.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedVaga === vaga.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() =>
                        setSelectedVaga(
                          vaga.id === selectedVaga ? null : vaga.id
                        )
                      }
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 text-sm">
                          {vaga.endereco}
                        </div>
                        <div className="text-xs text-gray-500">
                          {vaga.bairro}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {vaga.bairro}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                vaga.utilizacao > 80
                                  ? 'bg-red-500'
                                  : vaga.utilizacao > 60
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${vaga.utilizacao}%` }}
                            ></div>
                          </div>
                          <span className="font-medium text-sm">
                            {vaga.utilizacao}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">
                            {vaga.tempoMedioOcupacao} min
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-sm">
                        {vaga.totalUtilizacoes}
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {vaga.horarioPico}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* KPIs dos trajetos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Trajetos</p>
                  <p className="text-xl font-bold text-gray-900">
                    {trajetos.length}
                  </p>
                </div>
                <Route className="h-6 w-6 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Municípios Diferentes</p>
                  <p className="text-xl font-bold text-gray-900">
                    {
                      new Set(
                        trajetos.map(
                          (t) => `${t.origem.municipio}-${t.origem.estado}`
                        )
                      ).size
                    }
                  </p>
                </div>
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Tempo Médio no Município
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {Math.round(
                      trajetos.reduce(
                        (acc, t) => acc + t.tempoTotalMunicipio,
                        0
                      ) / trajetos.length
                    )}{' '}
                    min
                  </p>
                </div>
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vagas Múltiplas</p>
                  <p className="text-xl font-bold text-gray-900">
                    {
                      trajetos.filter((t) => t.vagasUtilizadas.length > 1)
                        .length
                    }
                  </p>
                </div>
                <Layers className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Gráficos de origem */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full max-w-2xl">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Origem dos Veículos
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dadosOrigemDestino.origens.slice(0, 8)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      name="Quantidade"
                      fill="#0088FE"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tabela de vagas detalhada */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Search className="h-5 w-5" />
                Lista Detalhada de Vagas
                {vagasFiltradas.length !== vagas.length && (
                  <span className="text-sm font-normal text-gray-600">
                    ({vagasFiltradas.length} de {vagas.length} vagas)
                  </span>
                )}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endereço
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bairro
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilização
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tempo Médio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Usos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horário Pico
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vagasFiltradas.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Nenhuma vaga encontrada com os filtros atuais
                      </td>
                    </tr>
                  ) : (
                    vagasFiltradas.map(
                      (
                        vaga // ← AQUI ESTÁ O MAP CORRIGIDO
                      ) => (
                        <tr
                          key={vaga.id}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selectedVaga === vaga.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() =>
                            setSelectedVaga(
                              vaga.id === selectedVaga ? null : vaga.id
                            )
                          }
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900 text-sm">
                              {vaga.endereco}
                            </div>
                            <div className="text-xs text-gray-500">
                              {vaga.bairro}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {vaga.bairro}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    vaga.utilizacao > 80
                                      ? 'bg-red-500'
                                      : vaga.utilizacao > 60
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                                  }`}
                                  style={{ width: `${vaga.utilizacao}%` }}
                                ></div>
                              </div>
                              <span className="font-medium text-sm">
                                {vaga.utilizacao}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">
                                {vaga.tempoMedioOcupacao} min
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-sm">
                            {vaga.totalUtilizacoes}
                          </td>
                          <td className="px-4 py-3">
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {vaga.horarioPico}
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Footer informativo */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              Relatórios CPTRANS
            </h4>
            <p className="text-sm text-gray-600">
              Companhia Petropolitana de Trânsito e Transporte
            </p>
          </div>
          <div className="text-sm text-gray-500">
            <p>Atualizado em: {new Date().toLocaleDateString('pt-BR')}</p>
            <p>
              Período analisado:{' '}
              {filtros.periodo.inicio.toLocaleDateString('pt-BR')} a{' '}
              {filtros.periodo.fim.toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
