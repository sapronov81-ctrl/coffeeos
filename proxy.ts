// proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Protect API routes
  if (pathname.startsWith("/api")) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};