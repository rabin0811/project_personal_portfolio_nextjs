"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
      });
      const json = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(json.error ?? "Login failed");
        setBusy(false);
        return;
      }
      router.push(searchParams.get("next") ?? "/admin");
      router.refresh();
    } catch {
      setError("Network error — try again");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-mute">email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="border border-line bg-paper px-3 py-2.5 text-base focus:border-ink"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-mute">password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="border border-line bg-paper px-3 py-2.5 text-base focus:border-ink"
        />
      </label>
      {error && <p className="font-mono text-xs text-signal">✗ {error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-fit items-center gap-2 bg-ink px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-paper hover:bg-signal disabled:opacity-50"
      >
        {busy ? "checking…" : "[ Log in ]"}
      </button>
    </form>
  );
}
