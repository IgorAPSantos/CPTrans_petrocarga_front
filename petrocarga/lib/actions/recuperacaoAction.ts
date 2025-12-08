'use server';

import { serverApi } from "@/lib/serverApi";

// 1. SOLICITAR RECUPERAÇÃO (envia email com código)
export async function solicitarRecuperacaoSenha(email: string): Promise<void> {
  try {
    // Endpoint que envia email com código de recuperação
    const res = await serverApi('/petrocarga/auth/solicitar-recuperacao', {
      method: 'POST',
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Falha ao enviar email com código de recuperação');
    }

  } catch (error: any) {
    // Tratamento específico de erros
    if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    }
    
    if (error.message.includes('Não encontrado') || error.message.includes('inexistente')) {
      throw new Error('Email não encontrado. Verifique se digitou corretamente.');
    }

    throw new Error(error.message || 'Erro ao processar sua solicitação. Tente novamente.');
  }
}

// 2. VALIDAR CÓDIGO DE RECUPERAÇÃO
export async function validarCodigoRecuperacao(
  email: string,
  codigo: string
): Promise<void> {
  try {
    const res = await serverApi('/petrocarga/auth/validar-codigo', {
      method: 'POST',
      body: JSON.stringify({ 
        email: email.trim(),
        codigo: codigo.trim().toUpperCase()
      })
    });

    const data = await res.json();

    if (!res.ok || !data.valido) {
      const mensagemErro = data.message || 'Código inválido ou expirado.';
      throw new Error(mensagemErro);
    }

    // Código válido - não precisa retornar nada
  } catch (error: any) {
    if (error.message.includes('expirado')) {
      throw new Error('Código expirado. Solicite um novo código.');
    }
    
    if (error.message.includes('inválido')) {
      throw new Error('Código inválido. Verifique e tente novamente.');
    }
    
    throw new Error(error.message || 'Erro ao validar código. Tente novamente.');
  }
}

// 3. REDEFINIR SENHA COM CÓDIGO
export async function redefinirSenhaComCodigo(
  email: string,
  codigo: string,
  novaSenha: string
): Promise<void> {
  try {
    const res = await serverApi('/petrocarga/auth/redefinir-senha-com-codigo', {
      method: 'POST',
      body: JSON.stringify({ 
        email: email.trim(),
        codigo: codigo.trim().toUpperCase(),
        novaSenha
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Falha ao redefinir senha');
    }

    // Sucesso - não precisa retornar nada
  } catch (error: any) {
    if (error.message.includes('expirado')) {
      throw new Error('Código expirado. Solicite um novo código de recuperação.');
    }
    
    if (error.message.includes('inválido')) {
      throw new Error('Código inválido. Verifique e tente novamente.');
    }
    
    throw new Error(error.message || 'Erro ao redefinir senha. Tente novamente.');
  }
}