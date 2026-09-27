import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/** Token acak yang aman dipakai di URL/cookie */
export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

/**
 * Hash token sebelum disimpan ke database.
 * Kalau database bocor, isinya tidak bisa langsung dipakai untuk login.
 */
export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hmacSha256(secret: string, payload: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/** Bandingkan dua string tanpa membocorkan info lewat waktu eksekusi */
export function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
