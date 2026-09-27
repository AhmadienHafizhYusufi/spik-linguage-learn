import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/admin/session";
import { appUrl } from "@/lib/domains";
import { Container } from "@/components/ui/section";
import { adminLogout } from "../login/actions";

export const metadata: Metadata = {
  title: { default: "Admin — LearnHub", template: "%s · Admin LearnHub" },
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: LayoutProps<"/console">) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-full bg-surface">
      {/* Header gelap → visual pembeda jelas dari app pembeli */}
      <header className="bg-night text-white">
        <Container className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/modules" className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-md bg-gradient-to-br from-primary-500 to-secondary-600 text-xs font-bold">
                L
              </span>
              <span className="text-ui">LearnHub</span>
              <span className="rounded bg-warning-500 px-1.5 py-0.5 text-[11px] font-bold text-night">ADMIN</span>
            </Link>
            <nav aria-label="Navigasi admin">
              <Link href="/modules" className="rounded-md px-2 py-1 text-ui text-slate-300 hover:bg-white/10 hover:text-white">
                Modul
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={appUrl("/dashboard")}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1 rounded-md px-2 py-1 text-body-sm text-slate-300 hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Lihat app <ExternalLink className="size-3.5" aria-hidden />
            </a>
            <span className="hidden text-body-sm text-slate-400 md:inline">{admin.email}</span>
            <form action={adminLogout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-body-sm text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4" aria-hidden /> Keluar
              </button>
            </form>
          </div>
        </Container>
      </header>
      <Container className="py-8">{children}</Container>
    </div>
  );
}
