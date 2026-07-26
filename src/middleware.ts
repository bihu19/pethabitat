import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Paths that never need a refreshed session. Routes matched here skip the
 * Supabase auth round-trip entirely.
 *
 * The middleware's only job is to refresh the auth cookie; it performs no
 * authorization (that is enforced by RLS in the database and by the server
 * check in /admin). Running it on fully public pages costs a network call to
 * Supabase Auth on every request for no benefit.
 */
const PUBLIC_PREFIXES = ["/login", "/register", "/terms", "/privacy"];

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest) {
  if (isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Skip static assets, image files, and Next internals. `_next/data` and
     * the metadata files are excluded too — none of them carry a session that
     * needs refreshing.
     */
    "/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff2?|ttf)$).*)",
  ],
};
