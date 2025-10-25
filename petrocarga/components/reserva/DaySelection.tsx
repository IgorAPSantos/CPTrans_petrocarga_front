import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DaySelectionProps {
  selected?: Date;
  onSelect: (day: Date) => void;
}

export default function DaySelection({
  selected,
  onSelect,
}: DaySelectionProps) {
  const today = new Date();
  return (
    <div className="flex justify-center">
      <div>
        <p className="font-semibold mb-4 text-center text-lg">
          Selecione o dia:
        </p>
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(day) => day && onSelect(day)}
          className="mx-auto"
          disabled={{ before: today }}
          modifiersClassNames={{
            selected:
              "bg-blue-600 text-white w-12 h-12 flex items-center justify-center rounded-full",
          }}
        />
      </div>
    </div>
  );
}
