import { getPrisma } from "@/lib/db";

export async function listPublishedPosts() {
  const prisma = await getPrisma();
  return prisma.blogPost.findMany({
    where: { status: "published", publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    include: { blocks: { orderBy: { order: "asc" } } },
  });
}

export async function listAllPosts() {
  const prisma = await getPrisma();
  return prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    include: { blocks: { orderBy: { order: "asc" } } },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  const prisma = await getPrisma();
  return prisma.blogPost.findFirst({
    where: { slug, status: "published", publishedAt: { not: null } },
    include: { blocks: { orderBy: { order: "asc" } } },
  });
}

export async function getPostById(id: string) {
  const prisma = await getPrisma();
  return prisma.blogPost.findUnique({
    where: { id },
    include: { blocks: { orderBy: { order: "asc" } } },
  });
}

export async function postSlugExists(slug: string, excludeId?: string) {
  const prisma = await getPrisma();
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  return existing !== null && existing.id !== excludeId;
}

export function postCover(post: {
  blocks: { type: string; content: string }[];
}): string | null {
  const cover = post.blocks.find((block) => block.type === "image");
  return cover ? cover.content : null;
}

export function postExcerpt(post: {
  blocks: { type: string; content: string }[];
}): string {
  const text = post.blocks
    .filter((block) => block.type === "text")
    .map((block) => block.content)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 160 ? `${text.slice(0, 160)}…` : text;
}
