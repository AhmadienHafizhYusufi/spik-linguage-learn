import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_HOST,
  ADMIN_ROUTE_PREFIX,
  ADMIN_SESSION_COOKIE,
  APP_HOST,
  APP_ROUTE_PREFIX,
  SESSION_COOKIE,
  adminUrl,
  appUrl,
} from "@/lib/domains";

/**
 * Proxy (dulu bernama middleware) — jalan sebelum setiap request.
 *
 * Satu project, tiga "situs":
 *
 *   admin.learnhub.id/modules  ──rewrite──▶  src/app/console/modules/page.tsx
 *   app.learnhub.id/dashboard  ──rewrite──▶  src/app/platform/dashboard/page.tsx
 *   learnhub.id/               ──────────▶  src/app/page.tsx (landing)
 *
 * Rewrite ≠ redirect: URL di browser tetap, Next.js hanya merender file dari
 * folder internal di belakang layar. Setiap folder internal HANYA bisa dicapai
 * dari host-nya sendiri.
 *
 * Proxy hanya melakukan cek CEPAT (ada cookie atau tidak). Cek sebenarnya
 * ada di requirePaidUser() / requireAdmin() di halaman & server action.
 */

function isInternalPath(pathname: string) {
  return [APP_ROUTE_PREFIX, ADMIN_ROUTE_PREFIX].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function rewriteTo(request: NextRequest, prefix: string) {
  const url = request.nextUrl.clone();
  url.pathname = `${prefix}${request.nextUrl.pathname}`;
  return NextResponse.rewrite(url);
}

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const { pathname, search } = request.nextUrl;

  // ---------------- admin.<domain> ----------------
  if (host === ADMIN_HOST) {
    if (isInternalPath(pathname)) return new NextResponse("Not found", { status: 404 });

    const isPublic = pathname === "/login";
    if (!isPublic && !request.cookies.has(ADMIN_SESSION_COOKIE)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname === "/") return NextResponse.redirect(new URL("/modules", request.url));

    const response = rewriteTo(request, ADMIN_ROUTE_PREFIX);
    // Panel admin jangan sampai masuk index mesin pencari
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  // ---------------- app.<domain> ----------------
  if (host === APP_HOST) {
    if (isInternalPath(pathname)) return new NextResponse("Not found", { status: 404 });

    const needsSession = pathname.startsWith("/dashboard") || pathname.startsWith("/learn");
    if (needsSession && !request.cookies.has(SESSION_COOKIE)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname === "/") return NextResponse.redirect(new URL("/dashboard", request.url));

    return rewriteTo(request, APP_ROUTE_PREFIX);
  }

  // ---------------- domain utama ----------------
  // Folder internal tidak boleh diakses langsung dari domain utama.
  if (pathname === ADMIN_ROUTE_PREFIX || pathname.startsWith(`${ADMIN_ROUTE_PREFIX}/`)) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (pathname === APP_ROUTE_PREFIX || pathname.startsWith(`${APP_ROUTE_PREFIX}/`)) {
    const rest = pathname.slice(APP_ROUTE_PREFIX.length) || "/";
    return NextResponse.redirect(appUrl(rest + search));
  }

  // Shortcut: learnhub.id/dashboard atau /login → pindah ke app subdomain
  if (pathname.startsWith("/dashboard") || pathname === "/login") {
    return NextResponse.redirect(appUrl(pathname + search));
  }
  // Shortcut: learnhub.id/admin → admin subdomain
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.redirect(adminUrl("/login"));
  }

  return NextResponse.next();
}

export const config = {
  // Lewati API (webhook), aset Next.js, dan file statis (favicon, gambar, dll)
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
