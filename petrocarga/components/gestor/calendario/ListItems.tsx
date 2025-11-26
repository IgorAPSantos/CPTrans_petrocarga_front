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
}) => (
  <div className="flex items-center justify-between p-3 rounded-md border" style={{ borderColor: "#e5e7eb" }}>
    <div>
      <div className="font-medium">{logradouro}</div>
      <div className="text-sm text-muted-foreground">{reservas.length} reserva(s)</div>
    </div>
    <Button variant="outline" onClick={onClick}>Ver vagas</Button>
  </div>
);

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
  const todasFinalizadas = reservas.every(r => r.status === "FINALIZADA");
  const color = todasFinalizadas ? "#ef4444" : "#22c55e";

  return (
    <div className="flex items-center justify-between p-3 rounded-md border" style={{ borderColor: "#e5e7eb" }}>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <div>
          <div className="font-medium">
            {vagaInfo?.endereco?.logradouro ?? vagaId}
            {vagaInfo?.numeroEndereco ? `, ${vagaInfo.numeroEndereco}` : ""}
          </div>
          <div className="text-sm text-muted-foreground">{reservas.length} reserva(s)</div>
        </div>
      </div>
      <Button variant="outline" onClick={onClick}>Ver reservas</Button>
    </div>
  );
};

export const ReservaItem = ({ reserva, veiculo, onClick }: { reserva: Reserva; veiculo?: Veiculo; onClick: () => void }) => (
  <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
    <div>
      <div className="font-medium">{formatTime(reserva.inicio)} — {formatTime(reserva.fim)}</div>
      <div className="text-sm text-muted-foreground">{reserva.bairro} • {reserva.cidadeOrigem}</div>
      {/* {veiculo && (
        <div className="text-sm text-muted-foreground">
          Placa: {veiculo.placa}
        </div>
      )} */}
    </div>
    <Button variant="ghost" onClick={onClick}>Detalhes</Button>
  </div>
);
