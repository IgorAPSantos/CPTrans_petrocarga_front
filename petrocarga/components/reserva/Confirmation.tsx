interface ConfirmationProps {
  day: Date;
  startHour: string;
  endHour: string;
  origin?: string;
  destination?: string;
  vehicleName?: string;
  onConfirm: () => void;
  onReset?: () => void;
  isSubmitting?: boolean;
}

export default function Confirmation({
  day,
  startHour,
  endHour,
  origin,
  destination,
  vehicleName,
  onConfirm,
  onReset,
  isSubmitting = false,
}: ConfirmationProps) {
  return (
    <div className="p-4 border rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2">Resumo da Reserva</h3>
      <p>
        <strong>Data:</strong> {day.toLocaleDateString()}
      </p>
      <p>
        <strong>Horário:</strong> {startHour} - {endHour}
      </p>
      {origin && (
        <p>
          <strong>Endereço de Entrada:</strong> {origin}
        </p>
      )}
      {destination && (
        <p>
          <strong>Endereço da Vaga:</strong> {destination}
        </p>
      )}
      {vehicleName && (
        <p>
          <strong>Veículo:</strong> {vehicleName}
        </p>
      )}
      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed" //
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2 align-middle"></div>
              Confirmando...
            </>
          ) : (
            'Confirmar'
          )}
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed" // 👈 ADICIONE disabled:
          onClick={onReset}
          disabled={isSubmitting}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
