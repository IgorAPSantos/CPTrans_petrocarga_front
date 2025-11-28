import { Button } from "@/components/ui/button";
import { Reserva } from "@/lib/types/reserva";
import { Vaga } from "@/lib/types/vaga";
import { Veiculo } from "@/lib/types/veiculo";
import { formatTime } from "./utils/utils";

export const LogradouroItem = ({
  logradouro,
  reservas,
  onClick,
}: {
  logradouro: string;
  reservas: Reserva[];
  onClick: () => void;
}) => {
  const ativas = reservas.filter((r) => r.status === "ATIVA").length;
  const concluidas = reservas.filter((r) => r.status === "CONCLUIDA").length;

  return (
    <div
      className="flex items-center justify-between p-3 rounded-md border"
      style={{ borderColor: "#e5e7eb" }}
    >
      <div>
        <div className="font-medium">{logradouro}</div>

        {/* Contadores elegantes */}
        <div className="flex gap-3 mt-1 text-sm">
          <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-800 font-medium">
            {ativas} ativa(s)
          </span>
          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-medium">
            {concluidas} concluída(s)
          </span>
        </div>
      </div>

      <Button variant="outline" onClick={onClick}>
        Ver vagas
      </Button>
    </div>
  );
};

export const VagaItem = ({
  vagaId,
  vagasCache,
  reservas,
  onClick,
}: {
  vagaId: string;
  vagasCache: Record<string, Vaga | null>;
  reservas: Reserva[];
  onClick: () => void;
}) => {
  const vagaInfo = vagasCache[vagaId] ?? null;
  const todasFinalizadas = reservas.every((r) => r.status === "CONCLUIDA");
  const color = todasFinalizadas ? "#ef4444" : "#22c55e";

  return (
    <div
      className="flex items-center justify-between p-3 rounded-md border"
      style={{ borderColor: "#e5e7eb" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div>
          <div className="font-medium">
            {vagaInfo?.endereco?.logradouro ?? vagaId}
            {vagaInfo?.numeroEndereco ? `, ${vagaInfo.numeroEndereco}` : ""}
          </div>
          <div className="text-sm text-muted-foreground">
            {reservas.length} reserva(s)
          </div>
        </div>
      </div>
      <Button variant="outline" onClick={onClick}>
        Ver reservas
      </Button>
    </div>
  );
};

export const ReservaItem = ({
  reserva,
  onClick,
}: {
  reserva: Reserva;
  veiculo?: Veiculo;
  onClick: () => void;
}) => {
  const statusColor =
    reserva.status === "CONCLUIDA"
      ? "border-l-4 border-red-400"
      : reserva.status === "ATIVA"
      ? "border-l-4 border-green-400"
      : "border-l-4 border-gray-400";

  return (
    <div
      className={`flex items-center justify-between p-2 rounded-md ${statusColor}`}
    >
      <div>
        <div className="font-medium">
          {formatTime(reserva.inicio)} — {formatTime(reserva.fim)}
        </div>
        <div className="text-sm text-muted-foreground">
          {reserva.enderecoVaga.bairro} • {reserva.placaVeiculo}
        </div>
      </div>
      <Button variant="ghost" onClick={onClick}>
        Detalhes
      </Button>
    </div>
  );
};
