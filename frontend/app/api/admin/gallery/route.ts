import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { listGalleryImages } from "@/lib/repositories/gallery";
import { putImage } from "@/lib/r2";
import { getPrisma } from "@/lib/db";
import { s, sOrNull } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const images = await listGalleryImages();
  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
  if (!allowed.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const caption = s(form.get("caption"), 200);
  const location = sOrNull(form.get("location"), 120);
  const data = new Uint8Array(await file.arrayBuffer());
  const key = await putImage(data, file.type, "gallery", file.name);

  const prisma = await getPrisma();
  const image = await prisma.galleryImage.create({
    data: { url: `/cdn/${key}`, caption: caption || null, location },
  });
  revalidatePath("/gallery");
  return NextResponse.json({ image });
}
