import "server-only";
import { db } from "@/lib/db";
import { appUrl } from "@/lib/domains";
import { issueLoginToken } from "@/lib/auth/login-token";
import { sendMagicLinkEmail } from "@/lib/email";

/**
 * Tandai order lunas → buat/temukan user → beri hak akses bahasa.
 *
 * Dipanggil dari webhook. Gateway bisa mengirim webhook yang sama lebih dari
 * sekali, jadi fungsi ini harus idempoten: panggilan kedua tidak mengubah apa-apa.
 */
export async function fulfillOrder(providerRef: string) {
  const result = await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { providerRef } });
    if (!order) throw new Error(`Order dengan providerRef ${providerRef} tidak ditemukan`);
    if (order.status === "PAID") return { order, isNew: false };

    // Satu email = satu akun. Pembeli lama yang beli lagi → akun yang sama.
    const user = await tx.user.upsert({
      where: { email: order.customerEmail },
      update: {},
      create: {
        email: order.customerEmail,
        name: order.customerName,
        phone: order.customerPhone,
      },
    });

    const paid = await tx.order.update({
      where: { id: order.id },
      data: { status: "PAID", paidAt: new Date(), userId: user.id },
    });

    await tx.entitlement.createMany({
      data: order.languages.map((language) => ({
        userId: user.id,
        language,
        orderId: order.id,
      })),
      skipDuplicates: true, // sudah punya bahasa itu dari pembelian sebelumnya
    });

    return { order: paid, isNew: true };
  });

  // Kirim magic link supaya pembeli bisa masuk dari perangkat mana pun.
  if (result.isNew && result.order.userId) {
    const token = await issueLoginToken(result.order.userId, 60 * 24);
    await sendMagicLinkEmail(
      result.order.customerEmail,
      appUrl(`/auth/verify?token=${token}`),
      "purchase",
    );
  }

  return result.order;
}

export async function markOrderStatus(providerRef: string, status: "FAILED" | "EXPIRED") {
  await db.order.updateMany({
    where: { providerRef, status: "PENDING" },
    data: { status },
  });
}
