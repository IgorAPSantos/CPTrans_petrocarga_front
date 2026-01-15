'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';
import {
  validarCodigoRecuperacao,
  redefinirSenhaComCodigo,
} from '@/lib/api/recuperacaoApi';

type StatusType = 'success' | 'error' | null;

// Função auxiliar para extrair mensagem de erro de forma segura
function extrairMensagemErro(erro: unknown): string {
  if (erro instanceof Error) {
    return erro.message;
  }

  if (typeof erro === 'object' && erro !== null && 'message' in erro) {
    const erroObj = erro as { message?: unknown };
    if (typeof erroObj.message === 'string') {
      return erroObj.message;
    }
  }

  if (typeof erro === 'string') {
    return erro;
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
}

export default function ResetarSenhaComCodigo() {
  // Estados principais
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Estados de controle
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [status, setStatus] = useState<StatusType>(null);
  const [mensagem, setMensagem] = useState('');
  const [mostrarModalNovaSenha, setMostrarModalNovaSenha] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [codigoValidado, setCodigoValidado] = useState(false);

  // Bloqueia scroll quando um modal está aberto
  useEffect(() => {
    if (mostrarModalNovaSenha || mostrarModalSucesso) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mostrarModalNovaSenha, mostrarModalSucesso]);

  // Validações
  const emailValido = useCallback((email: string): boolean => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }, []);

  const validarFormularioCodigo = (): string | null => {
    if (!email.trim()) return 'Por favor, digite seu email.';
    if (!emailValido(email)) return 'Por favor, digite um email válido.';
    if (!codigo.trim()) return 'Por favor, digite o código de verificação.';
    return null;
  };

  const validarFormularioSenha = (): string | null => {
    if (!novaSenha) return 'Por favor, digite a nova senha.';
    if (novaSenha.length < 6) return 'A senha deve ter no mínimo 6 caracteres.';
    if (novaSenha !== confirmarSenha) return 'As senhas não coincidem.';
    return null;
  };

  // Função para validar o código
  const validarCodigo = async () => {
    const erroValidacao = validarFormularioCodigo();
    if (erroValidacao) {
      setStatus('error');
      setMensagem(erroValidacao);
      return;
    }

    setEstaCarregando(true);
    setStatus(null);
    setMensagem('');

    try {
      await validarCodigoRecuperacao(email, codigo);

      setCodigoValidado(true);
      setMostrarModalNovaSenha(true);
      setStatus('success');
      setMensagem('Código validado com sucesso!');
    } catch (erro: unknown) {
      setStatus('error');
      setMensagem(extrairMensagemErro(erro));
    } finally {
      setEstaCarregando(false);
    }
  };

  // Função para redefinir a senha
  const redefinirSenha = async () => {
    const erroValidacao = validarFormularioSenha();
    if (erroValidacao) {
      setStatus('error');
      setMensagem(erroValidacao);
      return;
    }

    setEstaCarregando(true);
    setStatus(null);
    setMensagem('');

    try {
      await redefinirSenhaComCodigo(email, codigo, novaSenha);

      setMostrarModalNovaSenha(false);
      setMostrarModalSucesso(true);
    } catch (erro: unknown) {
      setStatus('error');
      setMensagem(extrairMensagemErro(erro));
    } finally {
      setEstaCarregando(false);
    }
  };

  // Funções auxiliares
  const irParaLogin = () => {
    window.location.href = '/autorizacao/login';
  };

  const aoPressionarTecla = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !estaCarregando && !codigoValidado) {
      validarCodigo();
    }
  };

  const aoPressionarTeclaModal = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !estaCarregando && mostrarModalNovaSenha) {
      redefinirSenha();
    }
  };

  // Função para cancelar e voltar
  const cancelarRedefinicao = () => {
    setMostrarModalNovaSenha(false);
    setCodigoValidado(false);
    setNovaSenha('');
    setConfirmarSenha('');
  };

  // Se algum modal estiver aberto, não renderiza o conteúdo principal
  if (mostrarModalNovaSenha || mostrarModalSucesso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Modal Nova Senha */}
        {mostrarModalNovaSenha && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm sm:backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-5 sm:p-6 md:p-8 max-w-md w-full mx-3 animate-fadeIn relative">
              {/* Cabeçalho do modal */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-indigo-100 rounded-full mb-3 sm:mb-4">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-indigo-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Redefinir Senha
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Complete o processo redefinindo sua senha
                </p>
                <div className="mt-2 inline-flex items-center gap-1 sm:gap-2 text-xs text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    Código validado para: {email}
                  </span>
                </div>
              </div>

              {/* Mensagem de erro no modal */}
              {status === 'error' && (
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg flex items-start gap-2 sm:gap-3 bg-red-50 border border-red-200">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-red-800">{mensagem}</p>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                {/* Campo Nova Senha */}
                <div>
                  <label
                    htmlFor="novaSenha"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      id="novaSenha"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      onKeyDown={aoPressionarTeclaModal}
                      placeholder="Digite sua nova senha"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:opacity-50"
                      disabled={estaCarregando}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {mostrarSenha ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Mínimo 6 caracteres
                  </p>
                </div>

                {/* Campo Confirmar Senha */}
                <div>
                  <label
                    htmlFor="confirmarSenha"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarConfirmarSenha ? 'text' : 'password'}
                      id="confirmarSenha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      onKeyDown={aoPressionarTeclaModal}
                      placeholder="Digite a senha novamente"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:opacity-50"
                      disabled={estaCarregando}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                      }
                      className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {mostrarConfirmarSenha ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Botões do modal */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                  <button
                    onClick={cancelarRedefinicao}
                    disabled={estaCarregando}
                    className="flex-1 border border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={redefinirSenha}
                    disabled={estaCarregando}
                    className="flex-1 bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {estaCarregando ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">
                          Alterando senha...
                        </span>
                        <span className="inline sm:hidden">Alterando...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">
                          Confirmar Nova Senha
                        </span>
                        <span className="inline sm:hidden">Confirmar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Indicador de progresso */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                    <span className="hidden xs:inline">Validação</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full"></div>
                    <span className="hidden xs:inline font-medium">
                      Redefinir
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full"></div>
                    <span className="hidden xs:inline">Concluído</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sucesso */}
        {mostrarModalSucesso && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm sm:backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-5 sm:p-6 md:p-8 max-w-md w-full mx-3 animate-fadeIn">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-100 rounded-full mb-3 sm:mb-4">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Senha alterada com sucesso!
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  Sua senha foi redefinida com sucesso. Agora você pode fazer
                  login com sua nova senha.
                </p>
                <button
                  onClick={irParaLogin}
                  className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-indigo-700 transition"
                >
                  Ir para o Login
                </button>
              </div>

              {/* Indicador de progresso completo */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                    <span className="hidden xs:inline">Validação</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                    <span className="hidden xs:inline">Redefinir</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                    <span className="hidden xs:inline font-medium">
                      Concluído
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-indigo-100 rounded-full mb-3 sm:mb-4">
              <KeyRound className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-indigo-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              Validar Código
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Digite seu email e o código recebido
            </p>
          </div>

          {/* Mensagem de Status */}
          {status && !codigoValidado && (
            <div
              className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg flex items-start gap-2 sm:gap-3 border ${
                status === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
              )}
              <p className="text-xs sm:text-sm">{mensagem}</p>
            </div>
          )}

          {/* Formulário de validação do código */}
          <div className="space-y-4 sm:space-y-6">
            {/* Campo Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={aoPressionarTecla}
                placeholder="seu@email.com"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:opacity-50"
                disabled={estaCarregando || codigoValidado}
              />
            </div>

            {/* Campo Código */}
            <div>
              <label
                htmlFor="codigo"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Código de Verificação
              </label>
              <input
                type="text"
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                onKeyDown={aoPressionarTecla}
                placeholder="Digite o código recebido"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:opacity-50 uppercase"
                disabled={estaCarregando || codigoValidado}
                maxLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">
                Digite o código enviado para seu email
              </p>
            </div>

            {/* Botão Validar Código */}
            <button
              onClick={validarCodigo}
              disabled={estaCarregando || codigoValidado}
              className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {estaCarregando ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Validando...</span>
                  <span className="inline sm:hidden">Validando...</span>
                </>
              ) : codigoValidado ? (
                <>
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Código Validado</span>
                  <span className="inline sm:hidden">Validado</span>
                </>
              ) : (
                'Validar código'
              )}
            </button>
          </div>

          {/* Link para voltar */}
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={irParaLogin}
              disabled={estaCarregando || codigoValidado}
              className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1 disabled:opacity-50"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              Voltar para o login
            </button>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
          <p className="text-center text-xs sm:text-sm text-gray-600">
            Não recebeu o código? Verifique sua caixa de spam.
          </p>
          <p className="text-center text-xs text-gray-500">
            O código é válido por 30 minutos.
          </p>
        </div>
      </div>
    </div>
  );
}
