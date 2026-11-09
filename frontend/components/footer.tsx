import Link from "next/link";
import { site, socials } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs text-mute">
          © {new Date().getFullYear()} {site.name}
          <span className="text-signal"> ~ </span>
          built with Next.js on Cloudflare
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${site.email}`}
            className="font-mono text-xs uppercase tracking-[0.15em] text-mute hover:text-signal"
          >
            {site.email}
          </a>
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.15em] text-mute hover:text-signal"
            >
              {social.label}
            </a>
          ))}
          <Link
            href="/admin/login"
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-line hover:text-mute"
          >
            admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
