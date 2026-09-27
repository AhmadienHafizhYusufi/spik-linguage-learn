# LearnHub

Landing page + aplikasi belajar 5 bahasa. Satu project Next.js melayani tiga domain:

| Domain | Isi | Folder kode |
|---|---|---|
| `learnhub.id` | Landing page, checkout, halaman status pembayaran | `src/app/page.tsx`, `src/app/checkout/` |
| `app.learnhub.id` | Login pembeli, dashboard, halaman belajar | `src/app/platform/` |
| `admin.learnhub.id` | Panel admin: kelola modul & lesson | `src/app/console/` |

Saat development: `http://localhost:3000`, `http://app.localhost:3000`, dan `http://admin.localhost:3000`.

---

## Menjalankan di komputer sendiri

Butuh **Node.js 20+** dan **PostgreSQL** (lokal, atau gratis di Supabase/Neon).

```bash
# 1. Salin konfigurasi, lalu isi DATABASE_URL & PAYMENT_WEBHOOK_SECRET
copy .env.example .env        # Windows (PowerShell/CMD)
# cp .env.example .env        # macOS/Linux

# 2. Install dependency (otomatis menjalankan prisma generate)
npm install

# 3. Buat tabel di database
npx prisma migrate dev --name init

# 4. Jalankan
npm run dev
```

Buka `http://localhost:3000` → klik **Pilih Bundle** → isi form → **Bayar (simulasi berhasil)**.
Browser akan pindah ke `http://app.localhost:3000/dashboard`.

> `*.localhost` otomatis mengarah ke komputer sendiri di Chrome, Edge, dan Firefox — tidak perlu edit file `hosts`.

### Membuat akun admin

```bash
npm run admin:create
```
Isi email, nama, dan password (minimal 12 karakter). Perintah yang sama dengan email yang sudah ada = **reset password** (semua sesi lama ikut dikeluarkan). Lalu buka `http://admin.localhost:3000`.

Link login (magic link) dicetak di **terminal `npm run dev`**, karena email belum disambungkan ke provider.
Lihat isi database: `npm run db:studio`.

---

## Alur dari bayar sampai dashboard

```
 learnhub.id                         Payment gateway                    app.learnhub.id
 ───────────                         ───────────────                    ───────────────
 1. /checkout (isi data)
    ├─ buat Order (PENDING)
    ├─ simpan secret di cookie
    └─ redirect ─────────────────▶  2. Halaman bayar
                                         │
                                         ├─ 3. WEBHOOK (server→server)
    /api/payments/webhook  ◀─────────────┘   verifikasi tanda tangan
    ├─ Order → PAID
    ├─ buat User + Entitlement
    └─ kirim magic link ke email
                                         │
 4. /checkout/success/[id]  ◀────────────┘ browser diarahkan balik
    (tunggu status PAID)
 5. /checkout/success/[id]/continue
    ├─ cek secret cookie = milik pembeli
    ├─ buat token sekali pakai (2 menit)
    └─ redirect ────────────────────────────────────────────────▶ 6. /auth/verify?token=…
                                                                     ├─ tukar token → sesi
                                                                     ├─ set cookie lh_session
                                                                     └─ redirect /dashboard
                                                                  7. /dashboard
                                                                     └─ requirePaidUser()
```

### Kenapa harus "serah terima" token, bukan langsung cookie?
Cookie yang dibuat di `learnhub.id` tidak bisa dibaca oleh `app.learnhub.id` (kecuali sengaja dibagi ke seluruh domain, yang memperbesar risiko). Jadi domain utama membuat **token sekali pakai berumur pendek**, lalu app subdomain menukarnya menjadi cookie sesinya sendiri. Momen redirect inilah yang membuat domain di address bar berubah.

### Kenapa `/auth/verify` hanya menampilkan halaman, bukan langsung login?
Pemindai keamanan email (Outlook, Gmail) dan prefetch browser sering membuka link lebih dulu. Kalau token dipakai saat link dibuka (GET), token hangus sebelum pemiliknya sempat mengklik. Jadi halaman `/auth/verify` mengirim token lewat **POST** ke `/auth/verify/confirm` (otomatis via JavaScript, atau lewat tombol). Dengan alasan yang sama, tombol "Buka dashboard" di halaman sukses memakai `<a>` biasa, bukan `<Link>` — `<Link>` mem-prefetch tujuannya di production.

### Kenapa order ditandai lunas di webhook, bukan di halaman sukses?
Halaman sukses dibuka oleh browser, jadi bisa dibuka siapa saja tanpa membayar. Webhook dikirim server gateway dan **ditandatangani** — hanya itu sumber kebenaran status pembayaran.

---

## File penting

