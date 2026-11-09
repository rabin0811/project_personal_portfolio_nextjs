import { Bracket } from "@/components/ui";
import { ProjectsManager } from "@/components/admin/projects-manager";

export const dynamic = "force-dynamic";

export default function AdminProjectsPage() {
  return (
    <div>
      <Bracket>project manager</Bracket>
      <h1 className="mt-3 font-display text-2xl font-bold">Projects</h1>
      <div className="mt-6">
        <ProjectsManager />
      </div>
    </div>
  );
}
