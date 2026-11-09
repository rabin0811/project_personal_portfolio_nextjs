import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row">
      <aside className="lg:w-52 lg:shrink-0">
        <AdminNav email={session.email} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
