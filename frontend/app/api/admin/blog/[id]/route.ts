import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { getPostById } from "@/lib/repositories/blog";
import {
  deletePost,
  publishPost,
  unpublishPost,
  updatePost,
  type BlogBlockInput,
} from "@/lib/services/blog-service";
import { readJson, s, sOrNull } from "@/lib/api-utils";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
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
        .filter((block) => (block.type === "image" ? Boolean(block.content) : true))
    : [];

  try {
    const post = await updatePost(id, {
      title,
      slug,
      location: sOrNull(body.location, 120),
      status,
      blocks,
    });
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update post" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await readJson(request);
  const action = body?.action;
  if (action === "publish") {
    await publishPost(id);
  } else if (action === "unpublish") {
    await unpublishPost(id);
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
  revalidatePath("/");
  revalidatePath("/blog");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deletePost(id);
  revalidatePath("/");
  revalidatePath("/blog");
  return NextResponse.json({ ok: true });
}
