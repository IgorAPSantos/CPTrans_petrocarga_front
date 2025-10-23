import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { OperacoesVaga } from '@/lib/types';

{/* Definição das propriedades esperadas pelo componente */ }
interface DiaSemanaProps {
  name?: string;
  operacoesVaga?: OperacoesVaga[];
}

export default function DiaSemana({ name = "diaSemana", operacoesVaga = [] }: DiaSemanaProps) {
  const diasDaSemana = [
    { id: 'dom', label: 'Domingo', value: '1', abrev: 'Dom', enum: 'DOMINGO' },
    { id: 'seg', label: 'Segunda-feira', value: '2', abrev: 'Seg', enum: 'SEGUNDA' },
    { id: 'ter', label: 'Terça-feira', value: '3', abrev: 'Ter', enum: 'TERCA' },
    { id: 'qua', label: 'Quarta-feira', value: '4', abrev: 'Qua', enum: 'QUARTA' },
    { id: 'qui', label: 'Quinta-feira', value: '5', abrev: 'Qui', enum: 'QUINTA' },
    { id: 'sex', label: 'Sexta-feira', value: '6', abrev: 'Sex', enum: 'SEXTA' },
    { id: 'sab', label: 'Sábado', value: '7', abrev: 'Sáb', enum: 'SABADO' }
  ];

  {/* Estado para gerenciar os dias e horários selecionados */ }
  type DiaConfig = {
    ativo: boolean;
    horarioInicio: string;
    horarioFim: string;
  };

  {/* Mapeamento dos dias para suas configurações */ }
  type DiasConfig = {
    [key: string]: DiaConfig;
  };

  {/* Função para converter as operações da vaga em configuração inicial */ }
  const getInitialConfig = () => {
    const config: DiasConfig = {};

    diasDaSemana.forEach((dia) => {
      const operacao = operacoesVaga.find(op => op.diaSemanaEnum === dia.enum);

      if (operacao) {
        config[dia.value] = {
          ativo: true,
          horarioInicio: operacao.horaInicio.slice(0, 5), // Remove os segundos
          horarioFim: operacao.horaFim.slice(0, 5),
        };
      } else {
        config[dia.value] = {
          ativo: false,
          horarioInicio: "00:00",
          horarioFim: "13:00"
        };
      }
    });

    return config;
  };

  {/* Inicializa o estado com os valores da vaga ou valores padrão */ }
  const [diasConfig, setDiasConfig] = useState<DiasConfig>(getInitialConfig());

  {/* Função para alternar o estado ativo de um dia */ }
  const handleDayToggle = (dayValue: string) => {
    setDiasConfig(prev => ({
      ...prev,
      [dayValue]: {
        ...prev[dayValue],
        ativo: !prev[dayValue].ativo
      }
    }));
  };

  {/* Função para atualizar os horários de início e fim */ }
  const handleHorarioChange = (
    dayValue: string,
    tipo: "horarioInicio" | "horarioFim",
    valor: string
  ) => {
    setDiasConfig(prev => ({
      ...prev,
      [dayValue]: {
        ...prev[dayValue],
        [tipo]: valor
      }
    }));
  };

  {/* Gera o valor JSON para o input hidden com os dias ativos e seus horários */ }
  const hiddenValue = JSON.stringify(
    Object.entries(diasConfig)
      .filter(([, config]) => config.ativo)
      .map(([dia, config]) => ({
        dia,
        horarioInicio: config.horarioInicio,
        horarioFim: config.horarioFim
      }))
  );

  {/* Renderiza o componente */ }
  return (
    <div className="w-full space-y-2 md:space-y-3">
      {diasDaSemana.map((dia) => (
        <div
          key={dia.id}
          className="border border-gray-300 rounded-md p-3 md:p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col gap-3">
            {/* Checkbox e Label do dia */}
            <div className="flex items-center space-x-2">
              <Checkbox
                className="border border-gray-500 flex-shrink-0"
                id={dia.id}
                checked={diasConfig[dia.value].ativo}
                onCheckedChange={() => handleDayToggle(dia.value)}
              />
              <Label
                htmlFor={dia.id}
                className="text-sm md:text-base font-medium cursor-pointer select-none"
              >
                {/* Mostra abreviação em mobile, nome completo em desktop */}
                <span className="md:hidden">{dia.abrev}</span>
                <span className="hidden md:inline">{dia.label}</span>
              </Label>
            </div>

            {/* Inputs de horário - só aparecem quando o dia está ativo */}
            {diasConfig[dia.value].ativo && (
              <div className="flex flex-col sm:flex-row gap-3 pl-0 sm:pl-6">
                <div className="flex-1">
                  <label
                    htmlFor={`${dia.id}-inicio`}
                    className="text-xs md:text-sm text-gray-600 mb-1 block"
                  >
                    Início
                  </label>
                  <Input
                    className="rounded-sm border-gray-400 w-full text-sm md:text-base"
                    type="time"
                    id={`${dia.id}-inicio`}
                    value={diasConfig[dia.value].horarioInicio}
                    onChange={(e) => handleHorarioChange(dia.value, 'horarioInicio', e.target.value)}
                  />
                </div>

                <div className="flex-1">
                  <label
                    htmlFor={`${dia.id}-fim`}
                    className="text-xs md:text-sm text-gray-600 mb-1 block"
                  >
                    Fim
                  </label>
                  <Input
                    className="rounded-sm border-gray-400 w-full text-sm md:text-base"
                    type="time"
                    id={`${dia.id}-fim`}
                    value={diasConfig[dia.value].horarioFim}
                    onChange={(e) => handleHorarioChange(dia.value, "horarioFim", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Input hidden para enviar os dados dos dias e horários selecionados */}
      <input
        type="hidden"
        name={name}
        value={hiddenValue}
      />
    </div>
  );
}