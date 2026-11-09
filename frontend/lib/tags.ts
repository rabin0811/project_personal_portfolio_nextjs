export function splitTags(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function joinTags(tags: string[]): string {
  return tags.map((tag) => tag.trim()).filter(Boolean).join(", ");
}
