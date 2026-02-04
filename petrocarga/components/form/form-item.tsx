import { Label } from '@/components/ui/label';
import { CircleAlert } from 'lucide-react';

interface FormItemProps {
  children: React.ReactNode;
  name: string;
  description: string;
  error?: string; // Prop opcional de erro
}

export default function FormItem({
  children,
  name,
  description,
  error,
}: FormItemProps) {
  return (
    <div className="space-y-3 md:space-y-0 flex flex-col md:flex-row md:items-start gap-3 md:gap-6 py-4 md:py-6 border-b border-b-gray-200">
      {/* Label e descrição - ocupa largura fixa no desktop */}
      <div className="md:w-64 md:flex-shrink-0">
        <Label className="block">
          <div className="flex items-center gap-2">
            <p className="text-gray-800 font-medium text-sm md:text-base mb-1">
              {name}
            </p>
            {error && (
              <CircleAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-muted-foreground text-xs md:text-sm font-normal leading-relaxed">
            {description}
          </p>
        </Label>
      </div>

      {/* Conteúdo (inputs, etc) - ocupa o resto do espaço */}
      <div className="flex-1 w-full space-y-2">
        {children}
        {/* Exibe a mensagem de erro abaixo do input */}
        {error && (
          <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
            <CircleAlert className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
