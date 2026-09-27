import {
  ArrowRight,
  Check,
  Layers,
  Library,
  ListChecks,
  MessagesSquare,
  Minus,
  Repeat,
  Timer,
  type LucideIcon,
} from "lucide-react";
import {
  comparison,
  faqs,
  features,
  languages,
  painPoints,
  personas,
  steps,
  type CompareValue,
  type FeatureIcon,
} from "@/data/landing";
import { ButtonLink } from "@/components/ui/button";
import { Container, Highlight, SectionHeading } from "@/components/ui/section";
import { LanguageTile } from "./language-tile";

/* ------------------------------------------------------------------ */
/* Masalah                                                            */
/* ------------------------------------------------------------------ */

export function Problems() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Kenapa sering berhenti di tengah jalan"
          title="Niat belajarnya ada. Yang kurang biasanya petanya."
        />
        {/* Grid biasa (bukan carousel) — hindari scroll macet seperti di audit Volingo */}
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {painPoints.map((p, i) => (
            <li key={p.title} className="rounded-2xl bg-white p-6 ring-1 ring-line">
              <span className="text-caption text-muted">0{i + 1}</span>
              <h3 className="mt-2 text-h3 text-ink">{p.title}</h3>
              <p className="mt-2 text-body text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Bahasa                                                             */
/* ------------------------------------------------------------------ */

export function Languages() {
  return (
    <section id="bahasa" className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="5 bahasa pilihan"
          title={
            <>
              Sedikit bahasa, <Highlight>kurikulum lebih dalam</Highlight>
            </>
          }
          description="Kami sengaja fokus ke 5 bahasa yang paling dicari pelajar Indonesia, supaya setiap bahasa punya jalur lengkap sampai ujian resmi."
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((l) => (
            <li
              key={l.code}
              className="group flex flex-col rounded-2xl bg-white p-6 ring-1 ring-line transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
            >
              <div className="flex items-center gap-4">
                <LanguageTile code={l.code} size="lg" />
                <div>
                  <h3 className="text-h3 text-ink">{l.name}</h3>
                  <p className="text-body-sm text-muted">{l.path}</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-surface p-4">
                <p lang={l.code} className="text-h3 text-ink">
                  {l.greeting}
                </p>
                <p className="mt-1 text-body-sm text-muted">“{l.greetingMeaning}”</p>
              </div>

              <dl className="mt-5 space-y-2 text-body-sm">
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-muted">Ujian</dt>
                  <dd className="font-medium text-ink">{l.exams}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-muted">Cocok</dt>
                  <dd className="text-ink">{l.goodFor}</dd>
                </div>
              </dl>
            </li>
          ))}

          {/* Kartu ke-6: ajakan tes penempatan */}
          <li className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 p-6 text-white">
            <div>
              <h3 className="text-h3">Belum yakin mulai dari mana?</h3>
              <p className="mt-2 text-body text-primary-100">
                Tes penempatan 10 menit akan menentukan level awal dan menyusun roadmap untukmu.
              </p>
            </div>
            <ButtonLink href="#cara-kerja" variant="inverse" className="mt-6 self-start">
              Lihat cara kerjanya <ArrowRight className="size-4" />
            </ButtonLink>
          </li>
        </ul>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cara kerja                                                         */
/* ------------------------------------------------------------------ */

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Cara kerja" title="Tiga langkah dari bingung ke terarah" />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <div className="flex items-center gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-600 text-ui text-white">
                  {i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span aria-hidden className="hidden h-px flex-1 bg-primary-200 md:block" />
                )}
              </div>
              <h3 className="mt-5 text-h3 text-ink">{s.title}</h3>
              <p className="mt-2 text-body text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Fitur                                                              */
/* ------------------------------------------------------------------ */

const featureIcons: Record<FeatureIcon, LucideIcon> = {
  layers: Layers,
  repeat: Repeat,
  messages: MessagesSquare,
  list: ListChecks,
  timer: Timer,
  library: Library,
};

export function Features() {
  return (
    <section id="fitur" className="bg-night py-20 text-white md:py-28">
      <Container>
        <SectionHeading
          inverse
          eyebrow="Isi di dalamnya"
          title="Semua alat belajar, saling terhubung"
          description="Kosakata yang kamu pelajari di modul otomatis masuk ke flashcard, lalu muncul lagi di bank soal dan simulasi ujian."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = featureIcons[f.icon];
            return (
              <li key={f.title} className="bg-night p-6 md:p-8">
                <span className="grid size-11 place-items-center rounded-xl bg-primary-500/15 text-primary-300 ring-1 ring-inset ring-primary-400/20">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-h3">{f.title}</h3>
                <p className="mt-2 text-body text-slate-300">{f.body}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Perbandingan                                                       */
/* ------------------------------------------------------------------ */

function CompareCell({ value }: { value: CompareValue }) {
  if (value === true)
    return (
      <>
        <Check className="mx-auto size-5 text-success-700" aria-hidden />
        <span className="sr-only">Ya</span>
      </>
    );
  if (value === false)
    return (
      <>
        <Minus className="mx-auto size-5 text-slate-400" aria-hidden />
        <span className="sr-only">Tidak</span>
      </>
    );
  return <span>{value}</span>;
}

export function Comparison() {
  return (
    <section id="perbandingan" className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Perbandingan jujur"
          title="Di mana LearnHub cocok, dan di mana tidak"
          description="Setiap cara belajar punya kelebihan. Tabel ini membantu kamu memilih — termasuk kalau jawabannya bukan kami."
        />

        {/* Scroll horizontal native (tanpa JS) untuk layar kecil */}
        <div className="relative mt-12 overflow-x-auto rounded-2xl ring-1 ring-line">
          <table className="w-full min-w-[640px] border-collapse text-left text-body-sm">
            <caption className="sr-only">Perbandingan LearnHub dengan cara belajar lain</caption>
            <thead>
              <tr className="bg-surface">
                <th scope="col" className="p-4 font-medium text-muted">
                  Aspek
                </th>
                {comparison.columns.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={`p-4 text-center font-semibold ${
                      i === 0 ? "bg-primary-50 text-primary-700" : "text-ink"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((r) => (
                <tr key={r.label} className="border-t border-line">
                  <th scope="row" className="p-4 font-medium text-ink">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td
                      key={i}
                      className={`p-4 text-center ${
                        i === 0 ? "bg-primary-50/60 font-semibold text-primary-900" : "text-muted"
                      }`}
                    >
                      <CompareCell value={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Untuk siapa                                                        */
/* ------------------------------------------------------------------ */

export function Personas() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Untuk siapa"
          title="Tujuanmu beda-beda, roadmap-nya ikut menyesuaikan"
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((p) => (
            <li key={p.role} className="flex items-start justify-between gap-4 rounded-2xl bg-white p-6 ring-1 ring-line">
              <div>
                <h3 className="text-h3 text-ink">{p.role}</h3>
                <p className="mt-1 text-body-sm text-muted">{p.goal}</p>
              </div>
              <div className="flex gap-1">
                {p.langs.map((c) => (
                  <LanguageTile key={c} code={c} size="sm" />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                */
/* ------------------------------------------------------------------ */

export function Faq() {
  return (
    <section id="faq" className="bg-surface py-20 md:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title="Pertanyaan yang sering muncul"
          description="Masih ada yang belum terjawab? Tanyakan lewat email ke halo@learnhub.id."
        />
        {/* <details> native: aksesibel tanpa JS, aria-expanded otomatis */}
        <div className="divide-y divide-line rounded-2xl bg-white ring-1 ring-line">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5 md:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-h3 text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden
                  className="grid size-7 shrink-0 place-items-center rounded-full bg-surface text-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-body text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA penutup                                                        */
/* ------------------------------------------------------------------ */

export function FinalCta() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 px-6 py-14 text-center text-white md:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-around text-[8rem] font-bold text-white/5 select-none"
          >
            {languages.map((l) => (
              <span key={l.code} lang={l.code}>
                {l.glyph}
              </span>
            ))}
          </div>
          <h2 className="relative mx-auto max-w-2xl text-h1">
            Mulai dari satu modul hari ini. Roadmap-nya sudah menunggu.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-body text-primary-100">
            Tes penempatan 10 menit, lalu kamu langsung tahu harus belajar apa minggu ini.
          </p>
          <ButtonLink href="#harga" size="lg" variant="inverse" className="relative mt-8">
            Pilih paket <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
