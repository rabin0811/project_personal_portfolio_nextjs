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
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/about");
  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const prisma = await getPrisma();
  await prisma.experience.update({
    where: { id },
    data: {
      role: s(body.role, 120),
      company: s(body.company, 120),
      dates: s(body.dates, 80),
      description: s(body.description, 1000) || null,
    },
  });
  revalidatePath("/about");
  return NextResponse.json({ ok: true });
}
