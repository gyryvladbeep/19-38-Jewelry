import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { ADMIN_SESSION_COOKIE, isValidSessionCookieValue } from "@/lib/adminAuth";

const intlMiddleware = createMiddleware(routing);

// /admin lives outside the [locale] segment (it's a single Russian-language
// internal tool, not part of the bilingual public site), so it's handled
// here directly instead of being passed to next-intl's middleware — that
// would otherwise redirect /admin to /ru/admin.
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const valid = await isValidSessionCookieValue(cookie).catch(() => false);
    if (!valid) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
