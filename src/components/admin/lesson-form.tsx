"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/lib/content";
import { youtubeEmbedUrl, youtubeId } from "@/lib/content";
import { saveLesson } from "@/app/console/(panel)/modules/actions";
import { Markdown } from "@/components/markdown";
import { FormMessage, PublishToggle, SubmitButton, TextField, inputCls } from "./form-ui";

export type LessonFormValues = {
  id?: string;
  moduleId: string;
  title: string;
  content: string;
  videoUrl: string;
  durationMinutes: string;
  order: number;
  published: boolean;
};

const MARKDOWN_TEMPLATE = `## Tujuan belajar
- …

## Materi
Tulis penjelasan di sini. **Tebal**, *miring*, dan tabel didukung:

| Huruf | Romaji |
|---|---|
| あ | a |

## Latihan
1. …
`;

export function LessonForm({ initial, lang }: { initial: LessonFormValues; lang: string }) {
  const [state, action] = useActionState<FormState, FormData>(saveLesson, {});
  const v = { ...initial, ...state.values };
  const e = state.errors ?? {};

  const [tab, setTab] = useState<"write" | "preview">("write");
  const [content, setContent] = useState(v.content || (initial.id ? "" : MARKDOWN_TEMPLATE));
  const [videoUrl, setVideoUrl] = useState(v.videoUrl ?? "");
  const videoId = videoUrl ? youtubeId(videoUrl) : null;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="moduleId" value={initial.moduleId} />
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid gap-5 sm:grid-cols-[1fr_120px_120px]">
        <TextField label="Judul lesson" name="title" defaultValue={v.title} error={e.title} />
        <TextField
          label="Durasi (menit)"
          name="durationMinutes"
          type="number"
          min={0}
          defaultValue={v.durationMinutes}
          error={e.durationMinutes}
        />
        <TextField label="Urutan" name="order" type="number" min={0} defaultValue={String(v.order)} error={e.order} />
      </div>

      <TextField
        label="Link video YouTube (opsional)"
        name="videoUrl"
        type="url"
        value={videoUrl}
        onChange={(ev) => setVideoUrl(ev.target.value)}
        // Sembunyikan error lama dari server begitu link yang diketik sudah valid
        error={videoUrl && videoId ? undefined : e.videoUrl}
        placeholder="https://www.youtube.com/watch?v=…"
        hint={videoUrl && !videoId ? "Link belum dikenali sebagai video YouTube" : undefined}
      />
      {videoId && (
        <div className="aspect-video max-w-md overflow-hidden rounded-lg ring-1 ring-line">
          <iframe
            src={youtubeEmbedUrl(videoId)}
            title="Preview video"
            className="size-full"
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <span className="text-ui text-ink">Isi materi (Markdown)</span>
          <div role="tablist" aria-label="Mode editor" className="flex rounded-lg bg-slate-100 p-0.5">
            {(["write", "preview"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1 text-body-sm ${tab === t ? "bg-white font-semibold text-ink shadow-sm" : "text-muted"}`}
              >
                {t === "write" ? "Tulis" : "Preview"}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea tetap ada (disembunyikan saat preview) supaya nilainya ikut terkirim */}
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(ev) => setContent(ev.target.value)}
          rows={20}
          aria-invalid={!!e.content}
          aria-label="Isi materi"
          className={`${inputCls} font-mono text-body-sm ${tab === "preview" ? "hidden" : ""}`}
        />
        {tab === "preview" && (
          <div className="mt-1.5 min-h-[20rem] rounded-lg border border-line bg-white p-5">
            {content.trim() ? <Markdown lang={lang}>{content}</Markdown> : <p className="text-muted">Belum ada isi.</p>}
          </div>
        )}
        {e.content && <p className="mt-1 text-body-sm text-error-700">{e.content}</p>}
        <p className="mt-1 text-body-sm text-muted">
          Mendukung heading (##), list, **tebal**, tabel, dan link. HTML tidak dirender.
        </p>
      </div>

      <PublishToggle defaultChecked={state.values ? state.values.published === "on" : initial.published} />

      <FormMessage saved={state.saved} error={e.form} />
      <SubmitButton>{initial.id ? "Simpan perubahan" : "Buat lesson"}</SubmitButton>
    </form>
  );
}
