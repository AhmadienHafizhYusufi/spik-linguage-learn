import { z } from "zod";
import { isLanguageCode } from "@/lib/plans";

/**
 * Ambil ID video dari berbagai bentuk link YouTube:
 *   https://www.youtube.com/watch?v=ID
 *   https://youtu.be/ID
 *   https://www.youtube.com/embed/ID
 *   https://www.youtube.com/shorts/ID
 * Selain YouTube ditolak — kita tidak mau menyematkan iframe dari sembarang situs.
 */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else {
        const match = u.pathname.match(/^\/(embed|shorts|live)\/([^/]+)/);
        id = match?.[2] ?? null;
      }
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** URL embed privasi-lebih-baik (tidak menaruh cookie sampai video diputar) */
export function youtubeEmbedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v));

const optionalInt = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : Number(v)))
  .pipe(z.number().int().min(0).max(100_000).nullable());

export const moduleSchema = z.object({
  language: z.string().refine(isLanguageCode, "Pilih bahasa"),
  level: z.string().trim().min(1, "Level wajib diisi").max(30),
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(120),
  description: optionalText.pipe(z.string().max(500, "Deskripsi maksimal 500 karakter").nullable()),
  order: z.coerce.number().int().min(0).max(10_000),
  published: z.literal("on").optional().transform((v) => v === "on"),
});

export const lessonSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(120),
  content: z.string().trim().min(1, "Isi materi wajib diisi").max(100_000),
  videoUrl: optionalText.refine((v) => v === null || youtubeId(v) !== null, "Link harus video YouTube yang valid"),
  durationMinutes: optionalInt,
  order: z.coerce.number().int().min(0).max(10_000),
  published: z.literal("on").optional().transform((v) => v === "on"),
});

export type FormState = {
  errors?: Record<string, string>;
  values?: Record<string, string>;
  saved?: boolean;
};

/** Ubah error zod menjadi { namaField: pesan } untuk ditampilkan di form */
export function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}
