import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Shared frontmatter used by page-like content collections. Every entry is
// keyed by its slug (URL path segment).
const pageBase = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),   // grouping within a collection (e.g., "spine" under treatments)
  order: z.number().default(999),    // display order within a category/menu
  image: z.string().optional(),      // hero image path
  imageAlt: z.string().optional(),
  updated: z.coerce.date().optional(),
  legacyUrl: z.string().optional(),  // original URL on alimranmed.com, for migration bookkeeping
  // `locale` retained as optional so freshly migrated files with locale: "en"
  // don't fail parsing; new code ignores it.
  locale: z.string().optional(),

  // ── Provenance ───────────────────────────────────────────────────────
  // Where this content came from, so we know its trust level and can plan
  // review passes. Also drives display badges in a future dashboard.
  //   legacy-wp        — scraped verbatim from alimranmed.com WordPress
  //                       (may need medical review; language matches source)
  //   ai-draft         — machine-translated / AI-generated, needs review
  //   human-reviewed   — a clinician has read and approved the content
  //   original         — written from scratch for this site
  source: z
    .enum(["legacy-wp", "ai-draft", "human-reviewed", "original"])
    .default("legacy-wp"),
  reviewedBy: z.string().optional(),      // clinician name / initials
  reviewedAt: z.coerce.date().optional(), // when the human review happened
});

const treatments = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/treatments" }),
  schema: pageBase.extend({
    bodyRegion: z.string().optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: pageBase,
});

const doctors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/doctors" }),
  schema: pageBase.extend({
    fullName: z.string(),
    titles: z.array(z.string()).default([]),
    specialty: z.string().optional(),
    photo: z.string().optional(),
    memberships: z.array(z.string()).default([]),
    languages: z.array(z.string()).default([]),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: pageBase.extend({
    author: z.string().optional(),
    publishedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const cases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cases" }),
  schema: pageBase.extend({
    condition: z.string().optional(),
    outcome: z.string().optional(),
  }),
});

const testimonies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/testimonies" }),
  schema: pageBase.extend({
    patientInitials: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: pageBase,
});

export const collections = {
  treatments,
  services,
  doctors,
  posts,
  cases,
  testimonies,
  pages,
};
