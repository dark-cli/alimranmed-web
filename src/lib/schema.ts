/**
 * JSON-LD builders for page-level structured data. The clinic itself is
 * declared once in BaseHead with `@id: <site>#clinic`; pages reference it
 * instead of repeating the organisation.
 */

export const CLINIC_ID = "https://alimran.clinic/#clinic";

type Locale = "en" | "ar";
type FaqItem = { question: string; answer: string };

interface PageInput {
  url: URL | string;
  name: string;
  description?: string;
  locale: Locale;
  datePublished?: Date | string;
  reviewedBy?: string;
  reviewedAt?: Date | string;
}

const iso = (d?: Date | string) =>
  d ? (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10) : undefined;

function page({ url, name, description, locale, datePublished, reviewedBy, reviewedAt }: PageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    url: String(url),
    name,
    description,
    inLanguage: locale,
    datePublished: iso(datePublished),
    lastReviewed: iso(reviewedAt),
    reviewedBy: reviewedBy ? { "@type": "Person", name: reviewedBy } : undefined,
    publisher: { "@id": CLINIC_ID },
  };
}

/** Treatment page: a web page about a medical condition. */
export function conditionPage(input: PageInput) {
  return { ...page(input), about: { "@type": "MedicalCondition", name: input.name, description: input.description } };
}

/** Service page: a web page about a procedure or therapy the clinic performs. */
export function procedurePage(input: PageInput) {
  return { ...page(input), about: { "@type": "MedicalProcedure", name: input.name, description: input.description } };
}

/** Blog post. */
export function articlePage(input: PageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.name,
    description: input.description,
    url: String(input.url),
    inLanguage: input.locale,
    datePublished: iso(input.datePublished),
    author: { "@id": CLINIC_ID },
    publisher: { "@id": CLINIC_ID },
  };
}

/** FAQPage from frontmatter faqItems, or null when there are none. */
export function faqPage(items?: FaqItem[]) {
  if (!items?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

/** Doctor profile. */
export function physician(input: {
  url: URL | string; name: string; description?: string; specialty?: string; image?: string; locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    url: String(input.url),
    name: input.name,
    description: input.description,
    jobTitle: input.specialty,
    medicalSpecialty: "Neurosurgery",
    image: input.image ? new URL(input.image, "https://alimran.clinic").href : undefined,
    worksFor: { "@id": CLINIC_ID },
    inLanguage: input.locale,
  };
}
