"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Checkbox, Field, InlineStatus, Input, SaveButton, TextArea } from "@/components/admin/form";
import { UploadButton, UploadPreview } from "@/components/admin/upload-button";
import { slugify } from "@/lib/slug";

export type Screenshot = { id: string; url: string };

export function ProjectForm({
  project,
}: {
  project?: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    description: string;
    liveUrl: string | null;
    repoUrl: string | null;
    techTags: string;
    featured: boolean;
    published: boolean;
    screenshots: Screenshot[];
  } | null;
}) {
  const router = useRouter();
  const isEdit = Boolean(project);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ message: string; tone: "ok" | "error" } | null>(null);

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [repoUrl, setRepoUrl] = useState(project?.repoUrl ?? "");
  const [techTags, setTechTags] = useState(project?.techTags ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [published, setPublished] = useState(project?.published ?? true);
  const [screenshots, setScreenshots] = useState<Screenshot[]>(project?.screenshots ?? []);

  function onTitleChange(value: string) {
    setTitle(value);
    if (!isEdit) setSlug(slugify(value));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (isEdit && !project) return;
    setBusy(true);
    setStatus(null);
    const payload = {
      title,
      slug,
      summary,
      description,
      liveUrl,
      repoUrl,
      techTags,
      featured,
      published,
    };
    try {
      const response = await fetch(
        isEdit ? `/api/admin/projects/${project!.id}` : "/api/admin/projects",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(json.error ?? "Save failed");
      setStatus({ message: isEdit ? "Project updated" : "Project created", tone: "ok" });
      if (!isEdit) router.push("/admin/projects");
      else router.refresh();
    } catch (error) {
      setStatus({ message: error instanceof Error ? error.message : "Save failed", tone: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function onScreenshotUploaded(url: string) {
    if (!isEdit || !project) return;
    const response = await fetch(`/api/admin/projects/screenshots/${project.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const json = (await response.json()) as { image?: Screenshot };
    const image = json.image;
    if (response.ok && image) setScreenshots((current) => [...current, image]);
  }

  async function onScreenshotRemove(id: string) {
    if (!isEdit) return;
    await fetch(`/api/admin/projects/screenshots/${id}`, { method: "DELETE" });
    setScreenshots((current) => current.filter((shot) => shot.id !== id));
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="title *">
          <Input value={title} onChange={(event) => onTitleChange(event.target.value)} required />
        </Field>
        <Field label="slug *" hint="URL-friendly — auto-generated from title on new projects">
          <Input value={slug} onChange={(event) => setSlug(event.target.value)} required />
        </Field>
      </div>

      <Field label="summary" hint="One-line pitch shown on cards">
        <TextArea rows={2} value={summary} onChange={(event) => setSummary(event.target.value)} />
      </Field>

      <Field label="description" hint="Long write-up — blank line separates paragraphs">
        <TextArea rows={10} value={description} onChange={(event) => setDescription(event.target.value)} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="live url">
          <Input value={liveUrl} onChange={(event) => setLiveUrl(event.target.value)} placeholder="https://…" />
        </Field>
        <Field label="repo url">
          <Input value={repoUrl} onChange={(event) => setRepoUrl(event.target.value)} placeholder="https://github.com/…" />
        </Field>
      </div>

      <Field label="tech tags" hint="Comma separated — e.g. Next.js, React, PostgreSQL">
        <Input value={techTags} onChange={(event) => setTechTags(event.target.value)} />
      </Field>

      <div className="flex gap-6">
        <Checkbox label="featured" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
        <Checkbox label="published" checked={published} onChange={(event) => setPublished(event.target.checked)} />
      </div>

      {isEdit && (
        <div className="border border-line p-4">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-mute">screenshots</p>
          <div className="flex flex-col gap-3">
            {screenshots.map((shot) => (
              <UploadPreview key={shot.id} url={shot.url} alt="screenshot" onClear={() => onScreenshotRemove(shot.id)} />
            ))}
            <UploadButton folder="projects" onUploaded={onScreenshotUploaded} label="add screenshot" />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <SaveButton busy={busy}>{isEdit ? "[ Save ]" : "[ Create ]"}</SaveButton>
        <InlineStatus message={status?.message ?? null} tone={status?.tone} />
      </div>
    </form>
  );
}
