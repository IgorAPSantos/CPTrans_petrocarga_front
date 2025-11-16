import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type UserRole = "gestor" | "motorista" | "agente" | "admin";

// Rotas públicas
const publicRoutes = [
  "/",
  "/quem-somos",
  "/contato",
  "/autorizacao/login",
  "/autorizacao/cadastro",
];

function isPublicRoute(pathname: string) {
  return publicRoutes.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );
}

// Rotas autorizadas por role
function hasRolePermission(pathname: string, role: UserRole) {
  if (role === "admin") return true; // ADMIN pode tudo

  if (pathname.startsWith("/gestor") && role === "gestor") return true;
  if (pathname.startsWith("/motorista") && role === "motorista") return true;
  if (pathname.startsWith("/agente") && role === "agente") return true;

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // libera públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    const redirectUrl = new URL("/autorizacao/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Decodifica o token
  let decoded: any = null;

  try {
    decoded = jwtDecode(token);
  } catch {
    const redirectUrl = new URL("/autorizacao/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Verifica expiração
  const now = Date.now() / 1000;
  if (decoded.exp && decoded.exp < now) {
    const redirectUrl = new URL("/autorizacao/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const userRole = decoded.permissao?.toLowerCase() as UserRole;

  if (!userRole) {
    return NextResponse.redirect(new URL("/autorizacao/login", request.url));
  }

  if (!hasRolePermission(pathname, userRole)) {
    const home = {
      gestor: "/gestor/relatorios",
      motorista: "/motorista/reservar-vaga",
      agente: "/agente/home",
      admin: "/gestor/relatorios", // admin cai no dashboard gestor
    }[userRole];

    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)"],
};
