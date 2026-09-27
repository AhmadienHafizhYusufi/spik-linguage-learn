import { languages, type LanguageCode } from "@/data/landing";

const byCode = Object.fromEntries(languages.map((l) => [l.code, l]));

/** Tile aksara bahasa — pengganti emoji bendera (lihat audit Volingo 3.3) */
export function LanguageTile({
  code,
  size = "md",
}: {
  code: LanguageCode;
  size?: "sm" | "md" | "lg";
}) {
  const lang = byCode[code];
  const sizeCls = {
    sm: "size-7 rounded-md text-xs",
    md: "size-10 rounded-lg text-base",
    lg: "size-14 rounded-xl text-2xl",
  }[size];

  return (
    <span
      lang={code}
      title={lang.name}
      className={`inline-grid shrink-0 place-items-center font-bold ring-1 ring-inset ${lang.tone} ${sizeCls}`}
    >
      <span aria-hidden>{lang.glyph}</span>
      <span className="sr-only">{lang.name}</span>
    </span>
  );
}
