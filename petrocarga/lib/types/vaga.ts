export type DiaSemana =
  | "DOMINGO"
  | "SEGUNDA"
  | "TERCA"
  | "QUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SABADO";

export type OperacoesVaga = {
  id: string;
  diaSemanaEnum: DiaSemana;
  horaInicio: string;
  horaFim: string;
};

export type Endereco = {
  id: string;
  codidoPMP: string;
  logradouro: string;
  bairro: string;
};

export type Vaga = {
  id: string;
  area: string;
  numeroEndereco: string;
  referenciaEndereco: string;
  tipoVaga: "PARALELA" | "PERPENDICULAR" | string;
  referenciaGeoInicio: string;
  referenciaGeoFim: string;
  comprimento: number;
  status: "DISPONIVEL" | "OCUPADO" | "MANUTENCAO" | "INDISPONIVEL" | string;
  operacoesVaga: OperacoesVaga[];
  endereco: Endereco;
};
