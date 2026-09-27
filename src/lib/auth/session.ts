import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { randomToken, sha256 } from "@/lib/crypto";
import { appUrl, marketingUrl, PROTOCOL, SESSION_COOKIE } from "@/lib/domains";

const SESSION_DAYS = 30;

/**
 * Opsi cookie sesi.
 * Tidak ada atribut `domain` → cookie hanya berlaku di host yang membuatnya
 * (app.learnhub.id), tidak ikut terkirim ke learnhub.id.
 */
export const sessionCookieOptions = {
  httpOnly: true, // tidak bisa dibaca JavaScript di browser
  secure: PROTOCOL === "https",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};

/** Buat sesi baru di database. Kembalikan token mentah untuk disimpan di cookie. */
export async function createSession(userId: string) {
  const token = randomToken();
  await db.session.create({
    data: {
      userId,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
    },
  });
  return token;
}

export async function deleteSession(token: string) {
  await db.session.deleteMany({ where: { tokenHash: sha256(token) } });
}

/**
 * User yang sedang login, beserta bahasa yang sudah dibeli.
 * `cache` → dipanggil berkali-kali dalam satu request tetap hanya 1 query.
 */
export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: { include: { entitlements: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;

  return session.user;
});

/**
 * Penjaga halaman app. Panggil di setiap page/layout yang butuh akses berbayar.
 *   - belum login        → halaman login app
 *   - login tapi belum beli → kembali ke bagian harga di landing
 */
export async function requirePaidUser() {
  const user = await getCurrentUser();
  if (!user) redirect(appUrl("/login"));
  if (user.entitlements.length === 0) redirect(marketingUrl("/#harga"));
  return user;
}
