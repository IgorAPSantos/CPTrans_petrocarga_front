import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type UserRole = "gestor" | "motorista" | "agente";

// Rotas públicas que não precisam de autenticação
const publicRoutes = [
  "/",
  "/quem-somos",
  "/contato",
  "/autorizacao/login",
  "/autorizacao/cadastro",
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });
}

// Verifica se usuário pode acessar rota conforme sua role
function hasRoutePermission(pathname: string, userRole: UserRole): boolean {
  if (pathname.startsWith("/gestor") && userRole === "gestor") return true;
  if (pathname.startsWith("/motorista") && userRole === "motorista")
    return true;
  if (pathname.startsWith("/agente") && userRole === "agente") return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Liberar rotas públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Pega token do cookie
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    const url = new URL("/autorizacao/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Decodificar token para obter role
  let userRole: UserRole | null = null;

  try {
    const decoded: any = jwtDecode(token);
    userRole = decoded.permissao?.toLowerCase();
  } catch (err) {
    console.error("Erro ao decodificar JWT no middleware:", err);

    const url = new URL("/autorizacao/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (!userRole) {
    const url = new URL("/autorizacao/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Verifica autorização
  if (!hasRoutePermission(pathname, userRole)) {
    let homeRoute = "/";

    switch (userRole) {
      case "gestor":
        homeRoute = "/gestor/relatorios";
        break;
      case "motorista":
        homeRoute = "/motorista/reservar-vaga";
        break;
      case "agente":
        homeRoute = "/agente/home";
        break;
    }

    return NextResponse.redirect(new URL(homeRoute, request.url));
  }

  return NextResponse.next();
}

// Middleware aplicado a todas as rotas (exceto arquivos estáticos)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)"],
};
