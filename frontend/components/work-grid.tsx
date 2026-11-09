"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { splitTags } from "@/lib/tags";
import type { ProjectWithImages } from "@/lib/types";

export function WorkGrid({ projects }: { projects: ProjectWithImages[] }) {
  const [filter, setFilter] = useState<string>("All");

  const filters = useMemo(() => {
    const tags = new Set<string>();
    for (const project of projects) {
      for (const tag of splitTags(project.techTags)) tags.add(tag);
    }
    return ["All", ...tags].sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const visible = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((project) => splitTags(project.techTags).includes(filter)),
    [projects, filter],
  );

  return (
    <div>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setFilter(tag)}
            className={`shrink-0 border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.15em] transition-colors ${
              filter === tag
                ? "border-ink bg-ink text-paper"
                : "border-line text-mute hover:border-ink hover:text-ink"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {visible.map((project) => (
          <ProjectCard
            key={project.id}
            slug={project.slug}
            title={project.title}
            summary={project.summary}
            techTags={project.techTags}
            image={project.screenshots[0]?.url}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-10 font-mono text-sm text-mute">No projects match this tag.</p>
      )}
    </div>
  );
}
