import { navLinks } from "@/data/landing";
import { Container } from "@/components/ui/section";
import { Logo } from "./navbar";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white pt-12 pb-24 md:pb-12">
      <Container className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-body-sm text-muted">
            Platform belajar 5 bahasa dengan kurikulum terstruktur untuk pelajar Indonesia.
          </p>
        </div>
        <nav aria-label="Navigasi footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-body-sm text-muted hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="mt-10 border-t border-line pt-6">
        <p className="text-caption text-muted">© {new Date().getFullYear()} LearnHub. Semua hak dilindungi.</p>
      </Container>
    </footer>
  );
}
