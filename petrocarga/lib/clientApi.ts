'use client';

type ClientApiOptions = RequestInit & {
  json?: unknown;
};

export async function clientApi(path: string, options: ClientApiOptions = {}) {
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = getCookie('auth-token');

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    });

    if (res.status === 401) {
      console.warn('Sessão expirada, redirecionando...');
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        message: errorData.message || 'Ocorreu um erro na requisição',
      };
    }

    return res;
  } catch (error) {
    console.error('Erro na ClientApi:', error);
    throw error;
  }
}
