import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { deleteImage } from "@/lib/r2";
import { getPrisma } from "@/lib/db";
import { readJson, s, sOrNull } from "@/lib/api-utils";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const prisma = await getPrisma();
  const image = await prisma.galleryImage.update({
    where: { id },
    data: { caption: s(body.caption, 200) || null, location: sOrNull(body.location, 120) },
  });
  revalidatePath("/gallery");
  return NextResponse.json({ image });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const prisma = await getPrisma();
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (image) {
    await deleteImage(image.url.replace(/^\/cdn\//, "")).catch(() => {});
  }
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}
