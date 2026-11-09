"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/lib/config";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight"
          aria-label={`${site.name} — home`}
        >
          <span className="text-signal">[</span> RH <span className="text-signal">]</span>
        </Link>

        <nav className="hidden items-center gap-7 sm:flex" aria-label="Main">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:text-signal ${
                  active ? "text-signal" : "text-mute"
                }`}
              >
                {active && (
                  <span aria-hidden="true" className="absolute -left-3 top-1/2 -translate-y-1/2 text-signal">
                    ›
                  </span>
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 sm:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`h-px w-5 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-line px-4 py-3 sm:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`font-mono text-sm uppercase tracking-[0.18em] ${
                  pathname === item.href ? "text-signal" : "text-mute"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
