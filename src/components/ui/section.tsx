import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  inverse?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  inverse = false,
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`max-w-2xl ${alignCls}`}>
      <p
        className={`text-caption uppercase tracking-widest ${
          inverse ? "text-primary-300" : "text-primary-600"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className={`mt-3 text-h1 ${inverse ? "text-white" : "text-ink"}`}>{title}</h2>
      {description && (
        <p className={`mt-4 text-body ${inverse ? "text-slate-300" : "text-muted"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

/** Highlight kata kunci di headline — pakai garis bawah tebal, bukan blok warna penuh */
export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative whitespace-nowrap text-primary-600">
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-[0.08em] -z-0 h-[0.3em] rounded-sm bg-primary-100"
      />
    </span>
  );
}
