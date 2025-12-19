"use client";

import { buttonVariants } from "@/components/ui/button";
import { Motorista } from "@/lib/types/motorista";
import { cn } from "@/lib/utils";
import { Mail, Phone, UserCircle, Bell, Car, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NotificacaoModal } from "@/components/gestor/modals/notificacaoModal";

interface MotoristaCardProps {
  motorista: Motorista;
}

export default function MotoristaCard({ motorista }: MotoristaCardProps) {
  const [isNotificacaoModalOpen, setIsNotificacaoModalOpen] = useState(false);

  return (
    <>
      <article
        className={cn(
          "flex flex-col sm:flex-row justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 gap-4 w-full",
          "border-blue-500"
        )}
      >
        {/* Informações */}
        <section className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Nome */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-gray-400" />
              {motorista.usuario.nome}
            </h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              Motorista
            </span>
          </div>

          {/* Infos (responsivas) */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Mail className="w-4 h-4 text-gray-400" />
              {motorista.usuario.email}
            </span>

            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Phone className="w-4 h-4 text-gray-400" />
              {motorista.usuario.telefone}
            </span>
            
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Car className="w-4 h-4 text-gray-400" />
              CNH: {motorista.tipoCnh}
            </span>
          </div>
        </section>

        {/* Botões - Lado Direito */}
        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
          {/* Botão Notificar */}
          <button
            onClick={() => setIsNotificacaoModalOpen(true)}
            className={cn(
              "flex items-center justify-center gap-1.5",
              "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200",
              "rounded-lg transition-colors text-sm font-medium",
              "h-9 w-full sm:w-28" // Altura fixa e largura fixa em desktop
            )}
            title="Enviar notificação"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificar</span>
          </button>
          
          {/* Botão Veículos */}
          <Link
            href={`/gestor/motoristas/veiculos/${motorista.usuario.id}`}
            className={cn(
              "flex items-center justify-center gap-1.5",
              "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200",
              "rounded-lg transition-colors text-sm font-medium",
              "h-9 w-full sm:w-28" // Mesma altura e largura
            )}
            title="Ver veículos"
          >
            <Truck className="w-4 h-4" />
            <span className="hidden sm:inline">Veículos</span>
          </Link>
        </div>
      </article>

      {/* Modal de Notificação */}
      <NotificacaoModal
        isOpen={isNotificacaoModalOpen}
        onClose={() => setIsNotificacaoModalOpen(false)}
        usuarioId={motorista.usuario.id}
        usuarioNome={motorista.usuario.nome}
        tipoUsuario="MOTORISTA"
      />
    </>
  );
}