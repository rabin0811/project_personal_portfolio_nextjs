import { Bracket } from "@/components/ui";
import { SkillsManager } from "@/components/admin/skills-manager";

export const dynamic = "force-dynamic";

export default function AdminSkillsPage() {
  return (
    <div>
      <Bracket>skills manager</Bracket>
      <h1 className="mt-3 font-display text-2xl font-bold">Skills & Experience</h1>
      <div className="mt-6">
        <SkillsManager />
      </div>
    </div>
  );
}
