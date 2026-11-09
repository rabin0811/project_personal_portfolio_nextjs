import { NextResponse } from "next/server";
import { submitContact } from "@/lib/services/contact-service";

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    message?: string;
    company?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  if (name.length > 80 || email.length > 160 || message.length > 4000) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }

  await submitContact({ name, email, message, honeypot: body.company });
  return NextResponse.json({ ok: true });
}
