"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { appUrl } from "@/lib/domains";
import { issueLoginToken } from "@/lib/auth/login-token";
import { sendMagicLinkEmail } from "@/lib/email";

export type LoginState = { sent?: boolean; error?: string; devLink?: string };

const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export async function requestMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { error: "Format email belum benar" };

  const user = await db.user.findUnique({
    where: { email: parsed.data },
    include: { entitlements: { take: 1 } },
  });

  // Hanya pembeli yang dikirimi link. Tapi pesan yang tampil SELALU sama,
  // supaya orang tidak bisa mengecek email siapa saja yang terdaftar.
  let devLink: string | undefined;
  if (user && user.entitlements.length > 0) {
    const token = await issueLoginToken(user.id, 15);
    const url = appUrl(`/auth/verify?token=${token}`);
    await sendMagicLinkEmail(user.email, url, "login");
    if (process.env.NODE_ENV !== "production") devLink = url;
  }

  return { sent: true, devLink };
}
