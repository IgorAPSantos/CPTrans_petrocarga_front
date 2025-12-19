'use client';

import { useNotifications } from "@/context/NotificationContext";
import { Bell, BellOff, CheckCheck, X, Wifi, WifiOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function NotificacoesPage() {
  const {
    notifications,
    isConnected,
    isLoading,
    error,
    removeNotification,
    clearNotifications,
  } = useNotifications();

  const formatarTempo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return "Agora";
    }
  };

  const getIconeNotificacao = (tipo: string) => {
    switch (tipo) {
      case "RESERVA":
        return "🚗";
      case "VAGA":
        return "🅿️";
      case "VEICULO":
        return "🔧";
      case "MOTORISTA":
        return "👤";
      case "SISTEMA":
        return "📢";
      default:
        return "📢";
    }
  };

  const getCorNotificacao = (tipo: string) => {
    switch (tipo) {
      case "RESERVA":
        return "border-l-blue-500 bg-blue-50";
      case "VAGA":
        return "border-l-green-500 bg-green-50";
      case "VEICULO":
        return "border-l-purple-500 bg-purple-50";
      case "MOTORISTA":
        return "border-l-yellow-500 bg-yellow-50";
      case "SISTEMA":
        return "border-l-gray-500 bg-gray-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
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
                  {notifications.length}{" "}
                  {notifications.length === 1
                    ? "notificação"
                    : "notificações"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status da conexão SSE */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  isConnected
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
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

              {/* Botão Limpar Tudo */}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Limpar todas as notificações"
                >
                  <CheckCheck className="h-4 w-4" />
                  Limpar tudo
                </button>
              )}
            </div>
          </div>

          {/* Mensagens de Status SSE */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              ⚠️ {error}
              <div className="mt-1 text-xs text-red-600">
                As notificações em tempo real estão temporariamente indisponíveis.
              </div>
            </div>
          )}

          {!isConnected && !error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-700 text-sm">
              ⚡ Conectando ao servidor de notificações...
              <div className="mt-1 text-xs text-yellow-600">
                As notificações serão recebidas em tempo real quando a conexão for estabelecida.
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
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${getCorNotificacao(
                  notif.tipo
                )} hover:shadow-lg transition-shadow ${notif.lida ? 'opacity-80' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
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
                        {!notif.lida && (
                          <span className="inline-block h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {notif.tipo}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatarTempo(notif.timestamp)}
                        </span>
                      </div>

                      {/* Dados adicionais */}
                      {notif.metada && Object.keys(notif.metada).length > 0 && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          {Object.entries(notif.metada).map(([key, value]) => (
                            <div key={key} className="truncate">
                              <strong>{key}:</strong> {String(value)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botão remover */}
                  <button
                    onClick={() => removeNotification(notif.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover notificação"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}