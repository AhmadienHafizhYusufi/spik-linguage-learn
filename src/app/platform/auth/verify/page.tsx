import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { AutoSubmit } from "./auto-submit";

export const metadata: Metadata = { title: "Masuk — LearnHub", robots: { index: false } };

/**
 * app.learnhub.id/auth/verify?token=…
 * Halaman ini TIDAK memakai token. Ia hanya menampilkan form yang mengirim
 * token lewat POST ke /auth/verify/confirm — otomatis via JavaScript,
 * atau lewat tombol kalau JavaScript mati.
 */
export default async function VerifyPage({ searchParams }: PageProps<"/platform/auth/verify">) {
  const { token } = await searchParams;
  if (typeof token !== "string" || !token) redirect("/login?error=link");

  return (
    <div className="grid min-h-full place-items-center bg-surface p-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <form
          id="verify-form"
          method="post"
          action="/auth/verify/confirm"
          className="mt-8 rounded-2xl bg-white p-8 ring-1 ring-line"
        >
          <input type="hidden" name="token" value={token} />
          <h1 className="text-h2 text-ink">Sedang masuk…</h1>
          <p className="mt-2 text-body-sm text-muted">Kalau tidak berpindah otomatis, klik tombol di bawah.</p>
          <Button type="submit" size="lg" className="mt-6 w-full">
            Masuk ke dashboard
          </Button>
        </form>
        <AutoSubmit formId="verify-form" />
      </div>
    </div>
  );
}
