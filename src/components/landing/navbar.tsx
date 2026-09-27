"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/landing";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="LearnHub — beranda">
      <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 text-sm font-bold text-white">
        L
      </span>
      <span className={`text-h3 ${inverse ? "text-white" : "text-ink"}`}>LearnHub</span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/85 backdrop-blur transition-colors ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-ui text-muted transition-colors hover:bg-surface hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="#harga" className="hidden sm:inline-flex">
            Mulai belajar
          </ButtonLink>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg text-ink hover:bg-surface md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Navigasi mobile" className="border-t border-line bg-white md:hidden">
          <Container className="py-3">
            <ul className="flex flex-col">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-ui text-ink hover:bg-surface"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <ButtonLink href="#harga" onClick={() => setOpen(false)} className="mt-3 w-full">
              Mulai belajar
            </ButtonLink>
          </Container>
        </nav>
      )}
    </header>
  );
}
