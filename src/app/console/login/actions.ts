"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "@/lib/domains";
import { adminCookieOptions, loginAdmin, logoutAdmin } from "@/lib/admin/session";

export type AdminLoginState = { error?: string; email?: string };

export async function adminLogin(_prev: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email dan password wajib diisi", email };

  const result = await loginAdmin(email, password);
  if (!result.ok) return { error: result.error, email };

  (await cookies()).set(ADMIN_SESSION_COOKIE, result.token, adminCookieOptions);
  redirect("/modules");
}

export async function adminLogout() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) await logoutAdmin(token);
  store.delete(ADMIN_SESSION_COOKIE);
  redirect("/login");
}
