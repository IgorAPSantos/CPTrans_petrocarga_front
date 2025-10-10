export type DiaSemana =
  | "SEGUNDA"
  | "TERCA"
  | "QUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SABADO"
  | "DOMINGO";

export type OperacoesVaga = {
  diaSemana: DiaSemana; // apenas um dia por operação
  horaInicio: string;
  horaFim: string;
};

export type Endereco = {
  id: string;
  codidoPmp: string;
  logradouro: string;
  bairro: string;
};

export type Vaga = {
  id: string;
  area: string;
  numeroEndereco: string;
  referenciaEndereco: string;
  tipoVaga: string;
  referenciaGeoInicio: string;
  referenciaGeoFim: string;
  comprimento: number;
  status: "DISPONIVEL" | "OCUPADO" | "MANUTENCAO" | string;
  operacoesVaga: OperacoesVaga[]; // array de operações
  endereco: Endereco; // nome correto conforme JSON
};
