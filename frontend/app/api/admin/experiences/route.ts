import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { getPrisma } from "@/lib/db";
import { reorderExperiences } from "@/lib/services/blog-service";
import { readJson, s } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prisma = await getPrisma();
  const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ experiences });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const role = s(body.role, 120);
  const company = s(body.company, 120);
  if (!role || !company) {
    return NextResponse.json({ error: "Role and company are required" }, { status: 400 });
  }

  const prisma = await getPrisma();
  const max = await prisma.experience.aggregate({ _max: { order: true } });
  const experience = await prisma.experience.create({
    data: {
      role,
      company,
      dates: s(body.dates, 80),
      description: s(body.description, 1000) || null,
      order: (max._max.order ?? -1) + 1,
    },
  });
  revalidatePath("/about");
  return NextResponse.json({ experience });
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await readJson<{ ids?: unknown }>(request);
  const ids = Array.isArray(body?.ids) ? body.ids.filter((id): id is string => typeof id === "string") : [];
  if (ids.length === 0) return NextResponse.json({ error: "No ids provided" }, { status: 400 });
  await reorderExperiences(ids);
  revalidatePath("/about");
  return NextResponse.json({ ok: true });
}
