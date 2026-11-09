import type { Metadata } from "next";
import { Bracket, SectionHeader } from "@/components/ui";
import { Img } from "@/components/image";
import { getSiteConfig } from "@/lib/repositories/site-config";
import { listExperiences, listSkillsGrouped } from "@/lib/repositories/skills";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "About Rabin Humagain — full stack developer, skills, experience.",
};

export default async function AboutPage() {
  const config = await getSiteConfig();
  const skills = await listSkillsGrouped();
  const experiences = await listExperiences();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeader title="About" />

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
        <div>
          <div className="border border-line bg-ink">
            {config.profilePhoto ? (
              <Img
                src={config.profilePhoto}
                alt="Rabin Humagain"
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
                [ photo ]
              </div>
            )}
          </div>
          {config.location && (
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-mute">
              📍 {config.location}
            </p>
          )}
        </div>

        <div className="space-y-4 text-base leading-relaxed text-ink">
          <Bracket>who am i</Bracket>
          <p className="whitespace-pre-line text-mute">{config.bio || "Bio coming soon — add it from the admin panel."}</p>
        </div>
      </div>

      {/* skills */}
      <div className="mt-14">
        <SectionHeader title="Skills" />
        <div className="mt-6 flex flex-col gap-6">
          {(["language", "framework", "tool"] as const).map((category) =>
            skills[category].length > 0 ? (
              <div key={category}>
                <Bracket className="mb-3">{category}</Bracket>
                <div className="flex flex-wrap gap-1.5">
                  {skills[category].map((skill) => (
                    <span key={skill.id} className="border border-line px-3 py-1.5 font-mono text-sm">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null,
          )}
        </div>
      </div>

      {/* experience */}
      {experiences.length > 0 && (
        <div className="mt-14">
          <SectionHeader title="Experience" />
          <div className="mt-6 flex flex-col">
            {experiences.map((experience, index) => (
              <div
                key={experience.id}
                className={`relative border-l border-line py-4 pl-6 ${
                  index > 0 ? "" : ""
                }`}
              >
                <span aria-hidden="true" className="absolute -left-[5px] top-6 h-2 w-2 bg-signal" />
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-mute">
                  {experience.dates}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">{experience.role}</h3>
                <p className="font-mono text-sm text-signal">{experience.company}</p>
                {experience.description && (
                  <p className="mt-2 text-sm leading-relaxed text-mute">{experience.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
