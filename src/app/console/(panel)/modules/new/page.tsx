import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/session";
import { isLanguageCode } from "@/lib/plans";
import { ModuleForm } from "@/components/admin/module-form";

export const metadata: Metadata = { title: "Modul baru" };

export default async function NewModulePage({ searchParams }: PageProps<"/console/modules/new">) {
  await requireAdmin();
  const { lang: langParam } = await searchParams;
  const lang = typeof langParam === "string" && isLanguageCode(langParam) ? langParam : "en";

  // Urutan default = setelah modul terakhir
  const last = await db.module.findFirst({ where: { language: lang }, orderBy: { order: "desc" } });

  return (
    <div className="max-w-2xl">
      <Link href={`/modules?lang=${lang}`} className="inline-flex items-center gap-1 text-body-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> Semua modul
      </Link>
      <h1 className="mt-2 text-h1 text-ink">Modul baru</h1>
      <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-line">
        <ModuleForm
          initial={{
            language: lang,
            level: "",
            title: "",
            description: "",
            order: (last?.order ?? 0) + 1,
            published: false,
          }}
        />
      </div>
    </div>
  );
}
