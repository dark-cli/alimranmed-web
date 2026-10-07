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
  number: z.string().optional(),       // optional section number ("01", "02") rendered above the heading
  eyebrow: z.string().optional(),      // optional small-caps accent label above the heading (hero-style)
  heading: z.string().optional(),      // when present, appears in the TOC
  headingLevel: z.enum(["h2", "h3"]).default("h2"),
  // `hero` renders a display-size heading (clamp(30px, 7.6cqw, 58px)) and
  // larger body text — matches the typographic treatment of the old home
  // and doctor page heroes. `default` is the normal in-article prose.
  variant: z.enum(["default", "hero"]).default("default"),
  body: z.string().optional(),         // markdown allowed; omit when the block is just a numbered section header
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
  // Default renders contained to the article width. "band" breaks out to
  // a full-bleed surface strip with top/bottom hairlines — the look of
  // the old home + doctor stat bands.
  variant: z.enum(["default", "band"]).default("default"),
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
  heading: z.string().optional(),
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
    reading: z.array(z.object({        // optional "related reading" link list per panel
      title: z.string(),
      href: z.string(),
    })).optional(),
  })).min(2).max(4),
});

// Individual item inside a media block.
const mediaItem = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("image"),
    src: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
    aspect: z.enum(["16/9", "4/3", "3/2", "1/1"]).optional(),
  }),
  z.object({
    kind: z.literal("youtube"),
    src: z.string(),
    caption: z.string().optional(),
    aspect: z.enum(["16/9", "4/3", "3/2", "1/1"]).optional(),
    uploadDate: z.string().optional(),
  }),
]);

// Media block — one or more image/video/youtube items shown side by side.
const blockMedia = z.object({
  type: z.literal("media"),
  heading: z.string().optional(),
  items: z.array(mediaItem).min(1),
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
  footerLink: z.object({            // optional trailing "see all" link
    label: z.string(),
    href: z.string(),
  }).optional(),
});

// Image row — specialised row for images only. (Was `row`; renamed when the
// generic `row` was introduced so writers have a dedicated widget for photo
// galleries and the generic row stays composable for mixed content.)
const blockImageRow = z.object({
  type: z.literal("image-row"),
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
  items: z.array(z.string()).min(1),  // locale-agnostic paths: /treatments/back-pain/
});

// Chips — a horizontal flex of small bordered labels. Used for inline
// credential badges, tags, categories, etc. — anywhere short label-only
// items need to sit side-by-side on one or two lines. Non-clickable (for
// clickable chips use `pathway`).
const blockChips = z.object({
  type: z.literal("chips"),
  heading: z.string().optional(),
  items: z.array(z.string()).min(1),
});

// Social row — a horizontal strip of circular icon-only links for social
// networks. The `platform` string picks the icon from FontAwesome brands.
const blockSocialRow = z.object({
  type: z.literal("social-row"),
  heading: z.string().optional(),
  items: z.array(z.object({
    platform: z.enum([
      "facebook", "instagram", "youtube", "telegram", "tiktok",
      "twitter", "x", "linkedin", "whatsapp",
    ]),
    href: z.string(),
    label: z.string().optional(),            // aria-label; defaults to the platform name
  })).min(1),
});

// Map — an embedded location iframe (Google Maps / OpenStreetMap).
// Writer supplies the full embed `src`; the component only wraps it in a
// framed container with a title + optional heading.
const blockMap = z.object({
  type: z.literal("map"),
  heading: z.string().optional(),
  embedUrl: z.string(),                      // full iframe src URL
  title: z.string(),                         // iframe accessible title
  aspect: z.enum(["16/9", "4/3", "3/2", "1/1"]).default("16/9"),
});

// FAQ block — question/answer pairs. Renders visually (always expanded, no
// JS, best for Googlebot indexing) and the top-level route also harvests
// these items into FAQPage JSON-LD so writers get SEO for free. Replaces
// the older `faqItems` frontmatter field, which emitted schema but never
// rendered anything to users.
const blockFaq = z.object({
  type: z.literal("faq"),
  heading: z.string().optional(),      // defaults to "Common questions" / "أسئلة شائعة"
  items: z.array(z.object({
    question: z.string(),
    answer: z.string(),                // markdown inline links supported
  })).min(1),
});

// Small primitive: a single call-to-action button. Used inside row/column
// layouts (hero CTAs, in-section action rows). Variants: primary (filled),
// secondary (outline), quiet (text + accent underline).
const blockButton = z.object({
  type: z.literal("button"),
  label: z.string(),
  href: z.string(),
  variant: z.enum(["primary", "secondary", "quiet"]).default("primary"),
  newTab: z.boolean().optional(),
});

// Button row — purpose-built flex-wrap of buttons at natural widths.
// Preferred over nesting individual button widgets inside a generic `row`
// because the semantics are clearer and the layout is predictable (no
// grid-cell stretching, no accidental centering).
const blockButtonRow = z.object({
  type: z.literal("button-row"),
  align: z.enum(["start", "center", "end"]).default("start"),
  gap: z.enum(["tight", "normal", "wide"]).default("tight"),
  items: z.array(z.object({
    label: z.string(),
    href: z.string(),
    variant: z.enum(["primary", "secondary", "quiet"]).default("primary"),
    newTab: z.boolean().optional(),
  })).min(1),
});

