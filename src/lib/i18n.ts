/**
 * i18n helpers. Content collection entries live at
 *   src/content/{collection}/{...path}/{topic}/{locale}.md
 * so entry.id has the shape "some/nested/topic/en" or "topic/ar".
 * These helpers split that back into (topic, locale) and provide the
 * URL-building bits routes need.
 */

export type Locale = "en" | "ar" | "tr";

export function toArabicDigits(n: number): string {
  return String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}
export const LOCALES: Locale[] = ["en", "ar", "tr"];

/** Right-to-left locales. */
export const RTL_LOCALES: Locale[] = ["ar"];
export const isRtl = (l: Locale) => RTL_LOCALES.includes(l);

/** Native name shown in the language switcher. */
export const LOCALE_LABELS: Record<Locale, string> = { en: "English", ar: "عربي", tr: "Türkçe" };

/** BCP-47 tag for Intl / toLocaleDateString. */
export const DATE_LOCALES: Record<Locale, string> = { en: "en-US", ar: "ar-IQ", tr: "tr-TR" };
export const DEFAULT_LOCALE: Locale = "en";

/** Extract the locale segment (last path part) from an entry id. */
export function localeOf(id: string): Locale | null {
  const last = id.split("/").pop();
  return LOCALES.includes(last as Locale) ? (last as Locale) : null;
}

/** Get the topic slug (everything before the trailing "/en", "/ar" or "/tr"). */
export function topicOf(id: string): string {
  return id.replace(/\/(en|ar|tr)$/, "");
}

/** True if the entry belongs to the given locale. */
export function isLocale(id: string, locale: Locale): boolean {
  return id.endsWith(`/${locale}`);
}

/**
 * Normalize a URL by stripping language prefixes and applying the correct one.
 * Fixes hardcoded /en/ or /ar/ prefixes to match the target locale.
 *
 * Routing: English at /en/, Arabic at /ar/, Turkish at /tr/
 */
export function normalizeHref(path: string, locale: Locale): string {
  // Strip existing language prefix (handles hardcoded /en/... or /ar/... URLs)
  const stripped = path.replace(/^\/(?:en|ar|tr)(?=\/|$)/, '') || '/';

  // Apply the correct locale prefix
  if (!LOCALES.includes(locale)) return path;
  return stripped === "/" ? `/${locale}/` : `/${locale}${stripped}`;
}

/** Prefix a path with /en, /ar or /tr based on locale. */
export function localizedHref(path: string, locale: Locale): string {
  // Strip existing language prefix for normalization
  const stripped = path.replace(/^\/(?:en|ar|tr)(?=\/|$)/, '') || '/';

  if (!LOCALES.includes(locale)) return path;
  return stripped === "/" ? `/${locale}/` : `/${locale}${stripped}`;
}

/** Given a current URL pathname, produce the alternate-locale equivalent. */
export function alternateHref(currentPath: string, otherLocale: Locale): string {
  // Strip the current language prefix to get the bare path
  const bare = currentPath.replace(/^\/(?:en|ar|tr)(?=\/|$)/, '') || '/';

  // Apply the alternate locale
  return localizedHref(bare, otherLocale);
}

import en from "../i18n/en.json";
import ar from "../i18n/ar.json";
import tr from "../i18n/tr.json";
const DICTS: Record<Locale, Record<string, string>> = { en, ar, tr };

/** Load the phrase dictionary for a locale, falling back to EN for
 *  missing keys so partial AR translations still render sensibly. */
export function dictFor(locale: Locale): Record<string, string> {
  return new Proxy(DICTS[locale] ?? DICTS.en, {
    get(target, key) {
      return (target as Record<string, string>)[key as string] ?? DICTS.en[key as string] ?? "";
    },
  });
}

/** Pull the current locale out of an Astro request; fall back to EN. */
export function currentLocale(astro: { currentLocale?: string; url: URL }): Locale {
  for (const l of LOCALES) {
    if (astro.currentLocale === l || astro.url.pathname.startsWith(`/${l}/`) || astro.url.pathname === `/${l}`) return l;
  }
  return "en"; // Default to English (even if path is /en)
}

/**
 * Given a topic (e.g. "headaches") and a locale, find the corresponding
 * entry in a collection. If the requested locale's file doesn't exist,
 * fall back to the other locale so the page still renders. Returns
 * `{ entry, fallback }` where `fallback` = true when the requested
 * locale had no file and we returned the other one.
 */
export function pickForLocale<T extends { id: string }>(
  entries: T[],
  topic: string,
  locale: Locale,
): { entry: T; fallback: boolean } | null {
  const want = entries.find((e) => e.id === `${topic}/${locale}`);
  if (want) return { entry: want, fallback: false };
  const alt = entries.find((e) => e.id === `${topic}/en`) ?? entries.find((e) => e.id === `${topic}/ar`);
  if (alt) return { entry: alt, fallback: true };
  return null;
}


/** Pick a per-locale value; falls back to EN when a locale is missing. */
export function byLocale<T>(locale: Locale, v: { en: T; ar: T; tr?: T }): T {
  return (v[locale] ?? v.en) as T;
}
