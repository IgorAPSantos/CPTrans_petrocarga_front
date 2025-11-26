import { Veiculo } from "./veiculo";

export interface ReservaState {
  step: number;
  selectedDay?: Date;
  availableTimes: string[];
  reservedTimes: string[];
  startHour: string | null;
  endHour: string | null;
  origin: string;

  // motorista
  selectedVehicleId?: string;

  // agente
  tipoVeiculoAgente?: Veiculo["tipo"];
  placaAgente: string;
}
