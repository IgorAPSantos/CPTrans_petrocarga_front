export type Vaga = {
  id: string; // UUID
  area: string;
  numeroEndereco: string;
  referenciaEndereco: string;
  tipoVaga: string;
  referenciaGeoInicio: string; // "-22.509135, -43.171351"
  referenciaGeoFim: string; // "-22.509135, -43.171351"
  comprimento: number;
  status: string;
  operacoesVaga: OperacaoesVaga;
  enderecoVagaResponseDTO: Endereco;
};

export type Endereco = {
  id: string; // UUID
  codidoPmp: string;
  logradouro: string;
  bairro: string;
};

export type OperacaoesVaga = {
  diaSemana: [];
  horaInicio: string;
  horaFim: string;
};
