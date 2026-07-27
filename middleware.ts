import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Extract hostname without port for subdomain matching
  const hostWithoutPort = hostname.split(":")[0];

  // Check if host starts with "admin." (e.g. admin.localhost, admin.citieye.ng)
  const isAdminSubdomain = hostWithoutPort.startsWith("admin.");

  if (isAdminSubdomain) {
    // Rewrite requests to the internal /admin directory if not already starting with /admin
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api routes (backend proxy)
     * 2. /_next (Next.js internals)
     * 3. Static files (images, favicons, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
