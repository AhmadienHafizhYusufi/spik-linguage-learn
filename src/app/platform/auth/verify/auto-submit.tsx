"use client";

import { useEffect } from "react";

/**
 * Kirim form otomatis sekali saat halaman terbuka.
 * Ditandai lewat data-attribute supaya tidak terkirim dua kali
 * (React Strict Mode di development menjalankan effect dua kali,
 * dan token hanya bisa dipakai sekali).
 */
export function AutoSubmit({ formId }: { formId: string }) {
  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form || form.dataset.submitted) return;
    form.dataset.submitted = "1";
    form.requestSubmit();
  }, [formId]);
  return null;
}
