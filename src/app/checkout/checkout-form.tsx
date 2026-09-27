"use client";

import { useActionState } from "react";
import { languages, type PlanId } from "@/data/landing";
import { Button } from "@/components/ui/button";
import { createOrder, type CheckoutState } from "./actions";

const inputCls =
  "mt-1.5 block h-12 w-full rounded-xl border border-line bg-white px-4 text-body text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 aria-invalid:border-error-500";

function Field({
  label,
  name,
  error,
  ...props
}: { label: string; name: string; error?: string } & React.ComponentProps<"input">) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="text-ui text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={inputCls}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-body-sm text-error-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckoutForm({ plan }: { plan: PlanId }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(createOrder, {});
  const v = state.values ?? {};
  const e = state.errors ?? {};

  return (
    <form action={action} className="mt-8 space-y-5" noValidate>
      <input type="hidden" name="plan" value={plan} />

      {plan === "single" && (
        <fieldset>
          <legend className="text-ui text-ink">Pilih bahasa</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {languages.map((l) => (
              <label
                key={l.code}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-line p-3 text-body-sm text-ink has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
              >
                <input
                  type="radio"
                  name="language"
                  value={l.code}
                  defaultChecked={v.language === l.code}
                  className="accent-primary-600"
                />
                {l.name}
              </label>
            ))}
          </div>
          {e.language && <p className="mt-1.5 text-body-sm text-error-700">{e.language}</p>}
        </fieldset>
      )}

      <Field label="Nama lengkap" name="name" autoComplete="name" defaultValue={v.name} error={e.name} />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        defaultValue={v.email}
        error={e.email}
      />
      <Field
        label="Nomor WhatsApp"
        name="phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder="0812xxxxxxx"
        defaultValue={v.phone}
        error={e.phone}
      />

      {e.form && (
        <p role="alert" className="rounded-xl bg-error-50 p-3 text-body-sm text-error-700">
          {e.form}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Memproses…" : "Lanjut ke pembayaran"}
      </Button>
    </form>
  );
}
