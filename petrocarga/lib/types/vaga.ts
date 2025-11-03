// Tipos de dias da semana
export type DiaSemana =
  | "DOMINGO"
  | "SEGUNDA"
  | "TERCA"
  | "QUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SABADO";

// Tipo para operações da vaga (horários por dia)
export type OperacoesVaga = {
  id: string;
  diaSemanaAsEnum: DiaSemana;
  horaInicio: string; // ex: "00:00:00"
  horaFim: string; // ex: "13:00:00"
};

// Endereço da vaga
export type Endereco = {
  id: string;
  codigoPmp: string;
  logradouro: string;
  bairro: string;
};

// Tipo principal da vaga
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
