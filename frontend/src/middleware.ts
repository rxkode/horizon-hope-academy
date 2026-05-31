import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge Middleware — Server-side auth guard.
 * Runs before every request to /admin/* routes.
 * Redirects unauthenticated users to /admin/login.
 *
 * Note: localStorage is not available in Edge middleware.
 * We use a cookie (hha_session) set on login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("hha_session");

    if (!session?.value) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
