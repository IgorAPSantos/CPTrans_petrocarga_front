import React from 'react';

interface SelecionarOpcao {
    value: string;
    label: string;
}

interface SelecaoCustomizadaProps {
    id: string;
    name: string;
    options: SelecionarOpcao[];
    placeholder?: string;
    defaultValue?: string;
}

export default function SelecaoCustomizada({ 
    id, 
    name, 
    options, 
    placeholder,
    defaultValue 
}: SelecaoCustomizadaProps) {
    return (
        <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="flex rounded-sm border border-gray-400 text-sm md:text-base"
        >
        {placeholder && (
            <option value="" disabled>
            {placeholder}
            </option>
        )}
        {options.map((option) => (
            <option key={option.value} value={option.value} className="border bg-white text-gray-900 py-2">
            {option.label}
            </option>
        ))}
        </select>
    );
}