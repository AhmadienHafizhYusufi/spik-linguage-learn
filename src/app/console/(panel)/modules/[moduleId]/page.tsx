import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PlayCircle, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/session";
import { ButtonLink } from "@/components/ui/button";
import { ModuleForm } from "@/components/admin/module-form";
import { DeleteButton, StatusBadge } from "@/components/admin/form-ui";
import { deleteModule } from "../actions";

export const metadata: Metadata = { title: "Edit modul" };

export default async function EditModulePage({ params }: PageProps<"/console/modules/[moduleId]">) {
  await requireAdmin();
  const { moduleId } = await params;
  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: { lessons: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] } },
  });
  if (!mod) notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <section>
        <Link href={`/modules?lang=${mod.language}`} className="inline-flex items-center gap-1 text-body-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> Semua modul
        </Link>
        <h1 className="mt-2 text-h1 text-ink">{mod.title}</h1>
        <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-line">
          <ModuleForm
            initial={{
              id: mod.id,
              language: mod.language,
              level: mod.level,
              title: mod.title,
              description: mod.description ?? "",
              order: mod.order,
              published: mod.published,
            }}
          />
        </div>
        <div className="mt-4">
          <DeleteButton
            action={deleteModule}
            id={mod.id}
            label="Hapus modul"
            confirmText={`Hapus modul "${mod.title}" beserta ${mod.lessons.length} lesson di dalamnya? Tidak bisa dibatalkan.`}
          />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-h2 text-ink">Lesson ({mod.lessons.length})</h2>
          <ButtonLink href={`/modules/${mod.id}/lessons/new`}>
            <Plus className="size-4" aria-hidden /> Lesson baru
          </ButtonLink>
        </div>

        {mod.lessons.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line bg-white p-8 text-center text-body-sm text-muted">
            Modul ini belum punya lesson.
          </p>
        ) : (
          <ol className="mt-4 divide-y divide-line rounded-2xl bg-white ring-1 ring-line">
            {mod.lessons.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/modules/${mod.id}/lessons/${l.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60"
                >
                  <span className="w-6 text-body-sm text-muted">{l.order}</span>
                  <span className="flex-1 font-semibold text-ink">{l.title}</span>
                  {l.videoUrl && <PlayCircle className="size-4 text-muted" aria-label="Ada video" />}
                  {l.durationMinutes != null && <span className="text-body-sm text-muted">{l.durationMinutes} mnt</span>}
                  <StatusBadge published={l.published} />
                </Link>
              </li>
            ))}
          </ol>
        )}
        {!mod.published && mod.lessons.some((l) => l.published) && (
          <p className="mt-3 rounded-lg bg-warning-50 p-3 text-body-sm text-warning-700">
            Modul masih draft — lesson yang sudah terbit belum terlihat pembeli sampai modulnya diterbitkan.
          </p>
        )}
      </section>
    </div>
  );
}
