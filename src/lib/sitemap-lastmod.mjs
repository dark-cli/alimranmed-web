/**
 * Sitemap `<lastmod>` resolver.
 *
 * For each sitemap URL, figures out the source file that generates it
 * and returns the ISO date of that file's last git commit. Used by
 * astro.config.mjs' sitemap `serialize` hook.
 *
 * URL → source-file mapping (locale-agnostic):
 *   /<locale>/                              → src/pages/[locale]/index.astro
 *   /<locale>/<simple-path>/                → src/pages/[locale]/<path>.astro
 *                                             OR src/pages/[locale]/<path>/index.astro
 *   /<locale>/<collection>/<slug…>/         → src/content/<collection>/<slug…>/<locale>.md
 *
 * If no source file resolves (unusual routing), returns `null` — the URL
 * ships without a lastmod, which is preferable to a fabricated one.
 *
 * Cloudflare Pages note: their default git clone depth is 1, which would
 * collapse every file's lastmod to the deploy commit. Set the environment
 * variable `WORKERS_CI_GIT_DEPTH=0` in the Pages project settings so
 * `git log -1 -- <file>` returns the real per-file history.
 */

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "../..");

const CONTENT_COLLECTIONS = new Set([
  "treatments", "services", "blog", "cases", "doctors", "pages",
]);

// Memoize per-file lookups so we shell out to git at most once per source
// file across the whole build (both EN and AR variants of the same doctor
// point at the same set of files).
const gitCache = new Map();

function gitLastEdit(absFile) {
  if (!absFile) return null;
  if (gitCache.has(absFile)) return gitCache.get(absFile);
  if (!existsSync(absFile)) {
    gitCache.set(absFile, null);
    return null;
  }
  let iso = null;
  try {
    iso = execSync(
      `git log -1 --format=%aI -- "${absFile}"`,
      { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"], cwd: ROOT },
    ).trim() || null;
  } catch { /* git missing, shallow clone, etc. — leave iso as null */ }
  gitCache.set(absFile, iso);
  return iso;
}

/** URL pathname (e.g. "/en/treatments/als/") → absolute source path, or null. */
export function sourceFileForUrl(pathname) {
  const parts = pathname.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const locale = parts[0];
  if (locale !== "en" && locale !== "ar") return null;

  const rest = parts.slice(1);

  // /<locale>/ → home
  if (rest.length === 0) {
    return path.join(ROOT, "src/pages/[locale]/index.astro");
  }

  // /<locale>/<collection>/<slug…>/ → content file. Fall back to the other
  // locale's file when the requested one is missing — that's what the
  // routing layer does at runtime (pickForLocale), so the sitemap should
  // report the same file's date.
  if (rest.length >= 2 && CONTENT_COLLECTIONS.has(rest[0])) {
    const collection = rest[0];
    const slugPath   = rest.slice(1).join("/");
    const primary   = path.join(ROOT, "src/content", collection, slugPath, `${locale}.md`);
    if (existsSync(primary)) return primary;
    const fallback  = path.join(ROOT, "src/content", collection, slugPath, `${locale === "en" ? "ar" : "en"}.md`);
    if (existsSync(fallback)) return fallback;
  }

  // /<locale>/<path>/ → astro page (either `<path>.astro` or `<path>/index.astro`)
  const pagesRoot = path.join(ROOT, "src/pages/[locale]");
  const singular  = path.join(pagesRoot, rest.join("/") + ".astro");
  if (existsSync(singular)) return singular;
  const asIndex = path.join(pagesRoot, rest.join("/"), "index.astro");
  if (existsSync(asIndex))  return asIndex;

  return null;
}

/** Serialize hook for @astrojs/sitemap. */
export function serializeWithLastmod(item) {
  const { pathname } = new URL(item.url);
  const src  = sourceFileForUrl(pathname);
  const date = gitLastEdit(src);
  return date ? { ...item, lastmod: date } : item;
}
