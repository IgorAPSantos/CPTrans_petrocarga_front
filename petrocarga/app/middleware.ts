import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type UserRole = "gestor" | "motorista" | "agente";

// Rotas públicas que não precisam de autenticação
const publicRoutes = [
    "/",
    "/quem-somos",
    "/contato",
    "/autorizacao/login",
    "/autorizacao/cadastro"
];

// Função para verificar se é rota pública
function isPublicRoute(pathname: string): boolean {
    return publicRoutes.some(route => {
        if (route === "/") {
        return pathname === "/";
        }
        return pathname.startsWith(route);
    });
}

// Função para verificar se usuário tem permissão para acessar a rota
function hasRoutePermission(pathname: string, userRole: UserRole): boolean {
    // Verifica se a rota pertence ao role do usuário
    if (pathname.startsWith("/gestor") && userRole === "gestor") return true;
    if (pathname.startsWith("/motorista") && userRole === "motorista") return true;
    if (pathname.startsWith("/agente") && userRole === "agente") return true;
    
    return false;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Se é rota pública, permite acesso
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // Pega o token e role do cookie
    const token = request.cookies.get("auth-token")?.value;
    const userRole = request.cookies.get("user-role")?.value as UserRole | undefined;

    // Se não tem token, redireciona para login
    if (!token || !userRole) {
        const url = new URL("/autorizacao/login", request.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    // Verifica se o usuário tem permissão para acessar a rota
    if (!hasRoutePermission(pathname, userRole)) {
        // Redireciona para a home do usuário
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

    // Usuário autenticado e com permissão - permite acesso
    return NextResponse.next();
}

// Configura quais rotas o middleware deve verificar
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
    ],
};