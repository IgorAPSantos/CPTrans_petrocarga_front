"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { VeiculoAPI } from "@/lib/types/veiculo";
import { useMapboxSuggestions } from "../map/hooks/useMapboxSuggestions";

interface OriginVehicleStepProps {
  vehicles: VeiculoAPI[];
  origin: string;
  selectedVehicleId?: string;
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
  const router = useRouter();
  const [localOrigin, setLocalOrigin] = useState(origin);
  const [localVehicleId, setLocalVehicleId] = useState(selectedVehicleId || "");
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMapboxSuggestions(localOrigin);

  const handleSelectSuggestion = (place: string) => {
    setLocalOrigin(place);
    onOriginChange(place);
    setIsFocused(false);
  };

  const handleVehicleChange = (value: string) => {
    if (value === "add-new") {
      router.push("/motorista/veiculos/cadastrar-veiculos");
      return;
    }
    setLocalVehicleId(value);
  };

  const handleNext = () => {
    if (!localOrigin || !localVehicleId) return;
    onOriginChange(localOrigin);
    onVehicleChange(localVehicleId);
    onNext();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Campo de origem com sugestões do Mapbox */}
      <div className="relative">
        <label className="block font-semibold mb-1">Local de origem:</label>
        <input
          type="text"
          value={localOrigin}
          onChange={(e) => setLocalOrigin(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)} // pequeno delay permite clicar
          placeholder="Digite de onde você está vindo (Ex: Rua do Imperador, Petrópolis - RJ)"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Sugestões do Mapbox */}
        {isFocused && suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto shadow">
            {suggestions.map((place, index) => (
              <li
                key={index}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onMouseDown={() => handleSelectSuggestion(place)} // evita perder foco antes do clique
              >
                {place}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Select de veículos */}
      <div>
        <label className="block font-semibold mb-1">Selecione o veículo:</label>
        <select
          value={localVehicleId}
          onChange={(e) => handleVehicleChange(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Selecione um veículo
          </option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {`${v.name} (${v.plate})`}
            </option>
          ))}
          <option value="add-new" className="text-blue-600 font-semibold">
            Adicionar novo veículo
          </option>
        </select>
      </div>

      {/* Botões */}
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
          disabled={!localOrigin || !localVehicleId}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
