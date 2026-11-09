export async function readJson<T = Record<string, unknown>>(
  request: Request,
): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function s(value: unknown, max = 500): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text.slice(0, max);
}

export function sOrNull(value: unknown, max = 500): string | null {
  const text = s(value, max);
  return text === "" ? null : text;
}

export function b(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

export function n(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
