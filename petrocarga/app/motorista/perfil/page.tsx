'use client';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/components/hooks/useAuth';
import { deleteMotorista, getMotoristaByUserId } from '@/lib/api/motoristaApi';
import { Motorista } from '@/lib/types/motorista';
import { cn } from '@/lib/utils';
import {
  UserIcon,
  Mail,
  Phone,
  FileText,
  Trash2,
  Fingerprint,
  IdCardIcon,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PerfilMotorista() {
  const [motorista, setMotorista] = useState<Motorista | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const { user } = useAuth(); // user deve conter o userId
  const router = useRouter();

  // Buscar dados do motorista usando a server action existente
  useEffect(() => {
    if (!user?.id) return;
    const fetchMotorista = async () => {
      setLoading(true);
      setError(null);

      try {
        const resultado = await getMotoristaByUserId(user.id);
        if (resultado.error) {
          setError(resultado.message || 'Erro ao buscar perfil');
        } else {
          setMotorista(resultado.motorista);
        }
      } catch (err) {
        console.error('Erro ao carregar motorista:', err);
        setError('Erro ao carregar informações do perfil. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchMotorista();
  }, [user]);

  const handleExcluir = async () => {
    if (!motorista) {
      alert('Você precisa estar logado para excluir a conta.');
      return;
    }

    try {
      const resultado = await deleteMotorista(motorista.id);

      if (resultado?.error) {
        alert(resultado.message || 'Erro ao excluir conta.');
      } else {
        setModalAberto(false);
        alert('Conta excluída com sucesso!');
        // Redirecionar para home ou login após excluir
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir conta.');
    }
  };

  // Estado de carregamento
  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </main>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Erro ao carregar perfil
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/autorizacao/login')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            Fazer Login
          </button>
        </div>
      </main>
    );
  }

  // Se não houver motorista
  if (!motorista) {
    return (
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Nenhum dado encontrado.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-4 md:py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Olá, {motorista.usuario.nome}!
          </CardTitle>
          <CardDescription className="text-base">
            Este é o seu perfil. Aqui você pode ver suas informações e atualizar
            seus dados conforme necessário.
          </CardDescription>
        </CardHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Informações do Perfil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <UserIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-lg font-semibold text-gray-900">
                  {motorista.usuario.nome}
                </p>
              </div>
            </div>

            {/* Telefone */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Telefone</p>
                <p className="text-lg font-semibold text-gray-900">
                  {motorista.usuario.telefone}
                </p>
              </div>
            </div>

            {/* Número da CNH*/}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <IdCardIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Número da CNH
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {motorista.numeroCnh}
                </p>
              </div>
            </div>

            {/* Tipo da CNH */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo da CNH</p>
                <p className="text-lg font-semibold text-gray-900">
                  {motorista.tipoCnh}
                </p>
              </div>
            </div>

            {/* CPF*/}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Fingerprint className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">CPF</p>
                <p className="text-lg font-semibold text-gray-900">
                  {motorista.usuario.cpf}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-900">
                  {motorista.usuario.email}
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href={`/motorista/perfil/editar-perfil`}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition inline-flex items-center justify-center"
            >
              Editar Perfil
            </Link>

            <button
              onClick={() => setModalAberto(true)}
              className={cn(
                buttonVariants({ variant: 'destructive' }),
                'flex items-center gap-2 justify-center'
              )}
            >
              <Trash2 className="w-4 h-4" />
              Excluir Conta
            </button>
          </div>
        </div>
      </Card>

      {/* Modal de Confirmação */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setModalAberto(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 w-96 max-w-full shadow-2xl transform transition-all duration-300 scale-95 animate-scaleIn">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Confirmar exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser
              desfeita e todos os seus dados serão permanentemente removidos.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluir}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
