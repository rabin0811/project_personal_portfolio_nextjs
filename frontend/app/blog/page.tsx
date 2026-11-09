import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui";
import { PostCard } from "@/components/post-card";
import { listPublishedPosts, postCover, postExcerpt } from "@/lib/repositories/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes from Rabin Humagain's travels — a travel journal.",
};

export default async function BlogPage() {
  const posts = await listPublishedPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeader title="Blog — notes from my travels" />
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute">
        Short journal entries from the road, written the way they happened.
      </p>

      <div className="mt-8 grid gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            slug={post.slug}
            title={post.title}
            location={post.location}
            publishedAt={post.publishedAt}
            excerpt={postExcerpt(post)}
            cover={postCover(post)}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="mt-8 border border-dashed border-line p-10 text-center font-mono text-sm text-mute">
          No published entries yet.
        </p>
      )}
    </div>
  );
}
