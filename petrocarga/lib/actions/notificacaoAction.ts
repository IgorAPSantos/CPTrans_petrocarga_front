'use server';

import { serverApi } from '../serverApi';

// ----------------------
// ENVIAR NOTIFICAÇÃO PARA UM USUÁRIO
// ----------------------
export async function enviarNotificacaoParaUsuario(formData: FormData) {
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
    }
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

// ----------------------
// ENVIAR NOTIFICAÇÃO POR PERMISSÃO
// ----------------------
export async function enviarNotificacaoPorPermissao(formData: FormData) {
  const permissao = formData.get('permissao') as
    | 'ADMIN'
    | 'GESTOR'
    | 'AGENTE'
    | 'EMPRESA'
    | 'MOTORISTA';

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
    `/petrocarga/notificacoes/sendNotification/byPermissao/${permissao}`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    let msg = 'Erro ao enviar notificação por permissão';
    try {
      const err = await res.json();
      msg = err.message ?? msg;
    } catch {}

    return { error: true, message: msg };
  }

  return { error: false, message: 'Notificações enviadas com sucesso' };
}
