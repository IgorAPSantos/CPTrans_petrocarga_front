'use client';
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
import Form from 'next/form';
import { useActionState } from 'react';
import { CircleAlert, UserIcon, CheckCircle, ArrowLeft } from 'lucide-react';
import FormItem from '@/components/form/form-item';
import { addGestor } from '@/lib/actions/gestorActions';
import Link from 'next/link';

export default function CadastroGestores() {
  const [state, action, pending] = useActionState(addGestor, null);

  return (
    <main className="container mx-auto px-4 py-4 md:py-8">
      <div className="mb-6">
        <Link
          href="/gestor/gestores"
          className="text-muted-foreground hover:text-foreground inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para todos os gestores
        </Link>
      </div>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UserIcon className="w-8 h-8 text-white" />
          </div>

          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Cadastrar Gestor
          </CardTitle>

          <CardDescription className="text-base">
            Preencha os dados abaixo para adicionar um gestor ao sistema.
          </CardDescription>
        </CardHeader>

        <Form action={action}>
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
              Dados do Gestor
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
                placeholder="Ex.: Maria Souza"
                required
              />
            </FormItem>

            {/* Email */}
            <FormItem name="Email" description="Digite o email do gestor.">
              <Input
                className="rounded-sm border-gray-400 text-sm md:text-base"
                type="email"
                id="email"
                name="email"
                placeholder="gestor@email.com"
                required
              />
            </FormItem>

            {/* CPF */}
            <FormItem
              name="CPF"
              description="Apenas números. Exemplo: 12345678900"
            >
              <Input
                className="rounded-sm border-gray-400 text-sm md:text-base"
                id="cpf"
                name="cpf"
                placeholder="00000000000"
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

            {/* Telefone */}
            <FormItem
              name="Telefone"
              description="Digite o telefone com DDD (apenas números). Exemplo: 21988887777"
            >
              <Input
                className="rounded-sm border-gray-400 text-sm md:text-base"
                id="telefone"
                name="telefone"
                placeholder="21999998888"
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
              {pending ? 'Salvando...' : 'Cadastrar'}
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </main>
  );
}
