import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/session";
import { isLanguageCode } from "@/lib/plans";
import { languages } from "@/data/landing";
import { ButtonLink } from "@/components/ui/button";
import { LanguageTile } from "@/components/landing/language-tile";
import { StatusBadge } from "@/components/admin/form-ui";

export const metadata: Metadata = { title: "Modul" };

export default async function ModulesPage({ searchParams }: PageProps<"/console/modules">) {
  await requireAdmin();
  const { lang: langParam } = await searchParams;
  const lang = typeof langParam === "string" && isLanguageCode(langParam) ? langParam : "en";

  const [modules, counts] = await Promise.all([
    db.module.findMany({
      where: { language: lang },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      include: { lessons: { select: { published: true } } },
    }),
    db.module.groupBy({ by: ["language"], _count: true }),
  ]);
  const countFor = (code: string) => counts.find((c) => c.language === code)?._count ?? 0;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-ink">Modul</h1>
          <p className="text-body-sm text-muted">Kelola modul dan lesson untuk setiap bahasa.</p>
        </div>
        <ButtonLink href={`/modules/new?lang=${lang}`}>
          <Plus className="size-4" aria-hidden /> Modul baru
        </ButtonLink>
      </div>

      <nav aria-label="Filter bahasa" className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
        {languages.map((l) => {
          const active = l.code === lang;
          return (
            <Link
              key={l.code}
              href={`/modules?lang=${l.code}`}
              aria-current={active ? "page" : undefined}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-ui ${
                active ? "border-primary-600 text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              <LanguageTile code={l.code} size="sm" />
              {l.name}
              <span className="rounded-full bg-slate-100 px-1.5 text-caption text-slate-600">{countFor(l.code)}</span>
            </Link>
          );
        })}
      </nav>

      {modules.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <p className="text-h3 text-ink">Belum ada modul</p>
          <p className="mt-1 text-body-sm text-muted">Mulai dengan membuat modul pertama untuk bahasa ini.</p>
          <ButtonLink href={`/modules/new?lang=${lang}`} className="mt-4">
            <Plus className="size-4" aria-hidden /> Modul baru
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-line">
          <table className="w-full min-w-[600px] text-left text-body-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th scope="col" className="w-16 px-4 py-3 font-medium">#</th>
                <th scope="col" className="w-24 px-4 py-3 font-medium">Level</th>
                <th scope="col" className="px-4 py-3 font-medium">Judul</th>
                <th scope="col" className="w-28 px-4 py-3 font-medium">Lesson</th>
                <th scope="col" className="w-24 px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => {
                const live = m.lessons.filter((l) => l.published).length;
                return (
                  <tr key={m.id} className="border-t border-line hover:bg-surface/60">
                    <td className="px-4 py-3 text-muted">{m.order}</td>
                    <td className="px-4 py-3 font-medium text-ink">{m.level}</td>
                    <td className="px-4 py-3">
                      <Link href={`/modules/${m.id}`} className="font-semibold text-ink hover:text-primary-700 hover:underline">
                        {m.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {live}/{m.lessons.length} terbit
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge published={m.published} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
