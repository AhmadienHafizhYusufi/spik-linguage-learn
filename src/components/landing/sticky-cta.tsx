"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/**
 * Bar CTA di bawah layar (mobile saja).
 * Muncul setelah hero lewat, dan otomatis sembunyi saat section harga terlihat
 * supaya tidak menumpuk dengan tombol di sana (lihat audit Volingo 3.2).
 */
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const pricing = document.getElementById("harga");
    const observer = new IntersectionObserver(([entry]) => setPricingVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    if (pricing) observer.observe(pricing);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const visible = pastHero && !pricingVisible;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-3 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-ui text-ink">5 bahasa, sekali bayar</p>
          <p className="text-caption text-muted">Tanpa langganan</p>
        </div>
        <ButtonLink href="#harga" tabIndex={visible ? 0 : -1}>
          Lihat paket <ArrowRight className="size-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
