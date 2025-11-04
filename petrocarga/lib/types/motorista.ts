export type Motorista = {
    id: string;
    nome: string;
    cpf: string;
    telefone: string;
    numeroCNH: string;
    tipoCNH: string;
    dataValidadeCNH: string;
    empresaId?: string | null;
    email: string;
    senha: string;
}