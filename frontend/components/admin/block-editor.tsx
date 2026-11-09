"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Field, InlineStatus, Input, SaveButton } from "@/components/admin/form";
import { UploadButton } from "@/components/admin/upload-button";
import { Img } from "@/components/image";
import { slugify } from "@/lib/slug";

export type Block = {
  key: string;
  type: "text" | "image";
  content: string;
  caption: string;
};

let blockCounter = 0;
const nextKey = () => `b${Date.now()}-${blockCounter++}`;

export function BlockEditor({
  post,
}: {
  post?: {
    id: string;
    title: string;
    slug: string;
    location: string | null;
    status: "draft" | "published";
    blocks: { type: "text" | "image"; content: string; caption: string | null }[];
  } | null;
}) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ message: string; tone: "ok" | "error" } | null>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [location, setLocation] = useState(post?.location ?? "");
  const [publish, setPublish] = useState((post?.status ?? "draft") === "published");
  const [blocks, setBlocks] = useState<Block[]>(
    post?.blocks.map((block) => ({
      key: nextKey(),
      type: block.type,
      content: block.content,
      caption: block.caption ?? "",
    })) ?? [],
  );

  function onTitleChange(value: string) {
    setTitle(value);
    if (!isEdit) setSlug(slugify(value));
  }

  function addTextBlock() {
    setBlocks((current) => [...current, { key: nextKey(), type: "text", content: "", caption: "" }]);
  }

  function addImageBlock() {
    setBlocks((current) => [...current, { key: nextKey(), type: "image", content: "", caption: "" }]);
  }

  function updateBlock(key: string, patch: Partial<Block>) {
    setBlocks((current) => current.map((block) => (block.key === key ? { ...block, ...patch } : block)));
  }

  function moveBlock(key: string, direction: -1 | 1) {
    setBlocks((current) => {
      const index = current.findIndex((block) => block.key === key);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeBlock(key: string) {
    setBlocks((current) => current.filter((block) => block.key !== key));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (isEdit && !post) return;
    setBusy(true);
    setStatus(null);
    const payload = {
      title,
      slug,
      location,
      status: publish ? "published" : "draft",
      blocks: blocks.map(({ type, content, caption }) => ({ type, content, caption: caption || null })),
    };
    try {
      const response = await fetch(isEdit ? `/api/admin/blog/${post!.id}` : "/api/admin/blog", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(json.error ?? "Save failed");
      setStatus({ message: "Saved", tone: "ok" });
      if (!isEdit) router.push("/admin/blog");
      else router.refresh();
    } catch (error) {
      setStatus({ message: error instanceof Error ? error.message : "Save failed", tone: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="title *">
          <Input value={title} onChange={(event) => onTitleChange(event.target.value)} required />
        </Field>
        <Field label="slug *">
          <Input value={slug} onChange={(event) => setSlug(event.target.value)} required />
        </Field>
        <Field label="location">
          <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Kathmandu" />
        </Field>
      </div>

      <label className="flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-mute">
        <input type="checkbox" checked={publish} onChange={(event) => setPublish(event.target.checked)} className="h-4 w-4 accent-ink" />
        publish
      </label>

      <div className="border border-line p-4">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-mute">
          blocks — rendered top to bottom in this order
        </p>

        <div className="flex flex-col gap-4">
          {blocks.map((block, index) => (
            <div key={block.key} className="border border-dashed border-line p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-signal">
                  {block.type === "text" ? "¶ text block" : "◉ photo block"}
                </p>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <button type="button" disabled={index === 0} onClick={() => moveBlock(block.key, -1)} className="px-1 text-mute hover:text-ink disabled:opacity-30" aria-label="Move up">↑</button>
                  <button type="button" disabled={index === blocks.length - 1} onClick={() => moveBlock(block.key, 1)} className="px-1 text-mute hover:text-ink disabled:opacity-30" aria-label="Move down">↓</button>
                  <button type="button" onClick={() => removeBlock(block.key)} className="px-1 text-mute hover:text-signal" aria-label="Remove">✕</button>
                </div>
              </div>

              {block.type === "text" ? (
                <textarea
                  value={block.content}
                  onChange={(event) => updateBlock(block.key, { content: event.target.value })}
                  rows={4}
                  className="w-full resize-y border border-line bg-paper px-3 py-2 text-sm focus:border-ink"
                  placeholder="Write the story…"
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {block.content ? (
                    <div className="flex items-start gap-3">
                      <Img src={block.content} alt="block photo" className="h-24 w-36 border border-line object-cover" />
                      <button
                        type="button"
                        onClick={() => updateBlock(block.key, { content: "" })}
                        className="font-mono text-xs uppercase tracking-[0.12em] text-signal hover:underline"
                      >
                        replace photo
                      </button>
                    </div>
                  ) : (
                    <UploadButton folder="blog" onUploaded={(url) => updateBlock(block.key, { content: url })} label="upload photo" />
                  )}
                  <input
                    value={block.caption}
                    onChange={(event) => updateBlock(block.key, { caption: event.target.value })}
                    className="border border-line bg-paper px-3 py-2 text-sm focus:border-ink"
                    placeholder="Caption (optional)"
                  />
                </div>
              )}
            </div>
          ))}

          {blocks.length === 0 && (
            <p className="border border-dashed border-line p-6 text-center font-mono text-xs text-mute">
              No blocks yet — add text or a photo below.
            </p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button type="button" onClick={addTextBlock} className="border border-line px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-mute hover:border-ink hover:text-ink">
            + text block
          </button>
          <button type="button" onClick={addImageBlock} className="border border-line px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-mute hover:border-ink hover:text-ink">
            + photo block
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SaveButton busy={busy}>{isEdit ? "[ Save ]" : "[ Create ]"}</SaveButton>
        <InlineStatus message={status?.message ?? null} tone={status?.tone} />
      </div>
    </form>
  );
}
