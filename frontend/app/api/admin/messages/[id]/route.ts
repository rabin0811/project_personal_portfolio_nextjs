import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { deleteMessage, markMessageRead } from "@/lib/repositories/messages";
import { readJson } from "@/lib/api-utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await readJson<{ read?: unknown }>(request);
  await markMessageRead(id, body?.read === true);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteMessage(id);
  return NextResponse.json({ ok: true });
}
