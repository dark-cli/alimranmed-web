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

export function readingMinutes(
  entry: { data: { sections?: unknown }; body?: string },
  wpm = 180,
): number {
  return Math.max(1, Math.round((wordsIn(entry.data.sections) + wordsIn(entry.body)) / wpm));
}

export function readingTimeAr(minutes: number, toArabicDigits: (n: number) => string): string {
  if (minutes <= 1) return "دقيقة واحدة";
  if (minutes === 2) return "دقيقتان";
  if (minutes <= 10) return `${toArabicDigits(minutes)} دقائق`;
  return `${toArabicDigits(minutes)} دقيقة`;
}

export function extractBodyImages(body: string | undefined): { alt: string; src: string }[] {
  if (!body) return [];
  const re = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const out: { alt: string; src: string }[] = [];
  let m;
  while ((m = re.exec(body)) !== null) out.push({ alt: m[1], src: m[2] });
  return out;
}
