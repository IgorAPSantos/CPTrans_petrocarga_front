'use client';

import { useNotifications } from '@/context/NotificationContext';
import { Notification } from '@/lib/types/notificacao';
import {
  Bell,
  BellOff,
  CheckCheck,
  Check,
  X,
  Wifi,
  WifiOff,
  RefreshCw,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCallback, useState } from 'react';

export default function NotificacoesPage() {
  const {
    notifications,
    isConnected,
    isLoading,
    error,
    removeNotification,
    markAsRead,
    markSelectedAsRead, // 🆕
    deleteSelectedNotifications, // 🆕
    reconnect,
  } = useNotifications();

  // 🔴 Estados para seleção múltipla
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMarkReadModal, setShowMarkReadModal] = useState(false);

  const formatarTempo = useCallback((timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return 'Agora';
    }
  }, []);

  const getIconeNotificacao = useCallback((tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'RESERVA':
        return '🚗';
      case 'VAGA':
        return '🅿️';
      case 'VEICULO':
        return '🔧';
      case 'MOTORISTA':
        return '👤';
      case 'SISTEMA':
        return '📢';
      default:
        return '📢';
    }
  }, []);

  const getCorNotificacao = useCallback((tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'RESERVA':
        return 'border-l-blue-500 bg-blue-50';
      case 'VAGA':
        return 'border-l-green-500 bg-green-50';
      case 'VEICULO':
        return 'border-l-purple-500 bg-purple-50';
      case 'MOTORISTA':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'SISTEMA':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  }, []);

  // 🔴 CONTADOR DE NÃO LIDAS
  const unreadCount = notifications.filter((n) => !n.lida).length;

  // 🔴 FUNÇÕES DE SELEÇÃO
  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map((n) => n.id));
    }
  };

  const toggleSelectNotification = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteSelectedNotifications(selectedIds);
      setSelectedIds([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao deletar notificações:', error);
    }
  };

  const handleMarkSelectedAsRead = async () => {
    try {
      await markSelectedAsRead(selectedIds);
      setSelectedIds([]);
      setShowMarkReadModal(false);
    } catch (error) {
      console.error('Erro ao marcar notificações como lidas:', error);
    }
  };

  // 🔴 Verifica se todas estão selecionadas
  const allSelected =
    selectedIds.length === notifications.length && notifications.length > 0;

  // 🔴 MODAL DE CONFIRMAÇÃO
  const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    confirmColor = 'bg-red-600 hover:bg-red-700',
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    confirmColor?: string;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white ${confirmColor} rounded-lg transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-800" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Notificações
                </h1>
                <p className="text-sm text-gray-600">
                  {notifications.length} total
                  {notifications.length !== 1 ? 's' : ''}
                  {unreadCount > 0 && (
                    <span className="ml-2 text-red-600 font-semibold">
                      • {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status da conexão SSE */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  isConnected
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {isConnected ? (
                  <>
                    <Wifi className="h-3 w-3" />
                    <span>Tempo real ativo</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    <span>Conexão offline</span>
                  </>
                )}
              </div>

              {/* Botão de Reconexão Manual */}
              {!isConnected && (
                <button
                  onClick={reconnect}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  title="Tentar reconectar"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reconectar
                </button>
              )}
            </div>
          </div>

          {/* 🔴 BARRA DE AÇÕES EM MASSA */}
          {selectedIds.length > 0 ? (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-blue-700 font-medium">
                    {selectedIds.length} notificação(ões) selecionada(s)
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMarkReadModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Marcar como lida(s)
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover selecionada(s)
                  </button>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // 🔴 APENAS BOTÃO "SELECIONAR TODAS" QUANDO NÃO HÁ SELEÇÃO
            notifications.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      selectedIds.length === notifications.length
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedIds.length === notifications.length && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>Selecionar todas ({notifications.length})</span>
                </button>
              </div>
            )
          )}

          {/* Mensagens de Status SSE */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              ⚠️ {error}
              <div className="mt-1 text-xs text-red-600">
                As notificações em tempo real estão temporariamente
                indisponíveis.
              </div>
            </div>
          )}

          {!isConnected && !error && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-700 text-sm">
              ⚡ Conectando ao servidor de notificações...
              <div className="mt-1 text-xs text-yellow-600">
                As notificações serão recebidas em tempo real quando a conexão
                for estabelecida.
              </div>
            </div>
          )}
        </div>

        {/* Lista de Notificações */}
        <div className="space-y-3">
          {isLoading && notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Carregando notificações...
              </h2>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <BellOff className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhuma notificação
              </h2>
              <p className="text-gray-500">
                Você está em dia! Não há notificações no momento.
              </p>
            </div>
          ) : (
            notifications.map((notif: Notification) => (
              <div
                key={notif.id}
                className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${getCorNotificacao(
                  notif.tipo
                )} hover:shadow-lg transition-all ${
                  notif.lida ? 'opacity-60' : ''
                } ${
                  selectedIds.includes(notif.id)
                    ? 'ring-2 ring-blue-500 ring-opacity-50'
                    : ''
                }`}
                onClick={(e) => {
                  // Impede a seleção ao clicar nos botões
                  if ((e.target as HTMLElement).closest('button')) return;
                  toggleSelectNotification(notif.id);
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* 🔴 CHECKBOX DE SELEÇÃO */}
                  <div className="flex-shrink-0 pt-1">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                        selectedIds.includes(notif.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectNotification(notif.id);
                      }}
                    >
                      {selectedIds.includes(notif.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl flex-shrink-0">
                      {getIconeNotificacao(notif.tipo)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-800 font-medium mb-1">
                            {notif.titulo}
                          </p>
                          <p className="text-gray-600 text-sm mb-2">
                            {notif.mensagem}
                          </p>
                        </div>
                        {!notif.lida && !selectedIds.includes(notif.id) && (
                          <span className="inline-block h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2 animate-pulse"></span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {notif.tipo}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatarTempo(notif.criada_em)}
                        </span>
                        {notif.lida && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Lida
                          </span>
                        )}
                      </div>

                      {/* Dados adicionais */}
                      {notif.metadata &&
                        Object.keys(notif.metadata).length > 0 && (
                          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                            {Object.entries(notif.metadata).map(
                              ([key, value]) => (
                                <div key={key} className="truncate">
                                  <strong>{key}:</strong> {String(value)}
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex flex-col gap-2">
                    {/* Botão Marcar como Lida */}
                    {!notif.lida && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        className="flex-shrink-0 p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        title="Marcar como lida"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    )}

                    {/* Botão remover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notif.id);
                      }}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover notificação"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔴 MODAIS DE CONFIRMAÇÃO */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteSelected}
        title="Remover notificações"
        message={`Tem certeza que deseja remover ${
          allSelected
            ? 'todas as notificações'
            : `${selectedIds.length} notificação(ões) selecionada(s)`
        }? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

      <ConfirmModal
        isOpen={showMarkReadModal}
        onClose={() => setShowMarkReadModal(false)}
        onConfirm={handleMarkSelectedAsRead}
        title="Marcar como lidas"
        message={`Deseja marcar ${
          allSelected
            ? 'todas as notificações'
            : `${selectedIds.length} notificação(ões) selecionada(s)`
        } como lida(s)?`}
        confirmText="Marcar como lidas"
        confirmColor="bg-green-600 hover:bg-green-700"
      />
    </div>
  );
}
