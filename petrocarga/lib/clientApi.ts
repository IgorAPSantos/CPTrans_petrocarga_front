'use client';

type ClientApiOptions = RequestInit & {
  json?: unknown;
};

export async function clientApi(path: string, options: ClientApiOptions = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  let body = options.body;

  if (options.json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.json);
  }

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      body,
      credentials: 'include',
    });

    if (res.status === 401) {
      console.warn('Sessão expirada, redirecionando...');
      window.location.href = '/autorizacao/login';
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));

      throw new Error(
        (errorData.cause !== 'unknown' ? errorData.cause : null) ||
          errorData.erro ||
          'Ocorreu um erro na requisição',
      );
    }

    return res;
  } catch (error) {
    console.error('Erro na ClientApi:', error);
    throw error;
  }
}
