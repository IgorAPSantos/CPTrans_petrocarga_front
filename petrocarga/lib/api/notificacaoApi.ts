'use client';

import { clientApi } from '../clientApi';

export async function Notificacao(formData: FormData) {
  const usuarioId = formData.get('usuarioId') as string;

  const payload = {
    titulo: formData.get('titulo') as string,
    mensagem: formData.get('mensagem') as string,
    tipo: formData.get('tipo') as
      | 'RESERVA'
      | 'VAGA'
      | 'VEICULO'
      | 'MOTORISTA'
      | 'SISTEMA',
  };

  const res = await clientApi(
    `/petrocarga/notificacoes/sendNotification/toUsuario/${usuarioId}`,
    {
      method: 'POST',
      json: payload
    }
  );

  if (!res.ok) {
    let msg = 'Erro ao enviar notificação';
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch { }

    return { error: true, message: msg };
  }
  return { error: false, message: 'Notificação enviada com sucesso' };
}

// ----------------------
// ENVIAR NOTIFICAÇÃO POR PERMISSÃO
// ----------------------
export async function NotificacaoPorPermissao(formData: FormData) {
  const permissao = formData.get('permissao') as 'ADMIN' | 'GESTOR' | 'AGENTE';

  const payload = {
    titulo: formData.get('titulo') as string,
    mensagem: formData.get('mensagem') as string,
    tipo: formData.get('tipo') as
      | 'RESERVA'
      | 'VAGA'
      | 'VEICULO'
      | 'MOTORISTA'
      | 'SISTEMA',
  };

  const res = await clientApi(
    `/petrocarga/notificacoes/sendNotification/byPermissao/${permissao}`,
    {
      method: 'POST',
      json: payload
    }
  );

  if (!res.ok) {
    let msg = 'Erro ao enviar notificação';
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch { }

    return { error: true, message: msg };
  }
  return { error: false, message: 'Notificação enviada com sucesso' };
}

// ----------------------
// OBTER NOTIFICAÇÕES DO USUÁRIO
// ----------------------
export async function getNotificacoesUsuario(usuarioId: string) {
  const res = await clientApi(
    `/petrocarga/notificacoes/byUsuario/${usuarioId}`,
    {
      method: 'GET',
    }
  );

  if (!res.ok) {
    let msg = 'Erro ao buscar notificações';
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch { }

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, notificacoes: data };
}

// ----------------------
// OBTER NOTIFICAÇÃO POR ID
// ----------------------
export async function getNotificacoesById(id: string) {
  const res = await clientApi(`/petrocarga/notificacoes/${id}`, {
    method: 'GET',
  });

  if (!res.ok) {
    let msg = 'Erro ao buscar notificações';
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch { }

    return { error: true, message: msg };
  }

  const data = await res.json();
  return { error: false, notificacoes: data };
}
