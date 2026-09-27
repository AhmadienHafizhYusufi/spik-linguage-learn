import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/session";
import { LessonForm } from "@/components/admin/lesson-form";
import { DeleteButton } from "@/components/admin/form-ui";
import { deleteLesson } from "../../../actions";

export const metadata: Metadata = { title: "Edit lesson" };

export default async function EditLessonPage({
  params,
  searchParams,
}: PageProps<"/console/modules/[moduleId]/lessons/[lessonId]">) {
  await requireAdmin();
  const { moduleId, lessonId } = await params;
  const { created } = await searchParams;
  const lesson = await db.lesson.findUnique({ where: { id: lessonId }, include: { module: true } });
  if (!lesson || lesson.moduleId !== moduleId) notFound();

  return (
    <div className="max-w-3xl">
      <Link href={`/modules/${moduleId}`} className="inline-flex items-center gap-1 text-body-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> {lesson.module.title}
      </Link>
      <h1 className="mt-2 text-h1 text-ink">{lesson.title}</h1>
      {created && (
        <p role="status" className="mt-4 rounded-lg bg-success-50 p-3 text-body-sm text-success-700">
          Lesson dibuat.
        </p>
      )}
      <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-line">
        <LessonForm
          lang={lesson.module.language}
          initial={{
            id: lesson.id,
            moduleId,
            title: lesson.title,
            content: lesson.content,
            videoUrl: lesson.videoUrl ?? "",
            durationMinutes: lesson.durationMinutes?.toString() ?? "",
            order: lesson.order,
            published: lesson.published,
          }}
        />
      </div>
      <div className="mt-4">
        <DeleteButton
          action={deleteLesson}
          id={lesson.id}
          label="Hapus lesson"
          confirmText={`Hapus lesson "${lesson.title}"? Tidak bisa dibatalkan.`}
        />
      </div>
    </div>
  );
}
