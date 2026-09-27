import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { randomToken, sha256 } from "@/lib/crypto";
import { ADMIN_SESSION_COOKIE, PROTOCOL, adminUrl } from "@/lib/domains";
import { verifyPassword } from "./password";

/** Sesi admin lebih pendek dari pembeli: 12 jam */
const SESSION_HOURS = 12;
const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;

export const adminCookieOptions = {
  httpOnly: true,
  secure: PROTOCOL === "https",
  // "strict": cookie tidak ikut terkirim dari link di situs lain → lebih aman untuk panel admin
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_HOURS * 60 * 60,
};

export type AdminLoginResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

/**
 * Cek email + password. Setelah 5 kali salah, akun dikunci 15 menit.
 * Pesan error dibuat sama untuk "email tidak ada" dan "password salah".
 */
export async function loginAdmin(email: string, password: string): Promise<AdminLoginResult> {
  const generic = { ok: false as const, error: "Email atau password salah" };
  const admin = await db.admin.findUnique({ where: { email } });

  if (!admin) {
    // Tetap jalankan hash supaya waktu respons mirip → tidak bocor email mana yang terdaftar
    await verifyPassword(password, "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(88));
    return generic;
  }

  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    return { ok: false, error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." };
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    const failed = admin.failedLogins + 1;
    await db.admin.update({
      where: { id: admin.id },
      data:
        failed >= MAX_FAILED_LOGINS
          ? { failedLogins: 0, lockedUntil: new Date(Date.now() + LOCK_MINUTES * 60_000) }
          : { failedLogins: failed },
    });
    return generic;
  }

  await db.admin.update({
    where: { id: admin.id },
    data: { failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() },
  });

  const token = randomToken();
  await db.adminSession.create({
    data: {
      adminId: admin.id,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000),
    },
  });
  return { ok: true, token };
}

export async function logoutAdmin(token: string) {
  await db.adminSession.deleteMany({ where: { tokenHash: sha256(token) } });
}

export const getCurrentAdmin = cache(async () => {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.adminSession.findUnique({
    where: { tokenHash: sha256(token) },
    include: { admin: { select: { id: true, email: true, name: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.admin;
});

/**
 * Penjaga halaman DAN server action admin.
 * PENTING: server action bisa dipanggil langsung lewat HTTP, jadi setiap
 * action yang mengubah data wajib memanggil ini — bukan cuma halamannya.
 */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect(adminUrl("/login"));
  return admin;
}
