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
import { addMotorista } from '@/lib/api/motoristaApi';
import { CircleAlert, Eye, EyeOff, UserIcon, CheckCircle } from 'lucide-react';
import Form from 'next/form';
import { useActionState } from 'react';
import React, { useState } from 'react';
import FormItem from '@/components/form/form-item';
import SelecaoCustomizada from '@/components/gestor/selecaoItem/selecao-customizada';

export default function CadastroUsuario() {
  const [state, addMotoristaAction, pending] = useActionState(
    addMotorista,
    null
  );
  const [exibirSenha, setExibirSenha] = useState(false);

  return (
    <main className="container mx-auto px-3 sm:px-4 py-4 md:py-8">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader className="space-y-3 text-center pb-4 sm:pb-6">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md sm:shadow-lg">
            <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Cadastro
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Forneça os dados para criar sua conta
          </CardDescription>
        </CardHeader>

        <Form action={addMotoristaAction}>
          <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Mensagem de erro ou sucesso */}
            {(state?.error || state?.message) && (
              <div
                className={`flex items-start gap-2 sm:gap-3 rounded-md border p-3 sm:p-4 mb-4 sm:mb-6 ${
                  state.error
                    ? 'border-red-200 bg-red-50 text-red-900'
                    : 'border-green-200 bg-green-50 text-green-900'
                }`}
              >
                {state.error ? (
                  <CircleAlert className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-xs sm:text-sm md:text-base">
                  {state.message}
                </span>
              </div>
            )}

            <div className="space-y-6 sm:space-y-8">
              {/* Seção Dados Pessoais */}
              <div className="space-y-4">
                <CardDescription className="text-sm sm:text-base text-center text-blue-800 font-bold">
                  Primeiro, alguns dados pessoais
                </CardDescription>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Nome */}
                  <div className="md:col-span-2">
                    <FormItem
                      name="Nome"
                      description="Insira seu nome completo."
                    >
                      <Input
                        className="rounded-sm border-gray-400 text-sm sm:text-base"
                        id="nome"
                        name="nome"
                        placeholder="João Alves da Silva"
                        required
                      />
                    </FormItem>
                  </div>

                  {/* CPF */}
                  <FormItem
                    name="CPF"
                    description="Insira seu CPF (apenas números). Exemplo: 12345678900"
                  >
                    <Input
                      className="rounded-sm border-gray-400 text-sm sm:text-base"
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
                      className="rounded-sm border-gray-400 text-sm sm:text-base"
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
                </div>
              </div>

              {/* Seção CNH */}
              <div className="space-y-4">
                <CardDescription className="text-sm sm:text-base text-center text-blue-800 font-bold">
                  Agora Vamos para a CNH
                </CardDescription>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* CNH */}
                  <div className="md:col-span-2">
                    <FormItem
                      name="Número da CNH"
                      description="Ponha o número da CNH. Exemplo: 123456789-0"
                    >
                      <Input
                        className="rounded-sm border-gray-400 text-sm sm:text-base"
                        id="numeroCnh"
                        name="numeroCnh"
                        placeholder="123456789-0"
                        required
                      />
                    </FormItem>
                  </div>

                  {/* Tipo da CNH */}
                  <FormItem
                    name="Categoria da CNH"
                    description="Selecione a categoria da sua CNH"
                  >
                    <SelecaoCustomizada
                      id="tipoCnh"
                      name="tipoCnh"
                      placeholder="Selecione a categoria"
                      options={[
                        { value: 'B', label: 'Categoria B' },
                        { value: 'AB', label: 'Categoria AB' },
                        { value: 'C', label: 'Categoria C' },
                        { value: 'AC', label: 'Categoria AC' },
                        { value: 'D', label: 'Categoria D' },
                        { value: 'AD', label: 'Categoria AD' },
                        { value: 'E', label: 'Categoria E' },
                        { value: 'AE', label: 'Categoria AE' },
                      ]}
                    />
                  </FormItem>

                  {/* Data de Vencimento da CNH */}
                  <FormItem
                    name="Data de Vencimento da CNH"
                    description="Informe a data de vencimento da sua CNH"
                  >
                    <Input
                      className="rounded-sm border-gray-400 text-sm sm:text-base"
                      type="date"
                      id="dataValidadeCnh"
                      name="dataValidadeCnh"
                      required
                    />
                  </FormItem>
                </div>
              </div>

              {/* Seção Dados de Acesso */}
              <div className="space-y-4">
                <CardDescription className="text-sm sm:text-base text-center text-blue-800 font-bold">
                  Por fim, os dados de acesso
                </CardDescription>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Email */}
                  <div className="md:col-span-2">
                    <FormItem name="Email" description="Digite seu email">
                      <Input
                        className="rounded-sm border-gray-400 text-sm sm:text-base"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="seu@email.com"
                        required
                      />
                    </FormItem>
                  </div>

                  {/* Senha */}
                  <div className="md:col-span-2">
                    <FormItem name="Senha" description="Digite sua senha">
                      <div className="relative">
                        <Input
                          type={exibirSenha ? 'text' : 'password'}
                          className="rounded-sm border-gray-400 text-sm sm:text-base pr-10"
                          id="senha"
                          name="senha"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setExibirSenha(!exibirSenha)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={
                            exibirSenha ? 'Ocultar senha' : 'Mostrar senha'
                          }
                        >
                          {exibirSenha ? (
                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Footer com botão */}
          <CardFooter className="px-3 sm:px-4 md:px-6 lg:px-8 pb-4 sm:pb-6 pt-0">
            <Button
              type="submit"
              disabled={pending}
              className="w-full rounded-sm px-4 sm:px-6 md:px-10 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-blue-800 bg-blue-200 hover:bg-blue-300 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {pending ? 'Salvando...' : 'Salvar'}
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </main>
  );
}
