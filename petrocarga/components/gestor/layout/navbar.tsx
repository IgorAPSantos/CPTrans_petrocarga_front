'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from '@/public/Logo.png';
import Image from 'next/image';
import { LogoutButton } from '@/components/logoutButton/logoutButton';
import { useAuth } from '@/components/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  ParkingSquare,
  User,
  Bell,
  FileText,
  Calendar,
  Car,
  Users,
  UserCircle,
  BookOpen,
} from 'lucide-react';

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  // Garante que o componente só renderiza completamente no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔥 Link extra somente se for ADMIN (só verifica após mounted)
  const adminLink =
    mounted && user?.permissao === 'ADMIN'
      ? { href: '/gestor/adicionar-gestores', label: 'Adicionar Gestores' }
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
        <ul className="hidden md:flex gap-5 text-lg items-center">
          {/* Relatório */}
          <li className="hover:text-gray-300">
            <Link href="/gestor/relatorio" className="flex items-center gap-1">
              Relatório
            </Link>
          </li>

          {/* Vagas Dropdown */}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-gray-300 focus:outline-none">
                Vagas
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-gray-800 border border-gray-200">
                <DropdownMenuItem asChild>
                  <Link
                    href="/gestor/visualizar-vagas"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    Vagas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/gestor/registrar-vagas"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    Adicionar Vaga
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>

          {/* Disponibilidade */}
          <li className="hover:text-gray-300">
            <Link
              href="/gestor/disponibilidade-vagas"
              className="flex items-center gap-1"
            >
              Disponibilidade
            </Link>
          </li>

          {/* Reservas */}
          <li className="hover:text-gray-300">
            <Link href="/gestor/reservas" className="flex items-center gap-1">
              Reservas
            </Link>
          </li>

          {/* Notificações */}
          <li className="hover:text-gray-300">
            <Link
              href="/gestor/enviar-notificacoes"
              className="flex items-center gap-1"
            >
              Notificações
            </Link>
          </li>

          {/* Motoristas Dropdown */}
          <li className="hover:text-gray-300">
            <Link href="/gestor/motoristas" className="flex items-center gap-1">
              Motoristas
            </Link>
          </li>

          {/* Agentes Dropdown */}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-gray-300 focus:outline-none">
                Agentes
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-gray-800 border border-gray-200">
                <DropdownMenuItem asChild>
                  <Link
                    href="/gestor/agentes"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <Users className="h-4 w-4" />
                    Agentes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/gestor/cadastrar-agente"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <Users className="h-4 w-4" />
                    Adicionar Agente
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>

          {/* 🔥 Link ADMIN no desktop (se aplicável) */}
          {adminLink && (
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 hover:text-gray-300 focus:outline-none">
                  Gestores
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

          {/* Perfil Dropdown */}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-gray-300 focus:outline-none">
                Perfil
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-gray-800 border border-gray-200">
                <DropdownMenuItem asChild>
                  <Link
                    href="/gestor/perfil"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <UserCircle className="h-4 w-4" />
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

          {/* Guia */}
          <li className="hover:text-gray-300">
            <Link href="/gestor/guia" className="flex items-center gap-1">
              Guia
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
          {/* Relatório */}
          <li className="hover:bg-blue-700 rounded">
            <Link
              href="/gestor/relatorio"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Relatório
            </Link>
          </li>

          {/* Vagas Submenu */}
          <li>
            <div className="text-white font-medium px-2 py-1">Vagas</div>
            <div className="pl-4 space-y-2">
              <Link
                href="/gestor/visualizar-vagas"
                onClick={() => setMenuAberto(false)}
                className="block text-gray-200 hover:text-white"
              >
                Visualizar Vagas
              </Link>
              <Link
                href="/gestor/registrar-vagas"
                onClick={() => setMenuAberto(false)}
                className="block text-gray-200 hover:text-white"
              >
                Adicionar Vaga
              </Link>
            </div>
          </li>

          {/* Disponibilidade */}
          <li className="hover:bg-blue-700 rounded">
            <Link
              href="/gestor/disponibilidade-vagas"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Disponibilidade
            </Link>
          </li>

          {/* Reservas */}
          <li className="hover:bg-blue-700 rounded">
            <Link
              href="/gestor/reservas"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Reservas
            </Link>
          </li>

          {/* Notificações */}
          <li className="hover:bg-blue-700 rounded">
            <Link
              href="/gestor/enviar-notificacoes"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Notificações
            </Link>
          </li>

          {/* Motoristas Submenu */}
          <li>
            <div className="text-white font-medium px-2 py-1">Motoristas</div>
            <div className="pl-4 space-y-2">
              <Link
                href="/gestor/motoristas"
                onClick={() => setMenuAberto(false)}
                className="block text-gray-200 hover:text-white"
              >
                Ver Motoristas
              </Link>
              <Link
                href="/gestor/adicionar-motorista"
                onClick={() => setMenuAberto(false)}
                className="block text-gray-200 hover:text-white"
              >
                Adicionar Motorista
              </Link>
            </div>
          </li>

          {/* Agentes Submenu */}
          <li>
            <div className="text-white font-medium px-2 py-1">Agentes</div>
            <div className="pl-4 space-y-2">
              <Link
                href="/gestor/agentes"
                onClick={() => setMenuAberto(false)}
                className="block text-gray-200 hover:text-white"
              >
                Ver Agentes
              </Link>
              <Link
                href="/gestor/cadastrar-agente"
                onClick={() => setMenuAberto(false)}
                className="block text-gray-200 hover:text-white"
              >
                Adicionar Agente
              </Link>
            </div>
          </li>

          {/* 🔥 Link ADMIN no mobile */}
          {adminLink && (
            <>
              <div className="border-t border-blue-400 my-2 pt-2">
                <div className="text-yellow-300 font-medium px-2 py-1">
                  Admin
                </div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/gestor/gestores"
                    onClick={() => setMenuAberto(false)}
                    className="block text-yellow-200 hover:text-yellow-100"
                  >
                    Gestores
                  </Link>
                  <Link
                    href="/gestor/adicionar-gestores"
                    onClick={() => setMenuAberto(false)}
                    className="block text-yellow-200 hover:text-yellow-100"
                  >
                    Adicionar Gestor
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Perfil */}
          <li className="hover:bg-blue-700 rounded">
            <Link
              href="/gestor/perfil"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full flex items-center gap-2"
            >
              <UserCircle className="h-4 w-4" />
              Meu Perfil
            </Link>
          </li>

          {/* Guia */}
          <li className="hover:bg-blue-700 rounded">
            <Link
              href="/gestor/guia"
              onClick={() => setMenuAberto(false)}
              className="block px-2 py-1 w-full flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Guia
            </Link>
          </li>

          {/* Logout mobile */}
          <li className="hover:bg-blue-700 rounded">
            <LogoutButton mobile={true} />
          </li>
        </ul>
      </div>
    </header>
  );
}
