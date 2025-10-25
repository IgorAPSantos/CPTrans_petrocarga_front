"use client"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CircleAlert, TruckIcon } from "lucide-react";
import Form from "next/form";
import { useActionState } from "react";
import FormItem from "@/components/form/form-item";
import React from "react";
import { addVeiculo } from "@/lib/actions/veiculoActions";
import SelecaoCustomizada from "@/components/gestor/selecaoItem/selecao-customizada";

export default function CadastroVeiculo() {
    {/* Hook para gerenciar o estado da ação de adicionar vaga */}
    const [state, addVeiculoAction, pending] = useActionState(addVeiculo, null);

    return (
        <main className="container mx-auto px-4 py-4 md:py-8">
        <Card className="w-full max-w-5xl mx-auto">
            <CardHeader className="space-y-3 text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <TruckIcon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Cadastro de Veículo
                </CardTitle>
                <CardDescription className="text-base">
                    Forneça os dados para adicionar um novo veículo.
                </CardDescription>
            </CardHeader>
            <Form action={addVeiculoAction}>
            <CardContent className="p-4 md:p-6 lg:p-8">
                {/* Mensagem de erro */}
                {state?.error && (
                <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 mb-6 text-red-900">
                    <CircleAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{state.message}</span>
                </div>
                )}

                <CardDescription className="text-base text-center mb-6 text-blue-800 font-bold">
                    Primeiro, alguns dados do veículo
                </CardDescription> 
                
                {/* Placa */}
                <FormItem
                name="Placa do Veículo"
                description="Digite a placa do veículo no formato ABC1D23. Exemplo: KLD2J19"
                >
                <Input
                    className="rounded-sm border-gray-400 text-sm md:text-base"
                    id="placa"
                    name="placa"
                    placeholder="KLD2J19"
                    required
                />
                </FormItem>

                {/* Marca */}
                <FormItem
                name="Marca do Veículo"
                description="Insira a marca do veículo. Exemplo: Ford, Volkswagen, Chevrolet"
                >
                <Input
                    className="rounded-sm border-gray-400 text-sm md:text-base"
                    id="marca"
                    name="marca"
                    placeholder="Ford"
                    required
                />
                </FormItem>

                {/* Modelo */}
                <FormItem
                name="Modelo do Veículo"
                description="Ponha o modelo do veículo. Exemplo: Fiesta, Gol, Onix"
                >
                <Input
                    className="rounded-sm border-gray-400 text-sm md:text-base"
                    id="modelo"
                    name="modelo"
                    placeholder="Fiesta"
                    required
                />
                </FormItem>

                {/* Tipo do Veículo */}
                <FormItem
                name="Tipo do Veículo"
                description="Selecione o tipo do veículo"
                >
                    <SelecaoCustomizada
                        id="tipo"
                        name="tipo"
                        placeholder="Selecione o tipo"
                        options={[
                            { value: "carro", label: "Carro - Até 5 metros" },
                            { value: "vuc", label: "VUC - 5 a 7 metros" },
                            { value: "caminhoneta", label: "Caminhoneta - Até 8 metros" },
                            { value: "caminhaoMedio", label: "Caminhão Médio - 8 a 12 metros" },
                            { value: "caminhaoLongo", label: "Caminhão Longo - 12 a 18 metros" },
                            { value: "carreta", label: "Carreta - Acima de 18 metros" },
                            ]}
                        />
                </FormItem>

                <CardDescription className="text-base text-center mb-6 text-blue-800 font-bold">
                    Por fim, os dados do proprietário do veículo.
                </CardDescription>
                
                {/* CPF do Proprietário */}
                <FormItem
                    name="CPF do Proprietário"
                    description="Insira o CPF (apenas números). Exemplo: 12345678900"
                >
                    <Input
                        className="rounded-sm border-gray-400 text-sm md:text-base"
                        id="cpf"
                        name="cpf"
                        placeholder="12345678900"
                        maxLength={11}
                        type="text"
                        inputMode="numeric"
                        onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            target.value = target.value.replace(/\D/g, ''); // Remove tudo que não é número
                        }}
                    />
                </FormItem>

                {/* Divisor */}
                <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500">ou</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
                
                {/* CNPJ do Proprietário */}
                <FormItem
                    name="CNPJ do Proprietário"
                    description="Insira o CNPJ (apenas números). Exemplo: 12345678000190"
                >
                    <Input
                        className="rounded-sm border-gray-400 text-sm md:text-base"
                        id="cpf"
                        name="cpf"
                        placeholder="12345678000190"
                        maxLength={14}
                        type="text"
                        inputMode="numeric"
                        onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            target.value = target.value.replace(/\D/g, ''); // Remove tudo que não é número
                        }}
                    />
                </FormItem>
            </CardContent>

            {/* Footer com botão */}
            <CardFooter className="px-4 md:px-6 lg:px-8 pb-6 pt-2">
                <Button
                type="submit"
                disabled={pending}
                className="w-full md:w-auto md:ml-auto rounded-sm px-6 md:px-10 py-2 md:py-2.5 text-sm md:text-base font-medium text-blue-800 bg-blue-200 hover:bg-blue-300 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                {pending ? "Salvando..." : "Salvar"}
                </Button>
            </CardFooter>
            </Form>
        </Card>
        </main>
    );
}