import "server-only";
import { hmacSha256, safeEqual } from "@/lib/crypto";
import { marketingUrl } from "@/lib/domains";
import type { PaymentProvider, WebhookEvent } from "./types";

export const MOCK_SIGNATURE_HEADER = "x-mock-signature";

function secret() {
  const value = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!value) throw new Error("PAYMENT_WEBHOOK_SECRET belum diisi di .env");
  return value;
}

/** Tanda tangan payload — meniru cara gateway sungguhan menandatangani webhook */
export function signMockPayload(body: string) {
  return hmacSha256(secret(), body);
}

/**
 * Gateway palsu untuk development.
 * Halaman bayarnya ada di /checkout/mock-pay/[orderId] dan mengirim webhook
 * bertanda tangan ke /api/payments/webhook — alurnya sama dengan gateway asli.
 */
export const mockProvider: PaymentProvider = {
  name: "mock",

  async createPayment({ orderId }) {
    return {
      providerRef: `mock_${orderId}`,
      redirectUrl: marketingUrl(`/checkout/mock-pay/${orderId}`),
    };
  },

  async parseWebhook(request) {
    const body = await request.text();
    const signature = request.headers.get(MOCK_SIGNATURE_HEADER) ?? "";
    if (!safeEqual(signature, signMockPayload(body))) {
      throw new Error("Tanda tangan webhook tidak valid");
    }
    return JSON.parse(body) as WebhookEvent;
  },
};
