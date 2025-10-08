"use client"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addVaga } from "@/lib/actions";
import { CircleAlert } from "lucide-react";
import Form from "next/form";
import { useActionState } from "react";
import FormItem from "./form-item";
import React from "react";
import DiaSemana from "./dia-semana";

export default function Cadastro() {
  const [state, addVagaAction, pending] = useActionState(addVaga, null);

  return (
    <main>
      <Card className="mx-auto w-full py-8">
        <Form action={addVagaAction}>
          <CardContent className="space-y-6">
            {state?.error && (
              <div className="flex items-center gap-4 rounded-md border border-red-200 bg-red-100 p-4 py-6 text-red-900">
                <CircleAlert className="inline-block h-6 w-6" />
                <span>{state.message}</span>
              </div>
            )}
            
            <FormItem
              name="Código"
              description="Ponha o código PMP da rua. Exemplo: Md-1234"
            >
              <Input
                className="rounded-xs border-gray-500"
                id="codigo"
                name="codigo"
                maxLength={30}
              />
            </FormItem>

            <FormItem
              name="Nome da rua"
              description="Exemplo: Rua do Imperador"
            >
              <Input
                className="rounded-xs border-gray-500"
                id="logradouro"
                name="logradouro"
              />
            </FormItem>

            <FormItem
              name="Localização"
              description="Latitude e Longitude. Exemplo: -23.55052, -46.633308"
            >
              <Input
                className="rounded-xs border-gray-500"
                id="localizacao"
                name="localizacao"
              />
            </FormItem>

            <FormItem
              name="Bairro"
              description="Exemplo: Centro"
            >
              <Input
                className="rounded-xs border-gray-500"
                id="bairro"
                name="bairro"
              />
            </FormItem>

            <FormItem
              name="Período"
              description="Período de funcionamento da vaga"
            >
              <div className="flex sm:gap-20">
                <div className="flex-1">
                  <label htmlFor="horarioInicio" className="rounded-xs border-gray-500 mb-1 block">
                    Início
                  </label>
                  <Input 
                    className="rounded-xs border-gray-500 w-full" 
                    type="time"
                    id="horarioInicio"
                    name="horarioInicio" 
                  />
                </div>
                
                <div className="flex-1">
                  <label htmlFor="horarioFim" className="rounded-xs border-gray-500 mb-1 block">
                    Fim
                  </label>
                  <Input 
                    className="rounded-xs border-gray-500 w-full" 
                    type="time"
                    id="horarioFim"
                    name="horarioFim"
                  />
                </div>
              </div>
            </FormItem>

            <FormItem
              name="Dias da semana" 
              description="Selecione os dias em que a vaga estará disponível"
            > 
              <DiaSemana name="diaSemana" />
            </FormItem>

            <FormItem 
              name="Comprimento" 
              description="Comprimento em metros da vaga"
            >
              <Input
                className="rounded-xs border-gray-500"
                id="comprimento"
                name="comprimento"
                type="number"
              />
            </FormItem>

            <FormItem
              name="Descrição"
              description="Coloque pontos de referência ou outras informações relevantes"
            >
              <Textarea
                id="descricao"
                name="descricao"
                className="min-h-[100px] md:min-h-[120px] rounded-xs border-gray-500"
              />
            </FormItem>
          </CardContent>

          <CardFooter className="px-4 md:px-6">
            <Button
              type="submit"
              disabled={pending}
              className="w-full sm:w-auto sm:ml-auto cursor-pointer rounded-none px-8 md:px-10"
            >
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </main>
  );
}