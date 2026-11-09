import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Bracket } from "@/components/ui";
import { LoginForm } from "@/components/admin/login-form";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <Bracket>admin</Bracket>
      <h1 className="mt-3 font-display text-2xl font-bold">Log in</h1>
      <p className="mt-2 text-sm text-mute">Restricted area — authorized personnel only.</p>
      <div className="mt-8 border border-line p-6">
        <LoginForm />
      </div>
    </div>
  );
}
