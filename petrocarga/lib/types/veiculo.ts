export type Veiculo = {
    id: string;
    placa: string;
    marca: string;
    modelo: string;
    tipo: "CARRO" | "VUC" | "CAMINHONETA" | "CAMINHAOMEDIO" | "CAMINHAOLONGO" | "CARRETA" | string;
    cpfProprietario: string | null;
    cnpjProprietario: string | null;
}