"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/hooks/useAuth";
import { deleteReservaByID } from "@/lib/actions/reservaActions"; // Server Action (precisa de internet)
import { clientApi } from "@/lib/clientApi";
import { Loader2, WifiOff } from "lucide-react"; // Ícone para estado offline
import ReservaLista from "@/components/reserva/minhasReservas/ReservaLista";
import { ReservaGet } from "@/lib/types/reserva";
import jsPDF from "jspdf";

export default function MinhasReservas() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<ReservaGet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // 1. Função de busca adaptada para PWA usando a clientApi
  const getReservasPorUsuarioClient = async (userId: string) => {
    // Ajuste o path conforme sua rota real no Java
    const response = await clientApi(`/petrocarga/reservas/usuario/${userId}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar dados do servidor.");
    }

    return response.json();
  };

  const fetchReservas = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getReservasPorUsuarioClient(user.id);

      let dadosFormatados;
      // Mantive sua lógica de formatação original
      if (data && typeof data === "object" && "veiculos" in data) {
        dadosFormatados = data.reservas || [];
      } else {
        dadosFormatados = data || [];
      }

      setReservas(dadosFormatados);
      setIsOffline(false);
    } catch (err) {
      console.error("Erro ao buscar reservas:", err);

      // No PWA, se cair aqui, geralmente é falha crítica ou falta de cache
      setError("Não foi possível carregar suas reservas atuais.");

      // Verifica se o navegador está offline para avisar o usuário
      if (!navigator.onLine) {
        setIsOffline(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();

    // Listener para avisar se a internet cair/voltar enquanto ele está na página
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", fetchReservas); // Tenta atualizar quando a net volta
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", fetchReservas);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [user?.id]);

  // --- LOGICA DO PDF (Mantida igual, jsPDF funciona offline) ---
  const handleGerarDocumento = (reserva: ReservaGet) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Documento da Reserva", 20, 20);
      doc.setFontSize(12);
      doc.text(`ID: ${reserva.id}`, 20, 40);
      doc.text(
        `Local: ${reserva.logradouro || ""}, ${reserva.bairro || ""}`,
        20,
        70
      );
      doc.text(`Status: ${reserva.status}`, 20, 110);
      doc.output("dataurlnewwindow");
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao gerar o PDF.");
    }
  };

  // --- EXCLUIR (Ação Sensível à Conexão) ---
  const handleExcluirReserva = async (reservaId: string) => {
    if (!navigator.onLine) {
      alert(
        "Você está offline. A exclusão de reservas só é permitida com conexão à internet."
      );
      return;
    }

    try {
      // Como o deleteReservaByID é uma Server Action,
      // o Next.js tentará fazer um POST que falhará se estiver offline.
      const dados = await deleteReservaByID(reservaId, user!.id);
      if (!dados) return;
      await fetchReservas();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir. Verifique sua conexão.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
        <span className="text-gray-600">
          Carregando reservas (buscando sinal)...
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center w-full min-h-screen bg-gray-50">
      {/* Banner de Aviso Offline */}
      {isOffline && (
        <div className="w-full max-w-md mb-4 p-3 bg-amber-100 border border-amber-300 text-amber-800 rounded-lg flex items-center gap-2 text-sm">
          <WifiOff size={18} />
          <span>
            Você está visualizando dados salvos. Conecte-se para atualizar ou
            excluir.
          </span>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-center">
        Suas Reservas, {user?.nome || "motorista"}!
      </h1>

      {reservas.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhuma reserva encontrada.</p>
          {isOffline && (
            <p className="text-xs text-gray-400">
              Pode haver dados não carregados por estar offline.
            </p>
          )}
        </div>
      ) : (
        <ReservaLista
          reservas={reservas}
          onGerarDocumento={handleGerarDocumento}
          onExcluir={handleExcluirReserva}
        />
      )}
    </div>
  );
}
