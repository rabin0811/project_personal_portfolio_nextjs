import { getPrisma } from "@/lib/db";

export async function getSiteConfig() {
  const prisma = await getPrisma();
  const config = await prisma.siteConfig.findFirst();
  if (config) return config;
  return prisma.siteConfig.create({ data: { id: 1 } });
}

export async function updateSiteConfig(data: {
  bio?: string;
  profilePhoto?: string | null;
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  location?: string | null;
}) {
  const prisma = await getPrisma();
  return prisma.siteConfig.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
}
