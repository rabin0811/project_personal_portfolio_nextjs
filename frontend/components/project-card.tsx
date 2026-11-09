import Link from "next/link";
import { Img } from "@/components/image";
import { Tag } from "@/components/ui";
import { splitTags } from "@/lib/tags";

export function ProjectCard({
  slug,
  title,
  summary,
  techTags,
  image,
}: {
  slug: string;
  title: string;
  summary: string;
  techTags: string;
  image?: string | null;
}) {
  return (
    <Link
      href={`/work/${slug}`}
      className="group block border border-line bg-paper transition-colors hover:border-ink"
    >
      <div className="aspect-[16/10] overflow-hidden border-b border-line bg-ink">
        {image ? (
          <Img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
            {title}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-semibold group-hover:text-signal">
            {title}
          </h3>
          <span aria-hidden="true" className="font-mono text-mute transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-mute">{summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {splitTags(techTags).slice(0, 4).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}
