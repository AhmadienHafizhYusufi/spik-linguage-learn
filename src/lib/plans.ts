import { languages, type LanguageCode, type PlanId } from "@/data/landing";

/**
 * Harga paket dalam Rupiah — dipakai di checkout & saat membuat order.
 *
 * TODO: angka ini PLACEHOLDER untuk development. Ganti dengan harga final
 * setelah survei Van Westendorp (RQ5). Harga selalu dihitung di server
 * dari sini, jangan pernah percaya angka yang dikirim dari browser.
 */
export const PLAN_PRICES: Record<PlanId, number> = {
  bundle: 299_000,
  single: 99_000,
};

export const ALL_LANGUAGES = languages.map((l) => l.code) as LanguageCode[];

export function isLanguageCode(value: string): value is LanguageCode {
  return (ALL_LANGUAGES as string[]).includes(value);
}

export function languagesForPlan(plan: PlanId, single?: LanguageCode): LanguageCode[] {
  if (plan === "bundle") return ALL_LANGUAGES;
  return single ? [single] : [];
}

export function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
