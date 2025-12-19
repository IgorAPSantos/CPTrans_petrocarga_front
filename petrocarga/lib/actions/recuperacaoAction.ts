'use server';

import { serverApi } from '@/lib/serverApi';

// Função SUPER simples para extrair mensagem
function extractMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Ocorreu um erro. Tente novamente.';
}

// 1. SOLICITAR RECUPERAÇÃO
export async function solicitarRecuperacaoSenha(email: string): Promise<void> {
  try {
    const res = await serverApi('/petrocarga/auth/solicitar-recuperacao', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      // Se o backend deu uma mensagem, usa ela. Senão, mensagem genérica.
      throw new Error(
        data.message || 'Não foi possível enviar o código de recuperação',
      );
    }
  } catch (error: unknown) {
    // Simplesmente passa a mensagem adiante
    throw new Error(extractMessage(error));
  }
}

// 2. VALIDAR CÓDIGO
export async function validarCodigoRecuperacao(
  email: string,
  codigo: string,
): Promise<void> {
  try {
    const res = await serverApi('/petrocarga/auth/validar-codigo', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        codigo: codigo.trim().toUpperCase(),
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.valido) {
      // Confia na mensagem do backend
      throw new Error(data.message || 'Código inválido ou expirado');
    }
  } catch (error: unknown) {
    throw new Error(extractMessage(error));
  }
}

// 3. REDEFINIR SENHA
export async function redefinirSenhaComCodigo(
  email: string,
  codigo: string,
  novaSenha: string,
): Promise<void> {
  try {
    const res = await serverApi('/petrocarga/auth/redefinir-senha-com-codigo', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        codigo: codigo.trim().toUpperCase(),
        novaSenha,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Não foi possível redefinir a senha');
    }
  } catch (error: unknown) {
    throw new Error(extractMessage(error));
  }
}
