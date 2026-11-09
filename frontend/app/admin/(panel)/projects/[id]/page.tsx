import Link from "next/link";
import { notFound } from "next/navigation";
import { Bracket } from "@/components/ui";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectById } from "@/lib/repositories/projects";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div>
      <Link href="/admin/projects" className="font-mono text-xs uppercase tracking-[0.15em] text-mute hover:text-signal">
        ‹ back
      </Link>
      <div className="mt-4">
        <Bracket>edit project</Bracket>
        <div className="mt-6 border border-line p-5">
          <ProjectForm project={project} />
        </div>
      </div>
    </div>
  );
}
