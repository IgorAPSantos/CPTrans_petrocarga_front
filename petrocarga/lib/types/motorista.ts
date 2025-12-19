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
