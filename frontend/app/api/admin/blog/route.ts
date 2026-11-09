import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { listAllPosts } from "@/lib/repositories/blog";
import { createPost, type BlogBlockInput } from "@/lib/services/blog-service";
import { readJson, s, sOrNull } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await listAllPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await readJson<{
    title?: unknown;
    slug?: unknown;
    location?: unknown;
    status?: unknown;
    blocks?: unknown;
  }>(request);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const title = s(body.title, 200);
  const slug = s(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }

  const status = body.status === "published" ? "published" : "draft";
  const blocks: BlogBlockInput[] = Array.isArray(body.blocks)
    ? body.blocks
        .filter(
          (block): block is { type: "text" | "image"; content?: unknown; caption?: unknown } =>
            typeof block === "object" && block !== null && (block.type === "text" || block.type === "image"),
        )
        .map((block) => ({
          type: block.type,
          content: s(block.content, 20000),
          caption: sOrNull(block.caption, 300),
        }))
        .filter((block) => block.type === "image" ? Boolean(block.content) : true)
    : [];

  try {
    const post = await createPost({ title, slug, location: sOrNull(body.location, 120), status, blocks });
    revalidatePath("/");
    revalidatePath("/blog");
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create post" },
      { status: 400 },
    );
  }
}
