import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// Catatan: file ini sengaja TIDAK memakai "server-only" supaya bisa dipakai
// oleh script terminal (scripts/create-admin.ts). Jangan import dari komponen client.

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;
const KEY_LENGTH = 64;

/**
 * Hash password dengan scrypt (bawaan Node.js, tidak perlu library tambahan).
 * Hasil: "scrypt$<salt base64>$<hash base64>"
 */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algo, saltB64, hashB64] = stored.split("$");
  if (algo !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scryptAsync(password, Buffer.from(saltB64, "base64"), expected.length);
  return timingSafeEqual(actual, expected);
}

/** Aturan minimal password admin */
export function validatePassword(password: string): string | null {
  if (password.length < 12) return "Password admin minimal 12 karakter";
  return null;
}
