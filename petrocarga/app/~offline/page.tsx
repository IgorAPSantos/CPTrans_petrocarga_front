"use client";

import { useRouter } from "next/navigation";

export default function Offline() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
      {/* Ícone de Nuvem/Offline */}
      <div className="bg-gray-200 p-4 rounded-full mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M10.477 10.477c.456-.252.96-.407 1.523-.407a3 3 0 013 3 3 3 0 01-.407 1.523M16.5 16.5c-2.485 0-4.5-2.015-4.5-4.5 0-.563.155-1.067.407-1.523M21.53 16.963C21.83 16.16 22 15.19 22 14c0-5.523-4.477-10-10-10-.943 0-1.85.122-2.709.349M5.037 5.037A9.957 9.957 0 002 14c0 3.012 1.343 5.719 3.515 7.55"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Sem conexão</h1>

      <p className="text-gray-600 mb-8 max-w-sm">
        Não foi possível carregar esta página. Verifique sua internet para
        acessar novos conteúdos.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {/* Botão Tentar Novamente (Recarrega a página atual) */}
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Tentar Novamente
        </button>

        {/* Botão Voltar (Volta para o histórico anterior, que deve estar em cache) */}
        <button
          onClick={() => router.back()}
          className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Voltar para onde eu estava
        </button>

        {/* Botão Home (Garantia de que vai para uma página cacheada) */}
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-500 hover:text-gray-700 mt-2 underline"
        >
          Ir para o Início
        </button>
      </div>
    </div>
  );
}
