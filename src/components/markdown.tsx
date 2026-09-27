import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Render Markdown materi.
 * Aman: react-markdown TIDAK merender HTML mentah (tanpa rehype-raw),
 * jadi admin yang menempel <script> tidak akan tereksekusi di browser pembeli.
 */
export function Markdown({ children, lang }: { children: string; lang?: string }) {
  return (
    <div
      lang={lang}
      className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-primary-700 prose-code:rounded prose-code:bg-surface prose-code:px-1 prose-code:before:content-none prose-code:after:content-none"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
