"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Img } from "@/components/image";
import { InlineStatus } from "@/components/admin/form";

type GalleryItem = {
  id: string;
  url: string;
  caption: string | null;
  location: string | null;
  uploadedAt: string;
};

export function GalleryManager() {
  const [images, setImages] = useState<GalleryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ message: string; tone: "ok" | "error" } | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/gallery");
      const json = (await response.json()) as { images?: GalleryItem[]; error?: string };
      if (!response.ok) throw new Error(json.error ?? "Failed to load");
      setImages(json.images ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setStatus({ message: "Choose a photo first", tone: "error" });
      setBusy(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/gallery", { method: "POST", body: data });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(json.error ?? "Upload failed");
      setStatus({ message: "Uploaded", tone: "ok" });
      setCaption("");
      setLocation("");
      form.reset();
      void load();
    } catch (err) {
      setStatus({ message: err instanceof Error ? err.message : "Upload failed", tone: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function updateMeta(image: GalleryItem, patch: { caption?: string | null; location?: string | null }) {
    await fetch(`/api/admin/gallery/${image.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    void load();
  }

  async function remove(image: GalleryItem) {
    if (!confirm("Delete this photo? The file will be removed.")) return;
    await fetch(`/api/admin/gallery/${image.id}`, { method: "DELETE" });
    void load();
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={onUpload} className="border border-line p-4">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-mute">upload new photo</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">file *</span>
            <input
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              required
              className="border border-line bg-paper px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">caption</span>
            <input name="caption" value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={200} className="border border-line bg-paper px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">location</span>
            <input name="location" value={location} onChange={(event) => setLocation(event.target.value)} maxLength={120} className="border border-line bg-paper px-3 py-2 text-sm" />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-paper hover:bg-signal disabled:opacity-50"
          >
            {busy ? "uploading…" : "upload"}
          </button>
        </div>
        <div className="mt-3">
          <InlineStatus message={status?.message ?? null} tone={status?.tone} />
        </div>
      </form>

      {error && <p className="font-mono text-xs text-signal">✗ {error}</p>}
      {!images && !error && <p className="font-mono text-xs text-mute">loading…</p>}

      {images && images.length === 0 && (
        <p className="border border-dashed border-line p-10 text-center font-mono text-xs text-mute">
          Gallery is empty.
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images?.map((image) => (
          <li key={image.id} className="border border-line p-3">
            <Img src={image.url} alt={image.caption ?? "Photo"} className="aspect-square w-full border border-line object-cover" />
            <div className="mt-3 flex flex-col gap-2">
              <input
                defaultValue={image.caption ?? ""}
                onBlur={(event) => updateMeta(image, { caption: event.target.value || null })}
                placeholder="caption"
                maxLength={200}
                className="border border-line bg-paper px-2 py-1.5 text-sm"
              />
              <input
                defaultValue={image.location ?? ""}
                onBlur={(event) => updateMeta(image, { location: event.target.value || null })}
                placeholder="location"
                maxLength={120}
                className="border border-line bg-paper px-2 py-1.5 text-sm"
              />
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-mute">
                  {new Date(image.uploadedAt).toLocaleDateString()}
                </span>
                <button type="button" onClick={() => remove(image)} className="font-mono text-xs uppercase tracking-[0.12em] text-mute hover:text-signal">
                  delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
