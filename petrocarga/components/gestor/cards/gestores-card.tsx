"use client";

import { deleteGestor } from "@/lib/actions/gestorActions";
import { Gestor } from "@/lib/types/gestor";
import { cn } from "@/lib/utils";
import { IdCard, Mail, Phone, UserCircle } from "lucide-react";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";

interface GestorCardProps {
  gestor: Gestor;
}

export default function GestorCard({ gestor }: GestorCardProps) {
  const [modalAberto, setModalAberto] = useState(false);

  const handleExcluir = async () => {
    try {
      await deleteGestor(gestor.id);
      setModalAberto(false);
      router.back();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir vaga.");
    }
  };

  return (
    <article
      className={cn(
        "flex flex-col sm:flex-row justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4 w-full",
        "border-blue-500"
      )}
    >
      {/* Informações */}
      <section className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Nome */}
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-gray-400" />
          {gestor.nome}
        </h3>

        {/* Infos (responsivas) */}
        <div className="flex flex-wrap gap-4">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Mail className="w-4 h-4 text-gray-400" />
            {gestor.email}
          </span>

          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Phone className="w-4 h-4 text-gray-400" />
            {gestor.telefone}
          </span>
        </div>
      </section>

      {/* Botões */}
      <div className="flex sm:flex-col flex-row gap-2 sm:w-auto w-full sm:max-w-none">
        <Link
          href={`/gestor/${gestor.id}`}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition text-center w-full sm:w-auto"
        >
          Alterar
        </Link>

        <button
          onClick={() => setModalAberto(true)}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition w-full sm:w-auto"
        >
          Excluir
        </button>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalAberto(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Confirmar exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir este gestor? Esta ação não pode ser
              desfeita.
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
    </article>
  );
}
