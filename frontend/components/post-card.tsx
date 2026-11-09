import Link from "next/link";
import { Img } from "@/components/image";

export function PostCard({
  slug,
  title,
  location,
  publishedAt,
  excerpt,
  cover,
}: {
  slug: string;
  title: string;
  location?: string | null;
  publishedAt: Date | null;
  excerpt: string;
  cover?: string | null;
}) {
  return (
    <Link href={`/blog/${slug}`} className="group flex gap-5 border border-line p-4 transition-colors hover:border-ink sm:p-5">
      <div className="hidden h-24 w-36 shrink-0 items-center justify-center overflow-hidden border border-line bg-ink sm:flex">
        {cover ? (
          <Img src={cover} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">no photo</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-mute">
          {[location, formatDate(publishedAt)].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-1.5 font-display text-base font-semibold group-hover:text-signal">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-mute">{excerpt}</p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-signal">read →</p>
      </div>
    </Link>
  );
}

function formatDate(value: Date | null): string {
  if (!value) return "";
  return value.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
