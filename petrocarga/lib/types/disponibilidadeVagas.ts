export type Disponibilidade = {
  id: string;
  vagaId: string;
  endereco: {
    id: string;
    codigoPmp: string;
    logradouro: string;
    bairro: string;
  };
  referenciaEndereco: string;
  numeroEndereco: string;
  inicio: string;
  fim: string;
  criadoEm: string;
  criadoPorId: string;
};
