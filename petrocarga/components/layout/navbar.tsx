"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/public/Logo.png";
import Image from "next/image";

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  // 🧩 Aqui futuramente você pega o role do usuário pelo Auth Context ou Token JWT
  const role: "visitante" | "motorista" | "gestor" | "admin" = "visitante";

  const menus: Record<string, { href: string; label: string }[]> = {
    visitante: [
      { href: "/", label: "Introdução" },
      { href: "/autorizacao/login", label: "Acessar Conta" },
      { href: "/quemsomos", label: "Quem Somos" },
    ],
    motorista: [
      { href: "/", label: "Início" },
      { href: "/motorista/reservar-vaga", label: "Reservar Vaga" },
      { href: "/motorista/reservas", label: "Minhas Reservas" },
      { href: "/perfil", label: "Meu Perfil" },
    ],
    gestor: [
      { href: "/", label: "Dashboard" },
      { href: "/gestor/vagas", label: "Gerenciar Vagas" },
      { href: "/gestor/relatorios", label: "Relatórios" },
      { href: "/perfil", label: "Meu Perfil" },
    ],
    admin: [
      { href: "/", label: "Admin Home" },
      { href: "/admin/usuarios", label: "Usuários" },
      { href: "/admin/sistema", label: "Configurações" },
      { href: "/perfil", label: "Perfil" },
    ],
  };

  const links = menus[role];

  return (
    <header className="bg-blue-800 text-white relative z-50 shadow">
      <nav className="flex items-center justify-between p-4 max-w-6xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl font-bold hover:text-gray-300"
        >
          <Image src={Logo} alt="Logo da Cptrans" className="w-16 h-auto" />
        </Link>

        {/* Links Desktop */}
        <ul className="hidden md:flex gap-6 text-lg">
          {links.map(({ href, label }) => (
            <li key={href} className="hover:text-gray-300">
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>

        {/* Botão mobile */}
        <button
          className="md:hidden text-2xl hover:text-gray-300"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-expanded={menuAberto}
        >
          ☰
        </button>
      </nav>

      {/* Menu Mobile */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuAberto ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-4 bg-blue-600 p-4 shadow-md">
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
