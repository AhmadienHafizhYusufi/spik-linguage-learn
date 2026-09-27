import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Noto_Sans_KR, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

// Font UI utama
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Font pendamping untuk konten non-Latin.
// preload: false karena file CJK besar — hanya diunduh saat karakternya dipakai.
const notoKR = Noto_Sans_KR({
  variable: "--font-noto-kr",
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap",
});

const notoJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap",
});

const notoSC = Noto_Sans_SC({
  variable: "--font-noto-sc",
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnHub — Belajar 5 bahasa dengan kurikulum terstruktur",
  description:
    "Inggris, Jepang, Mandarin, Jerman, dan Korea dalam satu akses. Roadmap jelas dari nol sampai siap ujian, tanpa gimmick.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${notoKR.variable} ${notoJP.variable} ${notoSC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
