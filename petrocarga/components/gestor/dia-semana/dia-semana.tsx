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
  const { token, loading } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <p>Carregando...</p>;
  if (!token) return <p>Você precisa estar logado para editar a vaga.</p>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

            <FormItem
              name="Código"
              description="Ponha o código PMP da rua. Exemplo: Md-1234"
            >
              <Input
                id="codigo"
                name="codigo"
                maxLength={30}
                placeholder="Md-1234"
                defaultValue={vaga.endereco.codigoPMP}
              />
            </FormItem>

            <FormItem
              name="Nome da rua"
              description="Exemplo: Rua do Imperador"
            >
              <Input
                id="logradouro"
                name="logradouro"
                placeholder="Rua do Imperador"
                defaultValue={vaga.endereco.logradouro}
              />
            </FormItem>

            <FormItem name="Número Referência" description="Exemplo: 90 ao 130">
              <Input
                id="numeroEndereco"
                name="numeroEndereco"
                placeholder="Vaga 03"
                defaultValue={vaga.numeroEndereco}
              />
            </FormItem>

            <FormItem name="Status" description="Disponível ou Indisponível">
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

            <FormItem name="Área" description="Selecione a cor da área da vaga">
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

            <FormItem name="Tipo" description="Perpendicular ou Paralela à rua">
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

            <FormItem name="Bairro" description="Exemplo: Centro">
              <Input
                id="bairro"
                name="bairro"
                placeholder="Centro"
                defaultValue={vaga.endereco.bairro}
              />
            </FormItem>

            <FormItem
              name="Comprimento"
              description="Comprimento em metros da vaga"
            >
              <Input
                id="comprimento"
                name="comprimento"
                type="number"
                placeholder="10"
                step="0.1"
                min="0"
                defaultValue={vaga.comprimento}
              />
            </FormItem>

            <FormItem
              name="Descrição"
              description="Coloque pontos de referência"
            >
              <Textarea
                id="descricao"
                name="descricao"
                placeholder="Ex: Em frente à praça, próximo ao mercado..."
                defaultValue={vaga.referenciaEndereco}
              />
            </FormItem>

            <FormItem
              name="Localização inicial"
              description="Latitude e Longitude do início da vaga"
            >
              <Input
                id="localizacao-inicio"
                name="localizacao-inicio"
                placeholder="-23.55052, -46.633308"
                defaultValue={vaga.referenciaGeoInicio}
              />
            </FormItem>

            <FormItem
              name="Localização final"
              description="Latitude e Longitude do fim da vaga"
            >
              <Input
                id="localizacao-fim"
                name="localizacao-fim"
                placeholder="-23.55052, -46.633308"
                defaultValue={vaga.referenciaGeoFim}
              />
            </FormItem>

            <FormItem
              name="Dias da semana"
              description="Selecione os dias e horários"
            >
              <DiaSemana name="diaSemana" operacoesVaga={vaga.operacoesVaga} />
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
        </form>
      </Card>
    </main>
  );
}
