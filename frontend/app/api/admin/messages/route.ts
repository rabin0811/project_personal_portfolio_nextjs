import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { listMessages } from "@/lib/repositories/messages";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const messages = await listMessages();
  return NextResponse.json({ messages });
}
