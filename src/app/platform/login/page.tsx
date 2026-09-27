import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { marketingUrl } from "@/lib/domains";
import { Logo } from "@/components/landing/navbar";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Masuk — LearnHub" };

const notices: Record<string, string> = {
  link: "Link masuk sudah kedaluwarsa atau sudah pernah dipakai. Minta link baru di bawah.",
  checkout: "Pembayaran kamu sudah kami terima. Masukkan email yang dipakai saat order untuk menerima link masuk.",
};

export default async function LoginPage({ searchParams }: PageProps<"/platform/login">) {
  const user = await getCurrentUser();
  if (user && user.entitlements.length > 0) redirect("/dashboard");

  const { error, from } = await searchParams;
  const notice =
    (typeof error === "string" && notices[error]) || (from === "checkout" ? notices.checkout : undefined);

  return (
    <div className="grid min-h-full place-items-center bg-surface p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-line md:p-8">
          <h1 className="text-h2 text-ink">Masuk ke LearnHub</h1>
          <p className="mt-2 text-body-sm text-muted">
            Tanpa password. Kami kirim link masuk ke email yang kamu pakai saat membeli.
          </p>
          {notice && (
            <p className="mt-4 rounded-xl bg-primary-50 p-3 text-body-sm text-primary-900">{notice}</p>
          )}
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-body-sm text-muted">
          Belum punya akses?{" "}
          <a href={marketingUrl("/#harga")} className="font-semibold text-primary-700 hover:underline">
            Lihat paket
          </a>
        </p>
      </div>
    </div>
  );
}
