'use client';

import { useAuth } from '@/components/hooks/useAuth';
import { Gestor } from '@/lib/types/gestor';
import { getGestorByUserId } from '@/lib/api/gestorApi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Fingerprint, Loader2, Mail, Phone, UserIcon } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function PerfilGestor() {
  const [gestor, setGestor] = useState<Gestor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // user deve conter o userId
  const router = useRouter();

  // Buscar dados do gestor usando a server action existente
  useEffect(() => {
    if (!user?.id) return;
    const fetchGestor = async () => {
      setLoading(true);
      setError(null);

      try {
        const resultado = await getGestorByUserId(user.id);
        if (resultado.error) {
          setError(resultado.message || 'Erro ao buscar perfil');
        } else {
          setGestor(resultado.gestor);
        }
      } catch (err) {
        console.error('Erro ao carregar gestor:', err);
        setError('Erro ao carregar informações do perfil. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchGestor();
  }, [user]);

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

  // Se não houver gestor
  if (!gestor) {
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
            Olá, {gestor.nome}!
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
                  {gestor.nome}
                </p>
              </div>
            </div>

            {/* Telefone */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Telefone</p>
                <p className="text-lg font-semibold text-gray-900">
                  {gestor.telefone}
                </p>
              </div>
            </div>

            {/* CPF*/}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Fingerprint className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">CPF</p>
                <p className="text-lg font-semibold text-gray-900">
                  {gestor.cpf}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-900">
                  {gestor.email}
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href={`/gestor/perfil/editar-perfil`}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition inline-flex items-center justify-center"
            >
              Editar Perfil
            </Link>
          </div>
        </div>
      </Card>
    </main>
  );
}
