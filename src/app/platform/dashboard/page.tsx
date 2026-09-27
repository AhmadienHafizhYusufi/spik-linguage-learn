import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { requirePaidUser } from "@/lib/auth/session";
import { publishedLessonCounts } from "@/lib/learn";
import { marketingUrl } from "@/lib/domains";
import { languages } from "@/data/landing";
import { LanguageTile } from "@/components/landing/language-tile";
import { Container } from "@/components/ui/section";

export const metadata: Metadata = { title: "Dashboard — LearnHub" };

export default async function DashboardPage() {
  // Dicek lagi di page (bukan cuma di layout): layout tidak selalu dijalankan
  // ulang saat navigasi antar halaman, jadi setiap halaman menjaga dirinya sendiri.
  const user = await requirePaidUser();
  const owned = new Set(user.entitlements.map((e) => e.language));
  const lessonCounts = await publishedLessonCounts();
  const firstName = user.name.split(" ")[0];
  // Bahasa yang sudah dibeli tampil duluan
  const sorted = [...languages].sort((a, b) => Number(owned.has(b.code)) - Number(owned.has(a.code)));

  return (
    <Container className="py-10 md:py-14">
      <p className="text-body-sm text-muted">Selamat datang,</p>
      <h1 className="text-h1 text-ink">Halo, {firstName}</h1>
      <p className="mt-2 text-body text-muted">
        Kamu punya akses ke {owned.size} bahasa. Pilih bahasa untuk mulai belajar.
      </p>

      <h2 className="mt-10 text-h2 text-ink">Bahasa kamu</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((l) => {
          const unlocked = owned.has(l.code);
          return (
            <li
              key={l.code}
              className={`flex flex-col rounded-2xl bg-white p-5 ring-1 ring-line ${unlocked ? "" : "opacity-60"}`}
            >
              <div className="flex items-center gap-3">
                <LanguageTile code={l.code} size="md" />
                <div className="flex-1">
                  <h3 className="text-h3 text-ink">{l.name}</h3>
                  <p className="text-body-sm text-muted">{l.exams}</p>
                </div>
                {!unlocked && <Lock className="size-4 text-muted" aria-label="Terkunci" />}
              </div>

              {unlocked ? (
                <>
                  <p className="mt-5 text-body-sm text-muted">
                    {lessonCounts[l.code] ? `${lessonCounts[l.code]} lesson tersedia` : "Materi sedang disiapkan"}
                  </p>
                  <Link
                    href={`/learn/${l.code}`}
                    className="mt-3 inline-flex items-center gap-1 text-ui text-primary-700 hover:underline"
                  >
                    Buka materi <ArrowRight className="size-4" />
                  </Link>
                </>
              ) : (
                <a
                  href={marketingUrl("/checkout?plan=bundle")}
                  className="mt-5 text-ui text-primary-700 hover:underline"
                >
                  Buka dengan Bundle 5 bahasa
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
