'use server';

import { serverApi } from '@/lib/serverApi';

// ----------------------
// ADD GESTOR
// ----------------------
export async function addGestor(_: unknown, formData: FormData) {
  const payload = {
    nome: formData.get('nome') as string,
    cpf: formData.get('cpf') as string,
    telefone: formData.get('telefone') as string,
    email: formData.get('email') as string,
  };

  const res = await serverApi(`/petrocarga/gestores`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = 'Erro ao cadastrar gestor';

    try {
      const data = await res.json();
      msg = data.message ?? msg;
    } catch {}

    return { error: true, message: msg, valores: payload };
  }

  return { error: false, message: 'Gestor cadastrado com sucesso!' };
}
