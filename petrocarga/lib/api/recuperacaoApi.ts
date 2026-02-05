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
    const res = await clientApi('/petrocarga/auth/forgot-password', {
      method: 'POST',
      json: { email },
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(
        data.message || 'Não foi possível processar a solicitação',
      );
    }
  } catch (error: unknown) {
    throw new Error(extractMessage(error));
  }
}

// ----------------------
// 2. REENVIAR EMAIL
// ----------------------
export async function reenviarEmailRecuperacao(email: string): Promise<{
  valido: boolean;
  message: string;
  [key: string]: any;
}> {
  try {
    const res = await clientApi('/petrocarga/auth/resend-code', {
      method: 'POST',
      json: {
        email: email.trim(),
      },
    });

    const data = await res.json();

    // Se a resposta HTTP não foi bem-sucedida
    if (!res.ok) {
      throw new Error(data.message || `Erro HTTP ${res.status}`);
    }

    // Retorna os dados completos, deixa o frontend decidir
    return data;
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
  novaSenha: string,
): Promise<void> {
  try {
    const res = await clientApi('/petrocarga/auth/reset-password', {
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
// ----------------------
// 4. ATIVAR CONTA
// ----------------------
export async function ativarConta(
  email: string,
  codigo: string,
): Promise<void> {
  try {
    const res = await clientApi('/petrocarga/auth/activate', {
      method: 'POST',
      json: {
        email: email.trim(),
        codigo: codigo.trim().toUpperCase(),
      },
    });
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || 'Não foi possível ativar a conta');
    }
  } catch (error: unknown) {
    throw new Error(extractMessage(error));
  }
}
