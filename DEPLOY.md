# Deploy LearnHub

Dua tahap:
1. **Sekarang:** staging gratis di Vercel (alamat `*.vercel.app`) + database Neon.
2. **Nanti:** pindah ke hosting berbayar + domain sendiri — tanpa mengubah kode.

> ⚠️ **Vercel Hobby (gratis) hanya untuk pemakaian non-komersial.** Menurut
> [Fair Use Guidelines Vercel](https://vercel.com/docs/limits/fair-use-guidelines),
> "meminta atau memproses pembayaran dari pengunjung" termasuk komersial.
> Pakai Hobby untuk **staging / uji coba** (mock payment). Sebelum menerima uang
> sungguhan, upgrade ke Vercel Pro atau pindah hosting (bagian B).

---

## A. Staging di Vercel + Neon

Hasil akhirnya tiga alamat (nama bebas, asal masih tersedia):

| Fungsi | Alamat |
|---|---|
| Landing + checkout | `https://learnhub.vercel.app` |
| App pembeli | `https://learnhub-app.vercel.app` |
| Panel admin | `https://learnhub-admin.vercel.app` |

Ketiganya dilayani **satu project Vercel yang sama**; `src/proxy.ts` membedakannya dari nama host.

### 1. Push kode ke GitHub

Buat repository **private** di GitHub, lalu dari folder project:

```bash
git add .
git commit -m "Siap deploy ke Vercel"
git branch -M main
git remote add origin https://github.com/<username>/<nama-repo>.git
git push -u origin main
```

`.env` sudah ada di `.gitignore`, jadi password database tidak ikut ter-upload.

### 2. Buat database di Neon

1. Daftar di [neon.tech](https://neon.tech) → **New Project** → region **AWS Asia Pacific (Singapore)**.
2. Klik **Connect**. Salin **dua** connection string:
   - Dengan *Connection pooling* **aktif** → ini `DATABASE_URL` (dipakai aplikasi).
   - Dengan *Connection pooling* **mati** → ini `DIRECT_URL` (dipakai `prisma migrate`).

   Bedanya: yang pooled punya `-pooler` di nama host-nya.

### 3. Import project di Vercel

1. [vercel.com/new](https://vercel.com/new) → pilih repository tadi. Framework otomatis terdeteksi **Next.js**.
2. Beri nama project `learnhub` (nama ini menjadi `learnhub.vercel.app`).
3. Buka **Environment Variables**, isi:

| Nama | Isi |
|---|---|
| `DATABASE_URL` | connection string Neon **pooled** |
| `DIRECT_URL` | connection string Neon **tanpa pooling** |
| `NEXT_PUBLIC_ROOT_DOMAIN` | `learnhub.vercel.app` |
| `NEXT_PUBLIC_APP_HOST` | `learnhub-app.vercel.app` |
| `NEXT_PUBLIC_ADMIN_HOST` | `learnhub-admin.vercel.app` |
| `PAYMENT_PROVIDER` | `mock` |
| `PAYMENT_WEBHOOK_SECRET` | string acak panjang (lihat tips di bawah) |
| `MOCK_PAYMENT_CODE` | kode rahasia untuk tombol "Bayar (simulasi)" |
| `RESEND_API_KEY` | *(opsional, lihat langkah 6)* |

   Tips membuat string acak (jalankan di terminal):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```

4. Klik **Deploy**.

Saat build, Vercel otomatis menjalankan script `vercel-build` di `package.json`:
`prisma generate` → `prisma migrate deploy` (membuat/memperbarui tabel di Neon) → `next build`.
Region server diset ke **Singapura** lewat `vercel.json`, supaya dekat dengan database dan pengguna Indonesia.

### 4. Tambahkan alamat app & admin

Vercel → project → **Settings → Domains → Add**:
- `learnhub-app.vercel.app`
- `learnhub-admin.vercel.app`

Kalau nama itu sudah dipakai orang lain, pilih nama lain, **ubah env `NEXT_PUBLIC_APP_HOST` / `NEXT_PUBLIC_ADMIN_HOST`**, lalu **Redeploy**
(variabel `NEXT_PUBLIC_*` ditanam saat build, jadi perubahan baru berlaku setelah deploy ulang).

### 5. Buat akun admin di database Neon

Di komputer Anda, buat file `.env.production.local` (sudah di-ignore git):

```env
DATABASE_URL="<connection string Neon TANPA pooling>"
NEXT_PUBLIC_ADMIN_HOST="learnhub-admin.vercel.app"
```

Lalu:

```bash
npm run admin:create:prod
```

### 6. (Opsional) Kirim magic link lewat email — Resend

Tanpa ini, pembeli tetap otomatis masuk setelah bayar, tapi **tidak bisa login ulang** dari perangkat lain.

1. Daftar di [resend.com](https://resend.com) → **API Keys → Create**.
2. Isi env `RESEND_API_KEY` di Vercel → Redeploy.

Tanpa domain sendiri, pengirim `onboarding@resend.dev` **hanya bisa mengirim ke email pemilik akun Resend** — cukup untuk uji coba sendiri.
Setelah punya domain: verifikasi domain di Resend, lalu isi `EMAIL_FROM="LearnHub <halo@domainmu.id>"`.

### 7. Coba

1. Buka `https://learnhub.vercel.app` → pilih paket → isi form.
2. Di halaman bayar simulasi, masukkan `MOCK_PAYMENT_CODE` → **Bayar**.
3. Harus pindah ke `https://learnhub-app.vercel.app/dashboard`.
4. Buka `https://learnhub-admin.vercel.app` → login admin → tambah modul & lesson → terbitkan → cek di app.

### Hal yang perlu diketahui selama staging

- **Error?** Vercel → project → **Logs**. Error database/email tercatat di sana.
- **Preview deployment** (setiap push ke branch selain `main`) memakai database yang sama dan ikut menjalankan migrasi. Untuk sekarang tidak masalah; nanti bisa pakai *Neon branching* untuk database terpisah.
- Pembeli tidak bisa masuk tanpa kode simulasi, jadi orang asing tidak bisa "membeli" gratis.
- Paket Hobby membatasi pemakaian (mis. 100 GB transfer, 1 juta function invocation per bulan) — lebih dari cukup untuk staging.

---

## B. Nanti: pindah ke hosting berbayar + domain sendiri

Kodenya **tidak terikat Vercel**. Satu-satunya file khusus Vercel adalah `vercel.json` dan script `vercel-build` — keduanya diabaikan di hosting lain.

### Pilihan 1 — Tetap di Vercel, upgrade ke Pro (paling mudah)
Upgrade plan → tambahkan domain sendiri (lihat "Ganti ke domain sendiri" di bawah). Selesai.

### Pilihan 2 — VPS (mis. penyedia lokal dengan server Jakarta/Singapura)

Kebutuhan: Node.js 20+, PostgreSQL (atau tetap pakai Neon), Nginx.

```bash
git clone <repo> learnhub && cd learnhub
cp .env.example .env            # isi semua variabel production
npm ci
npx prisma migrate deploy
npm run build
npm start                       # jalankan dengan PM2/systemd supaya hidup terus
```

Nginx sebagai reverse proxy untuk **ketiga** host, lalu HTTPS dengan Certbot. Yang **wajib**: teruskan header `Host` asli, karena `src/proxy.ts` menentukan halaman dari nama host:

```nginx
server {
    server_name learnhub.id app.learnhub.id admin.learnhub.id;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Ganti ke domain sendiri
1. Di DNS domain, arahkan `learnhub.id`, `app.learnhub.id`, `admin.learnhub.id` ke hosting (Vercel akan menunjukkan record yang harus diisi).
2. Ubah env:
   ```env
   NEXT_PUBLIC_ROOT_DOMAIN="learnhub.id"
   # hapus NEXT_PUBLIC_APP_HOST dan NEXT_PUBLIC_ADMIN_HOST → otomatis app./admin.
   ```
3. Deploy ulang / build ulang.
4. Pembeli & admin perlu **login ulang sekali** (cookie terikat ke alamat lama).
5. Update URL webhook & finish URL di dashboard payment gateway.
6. Verifikasi domain di Resend, isi `EMAIL_FROM`.

### Pindah database (kalau meninggalkan Neon)
```bash
pg_dump "<DIRECT_URL Neon>" --no-owner --no-acl -Fc -f learnhub.dump
pg_restore --no-owner --no-acl -d "<URL database baru>" learnhub.dump
```
Lalu ganti `DATABASE_URL` (dan `DIRECT_URL` kalau ada). Lakukan saat sepi, dan hentikan aplikasi lama selama proses supaya tidak ada data yang tertinggal.

### Checklist sebelum menerima pembayaran sungguhan
- [ ] Hosting komersial (Vercel Pro / VPS), bukan Hobby
- [ ] Adapter payment gateway asli (`src/lib/payments/`), `PAYMENT_PROVIDER` bukan `mock`
- [ ] Email dengan domain terverifikasi
- [ ] Harga final di `src/lib/plans.ts`
- [ ] Backup database otomatis
