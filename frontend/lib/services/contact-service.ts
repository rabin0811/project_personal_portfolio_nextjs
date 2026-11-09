import { createMessage } from "@/lib/repositories/messages";
import { getSiteConfig } from "@/lib/repositories/site-config";
import { site } from "@/lib/config";

const RESEND_URL = "https://api.resend.com/emails";

async function sendOwnerEmail(input: {
  name: string;
  email: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const config = await getSiteConfig();
  const from = process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>";
  const to = config.email ?? site.email;
  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Portfolio message from ${input.name}`,
        text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
        reply_to: input.email,
      }),
    });
    if (!response.ok) {
      console.error("Resend error", response.status, await response.text());
    }
  } catch (error) {
    console.error("Resend error", error);
  }
}

export async function submitContact(input: {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}) {
  if (input.honeypot) {
    return { ok: true };
  }
  await createMessage(input);
  void sendOwnerEmail(input);
  return { ok: true };
}
