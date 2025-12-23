import { cookies } from 'next/headers';

export async function serverApi(path: string, options: RequestInit = {}) {
  const isJson = options.body && typeof options.body === 'string';

  const headers = {
    ...(options.headers || {}),
    ...(isJson ? { 'Content-Type': 'application/json' } : {}),
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include', // CRITICO: Envia cookies automaticamente
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`[serverApi] Erro ${res.status}: ${path}`);
    try {
      const errorText = await res.text();
      console.error('[serverApi] Detalhes:', errorText);
    } catch {}
  }

  return res;
}
