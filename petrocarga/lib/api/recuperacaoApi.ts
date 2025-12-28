'use client';

import { clientApi } from '../clientApi';

// Função auxiliar para extrair mensagem de erro
function extractMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Ocorreu um erro. Tente novamente.';
}

// ----------------------
// 1. SOLICITAR RECUPERAÇÃO
// ----------------------
export async function solicitarRecuperacaoSenha(email: string): Promise<void> {
  try {
    const res = await clientApi('/petrocarga/auth/solicitar-recuperacao', {
      method: 'POST',
      json: { email },
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(
        data.message || 'Não foi possível enviar o código de recuperação'
      );
    }
  } catch (error: unknown) {
    throw new Error(extractMessage(error));
  }
}

// ----------------------
// 2. VALIDAR CÓDIGO
// ----------------------
export async function validarCodigoRecuperacao(
  email: string,
  codigo: string
): Promise<void> {
  try {
    const res = await clientApi('/petrocarga/auth/validar-codigo', {
      method: 'POST',
      json: {
        email: email.trim(),
        codigo: codigo.trim().toUpperCase(),
      },
    });

    const data = await res.json();

    if (!data.valido) {
      throw new Error(data.message || 'Código inválido ou expirado');
    }
  } catch (error: unknown) {
    throw new Error(extractMessage(error));
  }
}

// ----------------------
// 3. REDEFINIR SENHA
// ----------------------
export async function redefinirSenhaComCodigo(
  email: string,
  codigo: string,
  novaSenha: string
): Promise<void> {
  try {
    const res = await clientApi('/petrocarga/auth/redefinir-senha-com-codigo', {
      method: 'POST',
      json: {
        email: email.trim(),
        codigo: codigo.trim().toUpperCase(),
        novaSenha,
      },
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || 'Não foi possível redefinir a senha');
    }
  } catch (error: unknown) {
    throw new Error(extractMessage(error));
  }
}
