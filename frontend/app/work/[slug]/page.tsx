import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Tag } from "@/components/ui";
import { Img } from "@/components/image";
import { getPublishedProjectBySlug } from "@/lib/repositories/projects";
import { splitTags } from "@/lib/tags";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project || !project.published) notFound();

  const paragraphs = project.description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/work"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-mute hover:text-signal"
      >
        ‹ back to projects
      </Link>

      <header className="mt-6 border-b border-line pb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-mute">
          {project.summary}
        </p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {splitTags(project.techTags).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </header>

      {project.screenshots[0] && (
        <div className="mt-8 border border-line bg-ink">
          <Img
            src={project.screenshots[0].url}
            alt={`${project.title} screenshot`}
            className="w-full object-contain"
            eager
          />
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {project.liveUrl && (
          <ButtonLink href={project.liveUrl} variant="accent">
            [ Live Site ]
          </ButtonLink>
        )}
        {project.repoUrl && (
          <ButtonLink href={project.repoUrl} variant="outline">
            [ GitHub Repo ]
          </ButtonLink>
        )}
      </div>

      <div className="mt-10 max-w-3xl space-y-5 text-base leading-relaxed text-ink">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      {project.screenshots.length > 1 && (
        <div className="mt-12">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-mute">
            [ screenshots ]
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.screenshots.slice(1).map((shot) => (
              <div key={shot.id} className="border border-line bg-ink">
                <Img src={shot.url} alt={`${project.title} — additional screenshot`} className="w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
