import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui";
import { WorkGrid } from "@/components/work-grid";
import { listPublishedProjects } from "@/lib/repositories/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects by Rabin Humagain — web, mobile and everything in between.",
};

export default async function WorkPage() {
  const projects = await listPublishedProjects();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeader title="Projects" />
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute">
        A selection of things I&apos;ve built — production apps, tools, and
        experiments. Filter by stack.
      </p>
      <WorkGrid projects={projects} />
    </div>
  );
}
