"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/session";
import { fieldErrors, lessonSchema, moduleSchema, type FormState } from "@/lib/content";

/*
 * SEMUA action di file ini wajib memanggil requireAdmin() di baris pertama.
 * Server action = endpoint HTTP publik; menyembunyikan tombol di UI tidak cukup.
 */

function refresh() {
  revalidatePath("/console", "layout"); // panel admin
  revalidatePath("/platform", "layout"); // sisi pembeli ikut terbarui
}

// ---------------------------------------------------------------- Modul

export async function saveModule(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = moduleSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: raw };

  const id = raw.id || null;
  if (id) {
    await db.module.update({ where: { id }, data: parsed.data });
    refresh();
    return { saved: true };
  }

  const created = await db.module.create({ data: parsed.data });
  refresh();
  redirect(`/modules/${created.id}`);
}

export async function deleteModule(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const mod = await db.module.delete({ where: { id } }); // lesson ikut terhapus (onDelete: Cascade)
  refresh();
  redirect(`/modules?lang=${mod.language}`);
}

// ---------------------------------------------------------------- Lesson

export async function saveLesson(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const moduleId = raw.moduleId;
  if (!moduleId || !(await db.module.findUnique({ where: { id: moduleId }, select: { id: true } }))) {
    return { errors: { form: "Modul tidak ditemukan" }, values: raw };
  }

  const parsed = lessonSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: raw };

  const id = raw.id || null;
  if (id) {
    await db.lesson.update({ where: { id, moduleId }, data: parsed.data });
    refresh();
    return { saved: true };
  }

  const created = await db.lesson.create({ data: { ...parsed.data, moduleId } });
  refresh();
  redirect(`/modules/${moduleId}/lessons/${created.id}?created=1`);
}

export async function deleteLesson(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const lesson = await db.lesson.delete({ where: { id } });
  refresh();
  redirect(`/modules/${lesson.moduleId}`);
}
