export type Vaga = {
  id: string; // UUID
  area: string;
  comprimento: number;
  horarioInicio: string; // "08:00:00"
  horarioFim: string; // "18:00:00"
  localizacao: string; // "-22.509135, -43.171351"
  maxEixos: number;
  status: string;
  diasSemana: string[];
  enderecoVagaResponseDTO: Endereco;
};

export type Endereco = {
  id: string; // UUID
  codidoPmp: string;
  logradouro: string;
  bairro: string;
};
