/**
 * Buat (atau reset password) akun admin dari terminal.
 *
 *   npm run admin:create
 *
 * Tidak ada halaman pendaftaran admin di web — ini satu-satunya cara
 * membuat admin, jadi hanya orang yang punya akses ke server/database yang bisa.
 */
import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword, validatePassword } from "../src/lib/admin/password";

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });

  // Bisa juga lewat env: ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD (berguna untuk CI)
  const email = (process.env.ADMIN_EMAIL ?? (await rl.question("Email admin   : "))).trim().toLowerCase();
  const name = (process.env.ADMIN_NAME ?? (await rl.question("Nama          : "))).trim();
  const password = process.env.ADMIN_PASSWORD ?? (await rl.question("Password (min 12 karakter): "));
  rl.close();

  if (!email.includes("@")) throw new Error("Email tidak valid");
  if (!name) throw new Error("Nama wajib diisi");
  const passwordError = validatePassword(password);
  if (passwordError) throw new Error(passwordError);

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const passwordHash = await hashPassword(password);

  const admin = await db.admin.upsert({
    where: { email },
    update: { name, passwordHash, failedLogins: 0, lockedUntil: null },
    create: { email, name, passwordHash },
  });
  // Reset password → keluarkan semua sesi lama
  await db.adminSession.deleteMany({ where: { adminId: admin.id } });
  await db.$disconnect();

  console.log(`\n✔ Admin siap: ${admin.email}`);
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const adminHost = process.env.NEXT_PUBLIC_ADMIN_HOST || `admin.${root}`;
  const protocol = adminHost.includes("localhost") ? "http" : "https";
  console.log(`  Login di: ${protocol}://${adminHost}/login\n`);
}

main().catch((error) => {
  console.error(`\n✖ ${error.message}\n`);
  process.exit(1);
});
