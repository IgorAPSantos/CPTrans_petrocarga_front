import { useState } from "react";

interface Vehicle {
  id: string;
  name: string;
}

interface OriginVehicleStepProps {
  vehicles: Vehicle[]; // lista de veículos do usuário
  origin: string; // valor atual do local de origem
  selectedVehicleId?: string; // id do veículo selecionado
  onOriginChange: (value: string) => void;
  onVehicleChange: (id: string) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function OriginVehicleStep({
  vehicles,
  origin,
  selectedVehicleId,
  onOriginChange,
  onVehicleChange,
  onNext,
  onBack,
}: OriginVehicleStepProps) {
  const [localOrigin, setLocalOrigin] = useState(origin);

  const handleNext = () => {
    if (!localOrigin || !selectedVehicleId) return;
    onOriginChange(localOrigin);
    onNext();
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block font-semibold mb-1">Local de origem:</label>
        <input
          type="text"
          value={localOrigin}
          onChange={(e) => setLocalOrigin(e.target.value)}
          placeholder="Digite de onde você está vindo"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Selecione o veículo:</label>
        <select
          value={selectedVehicleId || ""}
          onChange={(e) => onVehicleChange(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Selecione um veículo
          </option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between mt-4">
        {onBack && (
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onBack}
          >
            Voltar
          </button>
        )}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleNext}
          disabled={!localOrigin || !selectedVehicleId}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
