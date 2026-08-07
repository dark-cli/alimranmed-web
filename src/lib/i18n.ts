/**
 * i18n helpers. Content collection entries live at
 *   src/content/{collection}/{...path}/{topic}/{locale}.md
 * so entry.id has the shape "some/nested/topic/en" or "topic/ar".
 * These helpers split that back into (topic, locale) and provide the
 * URL-building bits routes need.
 */

export type Locale = "en" | "ar";
export const LOCALES: Locale[] = ["en", "ar"];
export const DEFAULT_LOCALE: Locale = "en";

/** Extract the locale segment (last path part) from an entry id. */
export function localeOf(id: string): Locale | null {
  const last = id.split("/").pop();
  return LOCALES.includes(last as Locale) ? (last as Locale) : null;
}

/** Get the topic slug (everything before the trailing "/en" or "/ar"). */
export function topicOf(id: string): string {
  return id.replace(/\/(en|ar)$/, "");
}

/** True if the entry belongs to the given locale. */
export function isLocale(id: string, locale: Locale): boolean {
  return id.endsWith(`/${locale}`);
}

/** Prefix a path with /ar for AR locale; leave EN paths untouched. */
export function localizedHref(path: string, locale: Locale): string {
  if (locale === "en" || path.startsWith("/ar/") || path === "/ar") return path;
  if (path === "/") return "/ar/";
  return `/ar${path}`;
}

/** Given a current URL pathname, produce the alternate-locale equivalent. */
export function alternateHref(currentPath: string, otherLocale: Locale): string {
  const isAr = currentPath.startsWith("/ar/") || currentPath === "/ar";
  const bare = isAr
    ? (currentPath.replace(/^\/ar/, "") || "/")
    : currentPath;
  return otherLocale === "en" ? bare : localizedHref(bare, "ar");
}

import en from "../i18n/en.json";
import ar from "../i18n/ar.json";
const DICTS: Record<Locale, Record<string, string>> = { en, ar };

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
  if (astro.currentLocale === "ar" || astro.url.pathname.startsWith("/ar")) return "ar";
  return "en";
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
  const other = locale === "en" ? "ar" : "en";
  const alt = entries.find((e) => e.id === `${topic}/${other}`);
  if (alt) return { entry: alt, fallback: true };
  return null;
}

