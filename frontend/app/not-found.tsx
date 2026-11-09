import Link from "next/link";
import { Bracket } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm text-signal">$ 404 — page not found</p>
      <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
        This route doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md text-mute">
        The page may have moved, or the URL has a typo. Head back somewhere
        real.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="bg-ink px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-paper hover:bg-signal">
          [ Home ]
        </Link>
        <Link href="/work" className="border border-ink px-5 py-2.5 font-mono text-sm uppercase tracking-wide hover:bg-ink hover:text-paper">
          [ Work ]
        </Link>
        <Link href="/contact" className="border border-ink px-5 py-2.5 font-mono text-sm uppercase tracking-wide hover:bg-ink hover:text-paper">
          [ Contact ]
        </Link>
      </div>
      <div className="mt-12 w-full max-w-md">
        <Bracket>er</Bracket>
      </div>
    </div>
  );
}
