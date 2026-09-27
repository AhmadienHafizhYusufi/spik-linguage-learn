import { ArrowRight, Flame, Target } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Highlight } from "@/components/ui/section";
import { LanguageTile } from "./language-tile";
import { languages } from "@/data/landing";

const progress = [
  { code: "ja" as const, label: "Jepang · JLPT N4", value: 62 },
  { code: "en" as const, label: "Inggris · B1", value: 78 },
  { code: "ko" as const, label: "Korea · TOPIK I", value: 34 },
];

function AppPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden>
      {/* Glow */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary-200/60 via-secondary-200/40 to-transparent blur-2xl" />

      {/* Dashboard card */}
      <div className="rounded-2xl bg-white p-5 pb-8 shadow-xl shadow-slate-900/10 ring-1 ring-line sm:mr-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-caption text-muted">Selamat pagi,</p>
            <p className="text-h3 text-ink">Progres minggu ini</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2.5 py-1 text-caption text-warning-700">
            <Flame className="size-3.5" /> 5 hari
          </span>
        </div>

        <ul className="mt-5 space-y-4">
          {progress.map((p) => (
            <li key={p.code} className="flex items-center gap-3">
              <LanguageTile code={p.code} size="sm" />
              <div className="flex-1">
                <div className="flex justify-between text-body-sm">
                  <span className="text-ink">{p.label}</span>
                  <span className="text-muted">{p.value}%</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-surface">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    style={{ width: `${p.value}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center gap-3 rounded-xl bg-primary-50 p-3">
          <Target className="size-5 shrink-0 text-primary-600" />
          <p className="text-body-sm text-primary-900">
            Berikutnya: <span className="font-semibold">Modul 14 — Partikel は vs が</span>
          </p>
        </div>
      </div>

      {/* Flashcard floating */}
      <div className="relative -mt-5 ml-auto w-48 rotate-[3deg] rounded-2xl bg-night p-4 text-white shadow-xl sm:-mr-2">
        <p className="text-caption text-slate-400">Flashcard · Korea</p>
        <p lang="ko" className="mt-2 text-h2">
          안녕하세요
        </p>
        <p className="mt-1 text-body-sm text-slate-300">Halo (sopan)</p>
        <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[11px] font-semibold">
          <span className="rounded bg-error-500/20 py-1 text-red-300">Lupa</span>
          <span className="rounded bg-warning-500/20 py-1 text-yellow-300">Ragu</span>
          <span className="rounded bg-success-500/20 py-1 text-green-300">Ingat</span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Grid pattern halus */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
      />
      <Container className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-caption text-muted ring-1 ring-line">
            <span className="size-1.5 rounded-full bg-success-500" />5 bahasa · 1 kurikulum terstruktur
          </p>

          <h1 className="mt-5 text-display text-ink md:text-[3.25rem]">
            Belajar bahasa asing dengan <Highlight>roadmap yang jelas</Highlight>, bukan sekadar streak.
          </h1>

          <p className="mt-5 max-w-xl text-body text-muted">
            Inggris, Jepang, Mandarin, Jerman, dan Korea — dari nol sampai siap ujian resmi. Setiap
            modul punya tujuan, setiap latihan terukur, semua dijelaskan dalam Bahasa Indonesia.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#harga" size="lg">
              Lihat paket belajar <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="#cara-kerja" size="lg" variant="secondary">
              Cara kerjanya
            </ButtonLink>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex gap-1">
              {languages.map((l) => (
                <LanguageTile key={l.code} code={l.code} size="sm" />
              ))}
            </div>
            <p className="text-body-sm text-muted">
              Target ujian: IELTS, JLPT, HSK, Goethe, TOPIK
            </p>
          </div>
        </div>

        <AppPreview />
      </Container>
    </section>
  );
}
