"use client"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addVaga } from "@/lib/actions";
import { CircleAlert } from "lucide-react";
import Form from "next/form";
import { useActionState } from "react";
import FormItem from "@/components/form/form-item";
import React from "react";

export default function CadastroVeiculo() {
    {/* Hook para gerenciar o estado da ação de adicionar vaga */}
    const [state, addVagaAction, pending] = useActionState(addVaga, null);

    return (
        <main className="container mx-auto px-4 py-4 md:py-8">
        <Card className="w-full max-w-5xl mx-auto">
            <Form action={addVagaAction}>
            <CardContent className="p-4 md:p-6 lg:p-8">
                {/* Mensagem de erro */}
                {state?.error && (
                <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 mb-6 text-red-900">
                    <CircleAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{state.message}</span>
                </div>
                )}
                
                {/* Código */}
                <FormItem
                name="Código"
                description="Ponha o código PMP da rua. Exemplo: Md-1234"
                >
                <Input
                    className="rounded-sm border-gray-400 text-sm md:text-base"
                    id="codigo"
                    name="codigo"
                    maxLength={30}
                    placeholder="Md-1234"
                />
                </FormItem>

                {/* Nome da rua */}
                <FormItem
                name="Nome da rua"
                description="Exemplo: Rua do Imperador"
                >
                <Input
                    className="rounded-sm border-gray-400 text-sm md:text-base"
                    id="logradouro"
                    name="logradouro"
                    placeholder="Rua do Imperador"
                />
                </FormItem>

                {/* Número da Referência da Vaga */}
                <FormItem
                name="Número Referência"
                description="Números de locais por onde passa a área da vaga. Exemplo: 90 ao 130"
                >
                <Input
                    className="rounded-sm border-gray-400 text-sm md:text-base"
                    id="numeroEndereco"
                    name="numeroEndereco"
                    placeholder="90 ao 130"
                />
                </FormItem>

                {/* Bairro */}
                <FormItem
                name="Bairro"
                description="Exemplo: Centro"
                >
                <Input
                    className="rounded-sm border-gray-400 text-sm md:text-base"
                    id="bairro"
                    name="bairro"
                    placeholder="Centro"
                />
                </FormItem>

                {/* Comprimento */}
                <FormItem 
                name="Comprimento" 
                description="Comprimento em metros da vaga"
                >
                <Input
                    className="rounded-sm border-gray-400 text-sm md:text-base"
                    id="comprimento"
                    name="comprimento"
                    type="number"
                    placeholder="10"
                    step="0.1"
                    min="0"
                />
                </FormItem>

                {/* Descrição */}
                <FormItem
                name="Descrição"
                description="Coloque pontos de referência ou outras informações relevantes"
                >
                <Textarea
                    id="descricao"
                    name="descricao"
                    className="min-h-[100px] md:min-h-[120px] rounded-sm border-gray-400 text-sm md:text-base resize-none"
                    placeholder="Ex: Em frente à praça, próximo ao mercado..."
                />
                </FormItem>

                {/* Localização */}
                <FormItem
                name="Localização inicial"
                description="Latitude e Longitude do início da vaga. Exemplo: -23.55052, -46.633308"
                >
                <Input
                    className="rounded-sm border-gray-400 text-sm md:text-base"
                    id="localizacao-inicio"
                    name="localizacao-inicio"
                    placeholder="-23.55052, -46.633308"
                />
                </FormItem>

                <FormItem
                name="Localização final"
                description="Latitude e Longitude do fim da vaga. Exemplo: -23.55052, -46.633308"
                >
                <Input
                    className="rounded-sm border-gray-400 text-sm md:text-base"
                    id="localizacao-fim"
                    name="localizacao-fim"
                    placeholder="-23.55052, -46.633308"
                />
                </FormItem>
            </CardContent>

            {/* Footer com botão */}
            <CardFooter className="px-4 md:px-6 lg:px-8 pb-6 pt-2">
                <Button
                type="submit"
                disabled={pending}
                className="w-full md:w-auto md:ml-auto rounded-sm px-6 md:px-10 py-2 md:py-2.5 text-sm md:text-base font-medium"
                >
                {pending ? "Salvando..." : "Salvar"}
                </Button>
            </CardFooter>
            </Form>
        </Card>
        </main>
    );
}