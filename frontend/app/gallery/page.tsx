import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui";
import { GalleryGrid } from "@/components/gallery-grid";
import { listGalleryImages } from "@/lib/repositories/gallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Rabin Humagain's travels and daily life.",
};

export default async function GalleryPage() {
  const images = await listGalleryImages();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeader title="Gallery" />
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute">
        Places, faces, and quiet moments. Click any photo to view it full size.
      </p>
      <div className="mt-8">
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
