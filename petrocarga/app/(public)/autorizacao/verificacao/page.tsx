'use client';

import { useState, useCallback } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { solicitarRecuperacaoSenha } from '@/lib/api/recuperacaoApi';
import { validateEmail } from '@/lib/utils';

type StatusType = 'success' | 'error' | null;

export default function RecuperacaoSenha() {
  // Estados
  const [email, setEmail] = useState('');
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [status, setStatus] = useState<StatusType>(null);
  const [mensagem, setMensagem] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  // Validações
  const emailValido = useCallback((email: string): boolean => {
    return validateEmail(email);
  }, []);

  const validarFormulario = (): string | null => {
    if (!email.trim()) return 'Por favor, digite seu email.';
    if (!emailValido(email)) return 'Por favor, digite um email válido.';
    return null;
  };

  // Função principal
  const enviarEmailRecuperacao = async () => {
    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      setStatus('error');
      setMensagem(erroValidacao);
      return;
    }

    setEstaCarregando(true);
    setStatus(null);
    setMensagem('');

    try {
      await solicitarRecuperacaoSenha(email);

      // Se chegou aqui, é sucesso
      setStatus('success');
      setMensagem('Email enviado com sucesso!');
      setMostrarModal(true);
      setEmailEnviado(true);
    } catch (erro: any) {
      setStatus('error');
      setMensagem(erro.message || 'Erro ao enviar email de recuperação.');
      console.error('Erro ao recuperar senha:', erro);
    } finally {
      setEstaCarregando(false);
    }
  };

  // Eventos
  const aoPressionarTecla = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !estaCarregando) {
      enviarEmailRecuperacao();
    }
  };

  const irParaLogin = () => {
    window.location.href = '/autorizacao/login';
  };

  const tentarOutroEmail = () => {
    setEmail('');
    setEmailEnviado(false);
    setStatus(null);
    setMensagem('');
  };

  const fecharModal = () => {
    setMostrarModal(false);
    irParaLogin();
  };

  // Renderização principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Modal de Confirmação */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fadeIn">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Verifique seu email
              </h2>
              <p className="text-gray-600 mb-6">
                Um email foi enviado para o seu endereço de email para redefinir
                sua senha.
              </p>
              <button
                onClick={fecharModal}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Voltar para o login
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Recuperar Senha
            </h1>
            <p className="text-gray-600 text-sm">
              Digite seu email para receber as instruções de recuperação
            </p>
          </div>

          {/* Mensagem de Status */}
          {status && !mostrarModal && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 border ${
                status === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              )}
              <p className="text-sm">{mensagem}</p>
            </div>
          )}

          {/* Conteúdo principal */}
          {!emailEnviado ? (
            <div className="space-y-6">
              {/* Input Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email cadastrado
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={aoPressionarTecla}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:opacity-50"
                  disabled={estaCarregando}
                  autoComplete="email"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Digite o email cadastrado na sua conta para receber o link de
                  recuperação.
                </p>
              </div>

              {/* Botão Enviar */}
              <button
                onClick={enviarEmailRecuperacao}
                disabled={estaCarregando}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {estaCarregando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar link de recuperação'
                )}
              </button>

              {/* Link Voltar */}
              <div className="mt-6 text-center">
                <button
                  onClick={irParaLogin}
                  disabled={estaCarregando}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o login
                </button>
              </div>
            </div>
          ) : (
            /* Tela de Sucesso */
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Email enviado com sucesso!
                </h3>
                <p className="text-gray-600">
                  Enviamos as instruções para recuperação de senha para:
                  <br />
                  <span className="font-medium text-indigo-600">{email}</span>
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={irParaLogin}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Voltar para o login
                </button>
                <button
                  onClick={tentarOutroEmail}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Enviar para outro email
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Texto informativo */}
        <div className="mt-6 space-y-3">
          <p className="text-center text-sm text-gray-600">
            Não recebeu o email? Verifique sua caixa de spam ou tente novamente.
          </p>
        </div>
      </div>
    </div>
  );
}
