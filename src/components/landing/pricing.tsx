"use client";

import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { plans, type PlanId } from "@/data/landing";
import { Button } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/section";

const options: { id: PlanId; label: string }[] = [
  { id: "bundle", label: "Bundle 5 bahasa" },
  { id: "single", label: "Satu bahasa" },
];

export function Pricing() {
  const [plan, setPlan] = useState<PlanId>("bundle");
  const current = plans[plan];

  return (
    <section id="harga" className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Harga"
          title="Sekali bayar, tanpa langganan"
          description="Pilih semua bahasa sekaligus, atau mulai dari satu bahasa dulu dan upgrade kapan saja."
        />

        {/* Toggle Bundle vs Satu Bahasa (memvalidasi RQ4 lewat klik nyata) */}
        <div
          role="radiogroup"
          aria-label="Pilih jenis paket"
          className="mx-auto mt-10 flex w-fit rounded-xl bg-surface p-1 ring-1 ring-line"
        >
          {options.map((o) => {
            const active = plan === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPlan(o.id)}
                className={`rounded-lg px-4 py-2 text-ui transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 ${
                  active ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-lg rounded-3xl bg-white p-8 shadow-xl shadow-slate-900/5 ring-1 ring-line">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-h2 text-ink">{current.name}</h3>
              <p className="mt-1 text-body-sm text-muted">{current.note}</p>
            </div>
            {plan === "bundle" && (
              <span className="rounded-full bg-secondary-50 px-3 py-1 text-caption text-secondary-700">
                Paling hemat
              </span>
            )}
          </div>

          <p className="mt-6 text-display text-ink">{current.price}</p>
          <p className="text-body-sm text-muted">Harga final segera diumumkan</p>

          <ul className="mt-8 space-y-3">
            {current.perks.map((perk) => (
              <li key={perk} className="flex gap-3 text-body text-ink">
                <Check className="mt-1 size-4 shrink-0 text-success-700" aria-hidden />
                {perk}
              </li>
            ))}
          </ul>

          {/* TODO: arahkan ke halaman order / checkout saat sudah ada */}
          <Button size="lg" className="mt-8 w-full">
            {current.cta}
          </Button>

          <p className="mt-4 flex items-center justify-center gap-2 text-body-sm text-muted">
            <ShieldCheck className="size-4" aria-hidden /> Pembayaran aman · akses dikirim via email
          </p>
        </div>
      </Container>
    </section>
  );
}
