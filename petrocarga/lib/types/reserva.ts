export type Reserva = {
  id: string;
  vagaId: string;
  referenciaGeoInicio: string;
  referenciaGeoFim: string;
  motoristaId: string;
  veiculoId: string;
  criadoPorId: string;
  cidadeOrigem: string;
  criadoEm: string;
  inicio: string;
  fim: string;
  status: "ATIVA" | "CANCELADA" | "FINALIZADA";
};
