import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type UserRole = "gestor" | "motorista" | "agente" | "admin";

interface JwtPayload {
  nome: string;
  id: string;
  permissao: "ADMIN" | "GESTOR" | "MOTORISTA" | "AGENTE";
  email: string;
  sub: string;
  iat: number;
  exp: number;
}

// Rotas públicas
const publicRoutes = [
  "/",
  "/quemsomos",
  "/contato",
  "/autorizacao/login",
  "/autorizacao/cadastro",
  "/autorizacao/verificacao",
  "/autorizacao/nova-senha",
];

function isPublicRoute(pathname: string) {
  return publicRoutes.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );
}

function hasRolePermission(pathname: string, role: UserRole) {
  if (role === "admin") return true;
  if (pathname.startsWith("/gestor") && role === "gestor") return true;
  if (pathname.startsWith("/motorista") && role === "motorista") return true;
  if (pathname.startsWith("/agente") && role === "agente") return true;
  return false;
}

// Função auxiliar para pegar a home baseada na role
function getHomeByRole(role: UserRole): string {
  const homes = {
    gestor: "/gestor/visualizar-vagas",
    motorista: "/motorista/reservar-vaga",
    agente: "/agente/home",
    admin: "/gestor/visualizar-vagas",
  };
  return homes[role] || "/autorizacao/login";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // 1. Tentar decodificar o token SE ele existir
  let decoded: JwtPayload | null = null;

  if (token) {
    try {
      decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now() / 1000;
      // Se expirou, anulamos o decoded para tratar como não logado
      if (decoded.exp && decoded.exp < now) {
        decoded = null;
      }
    } catch (err) {
      decoded = null;
    }
  }

  // 2. Lógica para ROTAS PÚBLICAS
  if (isPublicRoute(pathname)) {
    // SE estiver numa rota pública E tiver um token válido -> Redireciona para a Home
    if (decoded) {
      const userRole = decoded.permissao.toLowerCase() as UserRole;
      const homeUrl = getHomeByRole(userRole);
      return NextResponse.redirect(new URL(homeUrl, request.url));
    }
    // Se não tiver token (ou for inválido), deixa acessar a rota pública (login/cadastro/etc)
    return NextResponse.next();
  }

  // 3. Lógica para ROTAS PROTEGIDAS (O usuário não está em rota pública)

  // Se não tem token ou token inválido -> Login
  if (!token || !decoded) {
    const redirectUrl = new URL("/autorizacao/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const userRole = decoded.permissao.toLowerCase() as UserRole;

  // Segurança extra: se a role não existir no token
  if (!userRole) {
    const redirectUrl = new URL("/autorizacao/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Verifica permissão da rota
  if (!hasRolePermission(pathname, userRole)) {
    const homeUrl = getHomeByRole(userRole);
    return NextResponse.redirect(new URL(homeUrl, request.url));
  }

  return NextResponse.next({
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
