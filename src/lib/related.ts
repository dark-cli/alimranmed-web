import { topicOf, isLocale, pickForLocale } from "./i18n";
import { TREATMENT_PATHWAY } from "./pathways";

// Shape consumed by <Related> block via ArticleSections. Kept in this
// TypeScript module so both the .astro dispatcher and these makeResolve*
// helpers can import it without triggering tsc's "no .astro modules" error.
export interface RelatedItem {
  slug: string;
  title: string;
  category: string;
  href: string;
  redesigned: boolean;
}

type TreatmentEntry = {
  id: string;
  data: {
    title: string;
    redesigned?: boolean;
    pathwayOverride?: string;
    category?: string;
  };
};

/**
 * Returns a resolveRelated callback for EN treatment pages.
 * Closes over the full EN treatment collection and a localised href builder.
 */
export function makeResolveRelatedEn(
  allTreatments: TreatmentEntry[],
  href: (slug: string) => string,
): (slugs: string[]) => RelatedItem[] {
  const enTreatments = allTreatments.filter((e) => isLocale(e.id, "en"));
  return (slugs) =>
    slugs.map((slug) => {
      const found = enTreatments.find((e) => topicOf(e.id) === slug);
      if (!found) return null;
      const rd = found.data.redesigned === true;
      const cat = (found.data.pathwayOverride || found.data.category || "pain").toLowerCase();
      return {
        slug,
        title: found.data.title,
        category: TREATMENT_PATHWAY.en[cat]?.label || "Pain",
        href: rd ? href(slug) : "",
        redesigned: rd,
      };
    }).filter(Boolean) as RelatedItem[];
}

/**
 * Returns a resolveRelated callback for AR treatment pages.
 * Uses pickForLocale to prefer the AR entry and fall back to EN.
 */
export function makeResolveRelatedAr(
  allTreatments: TreatmentEntry[],
  href: (slug: string) => string,
): (slugs: string[]) => RelatedItem[] {
  return (slugs) =>
    slugs.map((slug) => {
      const pick = pickForLocale(allTreatments, slug, "ar");
      if (!pick) return null;
      const found = pick.entry;
      const rd = found.data.redesigned === true;
      const cat = (found.data.pathwayOverride || found.data.category || "pain").toLowerCase();
      return {
        slug,
        title: found.data.title,
        category: TREATMENT_PATHWAY.ar[cat]?.label || "الألم",
        href: rd ? href(slug) : "",
        redesigned: rd,
      };
    }).filter(Boolean) as RelatedItem[];
}
