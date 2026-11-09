import Link from "next/link";
import { Bracket } from "@/components/ui";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <div>
      <Link href="/admin/projects" className="font-mono text-xs uppercase tracking-[0.15em] text-mute hover:text-signal">
        ‹ back
      </Link>
      <div className="mt-4">
        <Bracket>new project</Bracket>
        <div className="mt-6 border border-line p-5">
          <ProjectForm project={null} />
        </div>
      </div>
    </div>
  );
}
