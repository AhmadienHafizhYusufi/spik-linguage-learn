import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { db } from "@/lib/db";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { AutoRefresh } from "./auto-refresh";
import { AutoContinue } from "./auto-continue";

export const metadata: Metadata = { title: "Status pembayaran — LearnHub" };

/** Samarkan email: budi.santoso@gmail.com → bu***@gmail.com */
function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
}

/**
 * Halaman "finish" — tujuan browser setelah keluar dari halaman pembayaran.
 * Halaman ini hanya MEMBACA status order. Yang mengubah status adalah webhook.
 * Kalau webhook belum datang, halaman ini menunggu dan memuat ulang otomatis.
 */
export default async function SuccessPage({ params }: PageProps<"/checkout/success/[orderId]">) {
  const { orderId } = await params;
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, customerEmail: true },
  });
  if (!order) notFound();

  const continueHref = `/checkout/success/${order.id}/continue`;

  return (
    <div className="grid min-h-full place-items-center bg-surface p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center ring-1 ring-line">
        {order.status === "PAID" && (
          <>
            <CheckCircle2 className="mx-auto size-12 text-success-500" aria-hidden />
            <h1 className="mt-4 text-h1 text-ink">Pembayaran berhasil</h1>
            <p className="mt-2 text-body text-muted">
              Kami juga mengirim link masuk ke <strong className="text-ink">{maskEmail(order.customerEmail)}</strong>.
              Mengarahkan ke dashboard…
            </p>
            {/* <a> biasa, BUKAN <Link>: di production <Link> mem-prefetch tujuannya,
                dan prefetch akan "memakai" token serah terima yang sekali pakai. */}
            <a href={continueHref} className={buttonClass("primary", "lg", "mt-6 w-full")}>
              Buka dashboard
            </a>
            <AutoContinue href={continueHref} />
          </>
        )}

        {order.status === "PENDING" && (
          <>
            <Clock className="mx-auto size-12 text-warning-500" aria-hidden />
            <h1 className="mt-4 text-h1 text-ink">Menunggu konfirmasi pembayaran</h1>
            <p className="mt-2 text-body text-muted">
              Halaman ini akan diperbarui otomatis. Untuk transfer bank/VA, konfirmasi bisa butuh beberapa menit.
            </p>
            <AutoRefresh />
          </>
        )}

        {(order.status === "FAILED" || order.status === "EXPIRED") && (
          <>
            <XCircle className="mx-auto size-12 text-error-500" aria-hidden />
            <h1 className="mt-4 text-h1 text-ink">Pembayaran tidak berhasil</h1>
            <p className="mt-2 text-body text-muted">Tidak ada dana yang ditarik. Silakan coba lagi.</p>
            <ButtonLink href="/#harga" size="lg" className="mt-6 w-full">
              Coba lagi
            </ButtonLink>
          </>
        )}

        <Link href="/" className="mt-4 inline-block text-body-sm text-muted hover:text-ink">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
