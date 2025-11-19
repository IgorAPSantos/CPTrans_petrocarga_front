import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogradouroItem, VagaItem, ReservaItem } from "./ListItems";
import { Reserva } from "@/lib/types/reserva";
import { Vaga } from "@/lib/types/vaga";

export type ModalState =
  | { type: "group"; data: { dateStr: string; logradouros: Record<string, Reserva[]> } }
  | { type: "vagasLogradouro"; data: { logradouro: string; reservasDoLogradouro: Reserva[] } }
  | { type: "vaga"; data: { vagaId: string; vagaInfo: Vaga | null; reservas: Reserva[] } }
  | { type: "reserva"; data: { reserva: Reserva; vagaInfo: Vaga | null } }
  | { type: null; data: null };

interface ModalProps {
  modalState: ModalState;
  vagaCache: Record<string, Vaga | null>;
  close: () => void;
  openVagasLogradouro: (logradouro: string, reservas: Reserva[]) => void;
  openVagaModal: (vagaId: string, reservas: Reserva[]) => void;
  openReservaModal: (reserva: Reserva) => void;
  checkoutForcado: (reservaId: string) => void;
}

export const ReservaModal = ({
  modalState,
  vagaCache,
  close,
  openVagasLogradouro,
  openVagaModal,
  openReservaModal,
  checkoutForcado,
}: ModalProps) => {
  const renderContent = () => {
    switch (modalState.type) {
      case "group":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Reservas do dia {modalState.data.dateStr}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-[60vh] overflow-auto">
              {Object.entries(modalState.data.logradouros).map(([logradouro, reservasDoLogradouro]) => (
                <LogradouroItem
                  key={logradouro}
                  logradouro={logradouro}
                  reservas={reservasDoLogradouro}
                  onClick={() => openVagasLogradouro(logradouro, reservasDoLogradouro)}
                />
              ))}
            </div>
          </>
        );
      case "vagasLogradouro":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Vagas em {modalState.data.logradouro}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-[60vh] overflow-auto">
              {Array.from(new Set(modalState.data.reservasDoLogradouro.map(r => r.vagaId))).map(vagaId => (
                <VagaItem
                  key={vagaId}
                  vagaId={vagaId}
                  vagasCache={vagaCache}
                  reservas={modalState.data.reservasDoLogradouro.filter(r => r.vagaId === vagaId)}
                  onClick={() => openVagaModal(vagaId, modalState.data.reservasDoLogradouro)}
                />
              ))}
            </div>
          </>
        );
      case "vaga":
        return (
          <>
            <DialogHeader>
              <DialogTitle>
                Horários - {modalState.data.vagaInfo?.endereco?.logradouro ?? modalState.data.vagaId}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-[60vh] overflow-auto">
              {modalState.data.reservas.length === 0 && (
                <div className="text-sm text-muted-foreground p-2">Nenhuma reserva neste dia.</div>
              )}
              {modalState.data.reservas
                .slice()
                .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime())
                .map(r => <ReservaItem key={r.id} reserva={r} onClick={() => openReservaModal(r)} />)}
            </div>
          </>
        );
      case "reserva":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Detalhes da Reserva</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Vaga:</strong>{" "}
                {modalState.data.vagaInfo?.endereco?.logradouro ??
                  modalState.data.vagaInfo?.referenciaEndereco ??
                  modalState.data.reserva.vagaId}
              </p>
              <p>
                <strong>Área:</strong> {modalState.data.vagaInfo?.area ?? "—"}
              </p>
              <p>
                <strong>Início:</strong> {new Date(modalState.data.reserva.inicio).toLocaleString()}
              </p>
              <p>
                <strong>Fim:</strong> {new Date(modalState.data.reserva.fim).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {modalState.data.reserva.status}
              </p>
              <p>
                <strong>Bairro:</strong> {modalState.data.reserva.bairro}
              </p>
              <p>
                <strong>Cidade Origem:</strong> {modalState.data.reserva.cidadeOrigem}
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderFooter = () => {
    if (!modalState.type) return null;
    if (modalState.type === "reserva") {
      return (
        <DialogFooter className="flex gap-2">
          <Button variant="destructive" onClick={() => checkoutForcado(modalState.data.reserva.id)}>
            Checkout Forçado
          </Button>
          <Button onClick={close}>Fechar</Button>
        </DialogFooter>
      );
    }
    return (
      <DialogFooter>
        <Button onClick={close}>Fechar</Button>
      </DialogFooter>
    );
  };

  return (
  <Dialog open={!!modalState.type} onOpenChange={close}>
    <DialogContent aria-describedby={undefined}>
      {renderContent()}
      {renderFooter()}
    </DialogContent>
  </Dialog>
);

};
