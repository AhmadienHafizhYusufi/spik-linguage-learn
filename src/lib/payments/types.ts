/**
 * Kontrak payment gateway. Setiap provider (mock, Midtrans, Xendit, …)
 * cukup mengimplementasikan dua fungsi ini — sisa aplikasi tidak perlu berubah.
 */

export type CreatePaymentInput = {
  orderId: string;
  amount: number;
  description: string;
  customer: { name: string; email: string; phone: string };
  /** URL tujuan user setelah selesai di halaman pembayaran */
  finishUrl: string;
};

export type CreatePaymentResult = {
  /** Halaman pembayaran milik gateway (Snap Midtrans, Invoice Xendit, …) */
  redirectUrl: string;
  /** ID transaksi di sisi gateway, disimpan di Order.providerRef */
  providerRef: string;
};

export type WebhookEvent = {
  providerRef: string;
  status: "PAID" | "FAILED" | "EXPIRED" | "PENDING";
};

export interface PaymentProvider {
  name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  /**
   * Validasi & baca notifikasi dari gateway.
   * WAJIB memverifikasi tanda tangan — tanpa ini siapa saja bisa
   * menembak endpoint webhook dan "melunasi" order gratis.
   * Lempar error kalau tanda tangan tidak valid.
   */
  parseWebhook(request: Request): Promise<WebhookEvent>;
}
