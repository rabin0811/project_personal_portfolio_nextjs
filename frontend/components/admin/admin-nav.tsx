"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/messages", label: "Inbox" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="flex flex-col gap-1">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
        signed in as
        <span className="mt-1 block break-all text-signal">{email}</span>
      </p>
      <div className="flex flex-row flex-wrap gap-1 lg:flex-col">
        {items.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`border px-3 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-mute hover:border-ink hover:text-ink"
              }`}
            >
              {active ? "› " : ""}
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        <Link href="/" className="px-3 py-2 font-mono text-xs uppercase tracking-[0.15em] text-mute hover:text-ink">
          view site ↗
        </Link>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="px-3 py-2 font-mono text-xs uppercase tracking-[0.15em] text-signal hover:underline disabled:opacity-50"
        >
          {loggingOut ? "…" : "logout"}
        </button>
      </div>
    </nav>
  );
}
