"use client";

import { useEffect, useState } from "react";
import VagaItem from "@/components/gestor/cards/vagas-item";
import { Vaga } from "@/lib/types/vaga";
import { ChevronUp, ChevronDown } from "lucide-react";
import * as vagaActions from "@/lib/actions/vagaActions";
import { useAuth } from "@/context/AuthContext";

// Hook simples de debounce
function useDebounce(value: string, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function ListaVagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [disponiveisPrimeiro, setDisponiveisPrimeiro] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth(); // <-- pega o token do contexto
  const filtroDebounced = useDebounce(filtro, 300);

  // Buscar dados usando vagaActions.getVagas
  useEffect(() => {
    if (!token) return; // evita chamar sem token

    const fetchVagas = async () => {
      setLoading(true);
      try {
        const data: Vaga[] = await vagaActions.getVagas(token);
        setVagas(data);
      } catch (err) {
        console.error("Erro ao carregar vagas:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setVagas([]); // garante array vazio
      } finally {
        setLoading(false);
      }
    };

    fetchVagas();
  }, [token]);
  // Filtra as vagas
  const vagasFiltradas = vagas.filter((vaga) => {
    const filtroLower = filtroDebounced.toLowerCase();
    return (
      vaga.area?.toLowerCase().includes(filtroLower) ||
      vaga.referenciaEndereco?.toLowerCase().includes(filtroLower) ||
      vaga.endereco?.logradouro?.toLowerCase().includes(filtroLower) ||
      vaga.endereco?.bairro?.toLowerCase().includes(filtroLower)
    );
  });

  // Ordena baseado na disponibilidade
  const vagasOrdenadas = [...vagasFiltradas].sort((a, b) => {
    if (disponiveisPrimeiro) {
      return a.status === "DISPONIVEL" && b.status !== "DISPONIVEL"
        ? -1
        : b.status === "DISPONIVEL" && a.status !== "DISPONIVEL"
        ? 1
        : 0;
    } else {
      return a.status !== "DISPONIVEL" && b.status === "DISPONIVEL"
        ? -1
        : b.status !== "DISPONIVEL" && a.status === "DISPONIVEL"
        ? 1
        : 0;
    }
  });

  return (
    <div className="flex flex-col h-full">
      {/* Input e botão de ordenação */}
      <div className="mb-2 flex items-center gap-2">
        <input
          type="text"
          placeholder="Filtrar por área, rua ou bairro..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-1 p-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={() => setDisponiveisPrimeiro(!disponiveisPrimeiro)}
          className="p-2 rounded border border-gray-300 shadow-sm hover:bg-gray-100"
          title={
            disponiveisPrimeiro
              ? "Disponíveis por último"
              : "Disponíveis primeiro"
          }
        >
          {disponiveisPrimeiro ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
      </div>

      {/* Lista scrollável */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {loading ? (
          <p className="text-center text-gray-500 mt-4">Carregando vagas...</p>
        ) : vagasOrdenadas.length > 0 ? (
          vagasOrdenadas.map((vaga) => <VagaItem key={vaga.id} vaga={vaga} />)
        ) : (
          <p className="text-gray-500 text-center mt-4">
            Nenhuma vaga encontrada.
          </p>
        )}
      </div>
    </div>
  );
}
