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
    <div className="flex justify-between mb-8">
      {steps.map((s) => (
        <div
          key={s.number}
          className="flex flex-col items-center flex-1 relative"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold 
              ${
                step === s.number
                  ? "bg-blue-600 text-white"
                  : step > s.number
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
          >
            {s.number}
          </div>
          <span className="mt-2 text-sm text-center">{s.label}</span>
          {s.number < steps.length && (
            <div
              className={`absolute top-5 right-[-50%] h-1 flex-1 ${
                step > s.number ? "bg-green-600" : "bg-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}
