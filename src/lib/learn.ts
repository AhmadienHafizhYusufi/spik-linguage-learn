import "server-only";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requirePaidUser } from "@/lib/auth/session";
import { isLanguageCode } from "@/lib/plans";
import type { LanguageCode } from "@/data/landing";

/**
 * Pastikan user yang login memang membeli bahasa ini.
 * Kalau tidak → 404 (bukan 403), supaya tidak membocorkan apa pun.
 */
export async function requireLanguageAccess(lang: string) {
  const user = await requirePaidUser();
  if (!isLanguageCode(lang) || !user.entitlements.some((e) => e.language === lang)) notFound();
  return { user, lang: lang as LanguageCode };
}

/** Hanya konten yang modul DAN lesson-nya sudah terbit */
export function publishedCurriculum(lang: string) {
  return db.module.findMany({
    where: { language: lang, published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: {
      lessons: {
        where: { published: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: { id: true, title: true, durationMinutes: true, videoUrl: true },
      },
    },
  });
}

/** Jumlah lesson terbit per bahasa — untuk kartu di dashboard */
export async function publishedLessonCounts() {
  const rows = await db.lesson.groupBy({
    by: ["moduleId"],
    where: { published: true, module: { published: true } },
    _count: true,
  });
  const modules = await db.module.findMany({
    where: { id: { in: rows.map((r) => r.moduleId) } },
    select: { id: true, language: true },
  });
  const counts: Record<string, number> = {};
  for (const r of rows) {
    const lang = modules.find((m) => m.id === r.moduleId)?.language;
    if (lang) counts[lang] = (counts[lang] ?? 0) + r._count;
  }
  return counts;
}
