"use client";

import { useEffect } from "react";

/**
 * Setelah lunas, pindahkan browser ke route "continue" yang akan
 * mengarahkan ke app subdomain. Pakai navigasi penuh (bukan router.push)
 * karena tujuannya domain lain.
 */
export function AutoContinue({ href, delayMs = 1500 }: { href: string; delayMs?: number }) {
  useEffect(() => {
    const id = setTimeout(() => window.location.assign(href), delayMs);
    return () => clearTimeout(id);
  }, [href, delayMs]);
  return null;
}
