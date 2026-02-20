import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;

  // Si pas configuré, on bloque plutôt que laisser ouvert
  if (!user || !pass) {
    return new NextResponse("Admin not configured", { status: 401 });
  }

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  const encoded = auth.split(" ")[1] ?? "";
  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  const [u, p] = decoded.split(":");

  if (u !== user || p !== pass) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};