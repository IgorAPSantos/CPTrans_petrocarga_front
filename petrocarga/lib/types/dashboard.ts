export interface DashboardKPIs {
  totalSlots: number;
  activeReservations: number;
  pendingReservations: number;
  occupancyRate: number;
  completedReservations: number;
  canceledReservations: number;
  removedReservations: number;
  totalReservations: number;
  multipleSlotReservations: number;
  startDate: string;
  endDate: string;
}

export interface VehicleType {
  type: string;
  count: number;
  uniqueVehicles: number;
}

// Atualizado para incluir 'most-used'
export type LocationStatType =
  | 'district'
  | 'origin'
  | 'entry-origin'
  | 'most-used';

export interface LocationStat {
  name: string;
  type: LocationStatType;
  reservationCount: number;
}

// Novas interfaces para métricas avançadas
export interface StayDurationStats {
  avgMinutes: number;
  minMinutes: number | null;
  maxMinutes: number | null;
}

export interface ActiveDuringPeriodStats {
  total: number;
  reserva: number;
  reservaRapida: number;
}

export interface LengthOccupancyStats {
  availableLengthMeters: number;
  occupiedLengthMeters: number;
  occupancyRatePercent: number;
}

// Interface para paradas de rota de veículos
export interface VehicleRouteStop {
  source: 'RESERVA' | 'RESERVA_RAPIDA';
  inicio: string; // ISO string
  fim: string; // ISO string
  cidadeOrigem: string | null;
  entradaCidade: string | null;
  vagaId: string;
  vagaLabel: string;
}

// Interface para relatório de rota de veículo
export interface VehicleRouteReport {
  placa: string;
  periodStart: string; // ISO string
  periodEnd: string; // ISO string
  stops: VehicleRouteStop[];
}

// Interface principal do Dashboard Summary atualizada
export interface DashboardSummary {
  kpis: DashboardKPIs;
  vehicleTypes: VehicleType[];
  districts: LocationStat[];
  origins: LocationStat[];
  entryOrigins: LocationStat[];
  mostUsedVagas: LocationStat[];
  stayDurationStats?: StayDurationStats;
  activeDuringPeriodStats?: ActiveDuringPeriodStats;
  lengthOccupancyStats?: LengthOccupancyStats;
  vehicleRoutes?: VehicleRouteReport[];
}

// Interfaces auxiliares para filtros
export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
}

// Tipo para componente de cards de métrica avançada
export interface AdvancedMetricCard {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  subItems?: Array<{
    label: string;
    value: string | number;
  }>;
}

// Tipo para dados de timeline de rota
export interface RouteTimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: 'parking' | 'origin' | 'entry' | 'destination';
  color: 'blue' | 'green' | 'purple' | 'gray';
}

// Tipo para gráfico de ocupação por comprimento
export interface LengthOccupancyChartData {
  label: string;
  available: number;
  occupied: number;
  percentage: number;
}

// Tipo para estatísticas de tempo de permanência
export interface DurationStatsDisplay {
  avg: string; // Formatado: "2h 30min"
  min: string | null; // Formatado: "30min"
  max: string | null; // Formatado: "8h 15min"
}
