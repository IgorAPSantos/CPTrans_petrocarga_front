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
import { CarIcon, ChevronDown, User, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LogoutButton } from '@/components/logoutButton/logoutButton';
import { useNotifications } from '@/context/NotificationContext';

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const router = useRouter();
  const { notifications, isConnected } = useNotifications();

  // ✅ CORREÇÃO: Conta apenas notificações NÃO LIDAS
  const unreadCount = notifications.filter(
    (notification) => !notification.lida
  ).length;

  const links = [
    { href: '/motorista/reservar-vaga', label: 'Reservar Vaga' },
    { href: '/motorista/reservas', label: 'Minhas Reservas' },
  ];

  return (
    <header className="bg-blue-800 text-white relative">
      <nav className="flex items-center justify-between p-4 max-w-6xl mx-auto">
        {/* Logo */}
        <Link
          href="/motorista/reservar-vaga"
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

          {/* NOTIFICAÇÕES - MOBILE */}
          <li className="hover:bg-blue-700 rounded">
            <Link
              href="/motorista/notificacoes"
              onClick={() => setMenuAberto(false)}
              className="flex items-center justify-between px-2 py-1 w-full"
            >
              <span className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notificações
              </span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </li>

          {/* Meus Veículos no Mobile */}
          <li className="hover:bg-blue-700 rounded">
            <Link
              href="/motorista/veiculos/meus-veiculos"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full"
            >
              Meus Veículos
            </Link>
          </li>

          {/* Adicionar Veículo no Mobile */}
          <li className="hover:bg-blue-700 rounded">
            <Link
              href="/motorista/veiculos/cadastrar-veiculos"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full"
            >
              Adicionar Veículo
            </Link>
          </li>

          {/* Meu Perfil no Mobile */}
          <li className="hover:bg-blue-700 rounded">
            <Link
              href="/motorista/perfil"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full"
            >
              Perfil
            </Link>
          </li>

          {/* Logout no Mobile */}
          <li className="hover:bg-blue-700 rounded">
            <div className="px-2 py-1 w-full">
              <LogoutButton mobile={true} />
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
}
