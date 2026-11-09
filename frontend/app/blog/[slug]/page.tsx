import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tag } from "@/components/ui";
import { Img } from "@/components/image";
import { getPublishedPostBySlug } from "@/lib/repositories/blog";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Entry not found" };
  return {
    title: post.title,
    description: `A travel journal entry from ${post.location ?? "the road"}.`,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const coverIndex = post.blocks.findIndex((block) => block.type === "image");

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-mute hover:text-signal"
      >
        ‹ back to blog
      </Link>

      <header className="mt-6 border-b border-line pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-mute">
          {[post.location, formatDate(post.publishedAt)].filter(Boolean).join(" · ")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        {post.location && (
          <div className="mt-4">
            <Tag>{post.location}</Tag>
          </div>
        )}
      </header>

      <div className="mt-8 space-y-8">
        {post.blocks.map((block, index) => {
          if (block.type === "image") {
            const isCover = index === coverIndex && coverIndex < 2;
            return (
              <figure key={block.id}>
                <div className="border border-line bg-ink">
                  <Img
                    src={block.content}
                    alt={block.caption ?? `Photo in ${post.title}`}
                    className="w-full object-contain"
                    eager={isCover}
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-2 text-center font-mono text-xs uppercase tracking-[0.15em] text-mute">
                    [ {block.caption} ]
                  </figcaption>
                )}
              </figure>
            );
          }
          return (
            <p key={block.id} className="whitespace-pre-line text-base leading-relaxed text-ink">
              {block.content}
            </p>
          );
        })}
      </div>
    </article>
  );
}

function formatDate(value: Date | null): string {
  if (!value) return "";
  return value.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
