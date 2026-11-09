"use client";

import { useCallback, useEffect } from "react";
import { Img } from "@/components/image";

export type LightboxImage = {
  url: string;
  caption?: string | null;
  location?: string | null;
  uploadedAt?: Date | string | null;
};

export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const current = images[index];

  const close = useCallback(() => onClose(), [onClose]);
  const prev = useCallback(
    () => onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate],
  );
  const next = useCallback(
    () => onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("locked");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("locked");
    };
  }, [close, prev, next]);

  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.caption ?? "Photo"}
      className="fixed inset-0 z-50 flex flex-col bg-ink/95 backdrop-blur-sm"
      onClick={close}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-paper/70">
          {index + 1} / {images.length}
        </p>
        <button
          type="button"
          onClick={close}
          className="px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-paper/70 hover:text-signal"
          aria-label="Close"
        >
          esc ✕
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 sm:px-16" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 px-3 py-6 font-mono text-2xl text-paper/70 hover:text-signal sm:left-6"
        >
          ‹
        </button>
        <Img
          src={current.url}
          alt={current.caption ?? "Gallery photo"}
          className="max-h-[75vh] max-w-full border border-line/20 object-contain"
          eager
        />
        <button
          type="button"
          onClick={next}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-6 font-mono text-2xl text-paper/70 hover:text-signal sm:right-6"
        >
          ›
        </button>
      </div>

      <div className="px-4 pb-6 pt-4 text-center sm:px-6">
        {current.caption && (
          <p className="font-display text-base text-paper">{current.caption}</p>
        )}
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-paper/60">
          {[current.location, formatDate(current.uploadedAt)]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </div>
  );
}

function formatDate(value?: Date | string | null): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
