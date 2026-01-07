'use client';

import { deleteGestor } from '@/lib/api/gestorApi';
import { Gestor } from '@/lib/types/gestor';
import { cn } from '@/lib/utils';
import { Mail, Phone, Trash2, UserCircle } from 'lucide-react';
import router from 'next/router';
import { useState } from 'react';

interface GestorCardProps {
  gestor: Gestor;
}

export default function GestorCard({ gestor }: GestorCardProps) {
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  const handleExcluir = async () => {
    try {
      await deleteGestor(gestor.id);
      // Usando window.location para recarregar a página
      router.back();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir vaga.');
    }
  };

  return (
    <article
      className={cn(
        'flex flex-col sm:flex-row justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4 w-full',
        'border-yellow-500'
      )}
    >
      {/* Informações */}
      <section className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Nome */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-gray-400" />
            {gestor.nome}
          </h3>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
            Gestor
          </span>
        </div>

        {/* Infos (responsivas) */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Mail className="w-4 h-4 text-gray-400" />
            {gestor.email}
          </span>

          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Phone className="w-4 h-4 text-gray-400" />
            {gestor.telefone}
          </span>
        </div>
      </section>

      {/* Botões */}
      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
        <button
          onClick={() => setModalExcluirAberto(true)}
          className={cn(
            'flex items-center justify-center gap-1.5',
            'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
            'rounded-lg transition-colors text-sm font-medium',
            'h-9 w-full sm:w-28'
          )}
        >
          <Trash2 className="w-4 h-4" />
          Excluir
        </button>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {modalExcluirAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalExcluirAberto(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Confirmar exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o gestor{' '}
              <strong>{gestor.nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalExcluirAberto(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluir}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
