'use client';

import { clientApi } from '../clientApi';

// ----------------------
// OBTER NOTIFICAÇÕES DO USUÁRIO
// ----------------------
export async function getNotificacoesUsuario(
  usuarioId: string,
  lida?: boolean
) {
  let url = `/petrocarga/notificacoes/byUsuario/${usuarioId}`;

  if (lida !== undefined) {
    url += `?lida=${lida}`;
  }

  const res = await clientApi(url, {
    method: 'GET',
  });

  if (!res.ok) {
    let msg = 'Erro ao buscar notificações';
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, notificacoes: data };
}

// ----------------------
// OBTER NOTIFICAÇÃO POR ID (e marca como lida)
// ----------------------
export async function getNotificacaoById(id: string) {
  const res = await clientApi(`/petrocarga/notificacoes/${id}`, {
    method: 'GET',
  });

  if (!res.ok) {
    let msg = 'Erro ao buscar notificação';
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, notificacao: data };
}

// ----------------------
// MARCAR NOTIFICAÇÃO COMO LIDA
// ----------------------
export async function marcarNotificacaoComoLida(notificacaoId: string) {
  const res = await clientApi(
    `/petrocarga/notificacoes/lida/${notificacaoId}`,
    {
      method: 'PATCH',
    }
  );

  if (!res.ok) {
    let msg = 'Erro ao alterar notificação para lida';
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  const data = await res.json();
  return {
    error: false,
    message: 'Notificação marcada como lida',
    notificacao: data,
  };
}

// ----------------------
// DELETAR NOTIFICAÇÃO
// ----------------------
export async function deletarNotificacao(
  usuarioId: string,
  notificacaoId: string
) {
  const res = await clientApi(
    `/petrocarga/notificacoes/${usuarioId}/${notificacaoId}`,
    {
      method: 'DELETE',
    }
  );

  if (!res.ok) {
    let msg = 'Erro ao deletar notificação';
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  return { error: false, message: 'Notificação deletada com sucesso' };
}
