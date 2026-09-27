import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { plans, type PlanId } from "@/data/landing";
import { PLAN_PRICES, formatRupiah } from "@/lib/plans";
import { Logo } from "@/components/landing/navbar";
import { Container } from "@/components/ui/section";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Checkout — LearnHub" };

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const { plan: planParam } = await searchParams;
  const plan: PlanId = planParam === "single" ? "single" : "bundle";
  const current = plans[plan];

  return (
    <div className="min-h-full bg-surface">
      <header className="border-b border-line bg-white">
        <Container className="flex h-16 items-center justify-between">
          <Logo />
          <Link href="/#harga" className="inline-flex items-center gap-1 text-ui text-muted hover:text-ink">
            <ArrowLeft className="size-4" /> Kembali
          </Link>
        </Container>
      </header>

      <Container className="grid gap-8 py-10 md:py-16 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-2xl bg-white p-6 ring-1 ring-line md:p-8">
          <h1 className="text-h1 text-ink">Data pemesan</h1>
          <p className="mt-2 text-body text-muted">
            Akses dikirim ke email ini. Pastikan alamatnya benar.
          </p>
          <CheckoutForm plan={plan} />
        </section>

        <aside className="h-fit rounded-2xl bg-white p-6 ring-1 ring-line md:p-8">
          <p className="text-caption uppercase tracking-widest text-muted">Ringkasan</p>
          <h2 className="mt-2 text-h2 text-ink">{current.name}</h2>
          <p className="text-body-sm text-muted">{current.note}</p>

          <ul className="mt-6 space-y-2">
            {current.perks.map((perk) => (
              <li key={perk} className="flex gap-2 text-body-sm text-ink">
                <Check className="mt-0.5 size-4 shrink-0 text-success-700" aria-hidden />
                {perk}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-baseline justify-between border-t border-line pt-6">
            <span className="text-body text-muted">Total</span>
            <span className="text-h1 text-ink">{formatRupiah(PLAN_PRICES[plan])}</span>
          </div>

          <p className="mt-4 flex items-center gap-2 text-body-sm text-muted">
            <ShieldCheck className="size-4 shrink-0" aria-hidden /> Pembayaran diproses oleh payment gateway
          </p>

          {plan === "bundle" ? (
            <Link href="/checkout?plan=single" className="mt-4 block text-body-sm text-primary-700 hover:underline">
              Mau satu bahasa saja?
            </Link>
          ) : (
            <Link href="/checkout?plan=bundle" className="mt-4 block text-body-sm text-primary-700 hover:underline">
              Ambil semua 5 bahasa?
            </Link>
          )}
        </aside>
      </Container>
    </div>
  );
}
