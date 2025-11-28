export type Reserva = {
  id: string;
  numeroEndereco: string;
  referenciaEndereco: string;
  enderecoVaga: {
    id: string;
    codigoPmp: string;
    logradouro: string;
    bairro: string;
  };
  inicio: string; 
  fim: string;    
  tamanhoVeiculo: number;
  placaVeiculo: string;
  status: "ATIVA" | "CONCLUIDA";
  vaga: string; 
};
