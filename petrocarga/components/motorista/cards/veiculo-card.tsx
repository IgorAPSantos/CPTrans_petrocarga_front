'use client';

import { useState } from 'react';
import { Veiculo } from '@/lib/types/veiculo';
import { useRouter } from 'next/navigation';
import { deleteVeiculo, atualizarVeiculo } from '@/lib/actions/veiculoActions';
import { CheckCircle2, AlertCircle } from 'lucide-react';

type VeiculoDetalhesProps = {
  veiculo: Veiculo;
};

export default function VeiculoDetalhes({ veiculo }: VeiculoDetalhesProps) {
  const router = useRouter();

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: 'sucesso' | 'erro' | null;
    texto: string;
  }>({ tipo: null, texto: '' });

  // Estados de edição
  const [formData, setFormData] = useState({
    id: veiculo.id,
    marca: veiculo.marca,
    modelo: veiculo.modelo,
    placa: veiculo.placa,
    tipo: veiculo.tipo,
    cpfProprietario: veiculo.cpfProprietario || '',
    cnpjProprietario: veiculo.cnpjProprietario || '',
    usuarioId: veiculo.usuarioId,
  });

  const handleInput = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalvar = async () => {
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value as string);
      });

      await atualizarVeiculo(fd);

      setMensagem({
        tipo: 'sucesso',
        texto: 'Veículo atualizado com sucesso!',
      });

      setEditando(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao atualizar veículo.',
      });
    }
  };

  const handleExcluir = async () => {
    try {
      await deleteVeiculo(veiculo.id);
      setModalAberto(false);
      router.back();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir veículo.');
    }
  };

  const AlertBox = ({
    tipo,
    texto,
  }: {
    tipo: 'sucesso' | 'erro';
    texto: string;
  }) => {
    const isError = tipo === 'erro';

    return (
      <div
        className={`
        p-3 rounded-lg flex items-start gap-2 border text-sm
        ${
          isError
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-green-50 border-green-200 text-green-700'
        }
      `}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
        )}
        <span>{texto}</span>
      </div>
    );
  };

  return (
    <article className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl border-l-8 border-blue-500 transition-shadow max-w-4xl mx-auto">
      {mensagem.tipo && (
        <div className="mb-4">
          <AlertBox tipo={mensagem.tipo} texto={mensagem.texto} />
        </div>
      )}

      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-800 truncate">
            {formData.marca} {formData.modelo}
          </h2>

          {!editando ? (
            <p className="text-gray-600 mt-1 truncate">
              Placa: {veiculo.placa}
            </p>
          ) : (
            <p className="text-sm text-blue-600">Modo de edição</p>
          )}
        </div>

        {!editando ? (
          <div className="flex gap-2 mt-2 sm:mt-5">
            <button
              onClick={() => setEditando(true)}
              className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
            >
              Alterar
            </button>
            <button
              onClick={() => setModalAberto(true)}
              className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
            >
              Excluir
            </button>
          </div>
        ) : null}
      </header>

      {/* ===================== MODO DE VISUALIZAÇÃO ===================== */}
      {!editando && (
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
      )}

      {/* ===================== MODO DE EDIÇÃO ===================== */}
      {editando && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm mb-4">
          <div>
            <label className="block font-semibold">Marca</label>
            <input
              className="w-full p-2 border rounded"
              value={formData.marca}
              onChange={(e) => handleInput('marca', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold">Modelo</label>
            <input
              className="w-full p-2 border rounded"
              value={formData.modelo}
              onChange={(e) => handleInput('modelo', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold">Placa</label>
            <input
              className="w-full p-2 border rounded"
              value={formData.placa}
              onChange={(e) => handleInput('placa', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold">Tipo</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.tipo}
              onChange={(e) => handleInput('tipo', e.target.value)}
            >
              <option value="AUTOMOVEL">Automóvel</option>
              <option value="VUC">Veículo Urbano de Carga</option>
              <option value="CAMINHONETA">Caminhoneta</option>
              <option value="CAMINHAO_MEDIO">Caminhão Médio</option>
              <option value="CAMINHAO_LONGO">Caminhão Longo</option>
              <option value="CARRETA">Carreta</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold">CPF Proprietário</label>
            <input
              className="w-full p-2 border rounded"
              value={formData.cpfProprietario}
              onChange={(e) => handleInput('cpfProprietario', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold">CNPJ Proprietário</label>
            <input
              className="w-full p-2 border rounded"
              value={formData.cnpjProprietario}
              onChange={(e) => handleInput('cnpjProprietario', e.target.value)}
            />
          </div>
        </section>
      )}

      {/* ===================== BOTÕES DO MODO DE EDIÇÃO ===================== */}
      {editando && (
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setEditando(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSalvar}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            Salvar
          </button>
        </div>
      )}

      {/* ===================== MODAL DE EXCLUSÃO ===================== */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setModalAberto(false)}
          />

          <div className="relative bg-white rounded-2xl p-6 w-96 max-w-full shadow-2xl">
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
