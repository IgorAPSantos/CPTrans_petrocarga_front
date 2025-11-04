export interface ReservaState {
  step: number;
  selectedDay?: Date;
  availableTimes: string[];
  reservedTimes: string[];
  startHour: string | null;
  endHour: string | null;
  origin: string;
  selectedVehicleId?: string;
}
