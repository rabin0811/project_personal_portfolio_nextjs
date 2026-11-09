import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { listAllSkills } from "@/lib/repositories/skills";
import { getPrisma } from "@/lib/db";
import { reorderSkills } from "@/lib/services/blog-service";
import { readJson, s } from "@/lib/api-utils";

const CATEGORIES = ["language", "framework", "tool"];

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const skills = await listAllSkills();
  return NextResponse.json({ skills });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const name = s(body.name, 60);
  const category = CATEGORIES.includes(s(body.category, 20)) ? s(body.category, 20) : "tool";
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const prisma = await getPrisma();
  const max = await prisma.skill.aggregate({ _max: { order: true }, where: { category } });
  const skill = await prisma.skill.create({
    data: { name, category, order: (max._max.order ?? -1) + 1 },
  });
  revalidatePath("/");
  revalidatePath("/about");
  return NextResponse.json({ skill });
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await readJson<{ ids?: unknown }>(request);
  const ids = Array.isArray(body?.ids) ? body.ids.filter((id): id is string => typeof id === "string") : [];
  if (ids.length === 0) return NextResponse.json({ error: "No ids provided" }, { status: 400 });
  await reorderSkills(ids);
  revalidatePath("/");
  revalidatePath("/about");
  return NextResponse.json({ ok: true });
}
