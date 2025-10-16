"use client";

import { useEffect, useState } from "react";
import VagaItem from "@/components/cards/vagas-item";
import { Vaga } from "@/lib/types";

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

  const filtroDebounced = useDebounce(filtro, 300); // 300ms debounce

  // Buscar dados da API
  useEffect(() => {
    async function fetchVagas() {
      try {
        const res = await fetch("https://cptranspetrocargaback-production.up.railway.app/petrocarga/vagas"); // Para usar o MOCK troque por /api/vagas
        const data = await res.json();
        setVagas(data);
      } catch (err) {
        console.error("Erro ao buscar vagas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVagas();
  }, []);

  // Filtro atualizado — inclui área, referência, logradouro e bairro
  const vagasFiltradas = vagas.filter((vaga) => {
    const filtroLower = filtroDebounced.toLowerCase();

    return (
      vaga.area?.toLowerCase().includes(filtroLower) ||
      vaga.referenciaEndereco?.toLowerCase().includes(filtroLower) ||
      vaga.endereco?.logradouro?.toLowerCase().includes(filtroLower) ||
      vaga.endereco?.bairro?.toLowerCase().includes(filtroLower)
    );
  });

  return (
    <div className="flex flex-col h-full">
      {/* Input fixo no topo */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Filtrar por área, rua ou bairro..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Lista scrollável */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {loading ? (
          <p className="text-center text-gray-500 mt-4">Carregando vagas...</p>
        ) : vagasFiltradas.length > 0 ? (
          vagasFiltradas.map((vaga) => <VagaItem key={vaga.id} vaga={vaga} />)
        ) : (
          <p className="text-gray-500 text-center mt-4">
            Nenhuma vaga encontrada.
          </p>
        )}
      </div>
    </div>
  );
}
