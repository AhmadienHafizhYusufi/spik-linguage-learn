import "server-only";
import { db } from "@/lib/db";
import { randomToken, sha256 } from "@/lib/crypto";

/**
 * Token sekali pakai untuk masuk ke app subdomain. Dipakai di dua tempat:
 *   1. Magic link di email (berlaku 15 menit)
 *   2. "Serah terima" otomatis setelah pembayaran sukses (berlaku 2 menit)
 *
 * Token mentah hanya ada di URL; database menyimpan hash-nya.
 */
export async function issueLoginToken(userId: string, ttlMinutes = 15) {
  const token = randomToken();
  await db.loginToken.create({
    data: {
      userId,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + ttlMinutes * 60_000),
    },
  });
  return token;
}

/**
 * Tukar token dengan userId. Mengembalikan null kalau token salah,
 * kedaluwarsa, atau sudah pernah dipakai.
 */
export async function consumeLoginToken(token: string) {
  const tokenHash = sha256(token);
  const now = new Date();

  // updateMany + kondisi usedAt=null → atomik: dua request bersamaan tidak bisa
  // sama-sama berhasil memakai token yang sama.
  const { count } = await db.loginToken.updateMany({
    where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
    data: { usedAt: now },
  });
  if (count === 0) return null;

  const record = await db.loginToken.findUnique({ where: { tokenHash } });
  return record?.userId ?? null;
}
