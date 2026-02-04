export type Usuario = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
};

export type Agente = {
  id: string;
  matricula: string;
  usuario: Usuario;
};

export interface FiltrosAgente {
  nome?: string;
  matricula?: string;
  email?: string;
  telefone?: string;
  ativo?: boolean;
}
