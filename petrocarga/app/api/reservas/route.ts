import { NextResponse } from 'next/server';

import { cookies } from 'next/headers';

import { serverApi } from '@/lib/serverApi';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const usuarioId = searchParams.get('usuarioId');

  const token = (await cookies()).get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const res = await serverApi(`/petrocarga/reservas/usuario/${usuarioId}`, {
    method: 'GET',

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return NextResponse.json(await res.json());
}
