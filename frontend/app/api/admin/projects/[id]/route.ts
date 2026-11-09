import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { getProjectById } from "@/lib/repositories/projects";
import { deleteProject, updateProject } from "@/lib/services/project-service";
import { readJson, s, sOrNull, b, n } from "@/lib/api-utils";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const title = s(body.title, 160);
  const slug = s(body.slug, 80).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }

  try {
    const project = await updateProject(id, {
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
    revalidatePath(`/work/${project.slug}`);
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update project" },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await deleteProject(id);
    revalidatePath("/");
    revalidatePath("/work");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete project" },
      { status: 400 },
    );
  }
}
