export interface ReservaRapida {
  id: string;
  vagaId: string;
  agenteId: string;
  logradouro: string;
  bairro: string;
  tipoVeiculo: string;
  placa: string;
  inicio: string;
  fim: string;
  triadoEm: string;
  status: 'RESERVADA' | 'CANCELADA' | 'EXPIRADA';
}
