'use client';

import toast from 'react-hot-toast';
import { clientApi } from '../clientApi';
import { ConfirmResult } from '../types/confirmResult';

// ----------------------
// POST DENUNCIA
// ----------------------

export async function Denunciar(formData: FormData): Promise<ConfirmResult> {
  const body = {
    descricao: formData.get('descricao'),
    reservaId: formData.get('reservaId'),
    tipo: formData.get('tipo'),
  };

  try {
    await clientApi('/petrocarga/denuncias', {
      method: 'POST',
      json: body,
    });
    toast.success('Denuncia Enviada Com Sucesso!');
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erro ao Denunciar Reserva.';
    toast.error(message);
    return { success: false, message };
  }
}
