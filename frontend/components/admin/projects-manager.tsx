"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Img } from "@/components/image";

type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  published: boolean;
  featured: boolean;
  order: number;
  screenshots: { id: string; url: string }[];
};

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/projects");
      const json = (await response.json()) as { projects?: Project[]; error?: string };
      if (!response.ok) throw new Error(json.error ?? "Failed to load");
      setProjects(json.projects ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function reorder(ids: string[]) {
    await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    void load();
  }

  async function move(index: number, direction: -1 | 1) {
    if (!projects) return;
    const next = [...projects];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setProjects(next);
    await reorder(next.map((project) => project.id));
  }

  async function remove(project: Project) {
    if (!confirm(`Delete project "${project.title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
    void load();
  }

  if (error) return <p className="font-mono text-xs text-signal">✗ {error}</p>;
  if (!projects) return <p className="font-mono text-xs text-mute">loading…</p>;

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {projects.map((project, index) => (
          <li key={project.id} className="flex items-center gap-3 border border-line p-3">
            <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden border border-line bg-ink">
              {project.screenshots[0] ? (
                <Img src={project.screenshots[0].url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="font-mono text-[9px] uppercase text-paper/50">none</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-semibold">{project.title}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
                /work/{project.slug} · {project.published ? "published" : "draft"}
                {project.featured ? " · featured" : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 font-mono text-xs">
              <button type="button" disabled={index === 0} onClick={() => move(index, -1)} className="px-1.5 py-1 text-mute hover:text-ink disabled:opacity-30" aria-label="Move up">↑</button>
              <button type="button" disabled={index === projects.length - 1} onClick={() => move(index, 1)} className="px-1.5 py-1 text-mute hover:text-ink disabled:opacity-30" aria-label="Move down">↓</button>
              <Link href={`/admin/projects/${project.id}`} className="px-1.5 py-1 text-signal hover:underline">edit</Link>
              <button type="button" onClick={() => remove(project)} className="px-1.5 py-1 text-mute hover:text-signal">✕</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <Link href="/admin/projects/new" className="inline-block border border-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] hover:bg-ink hover:text-paper">
          + new project
        </Link>
      </div>
    </div>
  );
}
