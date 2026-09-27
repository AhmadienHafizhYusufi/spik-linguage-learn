/**
 * Konten landing page LearnHub.
 * Semua teks & angka dikumpulkan di sini supaya gampang diedit tanpa menyentuh komponen.
 *
 * CATATAN: harga masih placeholder ("Rp –––") — angka final menunggu hasil survei
 * Van Westendorp (RQ5 di ringkasan-user-research-5-bahasa.md).
 */

export const navLinks = [
  { href: "#bahasa", label: "Bahasa" },
  { href: "#fitur", label: "Fitur" },
  { href: "#perbandingan", label: "Perbandingan" },
  { href: "#harga", label: "Harga" },
  { href: "#faq", label: "FAQ" },
] as const;

export type LanguageCode = "en" | "ja" | "zh" | "de" | "ko";

export type Language = {
  code: LanguageCode;
  name: string;
  /** Karakter/kata contoh dalam aksara bahasa itu — sekaligus pamer font Noto */
  glyph: string;
  greeting: string;
  greetingMeaning: string;
  exams: string;
  path: string;
  goodFor: string;
  /** Kelas warna tile (utility Tailwind) */
  tone: string;
};

export const languages: Language[] = [
  {
    code: "en",
    name: "Inggris",
    glyph: "Aa",
    greeting: "Nice to meet you",
    greetingMeaning: "Senang bertemu denganmu",
    exams: "IELTS · TOEFL iBT",
    path: "A1 → C1",
    goodFor: "Studi lanjut, kerja remote, karier global",
    tone: "bg-primary-50 text-primary-700 ring-primary-100",
  },
  {
    code: "ja",
    name: "Jepang",
    glyph: "あ",
    greeting: "はじめまして",
    greetingMeaning: "Salam kenal",
    exams: "JLPT N5 → N2",
    path: "Hiragana → N2",
    goodFor: "Magang/kerja ke Jepang, anime & manga",
    tone: "bg-error-50 text-error-700 ring-red-100",
  },
  {
    code: "zh",
    name: "Mandarin",
    glyph: "中",
    greeting: "很高兴认识你",
    greetingMeaning: "Senang berkenalan denganmu",
    exams: "HSK 1 → 5",
    path: "Pinyin → HSK 5",
    goodFor: "Bisnis & perdagangan, beasiswa Tiongkok",
    tone: "bg-warning-50 text-warning-700 ring-yellow-100",
  },
  {
    code: "de",
    name: "Jerman",
    glyph: "Ä",
    greeting: "Freut mich",
    greetingMeaning: "Senang bertemu",
    exams: "Goethe A1 → B2",
    path: "A1 → B2",
    goodFor: "Ausbildung, kuliah gratis, kerja di Jerman",
    tone: "bg-slate-100 text-slate-800 ring-slate-200",
  },
  {
    code: "ko",
    name: "Korea",
    glyph: "한",
    greeting: "만나서 반가워요",
    greetingMeaning: "Senang bertemu denganmu",
    exams: "TOPIK I → II",
    path: "Hangeul → TOPIK II",
    goodFor: "K-drama tanpa subtitle, EPS-TOPIK, kuliah",
    tone: "bg-secondary-50 text-secondary-700 ring-secondary-100",
  },
];

export const painPoints = [
  {
    title: "Kursus resmi mahal",
    body: "Satu bahasa di lembaga kursus bisa jutaan rupiah per level. Mau belajar dua bahasa? Biayanya langsung dobel.",
  },
  {
    title: "Materi berserakan",
    body: "YouTube, PDF grup Telegram, akun TikTok — banyak, tapi tidak nyambung satu sama lain. Susah tahu progres sendiri.",
  },
  {
    title: "Bingung mulai dari mana",
    body: "Harus hafal huruf dulu atau langsung percakapan? Tanpa peta belajar, kebanyakan orang berhenti di minggu kedua.",
  },
  {
    title: "Semangat cuma di awal",
    body: "Aplikasi berbasis streak bikin rajin buka app, tapi belum tentu bikin kamu lulus ujian atau lancar ngobrol.",
  },
] as const;

export const steps = [
  {
    title: "Ikut tes penempatan",
    body: "10 menit untuk tahu level awalmu. Sudah pemula total? Lewati saja dan mulai dari nol.",
  },
  {
    title: "Dapat roadmap personal",
    body: "Pilih tujuan — ujian, kerja, atau hobi — dan dapatkan urutan modul per minggu yang realistis.",
  },
  {
    title: "Belajar, ulangi, ukur",
    body: "Modul, flashcard, dan simulasi ujian saling terhubung. Kamu selalu tahu posisi dan langkah berikutnya.",
  },
] as const;

export type FeatureIcon =
  | "layers"
  | "repeat"
  | "messages"
  | "list"
  | "timer"
  | "library";

export const features: { icon: FeatureIcon; title: string; body: string }[] = [
  {
    icon: "layers",
    title: "Modul berjenjang",
    body: "Kurikulum mengikuti level resmi (CEFR, JLPT, HSK, TOPIK) — setiap modul punya tujuan belajar yang jelas.",
  },
  {
    icon: "repeat",
    title: "Flashcard spaced repetition",
    body: "Kosakata muncul lagi tepat sebelum kamu lupa. Algoritma menyesuaikan dengan jawabanmu.",
  },
  {
    icon: "messages",
    title: "Dialog situasional",
    body: "Percakapan nyata: interview kerja, check-in hotel, ngobrol dengan rekan kantor — lengkap dengan audio.",
  },
  {
    icon: "list",
    title: "Bank soal per level",
    body: "Latihan pilihan ganda, isian, menyusun kalimat, dan listening dengan pembahasan di setiap soal.",
  },
  {
    icon: "timer",
    title: "Simulasi ujian",
    body: "Tryout dengan format & waktu seperti ujian asli, plus skor per bagian untuk tahu yang perlu dikejar.",
  },
  {
    icon: "library",
    title: "Referensi grammar",
    body: "Pola kalimat dijelaskan dalam Bahasa Indonesia, dengan contoh yang bisa dicari kapan saja.",
  },
];

