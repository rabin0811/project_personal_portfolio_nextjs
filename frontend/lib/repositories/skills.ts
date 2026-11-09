import { getPrisma } from "@/lib/db";

export const SKILL_CATEGORIES = ["language", "framework", "tool"] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export async function listSkillsGrouped() {
  const prisma = await getPrisma();
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  const grouped: Record<SkillCategory, { id: string; name: string }[]> = {
    language: [],
    framework: [],
    tool: [],
  };
  for (const skill of skills) {
    const category = SKILL_CATEGORIES.includes(skill.category as SkillCategory)
      ? (skill.category as SkillCategory)
      : "tool";
    grouped[category].push({ id: skill.id, name: skill.name });
  }
  return grouped;
}

export async function listAllSkills() {
  const prisma = await getPrisma();
  return prisma.skill.findMany({ orderBy: { order: "asc" } });
}

export async function listExperiences() {
  const prisma = await getPrisma();
  return prisma.experience.findMany({ orderBy: { order: "asc" } });
}
