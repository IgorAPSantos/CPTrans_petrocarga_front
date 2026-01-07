'use client';

import { useEffect, useState, useMemo } from 'react'; // ADICIONADO: useMemo
import { useAuth } from '@/components/hooks/useAuth';
import { getGestores } from '@/lib/api/gestorApi';
import { Loader2, Search, X } from 'lucide-react'; // ADICIONADO: Search, X
import GestorCard from '@/components/gestor/cards/gestores-card';
import { Gestor } from '@/lib/types/gestor';

export default function GestoresPage() {
  const { user } = useAuth();
  const [gestores, setGestores] = useState<Gestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (!user?.id) return;

    const fetchGestores = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getGestores();
        setGestores(result.gestores);
      } catch (err) {
        console.error('Erro ao carregar os gestores:', err);
        setError(
          'Erro ao buscar os gestores cadastrados. Tente novamente mais tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGestores();
  }, [user?.id]);

  // ADICIONADO: Filtra gestores com base na busca
  const gestoresFiltrados = useMemo(() => {
    if (!busca.trim()) return gestores;

    const termoBusca = busca.toLowerCase().trim();
    return gestores.filter(
      (gestor) =>
        gestor.nome.toLowerCase().includes(termoBusca) ||
        gestor.email.toLowerCase().includes(termoBusca)
    );
  }, [gestores, busca]);

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="text-gray-600">
          Carregando informação dos gestores...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center text-red-600 min-h-[60vh] text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center w-full min-h-screen bg-gray-50">
      {/* ADICIONADO: Container para título e busca */}
      <div className="w-full max-w-2xl mb-6">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Gestores Cadastrados
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Gerencie e visualize todos os gestores do sistema
        </p>

        {/* ADICIONADO: Campo de busca */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar gestor por nome ou email..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg p-1"
              title="Limpar busca"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* ADICIONADO: Estatísticas e contador */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div className="text-sm text-gray-600">
            {busca ? (
              <>
                <span className="font-medium">{gestoresFiltrados.length}</span>{' '}
                gestor(es) encontrado(s) para "
                <span className="font-medium text-blue-600">{busca}</span>"
              </>
            ) : (
              <>
                Total de <span className="font-medium">{gestores.length}</span>{' '}
                gestor(es)
              </>
            )}
          </div>

          {busca && gestoresFiltrados.length === 0 && (
            <button
              onClick={() => setBusca('')}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Limpar busca e ver todos
            </button>
          )}
        </div>
      </div>

      {/* ALTERADO: gestoresFiltrados em vez de Gestores */}
      {gestoresFiltrados.length === 0 ? (
        // ADICIONADO: Mensagem de busca vazia melhorada
        <div className="text-center py-8">
          {busca ? (
            <>
              <div className="mb-4">
                <Search className="h-12 w-12 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum gestor encontrado
              </h3>
              <p className="text-gray-600">
                Não encontramos gestores para "
                <span className="font-medium">{busca}</span>"
              </p>
              <button
                onClick={() => setBusca('')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todos os gestores
              </button>
            </>
          ) : (
            <p className="text-gray-500 text-center">
              Nenhum gestor cadastrado no momento.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 w-full max-w-2xl">
          {/* ALTERADO: gestoresFiltrados em vez de Gestores */}
          {gestoresFiltrados.map((gestor) => (
            <GestorCard key={gestor.id} gestor={gestor} />
          ))}
        </div>
      )}

      {/* ADICIONADO: Dica de busca quando há muitos gestores */}
      {gestores.length > 5 && !busca && (
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl w-full">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>
              <strong>Dica:</strong> Use a busca acima para encontrar gestores
              específicos por nome ou email.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
