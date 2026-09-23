import { defineConfig } from "tinacms";

// ── Section block templates ────────────────────────────────────────────────
// Mirror of the Zod discriminatedUnion in src/content.config.ts.
// templateKey: "type" preserves the existing `type: prose` frontmatter format.
// Names use underscores because TinaCMS identifiers can't contain hyphens —
// the migration script (scripts/migrate-section-types.mjs) renames the values
// in existing files (at-a-glance → at_a_glance, etc.) to match.
const sectionTemplates = [
  {
    name: "at_a_glance",
    label: "At a Glance",
    fields: [
      {
        type: "object" as const,
        name: "items",
        label: "Items",
        list: true,
        fields: [
          { type: "string" as const, name: "label", label: "Label", required: true },
          { type: "string" as const, name: "value", label: "Value", required: true, ui: { component: "textarea" } },
        ],
      },
    ],
  },
  {
    name: "prose",
    label: "Prose",
    fields: [
      { type: "string" as const, name: "heading", label: "Heading (appears in TOC)" },
      { type: "string" as const, name: "body", label: "Body (markdown)", required: true, ui: { component: "textarea" } },
    ],
  },
  {
    name: "pull_quote",
    label: "Pull Quote",
    fields: [
      { type: "string" as const, name: "text", label: "Quote text", required: true, ui: { component: "textarea" } },
      { type: "string" as const, name: "attribution", label: "Attribution" },
    ],
  },
  {
    name: "comparison_pair",
    label: "Comparison Pair",
    fields: [
      { type: "string" as const, name: "heading", label: "Heading" },
      { type: "string" as const, name: "intro", label: "Intro", ui: { component: "textarea" } },
      {
        type: "object" as const,
        name: "a",
        label: "Side A",
        fields: [
          { type: "string" as const, name: "label", label: "Label" },
          { type: "string" as const, name: "title", label: "Title" },
          { type: "string" as const, name: "items", label: "Items", list: true },
        ],
      },
      {
        type: "object" as const,
        name: "b",
        label: "Side B",
        fields: [
          { type: "string" as const, name: "label", label: "Label" },
          { type: "string" as const, name: "title", label: "Title" },
          { type: "string" as const, name: "items", label: "Items", list: true },
        ],
      },
    ],
  },
  {
    name: "stats_facts",
    label: "Stats & Facts",
    fields: [
      { type: "string" as const, name: "heading", label: "Heading" },
      { type: "string" as const, name: "intro", label: "Intro", ui: { component: "textarea" } },
      {
        type: "object" as const,
        name: "stats",
        label: "Stats",
        list: true,
        fields: [
          { type: "string" as const, name: "value", label: "Value", required: true },
          { type: "string" as const, name: "label", label: "Label", required: true },
        ],
      },
      { type: "string" as const, name: "facts", label: "Facts", list: true },
    ],
  },
  {
    name: "treatment_groups",
    label: "Treatment Groups",
    fields: [
      { type: "string" as const, name: "heading", label: "Heading" },
      { type: "string" as const, name: "intro", label: "Intro", ui: { component: "textarea" } },
      { type: "string" as const, name: "note", label: "Note" },
      {
        type: "object" as const,
        name: "groups",
        label: "Groups",
        list: true,
        fields: [
          { type: "string" as const, name: "title", label: "Title", required: true },
          { type: "string" as const, name: "subtitle", label: "Subtitle" },
          { type: "string" as const, name: "items", label: "Items", list: true },
        ],
      },
    ],
  },
  {
    name: "related",
    label: "Related Treatments",
    fields: [
      { type: "string" as const, name: "slugs", label: "Treatment slugs", list: true },
    ],
  },
  {
    name: "media",
    label: "Media",
    fields: [
      {
        type: "string" as const,
        name: "kind",
        label: "Kind",
        required: true,
        options: ["image", "video", "youtube"],
      },
      { type: "string" as const, name: "src", label: "Source URL / YouTube ID", required: true },
      { type: "string" as const, name: "alt", label: "Alt text" },
      { type: "string" as const, name: "caption", label: "Caption" },
      {
        type: "string" as const,
        name: "aspect",
        label: "Aspect ratio",
        options: ["16/9", "4/3", "3/2", "1/1"],
      },
    ],
  },
];

// Sections field — shared across all article collections
const sectionsField = {
  type: "object" as const,
  name: "sections",
  label: "Sections",
  list: true,
  templateKey: "type",
  templates: sectionTemplates,
};

// ── Shared base fields ─────────────────────────────────────────────────────
// Mirrors the pageBase Zod schema in src/content.config.ts.
const baseFields = [
  { type: "string" as const, name: "title", label: "Title", isTitle: true, required: true },
  {
    type: "string" as const,
    name: "description",
    label: "Description",
    ui: { component: "textarea" },
  },
  { type: "string" as const, name: "category", label: "Category" },
  { type: "number" as const, name: "order", label: "Order" },
  { type: "string" as const, name: "image", label: "Image path" },
  { type: "string" as const, name: "imageAlt", label: "Image alt" },
  { type: "datetime" as const, name: "updated", label: "Last updated" },
  {
    type: "string" as const,
    name: "source",
    label: "Content source",
    options: [
      { value: "legacy-wp",       label: "Legacy WordPress" },
      { value: "ai-draft",        label: "AI draft" },
      { value: "human-reviewed",  label: "Human reviewed" },
      { value: "original",        label: "Original" },
      { value: "translated-by-llm", label: "Translated by LLM" },
    ],
  },
  { type: "string" as const, name: "reviewedBy", label: "Reviewed by" },
  { type: "datetime" as const, name: "reviewedAt", label: "Reviewed at" },
];

