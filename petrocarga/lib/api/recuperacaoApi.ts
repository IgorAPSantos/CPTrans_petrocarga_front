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
    // Faz a requisição e não tenta parsear JSON
    const res = await clientApi('/petrocarga/auth/forgot-password', {
      method: 'POST',
      json: { email },
    });

    // Verifica apenas se o status HTTP é OK
    if (!res.ok) {
      throw new Error(`Erro ${res.status}: ${res.statusText}`);
    }

    // Se chegou aqui, a requisição foi bem-sucedida
    // Não tentamos ler .json() se sabemos que pode ser vazio
    return;
  } catch (error: unknown) {
    throw new Error(extractMessage(error));
  }
}

// ----------------------
// 2. REENVIAR EMAIL
// ----------------------
export async function reenviarEmailRecuperacao(email: string): Promise<void> {
  try {
    const res = await clientApi('/petrocarga/auth/resend-code', {
      method: 'POST',
      json: {
        email: email.trim(),
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
        codigo: codigo.trim(),
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
