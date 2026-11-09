"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Field, InlineStatus, Input, SaveButton, TextArea } from "@/components/admin/form";
import { UploadButton, UploadPreview } from "@/components/admin/upload-button";

type Config = {
  bio: string;
  profilePhoto: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  location: string | null;
};

export function SettingsForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ message: string; tone: "ok" | "error" } | null>(null);
  const [values, setValues] = useState<Config | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((response) => response.json() as Promise<{ config: Config }>)
      .then((json) => setValues(json.config));
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!values) return;
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(json.error ?? "Save failed");
      setStatus({ message: "Settings saved", tone: "ok" });
    } catch (error) {
      setStatus({ message: error instanceof Error ? error.message : "Save failed", tone: "error" });
    } finally {
      setBusy(false);
    }
  }

  if (!values) return <p className="font-mono text-xs text-mute">loading…</p>;

  const set = (key: keyof Config, value: string | null) =>
    setValues((current) => (current ? { ...current, [key]: value } : current));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="border border-line p-4">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-mute">profile photo</p>
        <div className="flex flex-col gap-3">
          {values.profilePhoto && (
            <UploadPreview url={values.profilePhoto} alt="profile" onClear={() => set("profilePhoto", null)} />
          )}
          <UploadButton folder="profile" onUploaded={(url) => set("profilePhoto", url)} label={values.profilePhoto ? "replace photo" : "upload photo"} />
        </div>
      </div>

      <Field label="bio" hint="Shown on the About page and home page">
        <TextArea rows={6} value={values.bio} onChange={(event) => set("bio", event.target.value)} maxLength={5000} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="location">
          <Input value={values.location ?? ""} onChange={(event) => set("location", event.target.value || null)} />
        </Field>
        <Field label="email">
          <Input type="email" value={values.email ?? ""} onChange={(event) => set("email", event.target.value || null)} />
        </Field>
        <Field label="github url">
          <Input value={values.github ?? ""} onChange={(event) => set("github", event.target.value || null)} />
        </Field>
        <Field label="linkedin url">
          <Input value={values.linkedin ?? ""} onChange={(event) => set("linkedin", event.target.value || null)} />
        </Field>
        <Field label="x / twitter url">
          <Input value={values.twitter ?? ""} onChange={(event) => set("twitter", event.target.value || null)} />
        </Field>
      </div>

      <div className="flex items-center gap-4">
        <SaveButton busy={busy}>[ Save ]</SaveButton>
        <InlineStatus message={status?.message ?? null} tone={status?.tone} />
      </div>
    </form>
  );
}
