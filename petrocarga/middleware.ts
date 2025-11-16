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

function hasRolePermission(pathname: string, role: UserRole) {
  if (role === "admin") return true;
  if (pathname.startsWith("/gestor") && role === "gestor") return true;
  if (pathname.startsWith("/motorista") && role === "motorista") return true;
  if (pathname.startsWith("/agente") && role === "agente") return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("[Middleware] Rota acessada:", pathname);

  if (isPublicRoute(pathname)) {
    console.log("[Middleware] Rota pública, acesso liberado");
    return NextResponse.next();
  }

  const token = request.cookies.get("auth-token")?.value;
  console.log("[Middleware] Token encontrado:", token);

  if (!token) {
    const redirectUrl = new URL("/autorizacao/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  let decoded: JwtPayload;
  try {
    decoded = jwtDecode<JwtPayload>(token);
    console.log("[Middleware] Payload JWT:", decoded);
  } catch (err) {
    const redirectUrl = new URL("/autorizacao/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const now = Date.now() / 1000;
  if (decoded.exp && decoded.exp < now) {
    const redirectUrl = new URL("/autorizacao/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const userRole = decoded.permissao.toLowerCase() as UserRole;
  if (!userRole) {
    return NextResponse.redirect(new URL("/autorizacao/login", request.url));
  }

  if (!hasRolePermission(pathname, userRole)) {
    const home = {
      gestor: "/gestor/visualizar-vagas",
      motorista: "/motorista/reservar-vaga",
      agente: "/agente/home",
      admin: "/gestor/visualizar-vagas",
    }[userRole];
    return NextResponse.redirect(new URL(home, request.url));
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
