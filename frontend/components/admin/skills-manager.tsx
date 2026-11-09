"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { InlineStatus } from "@/components/admin/form";

const CATEGORIES = ["language", "framework", "tool"] as const;

type Skill = { id: string; name: string; category: string; order: number };
type Experience = {
  id: string;
  role: string;
  company: string;
  dates: string;
  description: string | null;
  order: number;
};

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ message: string; tone: "ok" | "error" } | null>(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<string>("language");
  const [newExp, setNewExp] = useState({ role: "", company: "", dates: "", description: "" });

  const load = useCallback(async () => {
    try {
      const [skillResponse, expResponse] = await Promise.all([
        fetch("/api/admin/skills"),
        fetch("/api/admin/experiences"),
      ]);
      const skillsJson = (await skillResponse.json()) as { skills?: Skill[]; error?: string };
      const expJson = (await expResponse.json()) as { experiences?: Experience[] };
      if (!skillResponse.ok) throw new Error(skillsJson.error ?? "Failed to load");
      setSkills(skillsJson.skills ?? []);
      setExperiences(expJson.experiences ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addSkill(event: FormEvent) {
    event.preventDefault();
    const name = newSkillName.trim();
    if (!name) return;
    const response = await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category: newSkillCategory }),
    });
    const json = (await response.json()) as { error?: string };
    if (!response.ok) {
      setStatus({ message: json.error ?? "Failed", tone: "error" });
      return;
    }
    setNewSkillName("");
    void load();
  }

  async function removeSkill(skill: Skill) {
    await fetch(`/api/admin/skills/${skill.id}`, { method: "DELETE" });
    void load();
  }

  async function moveSkill(category: string, index: number, direction: -1 | 1) {
    if (!skills) return;
    const group = skills.filter((skill) => skill.category === category).sort((a, b) => a.order - b.order);
    const target = index + direction;
    if (target < 0 || target >= group.length) return;
    [group[index], group[target]] = [group[target], group[index]];
    await fetch("/api/admin/skills", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: group.map((skill) => skill.id) }),
    });
    void load();
  }

  async function addExperience(event: FormEvent) {
    event.preventDefault();
    if (!newExp.role.trim() || !newExp.company.trim()) return;
    const response = await fetch("/api/admin/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExp),
    });
    const json = (await response.json()) as { error?: string };
    if (!response.ok) {
      setStatus({ message: json.error ?? "Failed", tone: "error" });
      return;
    }
    setNewExp({ role: "", company: "", dates: "", description: "" });
    void load();
  }

  async function removeExperience(experience: Experience) {
    await fetch(`/api/admin/experiences/${experience.id}`, { method: "DELETE" });
    void load();
  }

  async function moveExperience(index: number, direction: -1 | 1) {
    if (!experiences) return;
    const next = [...experiences];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    await fetch("/api/admin/experiences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((item) => item.id) }),
    });
    void load();
  }

  if (error) return <p className="font-mono text-xs text-signal">✗ {error}</p>;
  if (!skills) return <p className="font-mono text-xs text-mute">loading…</p>;

  return (
    <div className="flex flex-col gap-10">
      <InlineStatus message={status?.message ?? null} tone={status?.tone} />

      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-mute">add skill</p>
        <form onSubmit={addSkill} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">name</span>
            <input value={newSkillName} onChange={(event) => setNewSkillName(event.target.value)} maxLength={60} required className="border border-line bg-paper px-3 py-2 text-sm" placeholder="Rust" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mute">category</span>
            <select value={newSkillCategory} onChange={(event) => setNewSkillCategory(event.target.value)} className="border border-line bg-paper px-3 py-2 text-sm">
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-paper hover:bg-signal">
            add
          </button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const group = skills.filter((skill) => skill.category === category).sort((a, b) => a.order - b.order);
          return (
            <div key={category} className="border border-line p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-signal">[ {category} ]</p>
              <ul className="flex flex-col gap-1.5">
                {group.map((skill, index) => (
                  <li key={skill.id} className="flex items-center justify-between border border-line px-2.5 py-1.5">
                    <span className="text-sm">{skill.name}</span>
                    <span className="flex items-center gap-1.5 font-mono text-xs">
                      <button type="button" disabled={index === 0} onClick={() => moveSkill(category, index, -1)} className="text-mute hover:text-ink disabled:opacity-30" aria-label="Move up">↑</button>
                      <button type="button" disabled={index === group.length - 1} onClick={() => moveSkill(category, index, 1)} className="text-mute hover:text-ink disabled:opacity-30" aria-label="Move down">↓</button>
                      <button type="button" onClick={() => removeSkill(skill)} className="text-mute hover:text-signal" aria-label="Remove">✕</button>
                    </span>
                  </li>
                ))}
                {group.length === 0 && <li className="font-mono text-xs text-mute">empty</li>}
              </ul>
            </div>
          );
        })}
      </div>

      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-mute">add experience</p>
        <form onSubmit={addExperience} className="grid gap-3 sm:grid-cols-4">
          <input value={newExp.role} onChange={(event) => setNewExp({ ...newExp, role: event.target.value })} maxLength={120} required placeholder="Role" className="border border-line bg-paper px-3 py-2 text-sm" />
          <input value={newExp.company} onChange={(event) => setNewExp({ ...newExp, company: event.target.value })} maxLength={120} required placeholder="Company" className="border border-line bg-paper px-3 py-2 text-sm" />
          <input value={newExp.dates} onChange={(event) => setNewExp({ ...newExp, dates: event.target.value })} maxLength={80} placeholder="2024 — 2025" className="border border-line bg-paper px-3 py-2 text-sm" />
          <button type="submit" className="bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-paper hover:bg-signal">add</button>
          <textarea value={newExp.description} onChange={(event) => setNewExp({ ...newExp, description: event.target.value })} maxLength={1000} rows={2} placeholder="What you did (optional)" className="border border-line bg-paper px-3 py-2 text-sm sm:col-span-4" />
        </form>

        <ul className="mt-4 flex flex-col gap-2">
          {(experiences ?? []).map((experience, index) => (
            <li key={experience.id} className="flex items-center gap-3 border border-line p-3">
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold">{experience.role}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
                  {experience.company}{experience.dates ? ` · ${experience.dates}` : ""}
                </p>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-xs">
                <button type="button" disabled={index === 0} onClick={() => moveExperience(index, -1)} className="text-mute hover:text-ink disabled:opacity-30" aria-label="Move up">↑</button>
                <button type="button" disabled={index === (experiences ?? []).length - 1} onClick={() => moveExperience(index, 1)} className="text-mute hover:text-ink disabled:opacity-30" aria-label="Move down">↓</button>
                <button type="button" onClick={() => removeExperience(experience)} className="text-mute hover:text-signal" aria-label="Remove">✕</button>
              </span>
            </li>
          ))}
          {(experiences ?? []).length === 0 && (
            <li className="font-mono text-xs text-mute">No experience entries yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
