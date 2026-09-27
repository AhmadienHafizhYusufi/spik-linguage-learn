import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Perintah CLI (migrate, studio) butuh koneksi LANGSUNG ke database.
    // Di Neon/Supabase: DATABASE_URL = koneksi pooled (untuk aplikasi),
    // DIRECT_URL = koneksi langsung (untuk migrate). Lokal cukup DATABASE_URL.
    url: process.env.DIRECT_URL || env("DATABASE_URL"),
  },
});
