import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { publishedCurriculum, requireLanguageAccess } from "@/lib/learn";
import { youtubeEmbedUrl, youtubeId } from "@/lib/content";
import { Markdown } from "@/components/markdown";
import { Container } from "@/components/ui/section";

export const metadata: Metadata = { title: "Belajar — LearnHub" };

export default async function LessonPage({ params }: PageProps<"/platform/learn/[lang]/[lessonId]">) {
  const { lang: langParam, lessonId } = await params;
  const { lang } = await requireLanguageAccess(langParam);

  const lesson = await db.lesson.findFirst({
    // Lesson harus terbit, modulnya terbit, DAN bahasanya sesuai URL.
    // Tanpa syarat bahasa, pembeli Korea bisa membuka lesson Jepang dengan menebak ID.
    where: { id: lessonId, published: true, module: { published: true, language: lang } },
    include: { module: { select: { title: true, level: true } } },
  });
  if (!lesson) notFound();

  // Urutan seluruh lesson dalam bahasa ini → tombol sebelumnya / berikutnya
  const flat = (await publishedCurriculum(lang)).flatMap((m) => m.lessons);
  const index = flat.findIndex((l) => l.id === lesson.id);
  const prev = index > 0 ? flat[index - 1] : null;
  const next = index >= 0 && index < flat.length - 1 ? flat[index + 1] : null;

  const videoId = lesson.videoUrl ? youtubeId(lesson.videoUrl) : null;

  return (
    <Container className="max-w-3xl py-10">
      <Link href={`/learn/${lang}`} className="inline-flex items-center gap-1 text-body-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> {lesson.module.title}
      </Link>
      <p className="mt-4 text-caption uppercase tracking-widest text-primary-600">
        {lesson.module.level}
        {lesson.durationMinutes != null && ` · ${lesson.durationMinutes} menit`}
      </p>
      <h1 className="mt-1 text-h1 text-ink">{lesson.title}</h1>

      {videoId && (
        <div className="mt-6 aspect-video overflow-hidden rounded-2xl bg-night ring-1 ring-line">
          <iframe
            src={youtubeEmbedUrl(videoId)}
            title={lesson.title}
            className="size-full"
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <article className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-line md:p-8">
        <Markdown lang={lang}>{lesson.content}</Markdown>
      </article>

      <nav aria-label="Navigasi lesson" className="mt-6 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={`/learn/${lang}/${prev.id}`} className="rounded-2xl bg-white p-4 ring-1 ring-line hover:ring-primary-300">
            <span className="flex items-center gap-1 text-caption text-muted">
              <ArrowLeft className="size-3.5" aria-hidden /> Sebelumnya
            </span>
            <span className="mt-1 block text-ui text-ink">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/learn/${lang}/${next.id}`}
            className="rounded-2xl bg-white p-4 text-right ring-1 ring-line hover:ring-primary-300"
          >
            <span className="flex items-center justify-end gap-1 text-caption text-muted">
              Berikutnya <ArrowRight className="size-3.5" aria-hidden />
            </span>
            <span className="mt-1 block text-ui text-ink">{next.title}</span>
          </Link>
        )}
      </nav>
    </Container>
  );
}
