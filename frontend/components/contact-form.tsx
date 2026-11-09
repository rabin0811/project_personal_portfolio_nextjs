"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/config";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company") ?? "",
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-ink bg-ink p-8 text-paper">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/70">$ message sent</p>
        <p className="mt-3 font-display text-lg">
          Thanks — I&apos;ll get back to you as soon as I can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-mute">name</span>
        <input
          name="name"
          required
          maxLength={80}
          placeholder="Your name"
          className="border border-line bg-paper px-3 py-2.5 text-base text-ink placeholder:text-mute/50 focus:border-ink"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-mute">email</span>
        <input
          name="email"
          type="email"
          required
          maxLength={160}
          placeholder="you@example.com"
          className="border border-line bg-paper px-3 py-2.5 text-base text-ink placeholder:text-mute/50 focus:border-ink"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-mute">message</span>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={4000}
          placeholder="What are you building?"
          className="resize-y border border-line bg-paper px-3 py-2.5 text-base text-ink placeholder:text-mute/50 focus:border-ink"
        />
      </label>

      <div aria-hidden="true" className="hidden">
        <label htmlFor="company-field">Company</label>
        <input id="company-field" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 bg-signal px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-paper transition-colors hover:bg-ink disabled:opacity-50"
        >
          {status === "sending" ? "sending…" : "[ Send Message ]"}
        </button>
      </div>

      {status === "error" && (
        <p className="font-mono text-xs text-signal">
          Something went wrong — try again, or email {site.email} directly.
        </p>
      )}
    </form>
  );
}
