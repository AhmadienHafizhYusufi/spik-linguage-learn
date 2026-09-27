"use client";

import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export const inputCls =
  "mt-1.5 block w-full rounded-lg border border-line bg-white px-3 py-2.5 text-body text-ink outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 aria-invalid:border-error-500";

export function FieldWrap({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-ui text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-body-sm text-muted">{hint}</p>}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-body-sm text-error-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  name,
  error,
  hint,
  ...props
}: { label: string; name: string; error?: string; hint?: ReactNode } & ComponentProps<"input">) {
  return (
    <FieldWrap label={label} name={name} error={error} hint={hint}>
      <input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputCls}
        {...props}
      />
    </FieldWrap>
  );
}

export function PublishToggle({ defaultChecked }: { defaultChecked: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-white p-3">
      <input type="checkbox" name="published" defaultChecked={defaultChecked} className="mt-1 size-4 accent-primary-600" />
      <span>
        <span className="block text-ui text-ink">Terbitkan</span>
        <span className="text-body-sm text-muted">Kalau tidak dicentang, tersimpan sebagai draft dan tidak terlihat pembeli.</span>
      </span>
    </label>
  );
}

export function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Menyimpan…" : children}
    </Button>
  );
}

export function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="rounded-full bg-success-50 px-2 py-0.5 text-caption text-success-700">Terbit</span>
  ) : (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-caption text-slate-600">Draft</span>
  );
}

export function FormMessage({ saved, error }: { saved?: boolean; error?: string }) {
  if (error)
    return (
      <p role="alert" className="rounded-lg bg-error-50 p-3 text-body-sm text-error-700">
        {error}
      </p>
    );
  if (saved)
    return (
      <p role="status" className="rounded-lg bg-success-50 p-3 text-body-sm text-success-700">
        Tersimpan.
      </p>
    );
  return null;
}

/** Tombol hapus dengan konfirmasi browser */
export function DeleteButton({
  action,
  id,
  label,
  confirmText,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label: string;
  confirmText: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex h-10 items-center rounded-xl px-4 text-ui text-error-700 ring-1 ring-error-500/30 hover:bg-error-50"
      >
        {label}
      </button>
    </form>
  );
}
