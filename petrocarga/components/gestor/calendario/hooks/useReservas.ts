"use client";

import { useEffect, useState, useCallback } from "react";
import { getReservas, finalizarForcado } from "@/lib/actions/reservaActions";
import { Notificacao } from "@/lib/actions/notificacaoAction";
import { useAuth } from "@/components/hooks/useAuth";
import { Reserva } from "@/lib/types/reserva";
import { toast } from "sonner";

export function useReservas() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Carregar reservas
  const carregarReservas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReservas();
      setReservas(data);
    } catch (err) {
      console.error("Erro ao carregar reservas:", err);
      toast.error("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarReservas();
  }, [carregarReservas]);

  // Função principal de checkout forçado com notificação
  const finalizarReservaForcada = useCallback(async (
    reservaID: string,
    reservaData?: Reserva
  ) => {
    setActionLoading(true);
    
    try {
      // 1. Encontrar a reserva completa
      let reserva = reservaData;
      if (!reserva) {
        reserva = reservas.find(r => r.id === reservaID);
        if (!reserva) {
          toast.error("Reserva não encontrada");
          return { error: true, message: "Reserva não encontrada" };
        }
      }

      // 2. Verificar se temos motoristaId (userId do motorista)
      if (!reserva.motoristaId) {
        console.warn("Reserva não tem motoristaId:", reserva.id);
        // Podemos prosseguir com checkout, mas sem notificação
      }

      // 3. Confirmar ação
      const confirmar = window.confirm(
        `CONFIRMAR CHECKOUT FORÇADO\n\n` +
        `Motorista: ${reserva.motoristaNome}\n` +
        `Placa: ${reserva.placaVeiculo}\n` +
        `Vaga: ${reserva.enderecoVaga.logradouro}\n` +
        `Data: ${new Date(reserva.inicio).toLocaleDateString()}\n\n` +
        `Esta ação não pode ser desfeita` +
        (reserva.motoristaId ? ` e uma notificação será enviada ao motorista.` : `.`)
      );

      if (!confirmar) {
        return { error: true, message: "Ação cancelada pelo usuário" };
      }

      // 4. Executar checkout forçado
      const resultado = await finalizarForcado(reservaID);

      if (resultado.error) {
        toast.error(`Erro: ${resultado.message}`);
        return resultado;
      }

      let notificacaoEnviada = false;

      // 5. Enviar notificação SE tivermos motoristaId
      if (reserva.motoristaId) {
        try {
          const formData = new FormData();
          formData.append("usuarioId", reserva.motoristaId); // userId do motorista
          formData.append("titulo", "Reserva Finalizada - Checkout Forçado");
          formData.append("mensagem", 
            `Sua reserva foi finalizada pelo gestor.\n\n` +
            `🔹 Vaga: ${reserva.enderecoVaga.logradouro}\n` +
            `🔹 Data: ${new Date(reserva.inicio).toLocaleDateString()}\n` +
            `🔹 Horário: ${new Date(reserva.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n` +
            `🔹 Veículo: ${reserva.placaVeiculo}\n\n` +
            `Motivo: Checkout realizado pelo gestor.`
          );
          formData.append("tipo", "RESERVA");
          formData.append("metada", JSON.stringify({
            tipo: "CHECKOUT_FORCADO",
            reservaId: reserva.id,
            vagaId: reserva.vagaId,
            vagaEndereco: reserva.enderecoVaga.logradouro,
            motoristaNome: reserva.motoristaNome,
            placaVeiculo: reserva.placaVeiculo,
            realizadoPor: {
              id: user?.id,
              nome: user?.nome,
              permissao: user?.permissao
            },
            realizadoEm: new Date().toISOString()
          }));

          const notificacaoResult = await Notificacao(formData);
          notificacaoEnviada = !notificacaoResult.error;
          
          if (notificacaoResult.error) {
            console.warn("Notificação não enviada:", notificacaoResult.message);
          }
        } catch (error) {
          console.warn("Erro ao enviar notificação:", error);
        }
      }

      // 6. Atualizar estado local
      setReservas(prev =>
        prev.map(r =>
          r.id === reservaID ? { ...r, status: "CONCLUIDA" } : r
        )
      );

      // 7. Feedback ao usuário
      if (notificacaoEnviada) {
        toast.success("Checkout forçado realizado e notificação enviada!");
      } else if (reserva.motoristaId) {
        toast.success("Checkout forçado realizado, mas notificação falhou");
      } else {
        toast.success("Checkout forçado realizado");
      }

      return {
        error: false,
        message: "Checkout forçado realizado com sucesso",
        notificacaoEnviada,
        motoristaIdEncontrado: !!reserva.motoristaId
      };

    } catch (err) {
      console.error("Erro ao finalizar reserva:", err);
      toast.error("Erro ao processar checkout forçado");
      return {
        error: true,
        message: "Erro ao processar checkout forçado"
      };
    } finally {
      setActionLoading(false);
    }
  }, [reservas, user]);

  return {
    reservas,
    loading,
    actionLoading,
    finalizarReservaForcada,
    carregarReservas,
    setReservas,
  };
}