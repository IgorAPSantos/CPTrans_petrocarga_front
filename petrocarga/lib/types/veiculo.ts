export type Veiculo = {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  tipo:
    | 'AUTOMOVEL'
    | 'VUC'
    | 'CAMINHONETA'
    | 'CAMINHAO_MEDIO'
    | 'CAMINHAO_LONGO';
  usuarioId?: string;
  cpfProprietario?: string | null;
  cnpjProprietario?: string | null;
};

export type VeiculoAPI = {
  id: string;
  name: string;
  plate: string;
};
