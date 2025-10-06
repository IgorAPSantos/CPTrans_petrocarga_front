"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addVaga(prevState: any, formData: FormData) {
    // Extrair valores do formData para retornar em caso de erro
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
            valores, // Retorna os valores para manter no formulário
        };
    }

    revalidatePath('/registrar-vagas');
    
    // Opcional: retornar sucesso ou redirecionar
    return {
        error: false,
        message: "Vaga cadastrada com sucesso!",
        valores: null, // Limpa os valores em caso de sucesso
    };
}