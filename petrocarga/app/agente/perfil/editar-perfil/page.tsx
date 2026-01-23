'use client';

import EditarAgente from '@/components/agente/editar/edicao-perfil';
import { useAuth } from '@/components/hooks/useAuth';
import { getAgenteByUserId } from '@/lib/api/agenteApi';
import { Agente } from '@/lib/types/agente';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditarAgentePerfil() {
  const { user } = useAuth();
  const params = useParams() as { id: string };

  const [agente, setAgente] = useState<Agente | null>(null);
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

    async function fetchAgente() {
      setLoading(true);
      setError('');

      try {
        const result = await getAgenteByUserId(userId);

        if (result.error) {
          setError(result.agente);
          setAgente(null);
        } else {
          const m = result.agente;
          if (!m) {
            setError('Agente não encontrado.');
          } else {
            setAgente(m);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar perfil do agente:', err);
        setError('Erro ao buscar perfil do agente.');
      } finally {
        setLoading(false);
      }
    }

    fetchAgente();
  }, [user?.id, params.id]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
        <Loader2 className="animate-spin w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
        <span className="text-gray-600 text-sm sm:text-base">
          Carregando perfil...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Ocorreu um erro
          </h3>
          <p className="text-red-600 mb-6 text-sm sm:text-base">{error}</p>
          <Link
            href="/agente/perfil"
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para perfil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Container principal */}
        <div className="max-w-5xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-6 sm:mb-8">
            <Link
              href="/agente/perfil"
              className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm sm:text-base group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Voltar para perfil
            </Link>

            {/* Título (opcional) */}
            <div className="mt-4 sm:mt-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Editar Perfil do Agente
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Atualize suas informações pessoais e de contato
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {agente ? (
              <div className="p-4 sm:p-6 lg:p-8">
                <EditarAgente agente={agente} />
              </div>
            ) : (
              <div className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Agente não encontrado
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Não foi possível carregar as informações do agente.
                </p>
                <Link
                  href="/agente/perfil"
                  className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para perfil
                </Link>
              </div>
            )}
          </div>

          {/* Rodapé informativo */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 text-sm sm:text-base">
                  Informação importante
                </h4>
                <p className="text-blue-700 text-xs sm:text-sm mt-1">
                  As alterações feitas aqui serão refletidas imediatamente no
                  seu perfil. Certifique-se de que todas as informações estão
                  corretas antes de salvar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
