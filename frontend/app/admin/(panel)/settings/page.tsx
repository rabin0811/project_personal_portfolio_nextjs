import { Bracket } from "@/components/ui";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div>
      <Bracket>settings</Bracket>
      <h1 className="mt-3 font-display text-2xl font-bold">Site settings</h1>
      <div className="mt-6">
        <SettingsForm />
      </div>
    </div>
  );
}
