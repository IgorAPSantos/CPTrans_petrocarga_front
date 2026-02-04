export type Usuario = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
};

export type Motorista = {
  id: string;
  numeroCnh: string;
  tipoCnh: string;
  dataValidadeCnh: string;
  empresaId?: string | null;
  usuario: Usuario;
};

export type MotoristaUsuario = {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
};

export type MotoristaPayload = {
  usuario: MotoristaUsuario;
  tipoCnh: string;
  numeroCnh: string;
  dataValidadeCnh: string;
};
export type MotoristaPatchPayload = {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
  tipoCnh: string;
  numeroCnh: string;
  dataValidadeCnh: string;
};

export type MotoristaResult = {
  error: boolean;
  message?: string;
  valores?: MotoristaPayload;
  motoristaId?: string;
  motorista?: unknown;
  motoristas?: unknown[];
};

export interface FiltrosMotorista {
  nome?: string;
  cnh?: string;
  telefone?: string;
  ativo?: boolean;
}
