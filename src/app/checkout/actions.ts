"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { randomToken, sha256 } from "@/lib/crypto";
import { CHECKOUT_COOKIE, PROTOCOL, marketingUrl } from "@/lib/domains";
import { getPaymentProvider } from "@/lib/payments";
import { PLAN_PRICES, isLanguageCode, languagesForPlan } from "@/lib/plans";
import { plans } from "@/data/landing";

const schema = z
  .object({
    plan: z.enum(["bundle", "single"]),
    language: z.string().optional(),
    name: z.string().trim().min(2, "Nama minimal 2 huruf").max(80),
    email: z.string().trim().toLowerCase().pipe(z.email("Format email belum benar")),
    phone: z
      .string()
      .trim()
      .regex(/^(\+62|62|0)8\d{7,12}$/, "Nomor WhatsApp belum valid (contoh: 0812xxxxxxx)"),
  })
  .refine((v) => v.plan === "bundle" || (v.language && isLanguageCode(v.language)), {
    message: "Pilih satu bahasa",
    path: ["language"],
  });

export type CheckoutState = {
  errors?: Partial<Record<"name" | "email" | "phone" | "language" | "form", string>>;
  values?: Record<string, string>;
};

export async function createOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const errors: CheckoutState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<CheckoutState["errors"]>;
      errors[key] ??= issue.message;
    }
    return { errors, values: raw };
  }

  const { plan, language, name, email, phone } = parsed.data;
  const langs = languagesForPlan(plan, language && isLanguageCode(language) ? language : undefined);

  // Secret acak disimpan di cookie browser pembeli (httpOnly).
  // Nanti di halaman sukses, hanya browser yang memegang secret ini yang
  // boleh otomatis masuk ke dashboard. Orang lain yang tahu orderId tidak bisa.
  const checkoutSecret = randomToken();

  const order = await db.order.create({
    data: {
      plan,
      languages: langs,
      amount: PLAN_PRICES[plan], // harga dari server, bukan dari form
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      checkoutSecretHash: sha256(checkoutSecret),
    },
  });

  const provider = getPaymentProvider();
  let redirectUrl: string;
  try {
    const payment = await provider.createPayment({
      orderId: order.id,
      amount: order.amount,
      description: `LearnHub — ${plans[plan].name}`,
      customer: { name, email, phone },
      finishUrl: marketingUrl(`/checkout/success/${order.id}`),
    });
    await db.order.update({ where: { id: order.id }, data: { providerRef: payment.providerRef } });
    redirectUrl = payment.redirectUrl;
  } catch (error) {
    console.error("[checkout] gagal membuat pembayaran:", error);
    await db.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    return { errors: { form: "Gagal menghubungi layanan pembayaran. Coba lagi sebentar." }, values: raw };
  }

  (await cookies()).set(CHECKOUT_COOKIE, checkoutSecret, {
    httpOnly: true,
    secure: PROTOCOL === "https",
    sameSite: "lax",
    path: "/checkout",
    maxAge: 60 * 60 * 24, // 1 hari
  });

  redirect(redirectUrl);
}
