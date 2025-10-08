export type Vaga = {
    id: number;
    area: string;
    comprimento: number;
    horario_fim: number;
    horario_inicio: number;
    localizacao: string;
    max_eixos: number;
    status: string;
    descricao: string;
    endereco: Endereco;
    diasSemana: string[];
    latitude: number; 
    longitude: number;  
};

type Endereco = {
    id: number;
    codigo_PMP: string;
    logradouro: string;
    bairro: string;
}