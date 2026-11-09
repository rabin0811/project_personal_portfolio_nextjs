import Link from "next/link";
import type { ReactNode } from "react";

export function Bracket({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bracket ${className}`}>
      <span aria-hidden="true" className="bracket-before">
        [&nbsp;
      </span>
      {children}
      <span aria-hidden="true" className="bracket-after">
        &nbsp;]
      </span>
    </div>
  );
}

export function SectionHeader({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Bracket>{title}</Bracket>
      <div aria-hidden="true" className="rule-dashed flex-1" />
    </div>
  );
}

const buttonBase =
  "inline-flex items-center gap-2 px-5 py-2.5 font-mono text-sm tracking-wide uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

const buttonVariants: Record<string, string> = {
  primary: "bg-ink text-paper hover:bg-signal",
  accent: "bg-signal text-paper hover:bg-ink",
  outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink underline decoration-signal decoration-2 underline-offset-4 hover:text-signal",
};

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof buttonVariants;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${buttonBase} ${buttonVariants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border border-line px-2 py-0.5 font-mono text-xs text-mute">
      {children}
    </span>
  );
}

export function MonoLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-xs uppercase tracking-[0.15em] text-mute ${className}`}>
      {children}
    </p>
  );
}
