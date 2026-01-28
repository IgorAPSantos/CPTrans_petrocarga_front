export interface EnderecoVaga {
  id: string;
  codigoPmp: string;
  logradouro: string;
  bairro: string;
}

export interface UsuarioReserva {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  permissao: string;
  criadoEm: string;
  ativo: boolean;
  desativadoEm?: string;
}

export interface ReservaPlaca {
  id: string;
  vagaId: string;
  motoristaId: string;
  motoristaNome: string;
  motoristaCpf: string;
  numeroEndereco: string;
  referenciaEndereco: string;
  enderecoVaga: EnderecoVaga;
  inicio: string;
  fim: string;
  tamanhoVeiculo: number;
  placaVeiculo: string;
  modeloVeiculo: string;
  marcaVeiculo: string;
  cpfProprietarioVeiculo: string;
  cnpjProprietarioVeiculo: string;
  status: 'RESERVADA' | 'ATIVA' | 'FINALIZADA' | 'CANCELADA';
  criadoPor: UsuarioReserva;
  criadoEm: string;
}

export interface ReservasPorPlacaResponse {
  reservas: ReservaPlaca[];
  total: number;
}