// Credit line: avatar + "Led by Name, title" + optional link. Appears below
// the hero copy on the home page; could also sit as a byline inside articles.
const blockDoctorCredit = z.object({
  type: z.literal("doctor-credit"),
  avatar: z.string(),                     // image path
  avatarAlt: z.string().optional(),
  leadLabel: z.string().optional(),       // "Led by" / "بإشراف" — if omitted the renderer uses the locale default
  name: z.string(),
  title: z.string(),                      // e.g. "consultant neurosurgeon"
  linkLabel: z.string().optional(),       // optional CV / profile link label
  linkHref: z.string().optional(),
});

// Typographic placeholder tile for mixed facility grids (one cell is a real
// image, the rest are label + sublabel on a bordered surface).
const blockLabelTile = z.object({
  type: z.literal("label-tile"),
  label: z.string(),                      // ALL CAPS top line
  sublabel: z.string().optional(),        // smaller description below
});

// Contact band: bordered surface card with an intro and 1–3 columns of
// labelled contact entries. Powers the home-page referral band and the
// contact page.
const blockContactStrip = z.object({
  type: z.literal("contact-strip"),
  eyebrow: z.string().optional(),
  body: z.string().optional(),
  columns: z.array(z.object({
    label: z.string(),
    items: z.array(z.object({
      text: z.string(),
      href: z.string().optional(),
    })).min(1),
  })).min(1).max(3),
});

// Generic row — side-by-side layout holding any mix of child blocks.
// Collapses to a single column on mobile. Items may themselves be rows,
// columns, cards, prose, media, buttons, etc. (recursive).
const blockRow = z.object({
  type: z.literal("row"),
  heading: z.string().optional(),
  columns: z.enum(["auto", "2", "3", "4"]).default("auto"),
  gap: z.enum(["tight", "normal", "wide"]).default("normal"),
  align: z.enum(["start", "center", "stretch"]).default("stretch"),
  items: z.array(z.any()).min(1),         // recursive — validated at runtime by the dispatcher
});

// Generic column — vertical stack of child blocks. Mainly useful inside a
// row (e.g. "left column: heading + prose + buttons"), or on its own when a
// section needs a tight vertical rhythm distinct from the article flow.
// `align` controls horizontal alignment of items — "stretch" fills parent
// width (default), "start" places items at the natural leading edge, etc.
const blockColumn = z.object({
  type: z.literal("column"),
  heading: z.string().optional(),
  gap: z.enum(["tight", "normal", "wide"]).default("normal"),
  align: z.enum(["start", "center", "end", "stretch"]).default("stretch"),
  items: z.array(z.any()).min(1),         // recursive — validated at runtime by the dispatcher
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
  blockImageRow,
  blockRow,
  blockColumn,
  blockButton,
  blockDoctorCredit,
  blockLabelTile,
  blockContactStrip,
  blockChips,
  blockFaq,
  blockCards,
  blockButtonRow,
  blockSocialRow,
  blockMap,
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
    // Shared across listing card and Physician JSON-LD.
    titles: z.array(z.string()).default([]),
    specialty: z.string().optional(),           // listing card chip + JSON-LD specialty
    photo: z.string().optional(),               // listing portrait + JSON-LD image + hero LCP preload
    photoAlt: z.string().optional(),            // portrait alt (falls back to fullName)
    languages: z.array(z.string()).default([]), // listing card only
    // Legacy hero fields — the hero now lives inside sections[] as blocks
    // (row + prose + chips + media). Kept optional so legacy files that
    // still carry these fields don't fail Zod; nothing reads them anymore.
    heroEyebrow: z.string().optional(),
    heroHeadline: z.string().optional(),
    heroLede: z.string().optional(),
    // Block-based page — everything (hero + CV) is a section.
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

// Home page — a bilingual pair of Markdown files living directly at the
// root of src/content/. The file layout mirrors the URL exactly:
//   /en/  → src/content/en.md
//   /ar/  → src/content/ar.md
// Only loads en.md and ar.md at the root (no recursion), so it never
// clashes with the sub-folder collections above.
const home = defineCollection({
  loader: glob({ pattern: "{en,ar}.md", base: "./src/content" }),
  schema: pageBase.extend({
    sections: z.array(section).optional(),
  }),
});

// About page — one bilingual pair (en.md + ar.md). Previously six files
// split across mission / vision / values; those are now `prose` sections
// inside a single page.
const about = defineCollection({
  loader: glob({ pattern: "{en,ar}.md", base: "./src/content/about" }),
  schema: pageBase.extend({
    sections: z.array(section).optional(),
  }),
});

// Contact page — one bilingual pair at src/content/contact/{en,ar}.md.
// Hero + contact-strip + social-row + map, all expressed as blocks.
const contact = defineCollection({
  loader: glob({ pattern: "{en,ar}.md", base: "./src/content/contact" }),
  schema: pageBase.extend({
    sections: z.array(section).optional(),
  }),
});

export const collections = {
  treatments,
  services,
  doctors,
  blog,
  posts,
  cases,
  testimonies,
  home,
  about,
  contact,
};
