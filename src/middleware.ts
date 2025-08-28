import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  const isLoginPage = request.nextUrl.pathname === "/";

  // Se não houver token e não for a página de login, redireciona
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Se houver token, pode continuar normalmente
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // login  
    "/pages/:path*",
  ],
};