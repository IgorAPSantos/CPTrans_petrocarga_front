'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/hooks/useAuth';
import {
  ativarConta,
  reenviarEmailRecuperacao,
} from '@/lib/api/recuperacaoApi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalEmail, setModalEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [solicitandoNovoCodigo, setSolicitandoNovoCodigo] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();

  // VERIFICAR STORAGE AO CARREGAR A PÁGINA
  useEffect(() => {
    const abrirModal = sessionStorage.getItem('abrirModalAtivacao');
    const emailSalvo = sessionStorage.getItem('emailCadastro');

    if (abrirModal === 'true') {
      if (emailSalvo) {
        setEmail(emailSalvo);
        setModalEmail(emailSalvo);
      }

      setMostrarModal(true);

      // Limpar storage
      sessionStorage.removeItem('abrirModalAtivacao');
      sessionStorage.removeItem('emailCadastro');
    }
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Redireciona conforme a permissão
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
  }, [loading, isAuthenticated, user, router]);

  // Enquanto o /me está sendo carregado
  if (loading) return null;

  // Se já estiver logado, nem renderiza a Home (vai redirecionar)
  if (isAuthenticated) return null;

  async function handleLogin() {
    setLoading(true);
    setError('');

    try {
      const decodedUser = await login({ email, senha });

      // Redirecionamento baseado na permissão
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
    } catch (err: unknown) {
      setError('Credênciais inválidas ou conta não ativada.');
    } finally {
      setLoading(false);
    }
  }

  const handleAtivarConta = async () => {
    setModalError('');
    setModalSuccess('');

    if (!modalEmail.trim()) {
      setModalError('Por favor, insira seu email');
      return;
    }

    if (!codigo.trim()) {
      setModalError('Por favor, insira o código de ativação');
      return;
    }

    setModalLoading(true);

    try {
      // Lógica direta para ativar conta
      await ativarConta(modalEmail.trim(), codigo.trim());

      setModalSuccess(
        'Conta ativada com sucesso! Agora você pode fazer login.',
      );
      setModalError('');

      // Limpar campos após sucesso
      setTimeout(() => {
        setMostrarModal(false);
        setModalEmail('');
        setCodigo('');
        setModalSuccess('');
      }, 2000);
    } catch (err: unknown) {
      console.error(err);
      setModalError(
        err instanceof Error
          ? err.message
          : 'Código inválido ou expirado. Verifique e tente novamente.',
      );
      setModalSuccess('');
    } finally {
      setModalLoading(false);
    }
  };

  const handleSolicitarNovoCodigo = async () => {
    if (!modalEmail.trim()) {
      setModalError('Por favor, insira seu email primeiro');
      return;
    }

    setSolicitandoNovoCodigo(true);
    setModalError('');
    setModalSuccess('');

    try {
      const resultado = await reenviarEmailRecuperacao(modalEmail.trim());

      if (resultado.valido === true) {
        setModalSuccess(
          resultado.message || 'Novo código enviado para seu email!',
        );
      } else if (resultado.valido === false) {
        setModalError(resultado.message || 'Erro ao solicitar novo código');
      } else {
        setModalSuccess('Código reenviado com sucesso!');
      }
    } catch (err: unknown) {
      console.error('Erro completo:', err);
      setModalError(
        err instanceof Error
          ? err.message
          : 'Erro ao solicitar novo código. Tente novamente.',
      );
    } finally {
      setSolicitandoNovoCodigo(false);
    }
  };

  const handleOpenModal = () => {
    setModalEmail(email);
    setCodigo('');
    setModalError('');
    setModalSuccess('');
    setMostrarModal(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Background decorativo */}
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
            Entre com suas credenciais para acessar o sistema
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
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                  disabled={loading}
                />
              </div>
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

            {/* Linha com "Esqueceu sua senha?" e "Ativar Conta" */}
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
              disabled={loading || !email || !senha}
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

      {/* Modal para Ativar Conta */}
      <Dialog
        open={mostrarModal}
        onOpenChange={(open) => {
          setMostrarModal(open);
          // Se o usuário fechar manualmente, limpa o storage também
          if (!open) {
            sessionStorage.removeItem('abrirModalAtivacao');
            sessionStorage.removeItem('emailCadastro');
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
              Insira seu email e o código de ativação recebido
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
                Email
              </label>
              <Input
                type="email"
                value={modalEmail}
                onChange={(e) => setModalEmail(e.target.value)}
                placeholder="seu@email.com"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                disabled={modalLoading}
              />
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
              onClick={() => setMostrarModal(false)}
              disabled={modalLoading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAtivarConta}
              disabled={modalLoading || !modalEmail || !codigo}
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
