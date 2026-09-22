export function wordsIn(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "string") {
    const t = v.replace(/!\[[^\]]*]\([^)]+\)/g, "").trim();
    return t ? t.split(/\s+/).length : 0;
  }
  if (Array.isArray(v)) return v.reduce((n, x) => n + wordsIn(x), 0);
  if (typeof v === "object") return Object.values(v as Record<string, unknown>).reduce((n, x) => n + wordsIn(x), 0);
  return 0;
}
