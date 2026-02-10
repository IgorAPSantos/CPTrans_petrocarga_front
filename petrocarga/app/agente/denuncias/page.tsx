'use client';

import { useState, useEffect } from 'react';
import { Denuncia } from '@/lib/types/denuncias';
import { getDenuncias } from '@/lib/api/denunciaApi';
import { Loader2 } from 'lucide-react';
import DenunciaLista from '@/components/gestor/denuncia/DenunciaLista';
import toast from 'react-hot-toast';

export default function DenunciasAgente() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDenuncias = async () => {
    setLoading(true);
    try {
      const result = await getDenuncias();
      setDenuncias(result ?? []);
    } catch (err) {
      toast.error('Erro ao carregar denúncias. Por favor, tente novamente.');
      setDenuncias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDenuncias();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
        <p className="text-gray-600">Carregando denúncias...</p>
      </div>
    );
  }

  if (!denuncias.length) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 text-lg">
          Nenhuma denúncia encontrada no momento.
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-2xl mx-auto px-4 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Denúncias
        </h1>

        <DenunciaLista denuncias={denuncias} />
      </div>
    </section>
  );
}
