import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { getPrisma } from "@/lib/db";
import { listAllProjects } from "@/lib/repositories/projects";
import { createProject } from "@/lib/services/project-service";
import { readJson, s, sOrNull, b, n } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await listAllProjects();
  return NextResponse.json({ projects });
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await readJson<{ ids?: unknown }>(request);
  const ids = Array.isArray(body?.ids) ? body.ids.filter((id): id is string => typeof id === "string") : [];
  if (ids.length === 0) return NextResponse.json({ error: "No ids provided" }, { status: 400 });
  const prisma = await getPrisma();
  for (let i = 0; i < ids.length; i++) {
    await prisma.project.update({ where: { id: ids[i] }, data: { order: i } });
  }
  revalidatePath("/");
  revalidatePath("/work");
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const title = s(body.title, 160);
  const slug = s(body.slug, 80).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }

  try {
    const project = await createProject({
      title,
      slug,
      summary: s(body.summary, 300),
      description: s(body.description, 20000) || title,
      liveUrl: sOrNull(body.liveUrl, 500),
      repoUrl: sOrNull(body.repoUrl, 500),
      techTags: s(body.techTags, 500),
      featured: b(body.featured),
      published: b(body.published),
      order: n(body.order, 0),
    });
    revalidatePath("/");
    revalidatePath("/work");
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create project" },
      { status: 400 },
    );
  }
}
