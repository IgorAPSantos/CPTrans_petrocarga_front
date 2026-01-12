'use client';

import { clientApi } from '../clientApi';

// ----------------------
// ENVIAR NOTIFICAÇÃO PARA UM USUÁRIO
// ----------------------
export async function enviarNotificacaoParaUsuario(formData: FormData) {
  try {
    const usuarioId = formData.get('usuarioId') as string;

    // Obtém metadata de forma segura
    const metadataRaw = formData.get('metadata') as string;
    let metadata = {};
    if (metadataRaw && metadataRaw !== 'undefined') {
      try {
        metadata = JSON.parse(metadataRaw);
      } catch (e) {
        console.warn('Metadata inválido, usando objeto vazio:', e);
      }
    }

    const payload = {
      titulo: formData.get('titulo') as string,
      mensagem: formData.get('mensagem') as string,
      tipo: formData.get('tipo') as string,
      metadata: metadata, // Campo correto
    };

    console.log('Enviando payload:', payload); // Para debug

    const res = await clientApi(
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
        console.error('Erro da API:', err);
      } catch {}

      return { error: true, message: msg };
    }

    return { error: false, message: 'Notificação enviada com sucesso' };
  } catch (error: any) {
    console.error('Erro em enviarNotificacaoParaUsuario:', error);
    return {
      error: true,
      message: error.message || 'Erro ao processar notificação',
    };
  }
}

// ----------------------
// ENVIAR NOTIFICAÇÃO POR PERMISSÃO
// ----------------------
export async function enviarNotificacaoPorPermissao(formData: FormData) {
  try {
    const permissao = formData.get('permissao') as string;

    // Obtém metadata de forma segura
    const metadataRaw = formData.get('metadata') as string;
    let metadata = {};
    if (metadataRaw && metadataRaw !== 'undefined') {
      try {
        metadata = JSON.parse(metadataRaw);
      } catch (e) {
        console.warn('Metadata inválido, usando objeto vazio:', e);
      }
    }

    const payload = {
      titulo: formData.get('titulo') as string,
      mensagem: formData.get('mensagem') as string,
      tipo: formData.get('tipo') as string,
      metadata: metadata, // Campo correto
    };

    console.log('Enviando payload por permissão:', payload); // Para debug

    const res = await clientApi(
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
        console.error('Erro da API:', err);
      } catch {}

      return { error: true, message: msg };
    }

    return { error: false, message: 'Notificações enviadas com sucesso' };
  } catch (error: any) {
    console.error('Erro em enviarNotificacaoPorPermissao:', error);
    return {
      error: true,
      message: error.message || 'Erro ao processar notificação',
    };
  }
}

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
