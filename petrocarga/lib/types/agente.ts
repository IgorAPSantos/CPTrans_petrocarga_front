export type Usuario = {
  id: string;
  nome: string,
  cpf: string,
  telefone: string,
  email: string,
  senha: string
}

export type Agente = {
  id: string;
  matricula: string;
  usuario: Usuario;
}