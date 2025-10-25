"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addMotorista(prevState: unknown, formData: FormData) {
    // Extrair dados do formulário
    const rawData = {
        nome: formData.get("nome") as string,
        cpf: formData.get("cpf") as string,
        telefone: formData.get("telefone") as string,
        email: formData.get("email") as string,
        confirmacaoEmail: formData.get("confirmacaoEmail") as string,
        senha: formData.get("senha") as string,
        confirmacaoSenha: formData.get("confirmacaoSenha") as string,
        numeroCnh: formData.get("numeroCnh") as string,
        categoriaCnh: formData.get("categoriaCnh") as string,
        dataVencimentoCnh: formData.get("dataVencimentoCnh") as string,
    };

    // VALIDAÇÕES
    const erros: string[] = [];

    // Campos obrigatórios
    const camposObrigatorios = [
        'nome', 'cpf', 'telefone', 'email', 'confirmacaoEmail', 
        'senha', 'confirmacaoSenha', 'numeroCnh', 'categoriaCnh', 'dataVencimentoCnh'
    ];

    camposObrigatorios.forEach(campo => {
        if (!rawData[campo as keyof typeof rawData]?.toString().trim()) {
            erros.push(`O campo ${campo} é obrigatório`);
        }
    });

    // Email
    if (rawData.email !== rawData.confirmacaoEmail) {
        erros.push("Os emails não correspondem");
    }

    // Validação básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (rawData.email && !emailRegex.test(rawData.email)) {
        erros.push("Formato de email inválido");
    }

    // Senha
    if (rawData.senha !== rawData.confirmacaoSenha) {
        erros.push("As senhas não correspondem");
    }

    if (rawData.senha && rawData.senha.length < 6) {
        erros.push("A senha deve ter pelo menos 6 caracteres");
    }

    // CPF
    if (rawData.cpf && rawData.cpf.length !== 11) {
        erros.push("CPF deve ter 11 dígitos");
    }

    // Telefone
    if (rawData.telefone && rawData.telefone.length < 10) {
        erros.push("Telefone deve ter pelo menos 10 dígitos");
    }

    // Data de vencimento da CNH
    if (rawData.dataVencimentoCnh) {
        const dataVencimento = new Date(rawData.dataVencimentoCnh);
        const hoje = new Date();
        if (dataVencimento <= hoje) {
            erros.push("A data de vencimento da CNH deve ser futura");
        }
    }

    // Se houver erros, retorna imediatamente
    if (erros.length > 0) {
        return {
            error: true,
            message: erros.join(", "),
            valores: rawData,
        };
    }

    // Montar payload para a API (após validações)
    const payload = {
        nome: rawData.nome,
        cpf: rawData.cpf,
        telefone: rawData.telefone,
        email: rawData.email,
        senha: rawData.senha,
        numero_cnh: rawData.numeroCnh,
        categoria_cnh: rawData.categoriaCnh.toUpperCase(),
        data_validade_cnh: rawData.dataVencimentoCnh,
    };

    try {
        const res = await fetch("https://cptranspetrocargaback-production.up.railway.app/petrocarga/motoristas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return {
                error: true,
                message: errorData.message || "Erro ao cadastrar motorista",
                valores: rawData,
            };
        }

        revalidatePath("/gestor/lista-motoristas");
        
        return {
            error: false,
            message: "Motorista cadastrado com sucesso!",
            valores: null,
        };

    } catch (error) {
        return {
            error: true,
            message: "Erro de conexão com o servidor",
            valores: rawData,
        };
    }
}

export async function deleteMotorista(motoristaId: string) {
    const res = await fetch(`https://cptranspetrocargaback-production.up.railway.app/petrocarga/motoristas/${motoristaId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const errorData = await res.json();
        return {
            error: true,
            message: errorData.message || "Erro ao deletar motorista",
        };
    }

    revalidatePath("/motoristas/veiculos&reservas");
    return {
        error: false,
        message: "Motorista deletado com sucesso!",
    };
}

export async function atualizarMotorista(prevState: unknown, formData: FormData) {
    // Certifique-se de enviar o ID no formData
    const id = formData.get("id") as string;

    // Extrair e montar o payload JSON
    const payload = {
        nome: formData.get("nome") as string,
        cpf: formData.get("cpf") as string,
        telefone: formData.get("telefone") as string,
        email: formData.get("email") as string,
        senha: formData.get("senha") as string,
        numero_cnh: formData.get("numeroCnh") as string,
        categoria_cnh: (formData.get("categoriaCnh") as string)?.toUpperCase(),
        data_validade_cnh: formData.get("dataValidadeCnh") as string,
    };

    const res = await fetch(`https://cptranspetrocargaback-production.up.railway.app/petrocarga/motoristas/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorData = await res.json();
        return {
            error: true,
            message: errorData.message || "Erro ao atualizar motorista",
            valores: payload,
        };
    }

    // Revalida a página de listagem de motoristas
    revalidatePath("/gestor/lista-motoristas");
    revalidatePath("/motoristas/perfil");
    return {
        error: false,
        message: "Perfil atualizado com sucesso!",
        valores: null,
    };

    // Redirecionar para a página de perfil do motorista
    redirect("/motoristas/perfil");
}