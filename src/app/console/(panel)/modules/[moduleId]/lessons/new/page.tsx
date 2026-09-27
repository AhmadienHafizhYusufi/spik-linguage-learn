import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/session";
import { LessonForm } from "@/components/admin/lesson-form";

export const metadata: Metadata = { title: "Lesson baru" };

export default async function NewLessonPage({ params }: PageProps<"/console/modules/[moduleId]/lessons/new">) {
  await requireAdmin();
  const { moduleId } = await params;
  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: { lessons: { orderBy: { order: "desc" }, take: 1, select: { order: true } } },
  });
  if (!mod) notFound();

  return (
    <div className="max-w-3xl">
      <Link href={`/modules/${mod.id}`} className="inline-flex items-center gap-1 text-body-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> {mod.title}
      </Link>
      <h1 className="mt-2 text-h1 text-ink">Lesson baru</h1>
      <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-line">
        <LessonForm
          lang={mod.language}
          initial={{
            moduleId: mod.id,
            title: "",
            content: "",
            videoUrl: "",
            durationMinutes: "",
            order: (mod.lessons[0]?.order ?? 0) + 1,
            published: false,
          }}
        />
      </div>
    </div>
  );
}
