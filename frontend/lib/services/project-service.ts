import { getPrisma } from "@/lib/db";
import { projectSlugExists } from "@/lib/repositories/projects";
import { deleteImage } from "@/lib/r2";

export type ProjectInput = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  liveUrl?: string | null;
  repoUrl?: string | null;
  techTags?: string;
  featured?: boolean;
  published?: boolean;
  order?: number;
};

export async function createProject(input: ProjectInput) {
  if (await projectSlugExists(input.slug)) {
    throw new Error("A project with this slug already exists.");
  }
  const prisma = await getPrisma();
  return prisma.project.create({ data: input });
}

export async function updateProject(id: string, input: ProjectInput) {
  if (await projectSlugExists(input.slug, id)) {
    throw new Error("A project with this slug already exists.");
  }
  const prisma = await getPrisma();
  return prisma.project.update({ where: { id }, data: input });
}

export async function deleteProject(id: string) {
  const prisma = await getPrisma();
  const project = await prisma.project.findUnique({
    where: { id },
    include: { screenshots: true },
  });
  if (!project) throw new Error("Project not found");
  await Promise.all(
    project.screenshots.map((shot) =>
      deleteImage(shot.url.replace(/^\/cdn\//, "")).catch(() => {}),
    ),
  );
  return prisma.project.delete({ where: { id } });
}

export async function reorderProjects(ids: string[]) {
  const prisma = await getPrisma();
  for (let i = 0; i < ids.length; i++) {
    await prisma.project.update({
      where: { id: ids[i] },
      data: { order: i },
    });
  }
}

export async function addProjectScreenshot(projectId: string, url: string) {
  const prisma = await getPrisma();
  const count = await prisma.projectImage.count({ where: { projectId } });
  return prisma.projectImage.create({
    data: { projectId, url, order: count },
  });
}

export async function removeProjectScreenshot(id: string) {
  const prisma = await getPrisma();
  const image = await prisma.projectImage.findUnique({ where: { id } });
  if (image) {
    await deleteImage(image.url.replace(/^\/cdn\//, "")).catch(() => {});
  }
  return prisma.projectImage.delete({ where: { id } });
}
