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

// ── Unified widget catalog ────────────────────────────────────────────────
// One `section` discriminated union used by every collection (doctors,
// treatments, services, blog). Renders through src/components/blocks/
// Sections.astro. Names describe the widget's LAYOUT, not its usage — the
// same block type can serve multiple editorial purposes.
//
// Migration notes:
//   • at_a_glance      → highlights
//   • pull_quote       → quote
//   • related          → cards
//   • stats_facts      → SPLIT into `stats` + `facts` (facts is now a widget)
//   • cv_stats         → stats (field rename: fig → value, desc → label)
//   • comparison_pair  → panels (2-panel form; a/b become panels[0/1] with
//                        original label → eyebrow)
//   • treatment_groups → panels (groups → panels, otherwise identical shape)

const blockProse = z.object({
  type: z.literal("prose"),
  heading: z.string().optional(),      // when present, appears in the TOC
  body: z.string(),                    // markdown allowed
});

const blockHighlights = z.object({
  type: z.literal("highlights"),
  heading: z.string().optional(),
  items: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).min(2).max(4),
});

const blockStats = z.object({
  type: z.literal("stats"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  items: z.array(z.object({
    value: z.string(),   // "5,000+", "25", "30–50%"
    label: z.string(),   // short description under the figure
  })).min(2).max(6),
});

const blockFacts = z.object({
  type: z.literal("facts"),
  heading: z.string().optional(),      // defaults to "Key facts" / "حقائق أساسية" in renderer
  items: z.array(z.string()).min(1),
});

// One list block, three layout variants. Item shape is generic
// (label / body / subtitle?); the renderer picks the layout.
//
//   rows    — single-column stacked entries, label mono-left, body right,
//              optional subtitle beneath the body.
//   wrap    — auto-fit responsive grid, body main-left, label mono-right.
//              Items pack as many columns as fit; subtitle unused.
//   columns — fixed 2 columns; each cell is a full label+body row.
const blockList = z.object({
  type: z.literal("list"),
  variant: z.enum(["rows", "wrap", "columns"]),
  heading: z.string(),
  items: z.array(z.object({
    label: z.string(),
    body: z.string(),
    subtitle: z.string().optional(),
  })).min(1),
});

const blockQuote = z.object({
  type: z.literal("quote"),
  text: z.string(),
  attribution: z.string().optional(),
});

const blockPanels = z.object({
  type: z.literal("panels"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  note: z.string().optional(),
  panels: z.array(z.object({
    eyebrow: z.string().optional(),   // small caps label above title
    title: z.string(),
    subtitle: z.string().optional(),
    items: z.array(z.string()).default([]),
  })).min(2).max(4),
});

const blockMedia = z.object({
  type: z.literal("media"),
  kind: z.enum(["image", "video", "youtube"]),
  src: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  aspect: z.enum(["16/9", "4/3", "3/2", "1/1"]).optional(),
  uploadDate: z.string().optional(),
});

const blockPathway = z.object({
  type: z.literal("pathway"),
  heading: z.string().optional(),
  intro: z.string().optional(),
  groups: z.array(z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    items: z.array(z.object({
      name: z.string(),
      href: z.string(),
    })).min(1),
  })).min(1),
});

const blockRow = z.object({
  type: z.literal("row"),
  heading: z.string().optional(),
  columns: z.enum(["auto", "2", "3", "4"]).default("auto"),
  items: z.array(z.object({
    src: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
    href: z.string().optional(),
    aspect: z.enum(["16/9", "4/3", "3/2", "1/1"]).optional(),
  })).min(1),
});

const blockCards = z.object({
  type: z.literal("cards"),
  heading: z.string().optional(),
  slugs: z.array(z.string()).min(1),   // resolved to items by the page template
});

const section = z.discriminatedUnion("type", [
  blockProse,
  blockHighlights,
  blockStats,
  blockFacts,
  blockList,
  blockQuote,
  blockPanels,
  blockMedia,
  blockPathway,
  blockRow,
  blockCards,
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
    sections: z.array(section).optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: pageBase.extend({
    redesigned: z.boolean().optional(),
    sections: z.array(section).optional(),
    isHub: z.boolean().optional(),
  }),
});

const doctors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/doctors" }),
  schema: pageBase.extend({
    fullName: z.string(),
    // Shared across listing card and detail hero — one source of truth.
    titles: z.array(z.string()).default([]),
    specialty: z.string().optional(),           // listing card chip
    photo: z.string().optional(),               // listing + detail portrait
    photoAlt: z.string().optional(),            // portrait alt (falls back to fullName)
    languages: z.array(z.string()).default([]), // listing card only
    // Hero copy — always present, single instance per doctor. Rendered at
    // the top of the detail page by DoctorSections before the sections loop.
    heroEyebrow: z.string(),                    // small caps label above name
    heroHeadline: z.string().optional(),        // defaults to fullName
    heroLede: z.string(),                       // paragraph under the h1
    // Block-based CV. Everything below the hero is a section: stats,
    // timelines (appointments/education/conferences), memberships, publications.
    // The listing card derives its memberships count from the cv_memberships
    // blocks in this list.
    sections: z.array(section).optional(),
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
    sections: z.array(section).optional(), // block-based content
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
