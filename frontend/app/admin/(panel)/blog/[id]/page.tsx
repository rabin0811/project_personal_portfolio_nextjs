import Link from "next/link";
import { notFound } from "next/navigation";
import { Bracket } from "@/components/ui";
import { BlockEditor } from "@/components/admin/block-editor";
import { getPostById } from "@/lib/repositories/blog";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div>
      <Link href="/admin/blog" className="font-mono text-xs uppercase tracking-[0.15em] text-mute hover:text-signal">
        ‹ back
      </Link>
      <div className="mt-4">
        <Bracket>edit entry</Bracket>
        <div className="mt-6">
          <BlockEditor
            post={{
              id: post.id,
              title: post.title,
              slug: post.slug,
              location: post.location,
              status: post.status === "published" ? "published" : "draft",
              blocks: post.blocks.map((block) => ({
                type: block.type === "image" ? ("image" as const) : ("text" as const),
                content: block.content,
                caption: block.caption,
              })),
            }}
          />
        </div>
      </div>
    </div>
  );
}