| File | Fungsi |
|---|---|
| `src/proxy.ts` | Membaca host. `app.*` → di-*rewrite* ke `src/app/platform`. Cek cepat cookie sesi. |
| `src/lib/domains.ts` | Konfigurasi domain & helper `appUrl()` / `marketingUrl()` / `adminUrl()`. Host app & admin bisa diatur lewat env. |
| `src/lib/auth/session.ts` | Sesi login + `requirePaidUser()` (penjaga halaman berbayar) |
| `src/lib/auth/login-token.ts` | Token sekali pakai untuk magic link & serah terima |
| `src/lib/payments/` | Adapter payment gateway (`mock.ts` sekarang) |
| `src/lib/orders.ts` | `fulfillOrder()` — lunasi order, buat user, beri akses (idempoten) |
| `src/app/api/payments/webhook/route.ts` | Endpoint webhook gateway |
| `prisma/schema.prisma` | Tabel: User, Order, Entitlement, Session, LoginToken, Admin, AdminSession, Module, Lesson |
| `src/lib/admin/` | Password (scrypt) & sesi admin, `requireAdmin()` |
| `src/lib/content.ts` | Validasi form modul/lesson, parser link YouTube |
| `src/lib/learn.ts` | Cek akses bahasa & ambil materi terbit untuk pembeli |

### Lapisan pengaman akses dashboard
1. **`proxy.ts`** — tidak ada cookie sesi → langsung ke `/login` (cepat, tanpa query DB).
2. **`requirePaidUser()`** di layout **dan** page — sesi valid di DB? punya minimal 1 bahasa? Kalau tidak: ke login / ke halaman harga.

Proxy saja tidak cukup; pengecekan sebenarnya harus di dekat data.

---

## Panel admin & pemisahan dari akun pembeli

Admin dan pembeli dipisah di **setiap lapisan**, bukan hanya beda halaman:

| Lapisan | Pembeli | Admin |
|---|---|---|
| Domain | `app.learnhub.id` | `admin.learnhub.id` |
| Folder kode | `src/app/platform/` | `src/app/console/` |
| Tabel | `User`, `Session` | `Admin`, `AdminSession` |
| Cookie | `lh_session` (SameSite=Lax, 30 hari) | `lh_admin_session` (SameSite=Strict, 12 jam) |
| Login | Magic link email | Email + password (scrypt), kunci 15 menit setelah 5x salah |
| Pendaftaran | Otomatis saat bayar | Hanya lewat `npm run admin:create` di terminal |
| Penjaga | `requirePaidUser()` | `requireAdmin()` |

Karena tabel, cookie, dan domainnya beda, token sesi pembeli tidak akan pernah diterima di panel admin, dan sebaliknya. Pembeli juga tidak bisa "dinaikkan" jadi admin lewat aplikasi.

**Server action = endpoint publik.** Setiap action di `src/app/console/(panel)/modules/actions.ts` memanggil `requireAdmin()` sendiri — menyembunyikan tombol di UI tidak cukup.

### Alur konten
1. Admin membuat **Modul** (bahasa, level, judul, urutan) → menambah **Lesson** (Markdown + video YouTube opsional).
2. Centang **Terbitkan**. Pembeli hanya melihat lesson yang *lesson-nya* DAN *modulnya* sudah terbit.
3. Pembeli membuka `app.learnhub.id/learn/<bahasa>` — hanya untuk bahasa yang sudah dibeli (selain itu 404).

Markdown dirender tanpa HTML mentah, jadi `<script>` yang ditempel admin tampil sebagai teks biasa, tidak dijalankan. Video hanya menerima link YouTube dan disematkan lewat `youtube-nocookie.com`.

### Pengamanan tambahan untuk production (opsional)
- Batasi `admin.learnhub.id` hanya untuk IP kantor/VPN, atau pasang **Cloudflare Access** di depannya.
- Tambahkan 2FA (TOTP) untuk admin.

---

## Mengganti mock dengan Midtrans / Xendit

1. Buat `src/lib/payments/midtrans.ts` yang mengimplementasikan `PaymentProvider` (`src/lib/payments/types.ts`):
   - `createPayment()` → panggil API Snap, kembalikan `redirect_url` dan `order_id`.
   - `parseWebhook()` → verifikasi `signature_key` (SHA512 dari `order_id + status_code + gross_amount + server_key`), petakan `transaction_status` ke `PAID/FAILED/EXPIRED/PENDING`.
2. Daftarkan di `src/lib/payments/index.ts`, set `PAYMENT_PROVIDER="midtrans"`.
3. Di dashboard Midtrans, isi **Notification URL** = `https://learnhub.id/api/payments/webhook` dan **Finish URL** = `https://learnhub.id/checkout/success/{order_id}`.

Halaman lain tidak perlu diubah.

## Deploy

Lihat **[DEPLOY.md](./DEPLOY.md)** — staging gratis di Vercel + Neon (alamat `*.vercel.app`), lalu cara pindah ke hosting berbayar & domain sendiri tanpa mengubah kode.

## Yang belum dibuat
- Adapter payment gateway asli dan provider email.
- Upgrade Satu Bahasa → Bundle dengan harga selisih (sekarang tombolnya mengarah ke checkout Bundle penuh).
- Tes penempatan, flashcard, kuis, dan progres belajar per lesson.
- Upload gambar/audio untuk materi (sekarang hanya teks + YouTube).
- Mengubah urutan modul/lesson dengan drag-and-drop (sekarang lewat angka "Urutan").
- Rate limit untuk form login & checkout.
- Membersihkan token/sesi kedaluwarsa (cron).
