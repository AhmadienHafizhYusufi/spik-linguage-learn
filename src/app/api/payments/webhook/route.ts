import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { fulfillOrder, markOrderStatus } from "@/lib/orders";

/**
 * Endpoint yang dipanggil payment gateway (server ke server) saat status
 * pembayaran berubah. Inilah SATU-SATUNYA tempat order boleh ditandai lunas —
 * bukan dari halaman "sukses" di browser, karena halaman itu bisa dipalsukan.
 */
export async function POST(request: Request) {
  const provider = getPaymentProvider();

  let event;
  try {
    event = await provider.parseWebhook(request);
  } catch (error) {
    console.warn("[webhook] ditolak:", (error as Error).message);
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    if (event.status === "PAID") await fulfillOrder(event.providerRef);
    else if (event.status === "FAILED" || event.status === "EXPIRED")
      await markOrderStatus(event.providerRef, event.status);
  } catch (error) {
    console.error("[webhook] gagal diproses:", error);
    // 500 → gateway akan mencoba mengirim ulang nanti
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
