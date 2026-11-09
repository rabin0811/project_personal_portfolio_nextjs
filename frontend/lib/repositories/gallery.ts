import { getPrisma } from "@/lib/db";

export async function listGalleryImages() {
  const prisma = await getPrisma();
  return prisma.galleryImage.findMany({ orderBy: { uploadedAt: "desc" } });
}
