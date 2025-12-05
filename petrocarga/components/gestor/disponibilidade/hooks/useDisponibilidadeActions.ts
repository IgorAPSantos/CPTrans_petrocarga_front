import {
  removeDisponibilidade,
  postDisponibilidade,
  updateDisponibilidade,
} from "../services/disponibilidadeService";

import { Disponibilidade } from "@/lib/types/disponibilidadeVagas";
import { Vaga } from "@/lib/types/vaga";

interface UseDisponibilidadeActionsProps {
  vagasPorLogradouro: Record<string, Vaga[]>;

  disponibilidadesAgrupadas: Record<string, Record<string, Disponibilidade[]>>;
  setDisponibilidades: React.Dispatch<React.SetStateAction<Disponibilidade[]>>;
}

export interface SalvarDisponibilidadeData {
  inicio: string;
  fim: string;
  modo: "logradouro" | "personalizado";
  selecionados: string[];
}

export function useDisponibilidadeActions({
  vagasPorLogradouro,
  disponibilidadesAgrupadas,
  setDisponibilidades,
}: UseDisponibilidadeActionsProps) {
  /** Salvar nova disponibilidade */
  async function salvar({
    inicio,
    fim,
    modo,
    selecionados,
  }: SalvarDisponibilidadeData) {
    if (!inicio || !fim) {
      alert("Preencha início e fim.");
      return;
    }

    try {
      let vagaIds: string[] = [];

      if (modo === "logradouro") {
        vagaIds = selecionados.flatMap(
          (log) => vagasPorLogradouro[log]?.map((v) => v.id) ?? []
        );
      } else {
        vagaIds = selecionados;
      }

      const novas = await postDisponibilidade(vagaIds, inicio, fim);

      setDisponibilidades((prev) => [
        ...prev,
        ...(Array.isArray(novas) ? novas : [novas]),
      ]);
    } catch (err) {
      let mensagem = "Erro desconhecido";

      if (err instanceof Error) {
        try {
          const json = JSON.parse(err.message);
          mensagem = json.erro || mensagem;
        } catch {
          mensagem = err.message;
        }
      }

      alert(`Erro ao salvar disponibilidade: ${mensagem}`);
    }
  }

  /** Excluir logradouro inteiro */
  async function excluirLogradouro(log: string) {
    if (!confirm(`Excluir todas as disponibilidades de "${log}"?`)) return;

    const grupos = disponibilidadesAgrupadas[log];
    if (!grupos) return;

    const ids = Object.values(grupos)
      .flat()
      .map((d) => d.id);

    setDisponibilidades((prev) => prev.filter((d) => !ids.includes(d.id)));

    await Promise.all(ids.map((id) => removeDisponibilidade(id)));
  }

  /** Editar intervalo de uma vaga específica */
  async function editarIntervalo(
    id: string,
    vagaId: string,
    inicio: string,
    fim: string
  ) {

    setDisponibilidades((prev) =>
      prev.map((d) => (d.id === id ? { ...d, inicio, fim } : d))
    );

    await updateDisponibilidade(id, vagaId, inicio, fim);
  }

  /** Remover vaga específica */
  async function removerVagaDisponibilidade(id: string) {
    setDisponibilidades((prev) => prev.filter((d) => d.id !== id));
    await removeDisponibilidade(id);
  }

  /** Excluir intervalo inteiro */
  async function excluirIntervalo(log: string, intervalo: string) {
    const lista = disponibilidadesAgrupadas[log]?.[intervalo] ?? [];
    const ids = lista.map((d) => d.id);

    setDisponibilidades((prev) => prev.filter((d) => !ids.includes(d.id)));
    await Promise.all(ids.map((id) => removeDisponibilidade(id)));
  }

  return {
    salvar,
    excluirLogradouro,
    editarIntervalo,
    removerVagaDisponibilidade,
    excluirIntervalo,
  };
}
