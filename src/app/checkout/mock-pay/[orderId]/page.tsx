import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatRupiah } from "@/lib/plans";
import { plans } from "@/data/landing";
import { Button } from "@/components/ui/button";
import { mockPaymentNeedsCode } from "@/lib/payments";
import { simulatePayment } from "./actions";

export const metadata: Metadata = { title: "Simulasi pembayaran" };

/**
 * Halaman ini MENIRU halaman pembayaran milik gateway (Snap Midtrans, dsb).
 * Di production dengan gateway asli, halaman ini tidak dipakai sama sekali.
 */
export default async function MockPayPage({
  params,
  searchParams,
}: PageProps<"/checkout/mock-pay/[orderId]">) {
  if (process.env.PAYMENT_PROVIDER && process.env.PAYMENT_PROVIDER !== "mock") notFound();

  const { orderId } = await params;
  const { error } = await searchParams;
  const needsCode = mockPaymentNeedsCode();
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) notFound();

  return (
    <div className="grid min-h-full place-items-center bg-slate-100 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-line">
        <div className="bg-warning-50 px-5 py-2 text-center text-caption text-warning-700">
          MODE SIMULASI — tidak ada uang yang ditarik
        </div>
        <div className="p-6">
          <p className="text-caption uppercase tracking-widest text-muted">Mock Payment Gateway</p>
          <p className="mt-4 text-body-sm text-muted">{plans[order.plan].name}</p>
          <p className="text-display text-ink">{formatRupiah(order.amount)}</p>
          <p className="mt-1 text-body-sm text-muted">Order {order.id}</p>

          {order.status === "PENDING" ? (
            <form action={simulatePayment} className="mt-8 space-y-2">
              <input type="hidden" name="orderId" value={order.id} />
              {needsCode && (
                <div className="mb-4">
                  <label htmlFor="code" className="text-ui text-ink">
                    Kode simulasi
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="password"
                    autoComplete="off"
                    required
                    className="mt-1.5 block h-11 w-full rounded-xl border border-line px-3 text-body outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                  <p className="mt-1 text-body-sm text-muted">Server publik: hanya tim yang tahu kode ini bisa mensimulasikan bayar.</p>
                  {error === "code" && <p className="mt-1 text-body-sm text-error-700">Kode salah.</p>}
                </div>
              )}
              <Button type="submit" name="result" value="PAID" size="lg" className="w-full">
                Bayar (simulasi berhasil)
              </Button>
              <Button type="submit" name="result" value="FAILED" variant="secondary" size="lg" className="w-full">
                Simulasi gagal
              </Button>
            </form>
          ) : (
            <p className="mt-8 rounded-xl bg-surface p-3 text-body-sm text-ink">
              Status order: <strong>{order.status}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
