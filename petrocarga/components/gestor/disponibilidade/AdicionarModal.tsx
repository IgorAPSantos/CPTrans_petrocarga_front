import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Vaga } from '@/lib/types/vaga';

interface AdicionarModalProps {
  open: boolean;
  onClose: () => void;
  vagasPorLogradouro: Record<string, Vaga[]>;
  dataInicialPredefinida?: string | null;
  onSalvar: (data: {
    inicio: string;
    fim: string;
    modo: 'logradouro' | 'personalizado';
    selecionados: string[];
  }) => void;
}

export function AdicionarModal({
  open,
  onClose,
  vagasPorLogradouro,
  dataInicialPredefinida,
  onSalvar,
}: AdicionarModalProps) {
  const [modo, setModo] = useState<'logradouro' | 'personalizado'>(
    'logradouro',
  );
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');

  /* ------------------------------------------------------------------ */
  /*      QUANDO O MODAL ABRIR: SE TIVER dataInicialPredefinida → SETA  */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (open && dataInicialPredefinida) {
      const data =
        dataInicialPredefinida.split('T')[0] ?? dataInicialPredefinida;

      setInicio(data);

      const dt = new Date(data);
      dt.setDate(dt.getDate() + 4);

      const fimSugerido = dt.toISOString().split('T')[0];
      setFim(fimSugerido);
    }
  }, [open, dataInicialPredefinida]);

  const toggle = (item: string) =>
    setSelecionados((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );

  function salvar() {
    onSalvar({
      inicio: `${inicio}T00:00`,
      fim: `${fim}T23:59`,
      modo,
      selecionados,
    });

    // limpar estado após salvar
    setSelecionados([]);
    setInicio('');
    setFim('');

    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-auto w-[min(900px,95%)]">
        <DialogHeader>
          <DialogTitle>Adicionar Disponibilidade</DialogTitle>
        </DialogHeader>

        {/* Modo LOGRADOURO | PERSONALIZADO */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setModo('logradouro')}
            className={`px-3 py-1 rounded ${
              modo === 'logradouro' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Por Logradouro
          </button>

          <button
            onClick={() => setModo('personalizado')}
            className={`px-3 py-1 rounded ${
              modo === 'personalizado' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Personalizado
          </button>
        </div>

        {/* Escolha por logradouro ------------------------------------------------ */}
        {modo === 'logradouro' ? (
          <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-auto mb-4">
            {Object.keys(vagasPorLogradouro).map((log) => (
              <label
                key={log}
                className="flex items-center gap-2 p-2 border rounded"
              >
                <input
                  type="checkbox"
                  checked={selecionados.includes(log)}
                  onChange={() => toggle(log)}
                />
                {log}
              </label>
            ))}
          </div>
        ) : (
          /* Escolha personalizada  --------------------------------------- */
          <div className="space-y-2 max-h-[40vh] overflow-auto mb-4">
            {Object.entries(vagasPorLogradouro).map(([log, lista]) => (
              <div key={log} className="border rounded p-2 bg-gray-50">
                <div className="font-semibold mb-1">{log}</div>
                <div className="space-y-1 ml-3">
                  {lista.map((vaga) => (
                    <label key={vaga.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={selecionados.includes(vaga.id)}
                        onCheckedChange={() => toggle(vaga.id)}
                      />
                      Vaga {vaga.endereco.logradouro} - {vaga.numeroEndereco}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Datas ----------------------------------------------------------------- */}
        <div className="space-y-4">
          {/* Início */}
          <div>
            <label className="text-sm font-medium">Início</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
            />
          </div>

          {/* Fim */}
          <div>
            <label className="text-sm font-medium">Fim</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button onClick={salvar}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
