import { Label } from '@/components/ui/label';

export default function FormItem({
  children,
  name,
  description,
}: Readonly<{ children: React.ReactNode; name: string; description: string }>) {
  return (
    <div className="space-y-3 md:space-y-0 flex flex-col md:flex-row md:items-start gap-3 md:gap-6 py-4 md:py-6 border-b border-b-gray-200">
      {/* Label e descrição - ocupa largura fixa no desktop */}
      <div className="md:w-64 md:flex-shrink-0">
        <Label className="block">
          <p className="text-gray-800 font-medium text-sm md:text-base mb-1">
            {name}
          </p>
          <p className="text-muted-foreground text-xs md:text-sm font-normal leading-relaxed">
            {description}
          </p>
        </Label>
      </div>

      {/* Conteúdo (inputs, etc) - ocupa o resto do espaço */}
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
