'use server';

import { serverApi } from '../serverApi';

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
    metada: JSON.parse(formData.get('metada') as string),
  };

  const res = await serverApi(
    `/petrocarga/notificacoes/sendNotification/toUsuario/${usuarioId}`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    let msg = 'Erro ao enviar notificação';
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }
  return { error: false, message: 'Notificação enviada com sucesso' };
}

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
    metada: JSON.parse(formData.get('metada') as string),
  };

  const res = await serverApi(
    `/petrocarga/notificacoes/sendNotification/toUsuario/${permissao}`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    let msg = 'Erro ao enviar notificação';
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }
  return { error: false, message: 'Notificação enviada com sucesso' };
}

export async function getNotificacoesUsuario(usuarioId: string) {
  const res = await serverApi(
    `/petrocarga/notificacoes/byUsuario/${usuarioId}`,
    {
      method: 'GET',
    },
  );

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

export async function getNotificacoesById(id: string) {
  const res = await serverApi(`/petrocarga/notificacoes/${id}`, {
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
