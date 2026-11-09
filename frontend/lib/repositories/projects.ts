import { getPrisma } from "@/lib/db";

export async function listPublishedProjects() {
  const prisma = await getPrisma();
  return prisma.project.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { screenshots: { orderBy: { order: "asc" } } },
  });
}

export async function listFeaturedProjects() {
  const prisma = await getPrisma();
  return prisma.project.findMany({
    where: { published: true, featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { screenshots: { orderBy: { order: "asc" } } },
  });
}

export async function listAllProjects() {
  const prisma = await getPrisma();
  return prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { screenshots: { orderBy: { order: "asc" } } },
  });
}

export async function getPublishedProjectBySlug(slug: string) {
  const prisma = await getPrisma();
  return prisma.project.findUnique({
    where: { slug },
    include: { screenshots: { orderBy: { order: "asc" } } },
  });
}

export async function getProjectById(id: string) {
  const prisma = await getPrisma();
  return prisma.project.findUnique({
    where: { id },
    include: { screenshots: { orderBy: { order: "asc" } } },
  });
}

export async function projectSlugExists(slug: string, excludeId?: string) {
  const prisma = await getPrisma();
  const existing = await prisma.project.findUnique({ where: { slug } });
  return existing !== null && existing.id !== excludeId;
}
