import "server-only";
import { mockProvider } from "./mock";
import type { PaymentProvider } from "./types";

/**
 * Pilih provider dari env PAYMENT_PROVIDER.
 * Untuk menambah Midtrans: buat src/lib/payments/midtrans.ts yang
 * mengimplementasikan PaymentProvider, lalu daftarkan di sini.
 */
const providers: Record<string, PaymentProvider> = {
  mock: mockProvider,
  // midtrans: midtransProvider,
  // xendit: xenditProvider,
};

export function getPaymentProvider(): PaymentProvider {
  const name = process.env.PAYMENT_PROVIDER ?? "mock";
  const provider = providers[name];
  if (!provider) throw new Error(`Payment provider "${name}" belum diimplementasikan`);
  if (name === "mock" && isProduction() && !process.env.MOCK_PAYMENT_CODE) {
    throw new Error("Mock payment di production wajib memakai MOCK_PAYMENT_CODE");
  }
  return provider;
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 * Di server publik (production), tombol "Bayar (simulasi)" dikunci dengan kode.
 * Tanpa ini, siapa pun yang menemukan URL-nya bisa dapat akses gratis.
 */
export function mockPaymentNeedsCode() {
  return isProduction();
}

export type { PaymentProvider } from "./types";
