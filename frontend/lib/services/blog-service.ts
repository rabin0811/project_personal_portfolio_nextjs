import { getPrisma } from "@/lib/db";
import { postSlugExists } from "@/lib/repositories/blog";
import { deleteImage } from "@/lib/r2";

export type BlogBlockInput = {
  type: "text" | "image";
  content: string;
  caption?: string | null;
};

export type BlogPostInput = {
  title: string;
  slug: string;
  location?: string | null;
  status: "draft" | "published";
  blocks: BlogBlockInput[];
};

export async function createPost(input: BlogPostInput) {
  if (await postSlugExists(input.slug)) {
    throw new Error("A post with this slug already exists.");
  }
  const prisma = await getPrisma();
  return prisma.blogPost.create({
    data: {
      title: input.title,
      slug: input.slug,
      location: input.location,
      status: input.status,
      publishedAt: input.status === "published" ? new Date() : null,
      blocks: {
        create: input.blocks.map((block, index) => ({
          type: block.type,
          content: block.content,
          caption: block.caption,
          order: index,
        })),
      },
    },
    include: { blocks: true },
  });
}

export async function updatePost(id: string, input: BlogPostInput) {
  if (await postSlugExists(input.slug, id)) {
    throw new Error("A post with this slug already exists.");
  }
  const prisma = await getPrisma();
  const existing = await prisma.blogPost.findUnique({ where: { id } });

  const updated = await prisma.blogPost.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      location: input.location,
      status: input.status,
      publishedAt:
        input.status === "published"
          ? existing?.publishedAt ?? new Date()
          : existing?.publishedAt,
    },
  });

  await prisma.blogBlock.deleteMany({ where: { postId: id } });
  if (input.blocks.length > 0) {
    await prisma.blogBlock.createMany({
      data: input.blocks.map((block, index) => ({
        postId: id,
        type: block.type,
        content: block.content,
        caption: block.caption,
        order: index,
      })),
    });
  }
  return updated;
}

export async function publishPost(id: string) {
  const prisma = await getPrisma();
  return prisma.blogPost.update({
    where: { id },
    data: { status: "published", publishedAt: new Date() },
  });
}

export async function unpublishPost(id: string) {
  const prisma = await getPrisma();
  return prisma.blogPost.update({ where: { id }, data: { status: "draft" } });
}

export async function deletePost(id: string) {
  const prisma = await getPrisma();
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { blocks: true },
  });
  if (post) {
    await Promise.all(
      post.blocks
        .filter((block) => block.type === "image")
        .map((block) =>
          deleteImage(block.content.replace(/^\/cdn\//, "")).catch(() => {}),
        ),
    );
  }
  return prisma.blogPost.delete({ where: { id } });
}

export async function reorderSkills(ids: string[]) {
  const prisma = await getPrisma();
  for (let i = 0; i < ids.length; i++) {
    await prisma.skill.update({
      where: { id: ids[i] },
      data: { order: i },
    });
  }
}

export async function reorderExperiences(ids: string[]) {
  const prisma = await getPrisma();
  for (let i = 0; i < ids.length; i++) {
    await prisma.experience.update({
      where: { id: ids[i] },
      data: { order: i },
    });
  }
}
