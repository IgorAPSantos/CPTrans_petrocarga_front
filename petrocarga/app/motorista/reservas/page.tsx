"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/hooks/useAuth";
import {
  getReservasPorUsuario,
  deleteReservaByID,
} from "@/lib/actions/reservaActions";
import { Loader2 } from "lucide-react";
import ReservaLista from "@/components/reserva/minhasReservas/ReservaLista";
import { ReservaGet } from "@/lib/types/reserva";
import jsPDF from "jspdf";

export default function MinhasReservas() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<ReservaGet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservas = async () => {
    if (!user?.id) return;

    setLoading(true);

    // 1. Estratégia "Cache First" manual
    const cachedData = localStorage.getItem(`reservas-${user.id}`);
    if (cachedData) {
      setReservas(JSON.parse(cachedData));
    }

    try {
      // 2. Tenta atualizar via Server Action
      const data = await getReservasPorUsuario(user.id);

      let dadosFormatados;
      if ("veiculos" in data) {
        dadosFormatados = data.reservas || [];
      } else {
        dadosFormatados = data;
      }

      setReservas(dadosFormatados);
      // Salva a versão mais nova no cache
      localStorage.setItem(
        `reservas-${user.id}`,
        JSON.stringify(dadosFormatados)
      );
    } catch (err) {
      console.error("Erro ao atualizar dados:", err);
      if (!cachedData) {
        setError("Sem internet e sem dados salvos.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleGerarDocumento = (reserva: ReservaGet) => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Documento da Reserva", 20, 20);

      doc.setFontSize(12);
      doc.text(`ID: ${reserva.id}`, 20, 40);

      const nomeMotorista = "Motorista";
      doc.text(`Motorista: ${nomeMotorista}`, 20, 50);

      const veiculoInfo = "Veículo não identificado";

      doc.text(`Veículo: ${veiculoInfo}`, 20, 60);

      doc.text(
        `Local: ${reserva.logradouro || ""}, ${reserva.bairro || ""}`,
        20,
        70
      );
      doc.text(`Origem: ${reserva.cidadeOrigem || ""}`, 20, 80);

      doc.text(`Início: ${new Date(reserva.inicio).toLocaleString()}`, 20, 90);
      doc.text(`Fim: ${new Date(reserva.fim).toLocaleString()}`, 20, 100);

      doc.text(`Status: ${reserva.status}`, 20, 110);

      doc.output("dataurlnewwindow");
    } catch (err) {
      console.error("Erro ao gerar documento:", err);
      alert("Erro ao gerar o PDF. Verifique os dados.");
    }
  };

  const handleExcluirReserva = async (reservaId: string) => {
    try {
      const dados = await deleteReservaByID(reservaId, user!.id);
      if (!dados) return;
      await fetchReservas();
    } catch (error) {
      console.error(error);
      alert("Você precisa estar online para excluir uma reserva.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] gap-2 text-center">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="text-gray-600">Carregando suas reservas...</span>
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
      <h1 className="text-2xl font-bold mb-6 text-center">
        Bem-vindo às suas Reservas, {user?.nome || "motorista"}!
      </h1>

      {reservas.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhuma reserva encontrada.</p>
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
