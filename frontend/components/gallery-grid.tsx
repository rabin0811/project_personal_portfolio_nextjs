"use client";

import { useState } from "react";
import { Img } from "@/components/image";
import { Lightbox } from "@/components/lightbox";

export type GalleryImage = {
  id: string;
  url: string;
  caption: string | null;
  location: string | null;
  uploadedAt: Date;
};

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <p className="border border-dashed border-line p-10 text-center font-mono text-sm text-mute">
        Gallery is empty — photos will appear here.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative block aspect-square overflow-hidden border border-line bg-ink"
            aria-label={`View ${image.caption ?? "photo"}`}
          >
            <Img
              src={image.url}
              alt={image.caption ?? "Gallery photo"}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/80 to-transparent px-3 pb-2 pt-8 font-mono text-[10px] uppercase tracking-[0.15em] text-paper opacity-0 transition-opacity group-hover:opacity-100">
              <span>{image.location ?? "—"}</span>
              <span>↗</span>
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          images={images.map(({ url, caption, location, uploadedAt }) => ({
            url,
            caption,
            location,
            uploadedAt,
          }))}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </>
  );
}
