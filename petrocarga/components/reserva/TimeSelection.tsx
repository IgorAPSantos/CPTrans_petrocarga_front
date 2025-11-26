interface TimeSelectionProps {
  times: string[];
  reserved: string[];
  selected: string | null;
  onSelect: (time: string) => void;
  onBack?: () => void;
  color?: "blue" | "green";
}

export default function TimeSelection({
  times,
  reserved,
  selected,
  onSelect,
  onBack,
  color = "blue",
}: TimeSelectionProps) {
  const hoverClass =
    color === "blue"
      ? "hover:bg-blue-500 hover:text-white"
      : "hover:bg-green-500 hover:text-white";
  const selectedClass =
    color === "blue" ? "bg-blue-600 text-white" : "bg-green-600 text-white";

  return (
    <div>
      <p className="font-semibold mb-3">Escolha o horário:</p>
      <div className="grid grid-cols-3 gap-3">
        {times.map((time) => {
          const disabled = reserved.includes(time);
          const isSelected = selected === time;
          return (
            <button
              key={time}
              disabled={disabled}
              onClick={() => onSelect(time)}
              className={`p-2 rounded border text-center transition
                ${
                  disabled
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : `cursor-pointer ${hoverClass}`
                }
                ${isSelected ? selectedClass : ""}`}
            >
              {time}
            </button>
          );
        })}
      </div>
      <button onClick={onBack} className="mt-4 px-3 py-1 bg-gray-200 rounded">
        Voltar
      </button>
    </div>
  );
}
