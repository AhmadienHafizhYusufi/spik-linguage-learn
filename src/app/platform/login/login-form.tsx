"use client";

import { useActionState } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestMagicLink, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(requestMagicLink, {});

  if (state.sent) {
    return (
      <div className="mt-6 rounded-xl bg-success-50 p-4 text-body-sm text-success-700">
        <MailCheck className="mb-2 size-5" aria-hidden />
        Kalau email itu terdaftar sebagai pembeli, link masuk sudah kami kirim. Cek inbox (dan folder spam).
        {state.devLink && (
          <a href={state.devLink} className="mt-3 block break-all font-semibold underline">
            [dev] Buka link masuk
          </a>
        )}
      </div>
    );
  }

  return (
    <form action={action} className="mt-6 space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="text-ui text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={!!state.error}
          className="mt-1.5 block h-12 w-full rounded-xl border border-line px-4 text-body text-ink outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
        {state.error && <p className="mt-1.5 text-body-sm text-error-700">{state.error}</p>}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Mengirim…" : "Kirim link masuk"}
      </Button>
    </form>
  );
}
