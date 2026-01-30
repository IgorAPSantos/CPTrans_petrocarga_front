export interface DashboardKPIs {
  totalSlots: number;
  activeReservations: number;
  pendingReservations: number; // NOVO CAMPO
  occupancyRate: number;
  completedReservations: number;
  canceledReservations: number;
  removedReservations: number; // NOVO CAMPO
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

export interface LocationStat {
  name: string;
  type: 'district' | 'origin' | 'entry-origin';
  reservationCount: number;
}

export interface DashboardSummary {
  kpis: DashboardKPIs;
  vehicleTypes: VehicleType[];
  districts: LocationStat[];
  origins: LocationStat[];
  entryOrigins: LocationStat[];
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
}
