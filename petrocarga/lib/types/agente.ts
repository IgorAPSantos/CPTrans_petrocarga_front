export type Usuario = {
  id: string;
  nome: string,
  cpf: string,
  telefone: string,
  email: string,
  senha: string
}

export type Agente = {
  matricula: string;
  usuario: Usuario;
}