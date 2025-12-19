'use client';

import { deleteAgente } from '@/lib/actions/agenteAction';
import { Agente } from '@/lib/types/agente';
import { cn } from '@/lib/utils';
import { IdCard, Mail, Phone, UserCircle, Bell, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { NotificacaoModal } from '@/components/gestor/modals/notificacaoModal';

interface AgenteCardProps {
  agente: Agente;
}

export default function AgenteCard({ agente }: AgenteCardProps) {
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [isNotificacaoModalOpen, setIsNotificacaoModalOpen] = useState(false);

  const handleExcluir = async () => {
    try {
      await deleteAgente(agente.usuario.id);
      setModalExcluirAberto(false);
      // Usando window.location para recarregar a página
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir agente.');
    }
  };

  return (
    <>
      <article
        className={cn(
          'flex flex-col sm:flex-row justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4 w-full',
          'border-green-500',
        )}
      >
        {/* Informações */}
        <section className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Nome */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-gray-400" />
              {agente.usuario.nome}
            </h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              Agente
            </span>
          </div>

          {/* Infos (responsivas) */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <IdCard className="w-4 h-4 text-gray-400" />
              Matrícula: {agente.matricula}
            </span>

            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Mail className="w-4 h-4 text-gray-400" />
              {agente.usuario.email}
            </span>

            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Phone className="w-4 h-4 text-gray-400" />
              {agente.usuario.telefone}
            </span>
          </div>
        </section>

        {/* Botões */}
        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsNotificacaoModalOpen(true)}
            className={cn(
              'flex items-center justify-center gap-1.5',
              'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200',
              'rounded-lg transition-colors text-sm font-medium',
              'h-9 w-full sm:w-28',
            )}
          >
            <Bell className="w-4 h-4" />
            Notificar
          </button>

          <button
            onClick={() => setModalExcluirAberto(true)}
            className={cn(
              'flex items-center justify-center gap-1.5',
              'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
              'rounded-lg transition-colors text-sm font-medium',
              'h-9 w-full sm:w-28',
            )}
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>
        </div>
      </article>

      {/* Modal de Notificação */}
      <NotificacaoModal
        isOpen={isNotificacaoModalOpen}
        onClose={() => setIsNotificacaoModalOpen(false)}
        usuarioId={agente.usuario.id}
        usuarioNome={agente.usuario.nome}
        tipoUsuario="AGENTE"
      />

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
              Tem certeza que deseja excluir o agente{' '}
              <strong>{agente.usuario.nome}</strong>? Esta ação não pode ser
              desfeita.
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
    </>
  );
}
