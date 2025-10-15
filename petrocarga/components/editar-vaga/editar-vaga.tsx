"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { atualizarVaga } from "@/lib/actions";
import { CircleAlert } from "lucide-react";
import Form from "next/form";
import { useActionState } from "react";
import FormItem from "@/app/registrar-vagas/form-item";
import React from "react";
import DiaSemana from "@/app/registrar-vagas/dia-semana";
import SelecaoCustomizada from "@/app/registrar-vagas/selecao-customizada";
import { Vaga } from "@/lib/types";

export default function EditarVaga({ vaga }: { vaga: Vaga }) {
  const [state, atualizarVagaAction, pending] = useActionState(
    atualizarVaga,
    null
  );

  return (
    <main className="container mx-auto px-4 py-4 md:py-8">
      <Card className="w-full max-w-5xl mx-auto">
        <Form action={atualizarVagaAction}>
          <input type="hidden" name="id" value={vaga.id} />

          <CardContent className="p-4 md:p-6 lg:p-8">
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
                defaultValue={vaga.endereco.codidoPmp}
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
                defaultValue={vaga.endereco.logradouro}
              />
            </FormItem>

            {/* Número da Vaga */}
            <FormItem name="Número da Vaga" description="Exemplo: Vaga 03">
              <Input
                className="rounded-sm border-gray-400 text-sm md:text-base"
                id="numeroEndereco"
                name="numeroEndereco"
                placeholder="Vaga 03"
                defaultValue={vaga.numeroEndereco}
              />
            </FormItem>

            {/* Área */}
            <FormItem name="Área" description="Selecione a cor da área da vaga">
              <SelecaoCustomizada
                id="area"
                name="area"
                placeholder="Selecione a área"
                defaultValue={vaga.area}
                options={[
                  { value: "vermelha", label: "Vermelha" },
                  { value: "amarela", label: "Amarela" },
                  { value: "azul", label: "Azul" },
                  { value: "branca", label: "Branca" },
                ]}
              />
            </FormItem>

            {/* Tipo da Vaga */}
            <FormItem name="Tipo" description="Perpendicular ou Paralela à rua">
              <SelecaoCustomizada
                id="tipo"
                name="tipo"
                placeholder="Selecione o tipo"
                defaultValue={vaga.tipoVaga}
                options={[
                  { value: "paralela", label: "Paralela" },
                  { value: "perpendicular", label: "Perpendicular" },
                ]}
              />
            </FormItem>

            {/* Bairro */}
            <FormItem name="Bairro" description="Exemplo: Centro">
              <Input
                className="rounded-sm border-gray-400 text-sm md:text-base"
                id="bairro"
                name="bairro"
                placeholder="Centro"
                defaultValue={vaga.endereco.bairro}
              />
            </FormItem>

            {/* Outros campos... */}
            {/* Dias da semana */}
            <FormItem
              name="Dias da semana"
              description="Selecione os dias em que a vaga estará disponível e defina os horários"
            >
              <DiaSemana name="diaSemana" />
            </FormItem>
          </CardContent>

          <CardFooter className="px-4 md:px-6 lg:px-8 pb-6 pt-2">
            <Button
              type="submit"
              disabled={pending}
              className="w-full md:w-auto md:ml-auto rounded-sm px-6 md:px-10 py-2 md:py-2.5 text-sm md:text-base font-medium"
            >
              {pending ? "Atualizando..." : "Atualizar"}
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </main>
  );
}
