import type { Metadata } from "next";
import { Bracket, ButtonLink, SectionHeader } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";
import { PostCard } from "@/components/post-card";
import { listFeaturedProjects, listPublishedProjects } from "@/lib/repositories/projects";
import { listSkillsGrouped } from "@/lib/repositories/skills";
import { listPublishedPosts, postCover, postExcerpt } from "@/lib/repositories/blog";
import { site } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
};

export default async function HomePage() {
  const featured = await listFeaturedProjects();
  const projects = await listPublishedProjects();
  const picks = featured.length > 0 ? featured : projects.slice(0, 4);
  const skills = await listSkillsGrouped();
  const posts = await listPublishedPosts();
  const latestPosts = posts.slice(0, 2);

  return (
    <>
      {/* hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-mute">
            <span className="text-signal">~/rabin</span> $ whoami
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Rabin Humagain
          </h1>
          <p className="mt-2 font-display text-xl text-mute sm:text-2xl">
            Full Stack Developer
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mute">
            I build fast, reliable web applications — Python, C#, .NET, Next.js,
            React — and ship them to people who use them daily.
          </p>
          <p className="mt-6 font-mono text-sm text-ink">
            <span className="text-signal">$</span> <span className="cursor-blink" aria-hidden="true"> </span>
            <span className="text-mute">full-stack-dev --ready --available</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/work" variant="primary">
              [ View Work ]
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              [ Contact Me ]
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* featured projects */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <SectionHeader title="Featured Projects" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {picks.slice(0, 4).map((project) => (
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
          <div className="mt-6">
            <ButtonLink href="/work" variant="ghost">
              all projects →
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* skills strip */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <SectionHeader title="Skills" />
          <div className="mt-6 flex flex-col gap-5">
            {(["language", "framework", "tool"] as const).map((category) =>
              skills[category].length > 0 ? (
                <div key={category} className="flex flex-wrap items-baseline gap-2">
                  <Bracket className="w-36 shrink-0">{category}</Bracket>
                  <div className="flex flex-wrap gap-1.5">
                    {skills[category].map((skill) => (
                      <span key={skill.id} className="border-b border-dashed border-mute px-1 pb-0.5 font-mono text-sm text-ink">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </div>
      </section>

      {/* latest from the blog */}
      <section>
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <SectionHeader title="Latest from the Blog" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {latestPosts.map((post) => (
              <PostCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                location={post.location}
                publishedAt={post.publishedAt}
                excerpt={postExcerpt(post)}
                cover={postCover(post)}
              />
            ))}
          </div>
          {posts.length === 0 && (
            <p className="mt-6 font-mono text-sm text-mute">
              No journal entries yet — the travel stories are on their way.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
