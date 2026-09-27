import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { safeEqual, sha256 } from "@/lib/crypto";
import { CHECKOUT_COOKIE, appUrl } from "@/lib/domains";
import { issueLoginToken } from "@/lib/auth/login-token";

/**
 * SERAH TERIMA domain utama → app subdomain.
 *
 * Cookie di learnhub.id tidak bisa dibaca app.learnhub.id (dan sebaliknya).
 * Jadi kita tidak "memindahkan" cookie — kita buat token sekali pakai
 * berumur 2 menit, lalu redirect ke:
 *
 *   https://app.learnhub.id/auth/verify?token=…
 *
 * Di sana token ditukar dengan cookie sesi milik app subdomain.
 * Inilah momen domain di address bar berubah, seperti di Volingo.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/checkout/success/[orderId]/continue">) {
  const { orderId } = await ctx.params;
  const secret = request.cookies.get(CHECKOUT_COOKIE)?.value;

  const order = await db.order.findUnique({ where: { id: orderId } });

  const canHandoff =
    order &&
    order.status === "PAID" &&
    order.userId &&
    !order.handoffUsedAt &&
    secret &&
    safeEqual(sha256(secret), order.checkoutSecretHash);

  if (!canHandoff) {
    // Browser berbeda / link dibagikan / sudah dipakai → login lewat email saja.
    return NextResponse.redirect(appUrl("/login?from=checkout"));
  }

  // Tandai sudah dipakai (atomik) supaya URL ini tidak bisa dipakai dua kali.
  const { count } = await db.order.updateMany({
    where: { id: order.id, handoffUsedAt: null },
    data: { handoffUsedAt: new Date() },
  });
  if (count === 0) return NextResponse.redirect(appUrl("/login?from=checkout"));

  const token = await issueLoginToken(order.userId!, 2);
  const response = NextResponse.redirect(appUrl(`/auth/verify?token=${token}`));
  response.cookies.delete({ name: CHECKOUT_COOKIE, path: "/checkout" });
  return response;
}
