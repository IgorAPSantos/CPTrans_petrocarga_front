interface MotoristaUsuario {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
}

interface MotoristaPayload {
  usuario: MotoristaUsuario;
  tipoCnh: string;
  numeroCnh: string;
  dataValidadeCnh: string;
}
interface MotoristaPatchPayload {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
  tipoCnh: string;
  numeroCnh: string;
  dataValidadeCnh: string;
}

interface MotoristaResult {
  error: boolean;
  message?: string;
  valores?: MotoristaPayload;
  motoristaId?: string;
  motorista?: unknown;
  motoristas?: unknown[];
}
