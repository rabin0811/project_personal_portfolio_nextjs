import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { getPrisma } from "@/lib/db";
import { readJson, s } from "@/lib/api-utils";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const prisma = await getPrisma();
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/about");
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await readJson(request);
  const name = s(body?.name, 60);
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const prisma = await getPrisma();
  await prisma.skill.update({ where: { id }, data: { name } });
  revalidatePath("/");
  revalidatePath("/about");
  return NextResponse.json({ ok: true });
}
