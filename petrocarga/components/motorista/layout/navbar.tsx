'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from '@/public/Logo.png';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CarIcon,
  ChevronDown,
  User,
  Bell,
  TriangleAlert,
  Archive,
} from 'lucide-react';
import { LogoutButton } from '@/components/logoutButton/logoutButton';
import { useNotifications } from '@/context/NotificationContext';

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { notifications, isConnected } = useNotifications();

  const unreadCount = notifications.filter(
    (notification) => !notification.lida,
  ).length;

  const links = [{ href: '/motorista/reservar-vaga', label: 'Reservar Vaga' }];

  return (
    <header className="bg-blue-800 text-white relative">
      <nav className="grid grid-cols-3 items-center p-4 max-w-6xl mx-auto md:flex md:justify-between">
        {/* SINO - MOBILE */}
        <Link
          href="/motorista/notificacoes"
          className="md:hidden flex items-center justify-start"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Bell className="h-6 w-6" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </Link>

        {/* LOGO */}
        <Link
          href="/motorista/reservar-vaga"
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
          {/* Dropdown Veículo */}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-gray-300 focus:outline-none">
                Reservas
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-gray-800 border border-gray-200">
                <DropdownMenuItem asChild>
                  <Link
                    href="/motorista/reservas"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <Archive className="h-4 w-4" />
                    Minhas Reservas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/motorista/reservas/minhas-denuncias"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <TriangleAlert className="h-4 w-4" />
                    Minhas Denúncias
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>

          {/* Dropdown Veículo */}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-gray-300 focus:outline-none">
                Veículo
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-gray-800 border border-gray-200">
                <DropdownMenuItem asChild>
                  <Link
                    href="/motorista/veiculos/meus-veiculos"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <CarIcon className="h-4 w-4" />
                    Meu Veículo
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/motorista/veiculos/cadastrar-veiculos"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <CarIcon className="h-4 w-4" />
                    Adicionar Veículo
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>

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
                    href="/motorista/perfil"
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

          {/* BOTÃO DE NOTIFICAÇÕES - DESKTOP */}
          <li>
            <Link
              href="/motorista/notificacoes"
              className="relative flex items-center gap-1 hover:text-gray-300 p-2 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label={`Notificações${
                unreadCount > 0 ? `, ${unreadCount} não lidas` : ''
              }`}
            >
              <Bell className="h-5 w-5" />

              {/* Badge de contador */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}

              {/* Indicador de conexão (opcional) */}
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

      {/* MENU MOBILE COM ANIMAÇÃO */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuAberto ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-4 bg-blue-500 p-4 shadow-md">
          <li className="flex flex-col gap-2 border-b border-blue-400 pb-2">
            <span className="font-bold text-sm text-blue-200 uppercase">
              Reservas
            </span>
            {/* Reservar Vagas no Mobile */}
            <Link
              href="/motorista/reservar-vaga"
              onClick={() => setMenuAberto(false)}
              className="pl-2"
            >
              Reservar Vaga
            </Link>

            {/* Minhas Reservas no Mobile */}
            <Link
              href="/motorista/reservas"
              onClick={() => setMenuAberto(false)}
              className="pl-2"
            >
              Minhas Reservas
            </Link>
          </li>
          <li className="flex flex-col gap-2 border-b border-blue-400 pb-2">
            <span className="font-bold text-sm text-blue-200 uppercase">
              Veículos
            </span>
            {/* Meus Veículos no Mobile */}
            <Link
              href="/motorista/veiculos/meus-veiculos"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full"
            >
              Meus Veículos
            </Link>

            {/* Adicionar Veículo no Mobile */}
            <Link
              href="/motorista/veiculos/cadastrar-veiculos"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full"
            >
              Adicionar Veículo
            </Link>
          </li>
          <li className="flex flex-col gap-2 border-b border-blue-400 pb-2">
            <span className="font-bold text-sm text-blue-200 uppercase">
              Notificações
            </span>
            {/* Notificações no Mobile */}
            <Link
              href="/motorista/notificacoes"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full"
            >
              Ver Notificações
            </Link>

            {/* Minhas Denuncias no Mobile */}
            <Link
              href="/motorista/reservas/minhas-denuncias"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full"
            >
              Minhas Denúncias
            </Link>
          </li>
          <li className="flex flex-col gap-2 border-b border-blue-400 pb-2">
            <span className="font-bold text-sm text-blue-200 uppercase">
              Perfil
            </span>
            {/* Meu Perfil no Mobile */}
            <Link
              href="/motorista/perfil"
              onClick={() => setMenuAberto(false)}
              className="pl-2"
            >
              Perfil
            </Link>

            {/* Logout no Mobile */}
            <div className="pl-2">
              <LogoutButton mobile={true} />
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
}
