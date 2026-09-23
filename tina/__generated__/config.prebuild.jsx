// tina/config.ts
import { defineConfig } from "tinacms";
var sectionTemplates = [
  {
    name: "at_a_glance",
    label: "At a Glance",
    fields: [
      {
        type: "object",
        name: "items",
        label: "Items",
        list: true,
        fields: [
          { type: "string", name: "label", label: "Label", required: true },
          { type: "string", name: "value", label: "Value", required: true, ui: { component: "textarea" } }
        ]
      }
    ]
  },
  {
    name: "prose",
    label: "Prose",
    fields: [
      { type: "string", name: "heading", label: "Heading (appears in TOC)" },
      { type: "string", name: "body", label: "Body (markdown)", required: true, ui: { component: "textarea" } }
    ]
  },
  {
    name: "pull_quote",
    label: "Pull Quote",
    fields: [
      { type: "string", name: "text", label: "Quote text", required: true, ui: { component: "textarea" } },
      { type: "string", name: "attribution", label: "Attribution" }
    ]
  },
  {
    name: "comparison_pair",
    label: "Comparison Pair",
    fields: [
      { type: "string", name: "heading", label: "Heading" },
      { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
      {
        type: "object",
        name: "a",
        label: "Side A",
        fields: [
          { type: "string", name: "label", label: "Label" },
          { type: "string", name: "title", label: "Title" },
          { type: "string", name: "items", label: "Items", list: true }
        ]
      },
      {
        type: "object",
        name: "b",
        label: "Side B",
        fields: [
          { type: "string", name: "label", label: "Label" },
          { type: "string", name: "title", label: "Title" },
          { type: "string", name: "items", label: "Items", list: true }
        ]
      }
    ]
  },
  {
    name: "stats_facts",
    label: "Stats & Facts",
    fields: [
      { type: "string", name: "heading", label: "Heading" },
      { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
      {
        type: "object",
        name: "stats",
        label: "Stats",
        list: true,
        fields: [
          { type: "string", name: "value", label: "Value", required: true },
          { type: "string", name: "label", label: "Label", required: true }
        ]
      },
      { type: "string", name: "facts", label: "Facts", list: true }
    ]
  },
  {
    name: "treatment_groups",
    label: "Treatment Groups",
    fields: [
      { type: "string", name: "heading", label: "Heading" },
      { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
      { type: "string", name: "note", label: "Note" },
      {
        type: "object",
        name: "groups",
        label: "Groups",
        list: true,
        fields: [
          { type: "string", name: "title", label: "Title", required: true },
          { type: "string", name: "subtitle", label: "Subtitle" },
          { type: "string", name: "items", label: "Items", list: true }
        ]
      }
    ]
  },
  {
    name: "related",
    label: "Related Treatments",
    fields: [
      { type: "string", name: "slugs", label: "Treatment slugs", list: true }
    ]
  },
  {
    name: "media",
    label: "Media",
    fields: [
      {
        type: "string",
        name: "kind",
        label: "Kind",
        required: true,
        options: ["image", "video", "youtube"]
      },
      { type: "string", name: "src", label: "Source URL / YouTube ID", required: true },
      { type: "string", name: "alt", label: "Alt text" },
      { type: "string", name: "caption", label: "Caption" },
      {
        type: "string",
        name: "aspect",
        label: "Aspect ratio",
        options: ["16/9", "4/3", "3/2", "1/1"]
      }
    ]
  }
];
var sectionsField = {
  type: "object",
  name: "sections",
  label: "Sections",
  list: true,
  templateKey: "type",
  templates: sectionTemplates
};
var baseFields = [
  { type: "string", name: "title", label: "Title", isTitle: true, required: true },
  {
    type: "string",
    name: "description",
    label: "Description",
    ui: { component: "textarea" }
  },
  { type: "string", name: "category", label: "Category" },
  { type: "number", name: "order", label: "Order" },
  { type: "string", name: "image", label: "Image path" },
  { type: "string", name: "imageAlt", label: "Image alt" },
  { type: "datetime", name: "updated", label: "Last updated" },
  {
    type: "string",
    name: "source",
    label: "Content source",
    options: [
      { value: "legacy-wp", label: "Legacy WordPress" },
      { value: "ai-draft", label: "AI draft" },
      { value: "human-reviewed", label: "Human reviewed" },
      { value: "original", label: "Original" },
      { value: "translated-by-llm", label: "Translated by LLM" }
    ]
  },
  { type: "string", name: "reviewedBy", label: "Reviewed by" },
  { type: "datetime", name: "reviewedAt", label: "Reviewed at" }
];
var blogFields = [
  ...baseFields,
  { type: "string", name: "author", label: "Author" },
  { type: "datetime", name: "publishedAt", label: "Published at" },
  { type: "string", name: "tags", label: "Tags", list: true },
  { type: "boolean", name: "redesigned", label: "Redesigned (block layout)" },
  { type: "boolean", name: "clinicallyRelevant", label: "Clinically relevant" },
  { type: "string", name: "relatedTreatments", label: "Related treatment slugs", list: true },
  sectionsField
];
var treatmentFields = [
  ...baseFields,
  { type: "string", name: "bodyRegion", label: "Body region" },
  { type: "datetime", name: "publishedAt", label: "Published at" },
  { type: "boolean", name: "redesigned", label: "Redesigned (block layout)" },
  {
    type: "object",
    name: "faqItems",
    label: "FAQ",
    list: true,
    fields: [
      { type: "string", name: "question", label: "Question", required: true },
      { type: "string", name: "answer", label: "Answer", required: true, ui: { component: "textarea" } }
    ]
  },
  sectionsField
];
var serviceFields = [
  ...baseFields,
  { type: "boolean", name: "redesigned", label: "Redesigned (block layout)" },
  { type: "boolean", name: "isHub", label: "Category hub page" },
  sectionsField
];
var caseFields = [
  ...baseFields,
  { type: "string", name: "condition", label: "Condition" },
  { type: "string", name: "outcome", label: "Outcome", ui: { component: "textarea" } }
];
var doctorFields = [
  ...baseFields,
  { type: "string", name: "fullName", label: "Full name", required: true },
  { type: "string", name: "titles", label: "Credentials / titles", list: true },
  { type: "string", name: "specialty", label: "Specialty" },
  { type: "string", name: "photo", label: "Photo path" },
  { type: "string", name: "memberships", label: "Memberships", list: true },
  { type: "string", name: "languages", label: "Languages", list: true }
];
var config_default = defineConfig({
  // Local mode — no Tina Cloud needed. Leave clientId/token null.
  branch: "",
  clientId: null,
  token: null,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  collections: [
    // ── Blog ──────────────────────────────────────────────────────────
    {
      name: "blog_en",
      label: "Blog \u2014 English",
      path: "src/content/blog",
      match: { include: "*/en" },
      format: "md",
      fields: blogFields
    },
    {
      name: "blog_ar",
      label: "Blog \u2014 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
      path: "src/content/blog",
      match: { include: "*/ar" },
      format: "md",
      fields: blogFields
    },
    // ── Treatments ────────────────────────────────────────────────────
    {
      name: "treatments_en",
      label: "Treatments \u2014 English",
      path: "src/content/treatments",
      match: { include: "*/en" },
      format: "md",
      fields: treatmentFields
    },
    {
      name: "treatments_ar",
      label: "Treatments \u2014 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
      path: "src/content/treatments",
      match: { include: "*/ar" },
      format: "md",
      fields: treatmentFields
    },
    // ── Services ──────────────────────────────────────────────────────
    {
      name: "services_en",
      label: "Services \u2014 English",
      path: "src/content/services",
      match: { include: "*/en" },
      format: "md",
      fields: serviceFields
    },
    {
      name: "services_ar",
      label: "Services \u2014 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
      path: "src/content/services",
      match: { include: "*/ar" },
      format: "md",
      fields: serviceFields
    },
    // ── Cases ─────────────────────────────────────────────────────────
    {
      name: "cases_en",
      label: "Cases \u2014 English",
      path: "src/content/cases",
      match: { include: "*/en" },
      format: "md",
      fields: caseFields
    },
    {
      name: "cases_ar",
      label: "Cases \u2014 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
      path: "src/content/cases",
      match: { include: "*/ar" },
      format: "md",
      fields: caseFields
    },
    // ── Doctors ───────────────────────────────────────────────────────
    {
      name: "doctors_en",
      label: "Doctors \u2014 English",
      path: "src/content/doctors",
      match: { include: "*/en" },
      format: "md",
      fields: doctorFields
    },
    {
      name: "doctors_ar",
      label: "Doctors \u2014 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
      path: "src/content/doctors",
      match: { include: "*/ar" },
      format: "md",
      fields: doctorFields
    },
    // ── Pages ─────────────────────────────────────────────────────────
    {
      name: "pages_en",
      label: "Pages \u2014 English",
      path: "src/content/pages",
      match: { include: "*/en" },
      format: "md",
      fields: baseFields
    },
    {
      name: "pages_ar",
      label: "Pages \u2014 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
      path: "src/content/pages",
      match: { include: "*/ar" },
      format: "md",
      fields: baseFields
    }
  ]
});
export {
  config_default as default
};
