interface StepIndicatorProps {
  step: number;
}

const steps = [
  { number: 1, label: "Escolher dia" },
  { number: 2, label: "Selecionar início" },
  { number: 3, label: "Selecionar fim" },
  { number: 4, label: "Informações" },
  { number: 5, label: "Confirmar reserva" },
];

export default function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <div className="relative mb-10">
      {/* Linha de fundo */}
      <div className="absolute top-4 left-0 right-0 bg-gray-300 h-1"></div>

      {/* Linha de progresso */}
      <div
        className="absolute top-4 left-0 h-1 bg-blue-600 transition-all duration-300"
        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
      ></div>

      <div className="flex justify-between w-full relative">
        {steps.map((s) => {
          const isCurrent = step === s.number;
          const isCompleted = step > s.number;

          return (
            <div
              key={s.number}
              className="flex flex-col items-center text-center w-full"
            >
              {/* Bolinhas */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-4
                ${
                  isCurrent
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isCompleted
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-white border-gray-300 text-gray-600"
                }
                `}
              >
                {s.number}
              </div>

              {/* Labels */}
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
