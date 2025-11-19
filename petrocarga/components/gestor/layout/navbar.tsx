"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/public/Logo.png";
import Image from "next/image";
import { LogoutButton } from "@/components/logoutButton/logoutButton";
import { useAuth } from "@/components/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, User } from "lucide-react";

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { user } = useAuth();

  const links = [
    { href: "/gestor/relatorio", label: "Relatório" },
    { href: "/gestor/guia", label: "Guia" },
    { href: "/gestor/reservas", label: "Reservas" },
  ];

  // 🔥 Link extra somente se for ADMIN
  const adminLink =
    user?.permissao === "ADMIN"
      ? { href: "/gestor/adicionar-gestores", label: "Adicionar Gestores" }
      : null;

  return (
    <header className="bg-blue-800 text-white relative">
      <nav className="flex items-center justify-between p-4 max-w-6xl mx-auto">
        {/* Logo */}
        <Link
          href="/gestor/relatorio"
          className="flex items-center space-x-2 text-xl font-bold hover:text-gray-300"
        >
          <Image src={Logo} alt="Logo da Cptrans" className="w-16 h-auto" />
        </Link>

        {/* MENU DESKTOP */}
        <ul className="hidden md:flex gap-6 text-lg items-center">
          {links.map(({ href, label }) => (
            <li key={href} className="hover:text-gray-300">
              <Link href={href}>{label}</Link>
            </li>
          ))}

          {/* Dropdown Vagas */}
            <li>
                <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 hover:text-gray-300 focus:outline-none">
                    Vaga
                    <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-gray-800 border border-gray-200">
                    <DropdownMenuItem asChild>
                    <Link
                        href="/gestor/visualizar-vagas"
                        className="flex items-center gap-2 cursor-pointer w-full"
                    >
                        <User className="h-4 w-4" />
                        Vagas
                    </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                    <Link
                        href="/gestor/registrar-vagas"
                        className="flex items-center gap-2 cursor-pointer w-full"
                    >
                        <User className="h-4 w-4" />
                        Adicionar Vaga
                    </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </li>

            {/* Dropdown Agente */}
            <li>
                <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 hover:text-gray-300 focus:outline-none">
                    Agente
                    <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-gray-800 border border-gray-200">
                    <DropdownMenuItem asChild>
                    <Link
                        href="/gestor/agentes"
                        className="flex items-center gap-2 cursor-pointer w-full"
                    >
                        <User className="h-4 w-4" />
                        Agentes
                    </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                    <Link
                        href="/gestor/cadastrar-agente"
                        className="flex items-center gap-2 cursor-pointer w-full"
                    >
                        <User className="h-4 w-4" />
                        Adicionar Agente
                    </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </li>

          {/* 🔥 Link ADMIN no desktop */}
          {adminLink && (
            //Dropdown Gestores
            <li>
                <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 hover:text-gray-300 focus:outline-none">
                    Gestor
                    <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-gray-800 border border-gray-200">
                    <DropdownMenuItem asChild>
                    <Link
                        href="/gestor/gestores"
                        className="flex items-center gap-2 cursor-pointer w-full"
                    >
                        <User className="h-4 w-4" />
                        Gestores
                    </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                    <Link
                        href="/gestor/adicionar-gestores"
                        className="flex items-center gap-2 cursor-pointer w-full"
                    >
                        <User className="h-4 w-4" />
                        Adicionar Gestor
                    </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </li>
          )}

          {/* Sair simples */}
          <li className="hover:text-gray-300">
            <LogoutButton />
          </li>
        </ul>

        {/* BOTÃO HAMBURGUER (mobile) */}
        <button
          className="md:hidden text-2xl hover:text-gray-300"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-expanded={menuAberto}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          ☰
        </button>
      </nav>

      {/* MENU MOBILE COM ANIMAÇÃO */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuAberto ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-4 bg-blue-500 p-4 shadow-md">
          {links.map(({ href, label }) => (
            <li key={href} className="hover:bg-blue-700 rounded">
              <Link
                href={href}
                onClick={() => setMenuAberto(false)}
                className="block px-2 py-1 w-full"
              >
                {label}
              </Link>
            </li>
          ))}

          {/* 🔥 Link ADMIN no mobile */}
          {adminLink && (
            <li className="hover:bg-blue-700 rounded font-semibold text-yellow-300">
              <Link
                href={adminLink.href}
                onClick={() => setMenuAberto(false)}
                className="block px-2 py-1 w-full"
              >
                {adminLink.label}
              </Link>
            </li>
          )}

          {/* Logout mobile */}
          <li className="hover:bg-blue-700 rounded">
            <LogoutButton mobile={true} />
          </li>
        </ul>
      </div>
    </header>
  );
}
