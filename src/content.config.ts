import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Shared frontmatter used by page-like content collections. Every entry is
// keyed by its slug (URL path segment); `locale` picks which language folder
// the file lives in (en/ or ar/).
const pageBase = z.object({
  title: z.string(),
  description: z.string().optional(),
  locale: z.enum(["en", "ar"]),
  category: z.string().optional(),   // grouping within a collection (e.g., "spine" under treatments)
  order: z.number().default(999),    // display order within a category/menu
  image: z.string().optional(),      // hero image path
  imageAlt: z.string().optional(),
  updated: z.date().optional(),
  legacyUrl: z.string().optional(),  // original URL on alimranmed.com, for migration bookkeeping
});

const treatments = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/treatments" }),
  schema: pageBase.extend({
    bodyRegion: z.string().optional(), // spine, brain, motor, pediatric, pain, etc.
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
    titles: z.array(z.string()).default([]),        // MBChB, FIBMS, etc.
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
    publishedAt: z.date().optional(),
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
