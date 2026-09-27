import { NextResponse, type NextRequest } from "next/server";
import { consumeLoginToken } from "@/lib/auth/login-token";
import { createSession, sessionCookieOptions } from "@/lib/auth/session";
import { SESSION_COOKIE, appUrl } from "@/lib/domains";

/**
 * POST app.learnhub.id/auth/verify/confirm  (body: token=…)
 * Tukar token sekali pakai dengan cookie sesi di app subdomain.
 *
 * Kenapa POST, bukan langsung di GET /auth/verify?token=… ?
 * Pemindai keamanan email (Outlook, Gmail) dan prefetch browser sering
 * membuka link (GET) lebih dulu. Kalau token dipakai di GET, token hangus
 * sebelum pemilik aslinya sempat mengklik.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const token = String(form.get("token") ?? "");
  const userId = token ? await consumeLoginToken(token) : null;

  // 303 → browser mengikuti redirect dengan GET
  if (!userId) return NextResponse.redirect(appUrl("/login?error=link"), 303);

  const sessionToken = await createSession(userId);
  const response = NextResponse.redirect(appUrl("/dashboard"), 303);
  response.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions);
  return response;
}
