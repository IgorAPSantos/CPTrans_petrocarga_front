"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { atualizarVaga } from "@/lib/actions/vagaActions";
import { CircleAlert } from "lucide-react";
import FormItem from "@/components/form/form-item";
import DiaSemana from "@/components/gestor/dia-semana/dia-semana";
import SelecaoCustomizada from "@/components/gestor/selecaoItem/selecao-customizada";
import { Vaga } from "@/lib/types/vaga";
import { useAuth } from "@/context/AuthContext";

interface EditarVagaProps {
  vaga: Vaga;
}

export default function EditarVaga({ vaga }: EditarVagaProps) {
  const { token } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!vaga) return null; // protege caso vaga seja null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setError("Você precisa estar logado.");
      return;
    }

    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await atualizarVaga(formData, token);
      if (result?.error) {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao atualizar a vaga");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-4 md:py-8">
      <Card className="w-full max-w-5xl mx-auto">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={vaga.id} />

          <CardContent className="p-4 md:p-6 lg:p-8">
            {error && (
              <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 mb-6 text-red-900">
                <CircleAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">{error}</span>
              </div>
            )}

            <FormItem name="Código" description="Ponha o código PMP da rua">
              <Input
                id="codigo"
                name="codigo"
                maxLength={30}
                defaultValue={vaga.endereco.codigoPMP}
              />
            </FormItem>

            <FormItem name="Nome da rua">
              <Input
                id="logradouro"
                name="logradouro"
                defaultValue={vaga.endereco.logradouro}
              />
            </FormItem>

            <FormItem name="Número Referência">
              <Input
                id="numeroEndereco"
                name="numeroEndereco"
                defaultValue={vaga.numeroEndereco}
              />
            </FormItem>

            <FormItem name="Status">
              <SelecaoCustomizada
                id="status"
                name="status"
                defaultValue={vaga.status.toLowerCase()}
                options={[
                  { value: "disponivel", label: "Disponível" },
                  { value: "indisponivel", label: "Indisponível" },
                ]}
              />
            </FormItem>

            <FormItem name="Área">
              <SelecaoCustomizada
                id="area"
                name="area"
                defaultValue={vaga.area.toLowerCase()}
                options={[
                  { value: "vermelha", label: "Vermelha" },
                  { value: "amarela", label: "Amarela" },
                  { value: "azul", label: "Azul" },
                  { value: "branca", label: "Branca" },
                ]}
              />
            </FormItem>

            <FormItem name="Tipo">
              <SelecaoCustomizada
                id="tipo"
                name="tipo"
                defaultValue={vaga.tipoVaga.toLowerCase()}
                options={[
                  { value: "paralela", label: "Paralela" },
                  { value: "perpendicular", label: "Perpendicular" },
                ]}
              />
            </FormItem>

            <FormItem name="Bairro">
              <Input
                id="bairro"
                name="bairro"
                defaultValue={vaga.endereco.bairro}
              />
            </FormItem>

            <FormItem name="Comprimento">
              <Input
                id="comprimento"
                name="comprimento"
                type="number"
                step="0.1"
                min="0"
                defaultValue={vaga.comprimento}
              />
            </FormItem>

            <FormItem name="Descrição">
              <Textarea
                id="descricao"
                name="descricao"
                defaultValue={vaga.referenciaEndereco}
              />
            </FormItem>

            <FormItem name="Localização inicial">
              <Input
                id="localizacao-inicio"
                name="localizacao-inicio"
                defaultValue={vaga.referenciaGeoInicio}
              />
            </FormItem>

            <FormItem name="Localização final">
              <Input
                id="localizacao-fim"
                name="localizacao-fim"
                defaultValue={vaga.referenciaGeoFim}
              />
            </FormItem>

            <FormItem name="Dias da semana">
              <DiaSemana name="diaSemana" operacoesVaga={vaga.operacoesVaga} />
            </FormItem>
          </CardContent>

          <CardFooter className="px-4 md:px-6 lg:px-8 pb-6 pt-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Atualizando..." : "Atualizar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
