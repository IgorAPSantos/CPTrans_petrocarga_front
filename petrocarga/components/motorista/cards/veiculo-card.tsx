"use client";

import { useState } from "react";
import { Veiculo } from "@/lib/types/veiculo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteVeiculo } from "@/lib/actions/veiculoActions";
import { useAuth } from "@/context/AuthContext";

type VeiculoDetalhesProps = {
  veiculo: Veiculo;
};

export default function VeiculoDetalhes({ veiculo }: VeiculoDetalhesProps) {
  const [modalAberto, setModalAberto] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  const handleExcluir = async () => {
    if (!token) {
      alert("Você precisa estar logado para excluir o veículo.");
      return;
    }

    try {
      await deleteVeiculo(veiculo.id, token);
      setModalAberto(false);
      router.back();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir veículo.");
    }
  };

  return (
    <article className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl border-l-8 border-blue-500 transition-shadow max-w-4xl mx-auto">
      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-800 truncate">
            {veiculo.marca} {veiculo.modelo}
          </h2>
          <p className="text-gray-600 mt-1 truncate">Placa: {veiculo.placa}</p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-5">
          <Link
            href={`/veiculos/meus-veiculos/${veiculo.id}/editar`}
            className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition inline-block"
          >
            Alterar
          </Link>
          <button
            onClick={() => setModalAberto(true)}
            className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
          >
            Excluir
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm mb-4">
        <p>
          <strong>Tipo:</strong> {veiculo.tipo}
        </p>
        {veiculo.cpfProprietario && (
          <p>
            <strong>CPF:</strong> {veiculo.cpfProprietario}
          </p>
        )}
        {veiculo.cnpjProprietario && (
          <p>
            <strong>CNPJ:</strong> {veiculo.cnpjProprietario}
          </p>
        )}
      </section>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setModalAberto(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 w-96 max-w-full shadow-2xl transform transition-all duration-300 scale-95 animate-scaleIn">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Confirmar exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir este veículo? Esta ação não pode
              ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluir}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
