interface StepIndicatorProps {
  step: number;
}

const steps = [
  { number: 1, label: "Escolher dia" },
  { number: 2, label: "Informações" },
  { number: 3, label: "Selecionar início" },
  { number: 4, label: "Selecionar fim" },
  { number: 5, label: "Confirmar reserva" },
];

export default function StepIndicator({ step }: StepIndicatorProps) {
  const segments = steps.length - 1;
  const ratio = segments > 0 ? (step - 1) / segments : 0; // 0..1

  return (
    <div className="relative mb-10 w-full">
      {/* Container da linha com padding horizontal igual ao raio da bolinha.
          w-10 = 2.5rem = 40px; metade = 20px => left/right = 1.25rem (left-5/right-5) */}
      <div className="absolute top-5 left-0 right-0 px-5">
        <div className="relative w-full">
          {/* Linha de fundo (cinza) ocupando toda a área interna */}
          <div className="h-1 bg-gray-300 rounded-full w-full"></div>

          {/* Linha de progresso (azul) — sua largura é % da largura interna */}
          <div
            className="absolute left-0 top-0 h-1 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>

      {/* Bolinhas e labels (sobrepondo a linha) */}
      <div className="flex justify-between w-full relative z-10">
        {steps.map((s) => {
          const isCurrent = step === s.number;
          const isCompleted = step > s.number;

          return (
            <div
              key={s.number}
              className="flex flex-col items-center text-center w-full"
            >
              {/* Bolinha (z acima da linha) */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-4 relative z-20
                ${
                  isCurrent
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isCompleted
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-white border-gray-300 text-gray-600"
                }`}
              >
                {s.number}
              </div>

              {/* Label */}
              <span className="mt-2 text-[10px] sm:text-xs max-w-[70px] break-words">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
