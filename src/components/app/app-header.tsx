import { LogOut } from "lucide-react";
import { Logo } from "@/components/landing/navbar";
import { Container } from "@/components/ui/section";

/** Header untuk halaman app pembeli (dashboard & belajar) */
export function AppHeader({ email }: { email: string }) {
  return (
    <header className="border-b border-line bg-white">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          <span className="hidden text-body-sm text-muted sm:inline">{email}</span>
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-ui text-muted hover:bg-surface hover:text-ink"
            >
              <LogOut className="size-4" aria-hidden /> Keluar
            </button>
          </form>
        </div>
      </Container>
    </header>
  );
}
