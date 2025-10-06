import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function DiaSemana({ name = "diaSemana" }) {
  const [selecionarDias, setSelecionarDias] = useState<string[]>([]);

  const diasDaSemana = [
    { id: 'dom', label: 'Domingo', value: '1' },
    { id: 'seg', label: 'Segunda-feira', value: '2' },
    { id: 'ter', label: 'Terça-feira', value: '3' },
    { id: 'qua', label: 'Quarta-feira', value: '4' },
    { id: 'qui', label: 'Quinta-feira', value: '5' },
    { id: 'sex', label: 'Sexta-feira', value: '6' },
    { id: 'sab', label: 'Sábado', value: '7' }
  ];

  const handleDayToggle = (dayValue: string) => {
    setSelecionarDias(prev => 
      prev.includes(dayValue)
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue]
    );
  };

  const selectAll = () => {
    setSelecionarDias(diasDaSemana.map(d => d.value));
  };

  const clearAll = () => {
    setSelecionarDias([]);
  };

  // Input hidden que enviará os valores no formato correto: "0,3,4"
  const hiddenValue = selecionarDias.sort((a, b) => Number(a) - Number(b)).join(',');

  return (
    <div>
      <div className='flex sm:gap-20 border border-gray-500 rounded-xs p-4'>
        {diasDaSemana.map((dia) => (
          <div key={dia.id}>
            <Checkbox
              className='border border-gray-500'
              id={dia.id}
              checked={selecionarDias.includes(dia.value)}
              onCheckedChange={() => handleDayToggle(dia.value)}
            />
            <Label
              htmlFor={dia.id}
              className="text-sm font-medium cursor-pointer select-none"
            >
              {dia.label}
            </Label>
          </div>
        ))}
      </div>

      {/* Input hidden que será enviado com o formulário */}
      <input 
        type="hidden" 
        name={name} 
        value={hiddenValue}
      />
    </div>
  );
}