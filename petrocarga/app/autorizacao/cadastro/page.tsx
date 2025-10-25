"use client"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { addMotorista } from "@/lib/actions/motoristaActions";
import { CircleAlert, Eye, EyeOff, UserIcon } from "lucide-react";
import Form from "next/form";
import { useActionState, useState } from "react";
import FormItem from "@/components/form/form-item";
import React from "react";
import SelecaoCustomizada from "@/components/gestor/selecaoItem/selecao-customizada";

export default function CadastroUsuario() {
    const [state, addMotoristaAction, pending] = useActionState(addMotorista, null);
    const [exibirSenha, setExibirSenha] = useState(false);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarEmail, setConfirmarEmail] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [errosValidacao, setErrosValidacao] = useState<string[]>([]);

    // Função para validar antes do submit
    const validarFormulario = () => {
        const novosErros: string[] = [];

        if (email !== confirmarEmail) {
            novosErros.push("Os emails não correspondem");
        }

        if (senha !== confirmarSenha) {
            novosErros.push("As senhas não correspondem");
        }

        setErrosValidacao(novosErros);
        return novosErros.length === 0;
    };

    // Handler personalizado para o submit
    const handleSubmit = (formData: FormData) => {
        if (!validarFormulario()) {
            return; // Impede o submit se houver erros
        }
        return addMotoristaAction(formData);
    };

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
                <Form action={handleSubmit}>
                    <CardContent className="p-4 md:p-6 lg:p-8">
                        {/* Mensagem de erro do servidor */}
                        {state?.error && (
                            <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 mb-6 text-red-900">
                                <CircleAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <span className="text-sm md:text-base">{state.message}</span>
                            </div>
                        )}

                        {/* Mensagens de erro de validação local */}
                        {errosValidacao.length > 0 && (
                            <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 mb-6 text-red-900">
                                <CircleAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <div className="text-sm md:text-base">
                                    {errosValidacao.map((erro, index) => (
                                        <p key={index}>{erro}</p>
                                    ))}
                                </div>
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
                                    { value: "categoriaA", label: "Categoria A" },
                                    { value: "categoriaB", label: "Categoria B" },
                                    { value: "categoriaC", label: "Categoria C" },
                                    { value: "categoriaD", label: "Categoria D" },
                                    { value: "categoriaE", label: "Categoria E" }
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </FormItem>

                        {/* Confirmação do Email */}
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
                                value={confirmarEmail}
                                onChange={(e) => setConfirmarEmail(e.target.value)}
                                required
                            />
                        </FormItem>
                        
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
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
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

                        {/* Confirme sua Senha */}
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
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
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
                    </CardContent>

                    {/* Footer com botão */}
                    <CardFooter className="px-4 md:px-6 lg:px-8 pb-6 pt-2">
                        <Button
                            type="submit"
                            disabled={pending || errosValidacao.length > 0}
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