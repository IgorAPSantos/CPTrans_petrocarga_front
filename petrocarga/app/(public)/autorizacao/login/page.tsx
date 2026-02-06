'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Key,
  CheckCircle,
  RefreshCw,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/hooks/useAuth';
import {
  ativarConta,
  reenviarEmailRecuperacao,
} from '@/lib/api/recuperacaoApi';

function identificarTipoLogin(
  input: string,
): 'email' | 'cpf' | 'invalido' | 'indeterminado' {
  if (!input.trim()) return 'indeterminado';

  const apenasNumeros = input.replace(/\D/g, '');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(input)) {
    return 'email';
  } else if (/^\d+$/.test(input) && apenasNumeros.length === 11) {
    return 'cpf';
  } else if (
    /^\d+$/.test(input) &&
    apenasNumeros.length > 0 &&
    apenasNumeros.length < 11
  ) {
    return 'cpf';
  }

  return 'invalido';
}

export default function LoginPage() {
  const [loginInput, setLoginInput] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalIdentificador, setModalIdentificador] = useState('');
  const [codigo, setCodigo] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [solicitandoNovoCodigo, setSolicitandoNovoCodigo] = useState(false);
  const [tipoInput, setTipoInput] = useState<
    'email' | 'cpf' | 'invalido' | 'indeterminado'
  >('indeterminado');

  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Detecta parâmetro na URL e abre modal
  useEffect(() => {
    const ativarContaParam = searchParams.get('ativar-conta');

    if (ativarContaParam === 'true') {
      const emailSalvo = sessionStorage.getItem('emailCadastro');
      if (emailSalvo) {
        setLoginInput(emailSalvo);
        setModalIdentificador(emailSalvo);
        sessionStorage.removeItem('emailCadastro');
      }

      setMostrarModal(true);
      // NÃO limpa URL aqui - mantém parâmetro visível
    }
  }, [searchParams]);

  useEffect(() => {
    const tipo = identificarTipoLogin(loginInput);
    setTipoInput(tipo);
  }, [loginInput]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      switch (user.permissao) {
        case 'ADMIN':
        case 'GESTOR':
          router.replace('/gestor/visualizar-vagas');
          break;
        case 'MOTORISTA':
          router.replace('/motorista/reservar-vaga');
          break;
        case 'AGENTE':
          router.replace('/agente/reserva-rapida');
          break;
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  async function handleLogin() {
    setLoading(true);
    setError('');

    try {
      const decodedUser = await login({
        login: loginInput,
        senha,
      });

      switch (decodedUser.permissao) {
        case 'ADMIN':
        case 'GESTOR':
          window.location.href = '/gestor/visualizar-vagas';
          break;
        case 'MOTORISTA':
          window.location.href = '/motorista/reservar-vaga';
          break;
        case 'AGENTE':
          window.location.href = '/agente/reserva-rapida';
          break;
        default:
          setError('Permissão desconhecida');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const handleAtivarConta = async () => {
    setModalError('');
    setModalSuccess('');

    if (!modalIdentificador.trim()) {
      setModalError('Por favor, insira seu email ou CPF');
      return;
    }

    if (!codigo.trim()) {
      setModalError('Por favor, insira o código de ativação');
      return;
    }

    setModalLoading(true);

    try {
      const isEmail = modalIdentificador.includes('@');
      let identificadorEnviar = modalIdentificador.trim();

      if (!isEmail) {
        identificadorEnviar = modalIdentificador.replace(/\D/g, '');
        if (identificadorEnviar.length !== 11) {
          throw new Error('CPF deve conter 11 dígitos');
        }
      }

      await ativarConta(identificadorEnviar, codigo.trim());

      setModalSuccess(
        'Conta ativada com sucesso! Agora você pode fazer login.',
      );

      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err: any) {
      setModalError(
        err.message ||
          'Código inválido ou expirado. Verifique e tente novamente.',
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleSolicitarNovoCodigo = async () => {
    if (!modalIdentificador.trim()) {
      setModalError('Por favor, insira seu email ou CPF primeiro');
      return;
    }

    setSolicitandoNovoCodigo(true);
    setModalError('');
    setModalSuccess('');

    try {
      const isEmail = modalIdentificador.includes('@');
      let identificadorEnviar = modalIdentificador.trim();

      if (!isEmail) {
        identificadorEnviar = modalIdentificador.replace(/\D/g, '');
        if (identificadorEnviar.length !== 11) {
          throw new Error('CPF deve conter 11 dígitos');
        }
      }

      const resultado = await reenviarEmailRecuperacao(identificadorEnviar);

      if (resultado.valido === true) {
        setModalSuccess(
          resultado.message || 'Novo código enviado para seu email!',
        );
      } else if (resultado.valido === false) {
        setModalError(resultado.message || 'Erro ao solicitar novo código');
      } else {
        setModalSuccess('Código reenviado com sucesso!');
      }
    } catch (err: any) {
      setModalError(
        err.message || 'Erro ao solicitar novo código. Tente novamente.',
      );
    } finally {
      setSolicitandoNovoCodigo(false);
    }
  };

  const handleOpenModal = () => {
    setModalIdentificador(loginInput);
    setCodigo('');
    setModalError('');
    setModalSuccess('');
    setMostrarModal(true);

    // Adiciona parâmetro na URL ao abrir modal manualmente
    const params = new URLSearchParams(searchParams.toString());
    params.set('ativar-conta', 'true');
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  const handleCloseModal = () => {
    setMostrarModal(false);
    setModalIdentificador('');
    setCodigo('');
    setModalSuccess('');
    setModalError('');

    // Remove parâmetro da URL ao fechar modal
    const params = new URLSearchParams(searchParams.toString());
    params.delete('ativar-conta');

    // Se não há outros parâmetros, remove a ? inteira
    if (params.toString() === '') {
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      window.history.replaceState({}, '', `?${params.toString()}`);
    }
  };

  const getInputIcon = () => {
    if (tipoInput === 'email') {
      return (
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      );
    } else if (tipoInput === 'cpf') {
      return (
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      );
    } else {
      return (
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      );
    }
  };

  const getFormatHint = () => {
    if (tipoInput === 'email') {
      return (
        <span className="text-xs text-green-600 mt-1 flex items-center gap-1">
          ✓ Formato de email válido
        </span>
      );
    } else if (tipoInput === 'cpf') {
      const apenasNumeros = loginInput.replace(/\D/g, '');
      if (apenasNumeros.length === 11) {
        return (
          <span className="text-xs text-green-600 mt-1 flex items-center gap-1">
            ✓ CPF válido (11 dígitos)
          </span>
        );
      } else {
        return (
          <span className="text-xs text-amber-600 mt-1">
            ⚠ CPF: {apenasNumeros.length}/11 dígitos
          </span>
        );
      }
    } else if (loginInput && tipoInput === 'invalido') {
      return (
        <span className="text-xs text-red-600 mt-1">
          ✗ Formato inválido. Use email ou CPF (apenas números)
        </span>
      );
    } else {
      return (
        <span className="text-xs text-gray-500 mt-1">
          Digite seu email ou CPF (11 dígitos)
        </span>
      );
    }
  };

  const handleInputChange = (value: string) => {
    if (tipoInput === 'cpf' || /^\d+$/.test(value)) {
      const apenasNumeros = value.replace(/\D/g, '');
      if (apenasNumeros.length <= 11) {
        setLoginInput(apenasNumeros);
      }
    } else {
      setLoginInput(value.toLowerCase());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-more-delayed"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl backdrop-blur-sm bg-white/90 border-0">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Bem-vindo
          </CardTitle>
          <CardDescription className="text-base">
            Entre com email ou CPF para acessar o sistema
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email ou CPF
              </label>
              <div className="relative">
                {getInputIcon()}
                <Input
                  type="text"
                  value={loginInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="seu@email.com ou 12345678900"
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                  disabled={loading}
                  inputMode={tipoInput === 'cpf' ? 'numeric' : 'text'}
                />
              </div>
              {getFormatHint()}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleOpenModal}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline flex items-center gap-1"
              >
                <Key className="w-4 h-4" />
                Ativar Conta
              </button>

              <div className="flex-1 text-center mx-4">
                <div className="h-px bg-gray-300"></div>
              </div>

              <Link
                href="/autorizacao/verificacao"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Esqueceu sua senha?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={
                loading || !loginInput || !senha || tipoInput === 'invalido'
              }
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-4 space-y-4">
            <Link href="/autorizacao/cadastro">
              <Button className="w-full h-12 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Criar Conta
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={mostrarModal}
        onOpenChange={(open) => {
          if (open) {
            setMostrarModal(true);
            // Se abrir manualmente (não por URL), adiciona parâmetro
            if (!searchParams.get('ativar-conta')) {
              const params = new URLSearchParams(searchParams.toString());
              params.set('ativar-conta', 'true');
              window.history.pushState({}, '', `?${params.toString()}`);
            }
          } else {
            handleCloseModal();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Key className="w-6 h-6 text-blue-600" />
              Ativar Conta
            </DialogTitle>
            <DialogDescription>
              Insira seu email ou CPF e o código de ativação recebido
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {modalError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{modalError}</span>
              </div>
            )}

            {modalSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{modalSuccess}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email ou CPF
              </label>
              <Input
                type="text"
                value={modalIdentificador}
                onChange={(e) => setModalIdentificador(e.target.value)}
                placeholder="seu@email.com ou 12345678900"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                disabled={modalLoading}
              />
              <p className="text-xs text-gray-500">
                Use o mesmo email ou CPF (11 dígitos) cadastrado
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Código de Ativação
                </label>
                <button
                  type="button"
                  onClick={handleSolicitarNovoCodigo}
                  disabled={solicitandoNovoCodigo || modalLoading}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                >
                  {solicitandoNovoCodigo ? (
                    <>
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3" />
                      <span>Solicitar novo código</span>
                    </>
                  )}
                </button>
              </div>
              <Input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Digite o código recebido"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all font-mono text-center text-lg"
                disabled={modalLoading}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={modalLoading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAtivarConta}
              disabled={modalLoading || !modalIdentificador || !codigo}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {modalLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Ativando...</span>
                </div>
              ) : (
                'Ativar Conta'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
