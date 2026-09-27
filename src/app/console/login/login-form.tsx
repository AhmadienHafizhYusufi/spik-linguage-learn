"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { adminLogin, type AdminLoginState } from "./actions";

const inputCls =
  "mt-1.5 block h-12 w-full rounded-xl border border-line px-4 text-body text-ink outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState<AdminLoginState, FormData>(adminLogin, {});

  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="text-ui text-ink">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.email} className={inputCls} />
      </div>
      <div>
        <label htmlFor="password" className="text-ui text-ink">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputCls} />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl bg-error-50 p-3 text-body-sm text-error-700">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Memeriksa…" : "Masuk"}
      </Button>
    </form>
  );
}
