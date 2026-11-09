import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { getSiteConfig, updateSiteConfig } from "@/lib/repositories/site-config";
import { readJson, s, sOrNull } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await getSiteConfig();
  return NextResponse.json({ config });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const config = await updateSiteConfig({
    bio: s(body.bio, 5000),
    profilePhoto: sOrNull(body.profilePhoto, 500),
    email: sOrNull(body.email, 160),
    github: sOrNull(body.github, 500),
    linkedin: sOrNull(body.linkedin, 500),
    twitter: sOrNull(body.twitter, 500),
    location: sOrNull(body.location, 120),
  });
  return NextResponse.json({ config });
}
