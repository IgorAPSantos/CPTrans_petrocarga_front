'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from '@/public/Logo.png';
import Image from 'next/image';
import { LogoutButton } from '@/components/logoutButton/logoutButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, User } from 'lucide-react';

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  const links = [
    { href: '/agente/reserva-rapida', label: 'Reserva Rapida' },
    { href: '/agente/lista-reserva', label: 'Lista de Reservas' },
    { href: '/agente/consulta', label: 'Consultar Placa' },
  ];

  return (
    <header className="bg-blue-800 text-white relative">
      <nav className="flex items-center justify-between p-4 max-w-6xl mx-auto">
        {/* Logo */}
        <Link
          href="/agente"
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

          {/* Dropdown Meu Perfil */}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-gray-300 focus:outline-none">
                Perfil
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-gray-800 border border-gray-200">
                <DropdownMenuItem asChild>
                  <Link
                    href="/agente/perfil"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <User className="h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0 m-0 focus:bg-gray-100">
                  {/* Redirect após logout */}
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>

        {/* BOTÃO HAMBURGUER (mobile) */}
        <button
          className="md:hidden text-2xl hover:text-gray-300"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-expanded={menuAberto}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
        >
          ☰
        </button>
      </nav>

      {/* MENU MOBILE COM ANIMAÇÃO */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuAberto ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
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

          {/* Logout mobile */}
          <li className="hover:bg-blue-700 rounded">
            <LogoutButton mobile={true} />
          </li>
        </ul>
      </div>
    </header>
  );
}
