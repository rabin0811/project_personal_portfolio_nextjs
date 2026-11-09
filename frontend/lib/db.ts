import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@/generated/prisma/client";

let cached: PrismaClient | undefined;

export async function getPrisma(): Promise<PrismaClient> {
  if (cached) return cached;
  const { env } = await getCloudflareContext({ async: true });
  const adapter = new PrismaD1(env.DB);
  cached = new PrismaClient({ adapter });
  return cached;
}
