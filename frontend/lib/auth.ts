import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "rh_session";

function getSecret(): Uint8Array {
  const value = process.env.AUTH_SECRET ?? "dev-only-secret-change-me";
  return new TextEncoder().encode(value);
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export type SessionPayload = {
  sub: string;
  email: string;
  role: string;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub) return null;
    return {
      sub: payload.sub as string,
      email: (payload.email as string) ?? "",
      role: (payload.role as string) ?? "admin",
    };
  } catch {
    return null;
  }
}
