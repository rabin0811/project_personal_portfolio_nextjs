import { getPrisma } from "@/lib/db";

export async function listMessages() {
  const prisma = await getPrisma();
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function markMessageRead(id: string, read: boolean) {
  const prisma = await getPrisma();
  return prisma.contactMessage.update({ where: { id }, data: { read } });
}

export async function deleteMessage(id: string) {
  const prisma = await getPrisma();
  return prisma.contactMessage.delete({ where: { id } });
}

export async function createMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  const prisma = await getPrisma();
  return prisma.contactMessage.create({ data });
}
