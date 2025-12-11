"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/hooks/useAuth";
import {
  getReservasPorUsuario,
  getDocumentoReserva,
  deleteReservaByID
} from "@/lib/actions/reservaActions";
import { Loader2 } from "lucide-react";
import ReservaCard from "@/components/reserva/minhasReservas/ReservaCard";
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
    setError(null);

    try {
      const data = await getReservasPorUsuario(user.id);
      if ("veiculos" in data) {
        setReservas(data.reservas || []);
      } else {
        setReservas(data);
      }
    } catch (err) {
      console.error("Erro ao carregar reservas:", err);
      setError("Erro ao buscar suas reservas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [user?.id]);

  const handleGerarDocumento = async (reserva: ReservaGet) => {
    try {
      const dados = await getDocumentoReserva(reserva.id);

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Documento da Reserva", 20, 20);

      doc.setFontSize(12);
      doc.text(`ID: ${dados.id}`, 20, 40);
      doc.text(`Motorista: ${dados.motoristaNome}`, 20, 50);
      doc.text(`Veículo: ${dados.veiculoPlaca} - ${dados.veiculoModelo}`, 20, 60);
      doc.text(`Local: ${dados.logradouro}, ${dados.bairro}`, 20, 70);
      doc.text(`Origem: ${dados.cidadeOrigem}`, 20, 80);
      doc.text(`Início: ${dados.inicio}`, 20, 90);
      doc.text(`Fim: ${dados.fim}`, 20, 100);
      doc.text(`Status: ${dados.status}`, 20, 110);

      doc.output("dataurlnewwindow");
    } catch (err) {
      console.error("Erro ao gerar documento:", err);
      alert("Erro ao gerar documento.");
    }
  };

  const handleExcluirReserva = async (reservaId: string) => {
    try {
      const dados = await deleteReservaByID(reservaId, user!.id);
      if (!dados) return;
      await fetchReservas();
    } catch (error) {
      console.error(error);
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
        <div className="grid gap-4 w-full max-w-2xl">
          {reservas.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              onGerarDocumento={handleGerarDocumento}
              onExcluir={handleExcluirReserva}
            />
          ))}
        </div>
      )}
    </div>
  );
}
