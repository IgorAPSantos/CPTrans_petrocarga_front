"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/public/Logo.png";
import Image from "next/image";

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  const links = [
    { href: "/relatorio", label: "Relatório" },
    { href: "/visualizar-vagas", label: "Visualizar Vagas" },
    { href: "/registrar-vagas", label: "Registrar Vagas" },
    { href: "/guia", label: "Guia" },
    { href: "/", label: "Sair" },
  ];

  return (
    <header className="bg-blue-800 text-white relative">
      <nav className="flex items-center justify-between p-4 max-w-6xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl font-bold hover:text-gray-300"
        >
          <Image src={Logo} alt="Logo da Cptrans" className="w-16 h-auto" />
        </Link>

        {/* MENU DESKTOP */}
        <ul className="hidden md:flex gap-6 text-lg">
          {links.map(({ href, label }) => (
            <li key={href} className="hover:text-gray-300">
              <Link href={href}>{label}</Link>
            </li>
          ))}
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
            <li key={href} className="hover:bg-blue-700 rounded px-2">
              <Link href={href} onClick={() => setMenuAberto(false)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
