interface ConfirmationProps {
  day: Date;
  startHour: string;
  endHour: string;
  origin?: string;
  vehicleName?: string; // nome do veículo para exibir
  onConfirm: () => void;
  onReset: () => void;
}

export default function Confirmation({
  day,
  startHour,
  endHour,
  origin,
  vehicleName,
  onConfirm,
  onReset,
}: ConfirmationProps) {
  return (
    <div className="text-center">
      <p className="font-semibold">Confirme sua reserva:</p>
      <p className="text-blue-700 text-lg font-bold mt-2">
        {day?.toLocaleDateString()} — {startHour} até {endHour}
      </p>

      {origin && (
        <p className="mt-1">
          Origem: <span className="font-medium">{origin}</span>
        </p>
      )}
      {vehicleName && (
        <p>
          Veículo: <span className="font-medium">{vehicleName}</span>
        </p>
      )}

      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Confirmar
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
