"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { marketingUrl } from "@/lib/domains";
import { MOCK_SIGNATURE_HEADER, signMockPayload } from "@/lib/payments/mock";
import { mockPaymentNeedsCode } from "@/lib/payments";
import { safeEqual } from "@/lib/crypto";

/**
 * Meniru dua hal yang dilakukan gateway sungguhan setelah user membayar:
 *   1. Mengirim webhook (server → server) ke /api/payments/webhook
 *   2. Mengarahkan browser user ke halaman "finish" (/checkout/success/…)
 */
export async function simulatePayment(formData: FormData) {
  if (process.env.PAYMENT_PROVIDER && process.env.PAYMENT_PROVIDER !== "mock") {
    throw new Error("Simulasi hanya tersedia untuk PAYMENT_PROVIDER=mock");
  }

  const orderId = String(formData.get("orderId"));

  // Di production, simulasi hanya untuk yang tahu MOCK_PAYMENT_CODE
  if (mockPaymentNeedsCode()) {
    const expected = process.env.MOCK_PAYMENT_CODE ?? "";
    const given = String(formData.get("code") ?? "");
    if (!expected || !safeEqual(given, expected)) redirect(`/checkout/mock-pay/${orderId}?error=code`);
  }

  const result = formData.get("result") === "PAID" ? "PAID" : "FAILED";

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order?.providerRef) throw new Error("Order tidak ditemukan");

  const body = JSON.stringify({ providerRef: order.providerRef, status: result });
  const res = await fetch(marketingUrl("/api/payments/webhook"), {
    method: "POST",
    headers: { "content-type": "application/json", [MOCK_SIGNATURE_HEADER]: signMockPayload(body) },
    body,
  });
  if (!res.ok) throw new Error(`Webhook simulasi gagal (${res.status})`);

  redirect(`/checkout/success/${orderId}`);
}
