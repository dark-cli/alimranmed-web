import { toArabicDigits } from "./i18n";

export type TocItem = { id: string; text: string; num: string };

/**
 * Build a sidebar TOC from block sections, legacy markdown headings, or both.
 * - `sections`: entry.data.sections when the entry is redesigned (else null).
 * - `headings`: from `render(entry)` — h2s in the raw markdown body.
 * When both are provided the section headings come first, then body headings
 * continue the numbering, so pages that carry BOTH sections and a body get
 * a single unified TOC.
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

  const toc: TocItem[] = [];
  let n = 0;

  if (Array.isArray(sections)) {
    for (const s of sections) {
      if (!s.heading) continue;
      n += 1;
      toc.push({ id: `s-${n}`, text: s.heading, num: fmt(n) });
    }
  }

  for (const h of headings ?? []) {
    if (h.depth !== 2) continue;
    n += 1;
    toc.push({ id: h.slug, text: h.text, num: fmt(n) });
  }

  return toc;
}
