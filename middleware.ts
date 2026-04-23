import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // On laisse passer les assets, API, fichiers système
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Sous-domaine agents immobiliers
  if (host === "agents-immobiliers.progressive-pulse.fr") {
    if (pathname === "/") {
      return NextResponse.rewrite(
        new URL("/agents-immobiliers", request.url)
      );
    }
  }

  // Sous-domaine organismes de formation
  if (host === "organismes-formations.progressive-pulse.fr") {
    if (pathname === "/") {
      return NextResponse.rewrite(
        new URL("/organismes-de-formation", request.url)
      );
    }
  }

  // Domaine principal = page mère
  if (
    host === "progressive-pulse.fr" ||
    host === "www.progressive-pulse.fr"
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};