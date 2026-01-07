'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/components/hooks/useAuth';
import { getAgentes } from '@/lib/api/agenteApi';
import { Loader2, Search, X } from 'lucide-react';
import { Agente } from '@/lib/types/agente';
import AgenteCard from '@/components/gestor/cards/agentes-card';

export default function AgentesPage() {
  const { user } = useAuth();
  const [Agentes, setAgentes] = useState<Agente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (!user?.id) return;

    const fetchAgentes = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAgentes();
        setAgentes(result.agentes);
      } catch (err) {
        console.error('Erro ao carregar os agentes:', err);
        setError(
          'Erro ao buscar os agentes cadastrados. Tente novamente mais tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAgentes();
  }, [user?.id]);

  const agentesFiltrados = useMemo(() => {
    if (!busca.trim()) return Agentes;

    const termoBusca = busca.toLowerCase().trim();
    return Agentes.filter(
      (agente) =>
        agente.usuario.nome.toLowerCase().includes(termoBusca) ||
        agente.usuario.email.toLowerCase().includes(termoBusca) ||
        false
    );
  }, [Agentes, busca]);

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="text-gray-600">
          Carregando informação dos agentes...
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
      <div className="w-full max-w-2xl mb-6">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Agentes Cadastrados
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Gerencie e visualize todos os agentes do sistema
        </p>

        {/* Campo de busca */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar agente por nome, email ou placa do veículo..."
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

        {/* Estatísticas e contador */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div className="text-sm text-gray-600">
            {busca ? (
              <>
                <span className="font-medium">{agentesFiltrados.length}</span>{' '}
                agente(s) encontrado(s) para "
                <span className="font-medium text-blue-600">{busca}</span>"
              </>
            ) : (
              <>
                Total de <span className="font-medium">{Agentes.length}</span>{' '}
                agente(s)
              </>
            )}
          </div>

          {busca && agentesFiltrados.length === 0 && (
            <button
              onClick={() => setBusca('')}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Limpar busca e ver todos
            </button>
          )}
        </div>
      </div>

      {agentesFiltrados.length === 0 ? (
        <div className="text-center py-8">
          {busca ? (
            <>
              <div className="mb-4">
                <Search className="h-12 w-12 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum motorista encontrado
              </h3>
              <p className="text-gray-600">
                Não encontramos agentes para "
                <span className="font-medium">{busca}</span>"
              </p>
              <button
                onClick={() => setBusca('')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todos os agentes
              </button>
            </>
          ) : (
            <p className="text-gray-500 text-center">
              Nenhum agente cadastrado no momento.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 w-full max-w-2xl">
          {agentesFiltrados.map((agente) => (
            <AgenteCard key={agente.usuario.id} agente={agente} />
          ))}
        </div>
      )}

      {/* Dica de busca quando há muitos agentes */}
      {Agentes.length > 10 && !busca && (
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl w-full">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>
              <strong>Dica:</strong> Use a busca acima para encontrar agentes
              específicos por nome, email ou placa do veículo.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
