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
  //   translated-by-llm — bilingual content translation by LLM for completeness
  source: z
    .enum(["legacy-wp", "ai-draft", "human-reviewed", "original", "translated-by-llm"])
    .default("legacy-wp"),
  reviewedBy: z.string().optional(),      // clinician name / initials
  reviewedAt: z.coerce.date().optional(), // when the human review happened
});

// ── Redesign block system ─────────────────────────────────────────────
// Treatment articles that opt into the new design (redesigned: true) declare
// an ordered `sections` array. Each entry is a discriminated union — the
// renderer dispatches on `type` and only draws the blocks the article
// actually needs. Articles without `sections` fall through to the plain
// prose template that renders their existing markdown body.
const kv = z.object({ label: z.string(), value: z.string() });

const blockAtGlance = z.object({
  type: z.literal("at-a-glance"),
  items: z.array(kv).min(2).max(4),
});

const blockProse = z.object({
  type: z.literal("prose"),
  heading: z.string().optional(),      // when present, appears in the TOC
  body: z.string(),                    // markdown allowed
});

const blockPullQuote = z.object({
  type: z.literal("pull-quote"),
  text: z.string(),
  attribution: z.string().optional(),
});

const blockComparisonPair = z.object({
  type: z.literal("comparison-pair"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  a: z.object({ label: z.string(), title: z.string(), items: z.array(z.string()) }),
  b: z.object({ label: z.string(), title: z.string(), items: z.array(z.string()) }),
});

const blockStatsFacts = z.object({
  type: z.literal("stats-facts"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).min(2).max(4),
  facts: z.array(z.string()).default([]),
});

const blockTreatmentGroups = z.object({
  type: z.literal("treatment-groups"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  note: z.string().optional(),
  groups: z.array(z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    items: z.array(z.string()),
  })).min(2).max(4),
});

const blockRelated = z.object({
  type: z.literal("related"),
  slugs: z.array(z.string()).min(1),   // links into other treatments/*
});

// Media — image, self-hosted video, or YouTube embed. Sits inline between
// other blocks so it lands where it makes editorial sense. Not numbered /
// not in the TOC. `src` for youtube accepts a bare 11-char ID or any full
// URL; the component extracts the ID.
const blockMedia = z.object({
  type: z.literal("media"),
  kind: z.enum(["image", "video", "youtube"]),
  src: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  aspect: z.enum(["16/9", "4/3", "3/2", "1/1"]).optional(),
  uploadDate: z.string().optional(),
});

const articleSection = z.discriminatedUnion("type", [
  blockAtGlance,
  blockProse,
  blockPullQuote,
  blockComparisonPair,
  blockStatsFacts,
  blockTreatmentGroups,
  blockRelated,
  blockMedia,
]);

const treatments = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/treatments" }),
  schema: pageBase.extend({
    bodyRegion: z.string().optional(),
    faqItems: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    // Redesign opt-in — when true the article renders via the block template
    // and its links are enabled across the site. Legacy articles omit this
    // flag and get the "not yet redesigned" grey-out treatment.
    redesigned: z.boolean().optional(),
    publishedAt: z.coerce.date().optional(),
    pathwayOverride: z.string().optional(), // when frontmatter category is legacy-wrong
    sections: z.array(articleSection).optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: pageBase.extend({
    redesigned: z.boolean().optional(),
    sections: z.array(articleSection).optional(),
    isHub: z.boolean().optional(),
  }),
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

// Blog collection — redesigned with block-based schema.
// Blogs can be marked as clinically-relevant to appear in /conditions page.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: pageBase.extend({
    author: z.string().optional(),
    publishedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    redesigned: z.boolean().optional(),        // opt-in to block-based rendering
    sections: z.array(articleSection).optional(), // block-based content
    relatedTreatments: z.array(z.string()).optional(), // link to treatment slugs
    clinicallyRelevant: z.boolean().default(false),    // appears in /conditions
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
  blog,
  posts,
  cases,
  testimonies,
  pages,
};
