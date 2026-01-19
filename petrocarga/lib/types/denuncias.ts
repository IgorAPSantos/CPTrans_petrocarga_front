export type EnderecoVaga = {
  id: string;
  codigoPmp: string;
  logradouro: string;
  bairro: string;
};

export type Denuncia = {
  id: string;
  descricao: string;
  criadoPorId: string;
  vagaId: string;
  reservaId: string;
  enderecoVaga: EnderecoVaga;
  numeroEndereco: string;
  referenciaEndereco: string;
  status: 'ABERTA' | 'EM_ANALISE' | 'PROCEDENTE' | 'IMPROCEDENTE';
  tipo: 'USO_INDEVIDO_DA_VAGA' | string;
  resposta: string | null;
  atualizadoPorId: string | null;
  criadoEm: string;
  atualizadoEm: string | null;
  encerradoEm: string | null;
};
