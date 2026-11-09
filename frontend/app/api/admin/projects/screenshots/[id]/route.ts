import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { addProjectScreenshot, removeProjectScreenshot } from "@/lib/services/project-service";
import { readJson, s } from "@/lib/api-utils";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const url = s(body.url, 500);
  if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });
  const image = await addProjectScreenshot(id, url);
  revalidatePath("/");
  revalidatePath("/work");
  return NextResponse.json({ image });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await removeProjectScreenshot(id);
  revalidatePath("/");
  revalidatePath("/work");
  return NextResponse.json({ ok: true });
}
