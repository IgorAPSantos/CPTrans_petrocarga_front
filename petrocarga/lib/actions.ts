"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addVaga(prevState: unknown, formData: FormData) {
    {/* Extrair valores do formData para retornar em caso de erro */}
    const valores = {
        codigo: formData.get("codigo") as string,
        logradouro: formData.get("logradouro") as string,
        localizacao: formData.get("localizacao") as string,
        bairro: formData.get("bairro") as string,
        horarioInicio: formData.get("horarioInicio") as string,
        horarioFim: formData.get("horarioFim") as string,
        diaSemana: Number(formData.get("diaSemana")),
        comprimento: Number(formData.get("comprimento")),
        descricao: formData.get("descricao") as string,
    };

    const res = await fetch('http://localhost:3000/registrar-vagas', {
        method: 'POST',
        body: formData,
    });

    if(!res.ok) {
        return {
            error: true,
            message: (await res.json()).message,
            valores, /* Retorna os valores para manter no formulário */
        };
    }

    revalidatePath('/registrar-vagas');
    
    {/* Retornar sucesso ou redirecionar */}
    return {
        error: false,
        message: "Vaga cadastrada com sucesso!",
        valores: null, /* Limpa os valores em caso de sucesso */
    };
}

export async function deleteVaga(id: string) {
    const res = await fetch(`http://localhost:3000/visualizar-vagas/${id}`, {
        method: 'DELETE',
    });
    if(!res.ok) {
        throw new Error('Erro ao deletar a vaga');
    }

    revalidatePath('/visualizar-vagas');
}

export async function atualizarVaga(prevState: unknown, formData: FormData) {
    {/* Certifique-se de enviar o ID no formData */}
    const id = formData.get("id") as string;
    
    {/* Extrair valores para retornar em caso de erro */}
    const valores = {
        codigo: formData.get("codigo") as string,
        logradouro: formData.get("logradouro") as string,
        numeroEndereco: formData.get("numeroEndereco") as string,
        area: formData.get("area") as string,
        tipo: formData.get("tipo") as string,
        bairro: formData.get("bairro") as string,
        comprimento: Number(formData.get("comprimento")),
        descricao: formData.get("descricao") as string,
        localizacaoInicio: formData.get("localizacao-inicio") as string,
        localizacaoFim: formData.get("localizacao-fim") as string,
        diaSemana: formData.get("diaSemana") as string,
    };

    const res = await fetch(`http://localhost:3000/visualizar-vagas/${id}/editar-vaga`, {
        method: 'PUT',
        body: formData,
    });

    if(!res.ok) {
        return {
            error: true,
            message: (await res.json()).message,
            valores,
        };
    } 

    {/* Revalida a lista e a página específica da vaga */}
    revalidatePath('/visualizar-vagas');
    revalidatePath(`/visualizar-vagas/${id}`);
    
    {/* Redireciona após sucesso */}
    redirect(`/visualizar-vagas/${id}`);
}