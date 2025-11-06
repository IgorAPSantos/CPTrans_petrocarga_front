export type Usuario = {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
}

export type Motorista = {
    id: string;
    numeroCNH: string;
    tipoCNH: string;
    dataValidadeCNH: string;
    empresaId?: string | null;
    usuario: Usuario;
}