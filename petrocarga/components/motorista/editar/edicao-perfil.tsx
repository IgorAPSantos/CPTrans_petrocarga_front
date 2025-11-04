"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { atualizarMotorista } from "@/lib/actions/motoristaActions";
import { CheckCircle, CircleAlert, Eye, EyeOff, UserIcon } from "lucide-react";
import Form from "next/form";
import { useActionState, useState } from "react";
import FormItem from "@/components/form/form-item";
import React from "react";
import { Motorista } from "@/lib/types/motorista";
import SelecaoCustomizada from "@/components/gestor/selecaoItem/selecao-customizada";

export default function EditarMotorista({ motorista }: { motorista: Motorista }) {
    {/* Hook para gerenciar o estado da ação de atualizar veículo */}
    const [state, atualizarMotoristaAction, pending] = useActionState(atualizarMotorista, null);
    const [exibirSenha, setExibirSenha] = useState(false);

    return (
        <main className="container mx-auto px-4 py-4 md:py-8">
            <Card className="w-full max-w-5xl mx-auto">
                <CardHeader className="space-y-3 text-center pb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        Cadastro
                    </CardTitle>
                    <CardDescription className="text-base">
                        Forneça os dados para criar sua conta
                    </CardDescription>
                </CardHeader>
                <Form action={atualizarMotoristaAction}>
                    <CardContent className="p-4 md:p-6 lg:p-8">
                        {/* Mensagem de erro ou sucesso */}
                        {(state?.error || state?.message) && (
                            <div className={`flex items-start gap-3 rounded-md border p-4 mb-6 ${
                                state.error 
                                    ? "border-red-200 bg-red-50 text-red-900" 
                                    : "border-green-200 bg-green-50 text-green-900"
                            }`}>
                                {state.error ? (
                                    <CircleAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                )}
                                <span className="text-sm md:text-base">{state.message}</span>
                            </div>
                        )}

                        <CardDescription className="text-base text-center mb-6 text-blue-800 font-bold">
                            Primeiro, alguns dados pessoais
                        </CardDescription> 
                        
                        {/* Nome */}
                        <FormItem
                            name="Nome"
                            description="Insira seu nome completo."
                        >
                            <Input
                                className="rounded-sm border-gray-400 text-sm md:text-base"
                                id="nome"
                                name="nome"
                                placeholder="João Alves da Silva"
                                required
                            />
                        </FormItem>

                        {/* CPF */}
                        <FormItem
                            name="CPF"
                            description="Insira seu CPF (apenas números). Exemplo: 12345678900"
                        >
                            <Input
                                className="rounded-sm border-gray-400 text-sm md:text-base"
                                id="cpf"
                                name="cpf"
                                placeholder="12345678900"
                                maxLength={11}
                                type="text"
                                inputMode="numeric"
                                required
                                onInput={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    target.value = target.value.replace(/\D/g, '');
                                }}
                            />
                        </FormItem>

                        {/* Telefone */}
                        <FormItem
                            name="Número de Telefone"
                            description="Digite seu número de telefone com DDD (apenas números). Exemplo: 22912345678"
                        >
                            <Input
                                className="rounded-sm border-gray-400 text-sm md:text-base"
                                id="telefone"
                                name="telefone"
                                placeholder="22912345678"
                                maxLength={11}
                                type="text"
                                inputMode="numeric"
                                required
                                onInput={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    target.value = target.value.replace(/\D/g, '');
                                }}
                            />
                        </FormItem>

                        <CardDescription className="text-base text-center mb-6 text-blue-800 font-bold">
                            Agora Vamos para a CNH
                        </CardDescription>

                        {/* CNH */}
                        <FormItem
                            name="Número da CNH"
                            description="Ponha o número da CNH. Exemplo: 123456789-0"
                        >
                            <Input
                                className="rounded-sm border-gray-400 text-sm md:text-base"
                                id="numeroCnh"
                                name="numeroCnh"
                                placeholder="123456789-0"
                                required
                            />
                        </FormItem>

                        {/* Tipo da CNH */}
                        <FormItem
                            name="Categoria da CNH"
                            description="Selecione a categoria da sua CNH"
                        >
                            <SelecaoCustomizada
                                id="categoriaCnh"
                                name="categoriaCnh"
                                placeholder="Selecione a categoria"
                                options={[
                                    { value: "A", label: "Categoria A" },
                                    { value: "B", label: "Categoria B" },
                                    { value: "C", label: "Categoria C" },
                                    { value: "D", label: "Categoria D" },
                                    { value: "E", label: "Categoria E" }
                                ]}
                            />
                        </FormItem>

                        {/* Data de Vencimento da CNH */}
                        <FormItem
                            name="Data de Vencimento da CNH"
                            description="Informe a data de vencimento da sua CNH"
                        >
                            <Input
                                className="rounded-sm border-gray-400 text-sm md:text-base"
                                type="date"
                                id="dataVencimentoCnh"
                                name="dataVencimentoCnh"
                                required
                            />
                        </FormItem>

                        <CardDescription className="text-base text-center mb-6 text-blue-800 font-bold">
                            Por fim, os dados de acesso
                        </CardDescription>
                        
                        {/* Email */}
                        <FormItem
                            name="Email"
                            description="Digite seu email"
                        >
                            <Input
                                className="rounded-sm border-gray-400 text-sm md:text-base"
                                type="email"
                                id="email"
                                name="email"
                                placeholder="seu@email.com"
                                required
                            />
                        </FormItem>

                        {/* Confirmação do Email
                        <FormItem
                            name="Confirmar Email"
                            description="Redigite seu email"
                        >
                            <Input
                                className="rounded-sm border-gray-400 text-sm md:text-base"
                                type="email"
                                id="confirmacaoEmail"
                                name="confirmacaoEmail"
                                placeholder="seu@email.com"
                                required
                            />
                        </FormItem> */}
                        
                        {/* Senha */}
                        <FormItem
                            name="Senha"
                            description="Digite sua senha"
                        >
                            <div className="relative">
                                <Input
                                    type={exibirSenha ? "text" : "password"}
                                    className="rounded-sm border-gray-400 text-sm md:text-base pr-10"
                                    id="senha"
                                    name="senha"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setExibirSenha(!exibirSenha)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {exibirSenha ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </FormItem>

                        {/* Confirme sua Senha
                        <FormItem
                            name="Confirmar Senha"
                            description="Confirme sua senha"
                        >
                            <div className="relative">
                                <Input
                                    type={exibirSenha ? "text" : "password"}
                                    className="rounded-sm border-gray-400 text-sm md:text-base pr-10"
                                    id="confirmacaoSenha"
                                    name="confirmacaoSenha"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setExibirSenha(!exibirSenha)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {exibirSenha ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </FormItem> */}
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
    )
}