// ── Collections ────────────────────────────────────────────────────────────

const blogFields = [
  ...baseFields,
  { type: "string" as const, name: "author", label: "Author" },
  { type: "datetime" as const, name: "publishedAt", label: "Published at" },
  { type: "string" as const, name: "tags", label: "Tags", list: true },
  { type: "boolean" as const, name: "redesigned", label: "Redesigned (block layout)" },
  { type: "boolean" as const, name: "clinicallyRelevant", label: "Clinically relevant" },
  { type: "string" as const, name: "relatedTreatments", label: "Related treatment slugs", list: true },
  sectionsField,
];

const treatmentFields = [
  ...baseFields,
  { type: "string" as const, name: "bodyRegion", label: "Body region" },
  { type: "datetime" as const, name: "publishedAt", label: "Published at" },
  { type: "boolean" as const, name: "redesigned", label: "Redesigned (block layout)" },
  {
    type: "object" as const,
    name: "faqItems",
    label: "FAQ",
    list: true,
    fields: [
      { type: "string" as const, name: "question", label: "Question", required: true },
      { type: "string" as const, name: "answer", label: "Answer", required: true, ui: { component: "textarea" } },
    ],
  },
  sectionsField,
];

const serviceFields = [
  ...baseFields,
  { type: "boolean" as const, name: "redesigned", label: "Redesigned (block layout)" },
  { type: "boolean" as const, name: "isHub", label: "Category hub page" },
  sectionsField,
];

const caseFields = [
  ...baseFields,
  { type: "string" as const, name: "condition", label: "Condition" },
  { type: "string" as const, name: "outcome", label: "Outcome", ui: { component: "textarea" } },
];

const doctorFields = [
  ...baseFields,
  { type: "string" as const, name: "fullName", label: "Full name", required: true },
  { type: "string" as const, name: "titles", label: "Credentials / titles", list: true },
  { type: "string" as const, name: "specialty", label: "Specialty" },
  { type: "string" as const, name: "photo", label: "Photo path" },
  { type: "string" as const, name: "memberships", label: "Memberships", list: true },
  { type: "string" as const, name: "languages", label: "Languages", list: true },
];

export default defineConfig({
  // Local mode — no Tina Cloud needed. Leave clientId/token null.
  branch: "",
  clientId: null,
  token: null,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  collections: [
    // ── Blog ──────────────────────────────────────────────────────────
    {
      name: "blog_en",
      label: "Blog — English",
      path: "src/content/blog",
      match: { include: "*/en" },
      format: "md",
      fields: blogFields,
    },
    {
      name: "blog_ar",
      label: "Blog — العربية",
      path: "src/content/blog",
      match: { include: "*/ar" },
      format: "md",
      fields: blogFields,
    },

    // ── Treatments ────────────────────────────────────────────────────
    {
      name: "treatments_en",
      label: "Treatments — English",
      path: "src/content/treatments",
      match: { include: "*/en" },
      format: "md",
      fields: treatmentFields,
    },
    {
      name: "treatments_ar",
      label: "Treatments — العربية",
      path: "src/content/treatments",
      match: { include: "*/ar" },
      format: "md",
      fields: treatmentFields,
    },

    // ── Services ──────────────────────────────────────────────────────
    {
      name: "services_en",
      label: "Services — English",
      path: "src/content/services",
      match: { include: "*/en" },
      format: "md",
      fields: serviceFields,
    },
    {
      name: "services_ar",
      label: "Services — العربية",
      path: "src/content/services",
      match: { include: "*/ar" },
      format: "md",
      fields: serviceFields,
    },

    // ── Cases ─────────────────────────────────────────────────────────
    {
      name: "cases_en",
      label: "Cases — English",
      path: "src/content/cases",
      match: { include: "*/en" },
      format: "md",
      fields: caseFields,
    },
    {
      name: "cases_ar",
      label: "Cases — العربية",
      path: "src/content/cases",
      match: { include: "*/ar" },
      format: "md",
      fields: caseFields,
    },

    // ── Doctors ───────────────────────────────────────────────────────
    {
      name: "doctors_en",
      label: "Doctors — English",
      path: "src/content/doctors",
      match: { include: "*/en" },
      format: "md",
      fields: doctorFields,
    },
    {
      name: "doctors_ar",
      label: "Doctors — العربية",
      path: "src/content/doctors",
      match: { include: "*/ar" },
      format: "md",
      fields: doctorFields,
    },

    // ── Pages ─────────────────────────────────────────────────────────
    {
      name: "pages_en",
      label: "Pages — English",
      path: "src/content/pages",
      match: { include: "*/en" },
      format: "md",
      fields: baseFields,
    },
    {
      name: "pages_ar",
      label: "Pages — العربية",
      path: "src/content/pages",
      match: { include: "*/ar" },
      format: "md",
      fields: baseFields,
    },
  ],
});
