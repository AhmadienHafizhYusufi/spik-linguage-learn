import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getCurrentAdmin } from "@/lib/admin/session";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin — LearnHub",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect("/modules");

  return (
    <div className="grid min-h-full place-items-center bg-night p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 text-sm font-bold">
            L
          </span>
          <span className="text-h3">LearnHub</span>
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-caption text-slate-300">Admin</span>
        </div>
        <div className="mt-8 rounded-2xl bg-white p-6 md:p-8">
          <h1 className="text-h2 text-ink">Masuk panel admin</h1>
          <p className="mt-2 flex items-center gap-2 text-body-sm text-muted">
            <ShieldCheck className="size-4" aria-hidden /> Khusus pengelola konten
          </p>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
