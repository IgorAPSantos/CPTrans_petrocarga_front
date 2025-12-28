'use server';

import { serverApi } from '@/lib/serverApi';

// ----------------------
// ADD MOTORISTA
// ----------------------
export async function addMotorista(_: unknown, formData: FormData) {
  const payload = {
    usuario: {
      nome: formData.get('nome') as string,
      cpf: formData.get('cpf') as string,
      telefone: formData.get('telefone') as string,
      email: formData.get('email') as string,
      senha: formData.get('senha') as string,
    },
    tipoCnh: (formData.get('tipoCnh') as string)?.toUpperCase(),
    numeroCnh: formData.get('numeroCnh') as string,
    dataValidadeCnh: formData.get('dataValidadeCnh') as string,
  };

  const res = await serverApi(`/petrocarga/motoristas/cadastro`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = 'Erro ao cadastrar motorista';

    try {
      const data = await res.json();
      msg = data.message ?? msg;
    } catch {}

    return { error: true, message: msg, valores: payload };
  }

  return { error: false, message: 'Motorista cadastrado com sucesso!' };
}
