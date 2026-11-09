"use client";

import { useRef, useState } from "react";
import { Img } from "@/components/image";

export function UploadButton({
  folder,
  onUploaded,
  label = "upload image",
}: {
  folder: string;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const response = await fetch("/api/admin/uploads", { method: "POST", body: form });
      const json = (await response.json()) as { url?: string; error?: string };
      if (!response.ok) {
        setError(json.error ?? "Upload failed");
        return;
      }
      if (json.url) onUploaded(json.url);
    } catch {
      setError("Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="w-fit border border-dashed border-line px-3 py-2 font-mono text-xs uppercase tracking-[0.15em] text-mute hover:border-ink hover:text-ink disabled:opacity-50"
      >
        {busy ? "uploading…" : `⬆ ${label}`}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      {error && <p className="font-mono text-xs text-signal">✗ {error}</p>}
    </div>
  );
}

export function UploadPreview({
  url,
  alt,
  onClear,
}: {
  url: string;
  alt: string;
  onClear?: () => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <Img src={url} alt={alt} className="h-16 w-16 border border-line object-cover" />
      <div className="flex flex-col gap-1">
        <span className="break-all font-mono text-[10px] text-mute">{url}</span>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="w-fit font-mono text-xs uppercase tracking-[0.15em] text-signal hover:underline"
          >
            remove
          </button>
        )}
      </div>
    </div>
  );
}