export type CompareValue = boolean | string;

export const comparison: {
  columns: string[];
  rows: { label: string; values: CompareValue[] }[];
} = {
  columns: ["LearnHub", "App gamifikasi", "Kursus tatap muka", "Tutor privat"],
  rows: [
    { label: "Jumlah bahasa dalam 1 akses", values: ["5 bahasa", "Banyak", "1 bahasa", "1 bahasa"] },
    { label: "Kurikulum mengikuti level resmi", values: [true, false, true, "Tergantung tutor"] },
    { label: "Persiapan ujian (JLPT, HSK, IELTS…)", values: [true, false, true, true] },
    { label: "Penjelasan dalam Bahasa Indonesia", values: [true, "Sebagian", true, "Tergantung tutor"] },
    { label: "Belajar kapan saja", values: [true, true, false, false] },
    { label: "Latihan ngobrol dengan manusia", values: [false, false, true, true] },
    { label: "Kisaran biaya", values: ["Sekali bayar", "Langganan", "Per level", "Per jam"] },
  ],
};

export const personas = [
  {
    role: "Pelajar SMA",
    goal: "Persiapan kuliah & beasiswa",
    langs: ["en", "ja"] as LanguageCode[],
  },
  {
    role: "Lulusan vokasi",
    goal: "Ausbildung ke Jerman",
    langs: ["de"] as LanguageCode[],
  },
  {
    role: "Karyawan",
    goal: "Naik jabatan di perusahaan multinasional",
    langs: ["zh", "en"] as LanguageCode[],
  },
  {
    role: "Mahasiswa",
    goal: "Exchange & TOPIK",
    langs: ["ko"] as LanguageCode[],
  },
  {
    role: "Freelancer",
    goal: "Dapat klien luar negeri",
    langs: ["en", "zh"] as LanguageCode[],
  },
  {
    role: "Ibu rumah tangga",
    goal: "Belajar santai di sela waktu",
    langs: ["en", "ko", "ja"] as LanguageCode[],
  },
];

export type PlanId = "bundle" | "single";

export const plans: Record<
  PlanId,
  { name: string; price: string; note: string; perks: string[]; cta: string }
> = {
  bundle: {
    name: "Bundle 5 Bahasa",
    price: "Rp –––",
    note: "Sekali bayar · akses semua bahasa",
    perks: [
      "Inggris, Jepang, Mandarin, Jerman, Korea",
      "Semua modul, flashcard, dan bank soal",
      "Simulasi ujian untuk setiap bahasa",
      "Roadmap personal dari tes penempatan",
      "Update materi tanpa biaya tambahan",
    ],
    cta: "Pilih Bundle",
  },
  single: {
    name: "Satu Bahasa",
    price: "Rp –––",
    note: "Sekali bayar · pilih 1 bahasa",
    perks: [
      "Pilih satu dari 5 bahasa",
      "Semua modul, flashcard, dan bank soal bahasa itu",
      "Simulasi ujian bahasa itu",
      "Roadmap personal dari tes penempatan",
      "Bisa upgrade ke Bundle kapan saja",
    ],
    cta: "Pilih Satu Bahasa",
  },
};

export const faqs = [
  {
    q: "Saya benar-benar pemula. Apakah bisa ikut?",
    a: "Bisa. Setiap bahasa dimulai dari level paling dasar — termasuk belajar huruf untuk Jepang, Mandarin, dan Korea. Kamu bisa melewati tes penempatan dan langsung mulai dari modul pertama.",
  },
  {
    q: "Sebaiknya belajar satu bahasa dulu atau beberapa sekaligus?",
    a: "Untuk pemula, kami sarankan fokus di satu bahasa sampai level dasar selesai, baru menambah bahasa kedua. Roadmap personal akan menyesuaikan jumlah jam per minggu yang kamu pilih.",
  },
  {
    q: "Berapa lama waktu belajar per hari?",
    a: "Roadmap bisa diatur mulai 15 menit per hari. Semakin banyak waktu yang kamu alokasikan, semakin cepat target level tercapai — dan estimasinya terlihat di dashboard.",
  },
  {
    q: "Apakah bisa dipakai di HP?",
    a: "Bisa. LearnHub berbasis web dan nyaman dipakai di browser HP maupun laptop. Progresmu tersinkron di semua perangkat.",
  },
  {
    q: "Apakah ada biaya tambahan setelah membeli?",
    a: "Tidak ada. Pembaruan materi untuk bahasa yang kamu beli sudah termasuk. Kalau membeli paket Satu Bahasa, kamu bisa upgrade ke Bundle dengan membayar selisihnya.",
  },
  {
    q: "Apakah ada kelas langsung dengan tutor?",
    a: "Saat ini belum. LearnHub fokus pada belajar mandiri yang terstruktur. Kalau butuh latihan bicara intensif, LearnHub bisa jadi pendamping kursus atau tutor yang sudah kamu ikuti.",
  },
] as const;
