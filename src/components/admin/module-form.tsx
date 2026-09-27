"use client";

import { useActionState } from "react";
import { languages } from "@/data/landing";
import type { FormState } from "@/lib/content";
import { saveModule } from "@/app/console/(panel)/modules/actions";
import { FieldWrap, FormMessage, PublishToggle, SubmitButton, TextField, inputCls } from "./form-ui";

export type ModuleFormValues = {
  id?: string;
  language: string;
  level: string;
  title: string;
  description: string;
  order: number;
  published: boolean;
};

const levelHints: Record<string, string> = {
  en: "Contoh: A1, A2, B1, B2, C1",
  ja: "Contoh: N5, N4, N3, N2",
  zh: "Contoh: HSK 1, HSK 2, … HSK 5",
  de: "Contoh: A1, A2, B1, B2",
  ko: "Contoh: TOPIK I, TOPIK II",
};

export function ModuleForm({ initial }: { initial: ModuleFormValues }) {
  const [state, action] = useActionState<FormState, FormData>(saveModule, {});
  const v = { ...initial, ...state.values };
  const e = state.errors ?? {};

  return (
    <form action={action} className="space-y-5">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid gap-5 sm:grid-cols-[1fr_1fr_120px]">
        <FieldWrap label="Bahasa" name="language" error={e.language}>
          <select id="language" name="language" defaultValue={v.language} className={inputCls}>
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </FieldWrap>
        <TextField
          label="Level"
          name="level"
          defaultValue={v.level}
          error={e.level}
          hint={levelHints[String(v.language)] ?? undefined}
        />
        <TextField label="Urutan" name="order" type="number" min={0} defaultValue={String(v.order)} error={e.order} />
      </div>

      <TextField label="Judul modul" name="title" defaultValue={v.title} error={e.title} placeholder="Mis. Hiragana dasar" />

      <FieldWrap label="Deskripsi singkat (opsional)" name="description" error={e.description}>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={v.description ?? ""}
          className={inputCls}
          placeholder="Apa yang akan dikuasai setelah modul ini?"
        />
      </FieldWrap>

      <PublishToggle defaultChecked={state.values ? state.values.published === "on" : initial.published} />

      <FormMessage saved={state.saved} error={e.form} />
      <SubmitButton>{initial.id ? "Simpan perubahan" : "Buat modul"}</SubmitButton>
    </form>
  );
}
