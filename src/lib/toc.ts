import { toArabicDigits } from "./i18n";

export type TocItem = { id: string; text: string; num: string };

/**
 * Build a sidebar TOC from either block sections or legacy markdown headings.
 * Pass `sections` from entry.data when the entry is redesigned, `null` otherwise.
 * Pass `headings` from render() when a headings-based fallback is desired (treatments);
 * pass `null` for pages that have no TOC in legacy mode (blogs, services).
 */
export function buildToc(
  sections: Array<{ heading?: string }> | null | undefined,
  headings: Array<{ depth: number; slug: string; text: string }> | null | undefined,
  locale: "en" | "ar",
): TocItem[] {
  const fmt =
    locale === "ar"
      ? (n: number) => toArabicDigits(n).padStart(2, "٠")
      : (n: number) => String(n).padStart(2, "0");

  if (Array.isArray(sections) && sections.length > 0) {
    const toc: TocItem[] = [];
    let n = 0;
    for (const s of sections) {
      if (!s.heading) continue;
      n += 1;
      toc.push({ id: `s-${n}`, text: s.heading, num: fmt(n) });
    }
    return toc;
  }

  return (headings ?? [])
    .filter((h) => h.depth === 2)
    .map((h, i) => ({ id: h.slug, text: h.text, num: fmt(i + 1) }));
}
