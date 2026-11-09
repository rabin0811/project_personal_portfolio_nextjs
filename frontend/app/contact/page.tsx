import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { getSiteConfig } from "@/lib/repositories/site-config";
import { site } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default async function ContactPage() {
  const config = await getSiteConfig();

  const links = [
    { label: "Email", href: `mailto:${config.email ?? site.email}` },
    { label: "GitHub", href: config.github },
    { label: "LinkedIn", href: config.linkedin },
    { label: "X", href: config.twitter },
  ].flatMap((link) => (link.href ? [{ label: link.label, href: link.href }] : []));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeader title="Get in touch" />
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute">
        Freelance work, interesting projects, or just to say hello — my inbox is
        open.
      </p>

      <div className="mt-10 grid gap-12 md:grid-cols-2">
        <ContactForm />

        <aside>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-mute">
            or reach me directly
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group inline-flex items-center gap-2 font-mono text-sm text-ink"
                >
                  <span className="text-signal">›</span>
                  <span className="border-b border-dashed border-mute pb-0.5 group-hover:text-signal">
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 border border-dashed border-line p-5">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-mute">
              $ response time
            </p>
            <p className="mt-2 text-sm text-mute">
              Usually within 24–48 hours. If it&apos;s urgent, put
              <span className="font-mono text-ink"> [urgent]</span> in the subject.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
