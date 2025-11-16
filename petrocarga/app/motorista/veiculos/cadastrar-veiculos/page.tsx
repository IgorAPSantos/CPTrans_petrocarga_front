"use client";
import React, { useState, useTransition } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle, CircleAlert, TruckIcon } from "lucide-react";
import Form from "next/form";
import FormItem from "@/components/form/form-item";
import SelecaoCustomizada from "@/components/gestor/selecaoItem/selecao-customizada";
import { addVeiculo } from "@/lib/actions/veiculoActions";
import { useAuth } from "@/components/hooks/useAuth";
import Link from "next/link";

export default function CadastroVeiculo() {
    const { user } = useAuth();
    const [message, setMessage] = useState<{ error?: boolean; text?: string }>({});
    const [isPending, startTransition] = useTransition();

    async function handleAction(formData: FormData) {
        startTransition(async () => {
        try {
            if (!user) {
            setMessage({
                error: true,
                text: "Usuário não autenticado. Faça login novamente.",
            });
            return;
            }

            formData.append("usuarioId", user.id);
            const result = await addVeiculo(formData);

            setMessage({
            error: result?.error,
            text: result?.message || "Veículo cadastrado com sucesso!",
            });
        } catch (err) {
            setMessage({
            error: true,
            text: "Erro inesperado ao cadastrar veículo.",
            });
        }
        });
    }

    return (
        <main className="container mx-auto px-4 py-4 md:py-8">
            <div className="mx-auto max-w-5xl p-6">
                <div className="mb-6">
                    <Link
                    href="/motorista/veiculos/meus-veiculos"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para os meus veículos
                    </Link>
                </div>
            </div>
            
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

            <Form action={handleAction}>
            <CardContent className="p-4 md:p-6 lg:p-8">
                {/* Mensagem de erro */}
                    {(message.text || message.error) && (
                        <div
                            className={`flex items-start gap-3 rounded-md border p-4 mb-6 ${
                            message.error
                                ? "border-red-200 bg-red-50 text-red-900"
                                : "border-green-200 bg-green-50 text-green-900"
                            }`}
                        >
                            {message.error ? (
                            <CircleAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            ) : (
                            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            )}
                            <span className="text-sm md:text-base">{message.text}</span>
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

                {/* Tipo */}
                <FormItem
                name="Tipo do Veículo"
                description="Selecione o tipo do veículo"
                >
                <SelecaoCustomizada
                    id="tipo"
                    name="tipo"
                    placeholder="Selecione o tipo"
                    options={[
                    { value: "AUTOMOVEL", label: "Carro - Até 5 metros" },
                    { value: "VUC", label: "VUC - 5 a 7 metros" },
                    { value: "CAMINHONETA", label: "Caminhoneta - Até 8 metros" },
                    { value: "CAMINHAO_MEDIO", label: "Caminhão Médio - 8 a 12 metros" },
                    { value: "CAMINHAO_LONGO", label: "Caminhão Longo - 12 a 18 metros" },
                    { value: "CARRETA", label: "Carreta - Acima de 18 metros" },
                    ]}
                />
                </FormItem>

                <CardDescription className="text-base text-center mb-6 text-blue-800 font-bold">
                Por fim, preencha apenas um dos campos com os dados do proprietário.
                </CardDescription>

                {/* CPF */}
                <FormItem
                name="CPF do Proprietário"
                description="Insira o CPF (apenas números). Exemplo: 12345678900"
                >
                <Input
                    className="rounded-sm border-gray-400 text-sm md:text-base"
                    id="cpfProprietario"
                    name="cpfProprietario"
                    placeholder="12345678900"
                    maxLength={11}
                    type="text"
                    inputMode="numeric"
                    onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/\D/g, "");
                    }}
                />
                </FormItem>

                {/* CNPJ */}
                <FormItem
                name="CNPJ do Proprietário"
                description="Insira o CNPJ (apenas números). Exemplo: 12345678000190"
                >
                <Input
                    className="rounded-sm border-gray-400 text-sm md:text-base"
                    id="cnpjProprietario"
                    name="cnpjProprietario"
                    placeholder="12345678000190"
                    maxLength={14}
                    type="text"
                    inputMode="numeric"
                    onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/\D/g, "");
                    }}
                />
                </FormItem>
            </CardContent>

            <CardFooter className="px-4 md:px-6 lg:px-8 pb-6 pt-2">
                <Button
                type="submit"
                disabled={isPending}
                className="w-full md:w-auto md:ml-auto rounded-sm px-6 md:px-10 py-2 md:py-2.5 text-sm md:text-base font-medium text-blue-800 bg-blue-200 hover:bg-blue-300 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                {isPending ? "Salvando..." : "Salvar"}
                </Button>
            </CardFooter>
            </Form>
        </Card>
        </main>
    );
}
