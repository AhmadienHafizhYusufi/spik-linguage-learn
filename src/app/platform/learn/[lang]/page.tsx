import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { languages } from "@/data/landing";
import { publishedCurriculum, requireLanguageAccess } from "@/lib/learn";
import { LanguageTile } from "@/components/landing/language-tile";
import { Container } from "@/components/ui/section";

export const metadata: Metadata = { title: "Materi — LearnHub" };

export default async function LanguagePage({ params }: PageProps<"/platform/learn/[lang]">) {
  const { lang } = await requireLanguageAccess((await params).lang);
  const info = languages.find((l) => l.code === lang)!;
  const modules = (await publishedCurriculum(lang)).filter((m) => m.lessons.length > 0);

  return (
    <Container className="max-w-3xl py-10">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-body-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> Dashboard
      </Link>
      <div className="mt-3 flex items-center gap-4">
        <LanguageTile code={lang} size="lg" />
        <div>
          <h1 className="text-h1 text-ink">{info.name}</h1>
          <p className="text-body-sm text-muted">{info.exams}</p>
        </div>
      </div>

      {modules.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line bg-white p-10 text-center text-body text-muted">
          Materi untuk bahasa ini sedang disiapkan. Kamu akan melihatnya di sini begitu terbit.
        </p>
      ) : (
        <ol className="mt-10 space-y-6">
          {modules.map((m, i) => (
            <li key={m.id} className="rounded-2xl bg-white ring-1 ring-line">
              <div className="border-b border-line p-5">
                <p className="text-caption uppercase tracking-widest text-primary-600">
                  Modul {i + 1} · {m.level}
                </p>
                <h2 className="mt-1 text-h2 text-ink">{m.title}</h2>
                {m.description && <p className="mt-1 text-body-sm text-muted">{m.description}</p>}
              </div>
              <ol>
                {m.lessons.map((l, j) => (
                  <li key={l.id} className="border-t border-line first:border-t-0">
                    <Link href={`/learn/${lang}/${l.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface/60">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface text-caption text-muted">
                        {j + 1}
                      </span>
                      <span className="flex-1 text-body text-ink">{l.title}</span>
                      {l.videoUrl && <PlayCircle className="size-4 text-muted" aria-label="Ada video" />}
                      {l.durationMinutes != null && (
                        <span className="text-body-sm text-muted">{l.durationMinutes} mnt</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      )}
    </Container>
  );
}
