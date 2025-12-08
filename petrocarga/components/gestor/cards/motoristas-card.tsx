"use client";

import { buttonVariants } from "@/components/ui/button";
import { Motorista } from "@/lib/types/motorista";
import { cn } from "@/lib/utils";
import { Mail, Phone, UserCircle } from "lucide-react";
import Link from "next/link";
interface MotoristaCardProps {
  motorista: Motorista;
}

export default function MotoristaCard({ motorista }: MotoristaCardProps) {
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
          {motorista.usuario.nome}
        </h3>

        {/* Infos (responsivas) */}
        <div className="flex flex-wrap gap-4">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Mail className="w-4 h-4 text-gray-400" />
            {motorista.usuario.email}
          </span>

          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Phone className="w-4 h-4 text-gray-400" />
            {motorista.usuario.telefone}
          </span>
        </div>
      </section>

      {/* Botão */}
      <div className="flex sm:flex-col flex-row gap-2 sm:w-auto w-full sm:max-w-none">
        <Link
          href={`/gestor/motoristas/veiculos/${motorista.usuario.id}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "text-sm sm:text-base w-full sm:w-auto text-center"
          )}
        >
          Veículos
        </Link>
      </div>
    </article>
  );
}
