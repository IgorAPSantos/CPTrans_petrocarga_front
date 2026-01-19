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
import { useActionState, useState, useEffect } from 'react';
import {
  CircleAlert,
  UserIcon,
  CheckCircle,
  EyeOff,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import FormItem from '@/components/form/form-item';
import { addAgente } from '@/lib/api/agenteApi';
import Link from 'next/link';

export default function CadastroAgentes() {
  const [state, action, pending] = useActionState(addAgente, null);
  const [exibirSenha, setExibirSenha] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmarEmail, setConfirmarEmail] = useState('');
  const [emailsIguais, setEmailsIguais] = useState(true);
  const [emailValido, setEmailValido] = useState(true);

  // Validação dos emails
  useEffect(() => {
    if (confirmarEmail === '') {
      setEmailsIguais(true);
    } else {
      setEmailsIguais(email === confirmarEmail);
    }
  }, [email, confirmarEmail]);

  // Validação do formato do email
  useEffect(() => {
    if (email === '') {
      setEmailValido(true);
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValido(emailRegex.test(email));
    }
  }, [email]);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (formData: FormData) => {
    if (!emailsIguais) {
      return; // Impede o envio se os emails não forem iguais
    }

    if (!emailValido) {
      return; // Impede o envio se o email não for válido
    }

    // Chama a action original
    return await action(formData);
  };

  return (
    <main className="container mx-auto px-4 py-4 md:py-8">
      <div className="mb-6">
        <Link
          href="/gestor/agentes"
          className="text-muted-foreground hover:text-foreground inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para todos os agentes
        </Link>
      </div>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UserIcon className="w-8 h-8 text-white" />
          </div>

          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Cadastrar Agente
          </CardTitle>

          <CardDescription className="text-base">
            Preencha os dados abaixo para adicionar um agente ao sistema.
          </CardDescription>
        </CardHeader>

        <Form action={handleSubmit}>
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

            {/* Mensagem de erro para emails diferentes */}
            {!emailsIguais && (
              <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 text-red-900 p-4 mb-6">
                <CircleAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">
                  Os emails não coincidem. Por favor, verifique.
                </span>
              </div>
            )}

            {/* Mensagem de erro para email inválido */}
            {!emailValido && email !== '' && (
              <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 text-red-900 p-4 mb-6">
                <CircleAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">
                  O formato do email é inválido. Use um email válido como
                  "exemplo@dominio.com".
                </span>
              </div>
            )}

            <CardDescription className="text-base text-center mb-6 text-blue-800 font-bold">
              Dados do agente
            </CardDescription>

            {/* Nome */}
            <FormItem
              name="Nome"
              description="Insira o nome completo do agente."
            >
              <Input
                className="rounded-sm border-gray-400 text-sm md:text-base"
                id="nome"
                name="nome"
                placeholder="Ex.: Eduardo Dantas"
                required
              />
            </FormItem>

            {/* Email */}
            <FormItem name="Email" description="Digite o email do agente.">
              <Input
                className={`rounded-sm border-gray-400 text-sm md:text-base ${
                  !emailValido && email !== ''
                    ? 'border-red-500 focus:ring-red-500'
                    : ''
                }`}
                type="email"
                id="email"
                name="email"
                placeholder="agente@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!emailValido && email !== '' && (
                <p className="text-red-500 text-xs mt-1">
                  Digite um email válido
                </p>
              )}
            </FormItem>

            {/* Confirmar Email */}
            <FormItem
              name="Confirmar Email"
              description="Digite novamente o email para confirmação."
            >
              <Input
                className={`rounded-sm border-gray-400 text-sm md:text-base ${
                  !emailsIguais && confirmarEmail !== ''
                    ? 'border-red-500 focus:ring-red-500'
                    : ''
                }`}
                type="email"
                id="confirmarEmail"
                name="confirmarEmail"
                placeholder="agente@email.com"
                required
                value={confirmarEmail}
                onChange={(e) => setConfirmarEmail(e.target.value)}
              />
              {!emailsIguais && confirmarEmail !== '' && (
                <p className="text-red-500 text-xs mt-1">
                  Os emails não coincidem
                </p>
              )}
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

            {/* Matricula */}
            <FormItem
              name="Matricula"
              description="Insira a matricula completo do agente."
            >
              <Input
                className="rounded-sm border-gray-400 text-sm md:text-base"
                id="matricula"
                name="matricula"
                placeholder="Ex.: MSD20231"
                required
              />
            </FormItem>
          </CardContent>

          <CardFooter className="px-4 md:px-6 lg:px-8 pb-6 pt-2">
            <Button
              type="submit"
              disabled={pending || !emailsIguais || !emailValido}
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
