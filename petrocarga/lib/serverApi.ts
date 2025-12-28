export async function serverApi(path: string, options: RequestInit = {}) {
  const isJson = options.body && typeof options.body === 'string';

  const headers = {
    ...(options.headers || {}),
    ...(isJson ? { 'Content-Type': 'application/json' } : {}),
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store', // pega dados sempre atualizados
  });

  // Trata erro de forma segura
  if (!res.ok) {
    let errorText = '';
    try {
      errorText = await res.text(); // só lê uma vez
    } catch {
      errorText = '<body não disponível>';
    }
    console.error(`[serverApi] Erro ${res.status}: ${path}`);
    console.error('[serverApi] Detalhes:', errorText);
  }

  return res;
}
