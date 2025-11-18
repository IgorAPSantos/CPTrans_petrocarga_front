"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/public/Logo.png";
import Image from "next/image";
import { LogoutButton } from "@/components/logoutButton/logoutButton";
import { useAuth } from "@/components/hooks/useAuth";

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { user } = useAuth();

  const links = [
    { href: "/gestor/relatorio", label: "Relatório" },
    { href: "/gestor/visualizar-vagas", label: "Visualizar Vagas" },
    { href: "/gestor/registrar-vagas", label: "Registrar Vagas" },
    { href: "/gestor/guia", label: "Guia" },
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

          {/* 🔥 Link ADMIN no desktop */}
          {adminLink && (
            <li className="hover:text-gray-300 font-semibold text-yellow-300">
              <Link href={adminLink.href}>{adminLink.label}</Link>
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
