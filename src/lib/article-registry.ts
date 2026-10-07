/**
 * Per-collection article configuration — breadcrumbs, labels, JSON-LD
 * schema, disclaimer. Consumed by the catch-all route at
 * `src/pages/[locale]/[...slug].astro` so every collection follows the
 * same ArticleLayout + ArticleBody pipeline by default.
 *
 * Adding a new article-shaped collection (e.g. `surgeries`) is a one-line
 * edit here plus the usual content/schema/CMS additions — no new .astro
 * route file.
 */
import type { Locale } from "./i18n";
import { localizedHref } from "./i18n";
import { NAV_LABELS, TREATMENT_LABELS, SERVICE_LABELS, BLOG_LABELS, CASE_LABELS } from "./labels";
import { TREATMENT_PATHWAY } from "./pathways";
import { conditionPage, procedurePage, articlePage, type PageInput } from "./schema";

export type ArticleCollection = "treatments" | "services" | "blog" | "cases";

export interface BreadcrumbItem { label: string; href?: string; }
export interface MetaItem { label: string; value: string; }

export interface ArticleBaseLabels {
  reviewedByLabel: string;
  reviewer: string;
  readingTimeLabel: string;
  lastReviewedLabel: string;
  tocLabel: string;
  callLabel: string;
  callBody: string;
  ctaHeading: string;
  ctaBody: string;
  disclaimer?: string;
}

export interface ArticleConfig {
  /** Human-readable labels for the article chrome (TOC, meta, CTA). */
  labels: (locale: Locale) => ArticleBaseLabels;
  /** JSON-LD schema function to call for the page. */
  schemaFn: (input: PageInput) => Record<string, unknown>;
  /** Breadcrumb trail for the page, with the final crumb unlinked. */
  breadcrumbs: (entry: any, locale: Locale) => BreadcrumbItem[];
  /** Optional first meta row before Reviewed by (e.g. pathway, category). */
  firstMetaRow?: (entry: any, locale: Locale) => MetaItem | null;
  /** Disclaimer string — may depend on the entry (e.g. embed the title). */
  disclaimer?: (entry: any, locale: Locale) => string;
  /** Which `publishedAt`-ish date to show in the Last-reviewed meta row. */
  dateField?: (entry: any) => Date | undefined;
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

const home = (locale: Locale) => ({ label: NAV_LABELS[locale].home, href: localizedHref("/", locale) });

const dateFromPublishedAt = (entry: any): Date | undefined =>
  entry.data.publishedAt as Date | undefined;

const dateFromPublishedOrUpdated = (entry: any): Date | undefined =>
  (entry.data.publishedAt as Date | undefined) ?? (entry.data.updated as Date | undefined);

/* ── Registry ─────────────────────────────────────────────────────────── */

export const ARTICLE_REGISTRY: Record<ArticleCollection, ArticleConfig> = {
  treatments: {
    labels: (locale) => TREATMENT_LABELS[locale],
    schemaFn: conditionPage,
    breadcrumbs: (entry, locale) => {
      const cat = (entry.data.pathwayOverride || entry.data.category || "pain").toLowerCase();
      const pw = TREATMENT_PATHWAY[locale][cat] || TREATMENT_PATHWAY[locale].pain;
      return [
        home(locale),
        { label: NAV_LABELS[locale].treatments, href: localizedHref("/conditions/", locale) },
        { label: pw.label },
      ];
    },
    firstMetaRow: (entry, locale) => {
      const cat = (entry.data.pathwayOverride || entry.data.category || "pain").toLowerCase();
      const pw = TREATMENT_PATHWAY[locale][cat] || TREATMENT_PATHWAY[locale].pain;
      return { label: TREATMENT_LABELS[locale].pathwayLabel, value: pw.pathway };
    },
    disclaimer: (entry, locale) =>
      locale === "ar"
        ? `تقدم هذه الصفحة معلومات عامة حول ${entry.data.title} وليست بديلاً عن التقييم الطبي الفردي. إذا كانت أعراضك شديدة أو تزداد سوءاً، فاتصل بطبيب على الفور.`
        : `This page provides general information about ${(entry.data.title as string).toLowerCase()} and is not a substitute for individual medical assessment. If your symptoms are severe or worsening, contact a clinician promptly.`,
    dateField: dateFromPublishedAt,
  },

  services: {
    labels: (locale) => SERVICE_LABELS[locale],
    schemaFn: procedurePage,
    breadcrumbs: (entry, locale) => {
      const cat = entry.data.category || (locale === "ar" ? "خدمة" : "Service");
      return [
        home(locale),
        { label: NAV_LABELS[locale].services, href: localizedHref("/services/", locale) },
        { label: cat },
      ];
    },
    firstMetaRow: (entry, locale) => {
      const cat = entry.data.category || (locale === "ar" ? "خدمة" : "Service");
      return { label: SERVICE_LABELS[locale].pathwayLabel, value: cat };
    },
    disclaimer: (_, locale) => SERVICE_LABELS[locale].disclaimer,
    dateField: dateFromPublishedOrUpdated,
  },

  blog: {
    labels: (locale) => BLOG_LABELS[locale],
    schemaFn: articlePage,
    breadcrumbs: (entry, locale) => [
      home(locale),
      { label: NAV_LABELS[locale].blog, href: localizedHref("/blog/", locale) },
      { label: entry.data.title },
    ],
    disclaimer: (_, locale) => BLOG_LABELS[locale].disclaimer,
    dateField: dateFromPublishedAt,
  },

  cases: {
    labels: (locale) => CASE_LABELS[locale],
    schemaFn: articlePage,
    breadcrumbs: (entry, locale) => [
      home(locale),
      { label: NAV_LABELS[locale].cases, href: localizedHref("/cases/", locale) },
      { label: entry.data.title },
    ],
    disclaimer: (_, locale) => CASE_LABELS[locale].disclaimer,
    dateField: dateFromPublishedAt,
  },
};

export function isArticleCollection(name: string): name is ArticleCollection {
  return name in ARTICLE_REGISTRY;
}
