export type EnderecoVaga = {
  id: string;
  codigoPmp: string;
  logradouro: string;
  bairro: string;
};

export type Denuncia = {
  id: string;
  criadoPorId: string;
  vagaId: string;
  reservaId: string;
  veiculoId: string;

  nomeMotorista: string;
  telefoneMotorista: string;

  descricao: string;

  enderecoVaga: EnderecoVaga;
  numeroEndereco: string;
  referenciaEndereco: string;

  marcaVeiculo: string;
  modeloVeiculo: string;
  placaVeiculo: string;
  tamanhoVeiculo: number;

  status: 'ABERTA' | 'EM_ANALISE' | 'PROCEDENTE' | 'IMPROCEDENTE';
  tipo: 'USO_INDEVIDO_DA_VAGA';

  resposta: string;
  atualizadoPorId: string;

  criadoEm: string;
  atualizadoEm: string;
  encerradoEm: string;
};
