'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from '@/public/Logo.png';
import Image from 'next/image';
import { LogoutButton } from '@/components/logoutButton/logoutButton';
import { useNotifications } from '@/context/NotificationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, User, Bell } from 'lucide-react';

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { notifications, isConnected } = useNotifications();

  // 🔴 Contador de notificações NÃO lidas
  const unreadCount = notifications.filter(
    (notification) => !notification.lida,
  ).length;

  const links = [
    { href: '/agente/reserva-rapida', label: 'Reserva Rapida' },
    { href: '/agente/lista-reserva', label: 'Lista de Reservas' },
    { href: '/agente/denuncias', label: 'Denúncias' },
    { href: '/agente/consulta', label: 'Consultar Placa' },
  ];

  return (
    <header className="bg-blue-800 text-white relative">
      <nav className="grid grid-cols-3 items-center p-4 max-w-6xl mx-auto md:flex md:justify-between">
        {/* 🔔 SINO - MOBILE */}
        <Link
          href="/agente/notificacoes"
          className="md:hidden flex items-center justify-start"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Bell className="h-6 w-6" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </Link>

        {/* LOGO */}
        <Link
          href="/agente"
          className="flex justify-center md:justify-start"
        >
          <Image src={Logo} alt="Logo da Cptrans" className="w-16 h-auto" />
        </Link>

        {/* BOTÃO MENU - MOBILE */}
        <button
          className="md:hidden text-2xl hover:text-gray-300 flex justify-end"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          ☰
        </button>

        {/* MENU DESKTOP */}
        <ul className="hidden md:flex gap-6 text-lg items-center">
          {links.map(({ href, label }) => (
            <li key={href} className="hover:text-gray-300">
              <Link href={href}>{label}</Link>
            </li>
          ))}

          {/* PERFIL */}
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
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>

          {/* 🔔 SINO - DESKTOP */}
          <li>
            <Link
              href="/agente/notificacoes"
              className="relative flex items-center p-2 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label={`Notificações${
                unreadCount > 0 ? `, ${unreadCount} não lidas` : ''
              }`}
            >
              <Bell className="h-5 w-5" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}

              {!isConnected && (
                <span
                  className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full h-2 w-2 animate-pulse"
                  title="Reconectando..."
                />
              )}
            </Link>
          </li>
        </ul>
      </nav>

      {/* MENU MOBILE */}
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

          {/* LOGOUT MOBILE */}
          <li className="hover:bg-blue-700 rounded">
            <LogoutButton mobile />
          </li>
        </ul>
      </div>
    </header>
  );
}
