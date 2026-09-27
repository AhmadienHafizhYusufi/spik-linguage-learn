import { NextResponse, type NextRequest } from "next/server";
import { deleteSession } from "@/lib/auth/session";
import { SESSION_COOKIE, marketingUrl } from "@/lib/domains";

/** POST app.learnhub.id/auth/logout — hapus sesi di DB & cookie, lalu ke landing */
export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(token);

  // 303 → browser mengubah POST menjadi GET saat mengikuti redirect
  const response = NextResponse.redirect(marketingUrl("/"), 303);
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
