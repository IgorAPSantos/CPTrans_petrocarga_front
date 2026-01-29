export interface DashboardKPIs {
  success: any;
  message: any;
  data: null;
  totalSlots: number;
  activeReservations: number;
  occupancyRate: number;
  completedReservations: number;
  canceledReservations: number;
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
  type: 'district' | 'origin';
  reservationCount: number;
}

export interface DashboardSummary {
  success: any;
  message: string;
  data: null;
  kpis: DashboardKPIs;
  vehicleTypes: VehicleType[];
  districts: LocationStat[];
  origins: LocationStat[];
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
}
