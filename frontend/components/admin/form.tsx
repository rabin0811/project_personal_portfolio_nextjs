"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs uppercase tracking-[0.15em] text-mute">{label}</span>
      {children}
      {hint && <span className="text-xs text-mute">{hint}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`border border-line bg-paper px-3 py-2 text-sm focus:border-ink ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`resize-y border border-line bg-paper px-3 py-2 text-sm focus:border-ink ${props.className ?? ""}`}
    />
  );
}

export function Checkbox({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-mute">
      <input type="checkbox" {...props} className="h-4 w-4 accent-ink" />
      {label}
    </label>
  );
}

export function SaveButton({
  busy,
  children = "[ Save ]",
}: {
  busy: boolean;
  children?: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex w-fit items-center gap-2 bg-ink px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-paper hover:bg-signal disabled:opacity-50"
    >
      {busy ? "saving…" : children}
    </button>
  );
}

export function InlineStatus({
  message,
  tone = "ok",
}: {
  message: string | null;
  tone?: "ok" | "error";
}) {
  if (!message) return null;
  return (
    <p className={`font-mono text-xs ${tone === "error" ? "text-signal" : "text-ink"}`}>
      {tone === "error" ? "✗ " : "✓ "}
      {message}
    </p>
  );
}
