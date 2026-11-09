import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/db";

export async function loginAdmin(
  email: string,
  password: string,
): Promise<{ id: string; email: string; role: string } | null> {
  const prisma = await getPrisma();
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!user || user.role !== "admin") return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return { id: user.id, email: user.email, role: user.role };
}
