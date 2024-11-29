import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Obtém o token de autenticação armazenado nos cookies
  const token = request.cookies.get("token")?.value;

  // Define as rotas que precisam de autenticação
  const protectedRoutes = ["/dashboard", "/solicitar", "/profile"];

  // Verifica se a URL solicitada está entre as rotas protegidas
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    // Se o token não existir, redireciona para a página de login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next(); // Permite continuar se o token existir
}

export const config = {
  matcher: ["/dashboard/:path*", "/solicitar/:path*", "/profile/:path*"], // Define as rotas protegidas
};
