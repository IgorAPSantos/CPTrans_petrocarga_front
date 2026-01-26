'use client';

import FormItem from '@/components/form/form-item';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { atualizarGestor } from '@/lib/api/gestorApi';
import { Gestor } from '@/lib/types/gestor';
import { CheckCircle, CircleAlert, UserIcon } from 'lucide-react';
import Form from 'next/form';
import { useActionState, useState } from 'react';

export default function EditarGestor({ gestor }: { gestor: Gestor }) {
  // Wrapper para passar o token na action
  const atualizar = async (prevState: unknown, formData: FormData) => {
    return atualizarGestor(formData);
  };

  const [state, atualizarGestorAction, pending] = useActionState(
    atualizar,
    null,
  );

  const [exibirSenha, setExibirSenha] = useState(false);

  return (
    <main className="container mx-auto px-4 py-4 md:py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UserIcon className="w-8 h-8 text-white" />
          </div>

          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Edição de Perfil
          </CardTitle>

          <CardDescription className="text-base">
            Preencha os dados abaixo para editar seu perfil.
          </CardDescription>
        </CardHeader>

        <Form action={atualizarGestorAction}>
          {/* Campo hidden com o ID da vaga */}
          <input type="hidden" name="id" value={gestor.id} />

          <CardContent className="p-4 md:p-6 lg:p-8">
            {(state?.error || state?.message) && (
              <div
                className={`flex items-start gap-3 rounded-md border p-4 mb-6 ${
                  state.error
                    ? 'border-red-200 bg-red-50 text-red-900'
                    : 'border-green-200 bg-green-50 text-green-900'
                }`}
              >
                {state.error ? (
                  <CircleAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm md:text-base">{state.message}</span>
              </div>
            )}

            <CardDescription className="text-base text-center mb-6 text-blue-800 font-bold">
              Seus Dados
            </CardDescription>

            {/* Nome */}
            <FormItem
              name="Nome"
              description="Insira o nome completo do gestor."
            >
              <Input
                className="rounded-sm border-gray-400 text-sm md:text-base"
                id="nome"
                name="nome"
                defaultValue={gestor.nome}
                required
              />
            </FormItem>

            {/* Telefone */}
            <FormItem
              name="Telefone"
              description="Digite o telefone com DDD (apenas números). Exemplo: 21988887777"
            >
              <Input
                className="rounded-sm border-gray-400 text-sm md:text-base"
                id="telefone"
                name="telefone"
                defaultValue={gestor.telefone}
                maxLength={11}
                inputMode="numeric"
                required
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /\D/g,
                    '',
                  );
                }}
              />
            </FormItem>
          </CardContent>

          <CardFooter className="px-4 md:px-6 lg:px-8 pb-6 pt-2">
            <Button
              type="submit"
              disabled={pending}
              className="w-full md:w-auto md:ml-auto rounded-sm px-6 md:px-10 py-2 md:py-2.5 text-sm md:text-base font-medium text-blue-800 bg-blue-200 hover:bg-blue-300 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {pending ? 'Salvando...' : 'Atualizar'}
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </main>
  );
}
