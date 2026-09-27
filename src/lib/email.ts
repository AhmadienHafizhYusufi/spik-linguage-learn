import "server-only";

/**
 * Pengiriman email magic link.
 *
 * - Ada RESEND_API_KEY → dikirim lewat Resend (https://resend.com, gratis 3.000 email/bulan).
 * - Tidak ada, dan sedang development → link dicetak ke terminal `npm run dev`.
 * - Tidak ada, dan production → dicatat di log server (Vercel → Logs), email tidak terkirim.
 *
 * Catatan Resend tanpa domain sendiri: pengirim "onboarding@resend.dev" hanya bisa
 * mengirim ke email pemilik akun Resend. Cukup untuk uji coba; untuk pembeli
 * sungguhan, verifikasi domain di Resend lalu ganti EMAIL_FROM.
 */
export async function sendMagicLinkEmail(to: string, url: string, reason: "purchase" | "login") {
  const subject =
    reason === "purchase" ? "Pembayaran berhasil — akses LearnHub kamu" : "Link masuk ke LearnHub";

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n📧 [email dev] ke: ${to}\n   subjek: ${subject}\n   link  : ${url}\n`);
    } else {
      console.error(`[email] RESEND_API_KEY belum diisi — email ke ${to} tidak terkirim`);
    }
    return;
  }

  const intro =
    reason === "purchase"
      ? "Terima kasih! Pembayaran kamu sudah kami terima."
      : "Kamu meminta link untuk masuk ke LearnHub.";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "LearnHub <onboarding@resend.dev>",
        to,
        subject,
        text: `${intro}\n\nKlik link ini untuk masuk:\n${url}\n\nLink hanya bisa dipakai sekali. Abaikan email ini kalau kamu tidak memintanya.`,
        html: `<p>${intro}</p><p><a href="${url}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;border-radius:10px;text-decoration:none;font-weight:600">Masuk ke LearnHub</a></p><p style="color:#475569;font-size:14px">Link hanya bisa dipakai sekali. Abaikan email ini kalau kamu tidak memintanya.</p>`,
      }),
    });
    if (!res.ok) console.error(`[email] Resend menolak (${res.status}):`, await res.text());
  } catch (error) {
    // Sengaja tidak throw: gagal kirim email tidak boleh membatalkan order yang sudah dibayar.
    console.error("[email] gagal menghubungi Resend:", error);
  }
}
