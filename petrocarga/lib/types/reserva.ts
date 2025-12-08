export type Reserva = {
  id: string;
  numeroEndereco: string;
  referenciaEndereco: string;
  enderecoVaga: {
    id: string;
    codigoPmp: string;
    logradouro: string;
    bairro: string;
  };
  inicio: string; 
  fim: string;    
  tamanhoVeiculo: number;
  placaVeiculo: string;
  status: "ATIVA" | "CONCLUIDA" | "RESERVADA" | "REMOVIDA" | "CANCELADA";
  vaga: string; 
};

export type ReservaGet = {
  id: string;
  vagaId: string;
  referenciaGeoInicio: string;
  logradouro: string;
  bairro: string;
  referenciaGeoFim: string;
  motoristaId: string;
  veiculoId: string;
  criadoPorId: string;
  cidadeOrigem: string;
  criadoEm: string;
  inicio: string;
  fim: string;
  status: "ATIVA" | "CONCLUIDA" | "RESERVADA" | "REMOVIDA" | "CANCELADA";
};
