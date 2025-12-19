'use client';

import EditarGestor from '@/components/gestor/editar/edicao-perfil';
import { useAuth } from '@/components/hooks/useAuth';
import { getGestorByUserId } from '@/lib/actions/gestorActions';
import { Gestor } from '@/lib/types/gestor';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditarGestorPerfil() {
  const { user } = useAuth();
  const params = useParams() as { id: string };

  const [gestor, setGestor] = useState<Gestor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user?.id) {
      setError('Usuário não autenticado.');
      setLoading(false);
      return;
    }
    const userId = user.id;
    if (!userId) return;

    async function fetchGestor() {
      setLoading(true);
      setError('');

      try {
        const result = await getGestorByUserId(userId);

        if (result.error) {
          setError(result.gestor);
          setGestor(null);
        } else {
          const m = result.gestor;
          if (!m) {
            setError('Gestor não encontrado.');
          } else {
            setGestor(m);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar perfil do gestor:', err);
        setError('Erro ao buscar perfil do gestor.');
      } finally {
        setLoading(false);
      }
    }

    fetchGestor();
  }, [user?.id, params.id]);

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="text-gray-600">Carregando perfil...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-red-600 text-center gap-2">
        <p>{error}</p>
        <Link href="/gestor/perfil" className="text-blue-600 underline">
          Voltar para perfil
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <Link
          href="/gestor/perfil"
          className="text-muted-foreground hover:text-foreground inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para perfil
        </Link>
      </div>

      {gestor && <EditarGestor gestor={gestor} />}
    </div>
  );
}
