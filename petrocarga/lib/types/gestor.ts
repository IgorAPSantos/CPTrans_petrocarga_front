export type Gestor = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
};

export interface FiltrosGestor {
  nome?: string;
  email?: string;
  telefone?: string;
  ativo?: boolean;
}
