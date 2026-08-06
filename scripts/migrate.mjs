#!/usr/bin/env node
/**
 * WordPress → Astro Content Collections migrator for alimranmed.com.
 *
 * Reads pages + posts from the source's WP-REST API, converts content.rendered
 * HTML to Markdown via turndown, and writes one .md file per entry into the
 * matching content collection folder. Runs for both EN (alimranmed.com) and
 * AR (ar.alimranmed.com).
 *
 * Slug → collection mapping is derived from src/data/navigation.ts:
 * every leaf carries a legacyUrl, and legacyUrl's slug is what WordPress
 * returns as `slug`. If a WP slug isn't in navigation.ts, it falls into
 * the `pages` catch-all collection.
 *
 * Run:
 *   node scripts/migrate.mjs                    # both locales, all sources
 *   node scripts/migrate.mjs --locale=en        # EN only
 *   node scripts/migrate.mjs --dry-run          # log actions, write nothing
 *   node scripts/migrate.mjs --limit=10         # first 10 entries per source
 */

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import TurndownService from "turndown";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CONTENT_ROOT = path.join(REPO_ROOT, "src", "content");

// -----------------------------------------------------------------------------
// CLI
// -----------------------------------------------------------------------------
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  }),
);
const DRY = args["dry-run"] === "true";
const ONLY_LOCALE = args.locale;      // "en" | "ar" | undefined
const LIMIT = args.limit ? parseInt(args.limit, 10) : Infinity;

// -----------------------------------------------------------------------------
// Source config — English only. If Arabic is added back later, uncomment the
// ar.alimranmed.com entry AND restore locale-scoped folders under src/content.
// -----------------------------------------------------------------------------
const SOURCES = [
  { locale: "en", host: "https://alimranmed.com" },
].filter((s) => !ONLY_LOCALE || s.locale === ONLY_LOCALE);

// -----------------------------------------------------------------------------
// Slug → { collection, category, newHref } from navigation.ts
// The nav is a TS file — we can't `import` it directly from Node without a
// loader. Instead we load its runtime JSON dump (see `dump-nav.mjs`).
// -----------------------------------------------------------------------------
async function loadNavIndex() {
  // Node 22+ can import .ts directly with --experimental-strip-types.
  // See package.json scripts (`npm run migrate`).
  const { NAV, flattenNav } = await import(
    path.join(REPO_ROOT, "src/data/navigation.ts")
  );
  const bySlug = new Map();
  const legacySlugOf = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      return decodeURIComponent(u.pathname.replace(/^\/|\/$/g, ""));
    } catch { return null; }
  };
  for (const item of flattenNav(NAV)) {
    const slug = legacySlugOf(item.legacyUrl);
    if (!slug) continue;
    // WP returns unicode chars in slugs decoded; strip trailing BOM-like %ef%bb%bf artefacts
    const bareSlug = slug.replace(/(?:﻿|%ef%bb%bf)$/i, "").split("/").pop();
    bySlug.set(bareSlug, {
      collection: item.collection ?? "pages",
      category: item.category,
      newHref: item.href,
    });
  }
  return bySlug;
}

// -----------------------------------------------------------------------------
// Turndown — HTML → Markdown
// -----------------------------------------------------------------------------
const td = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
  strongDelimiter: "**",
});
// Preserve WP-YouTube-Lyte embeds as YouTube links. The video ID lives in the
// child element's id attribute prefixed WYL_ (e.g. id="WYL_m53F8E6VKFA").
td.addRule("lyte-youtube", {
  filter: (node) => node.classList && node.classList.contains("lyte-wrapper"),
  replacement: (_content, node) => {
    const html = node.outerHTML || "";
    const m = html.match(/WYL_([A-Za-z0-9_-]+)/);
    if (!m) return "";
    const id = m[1];
    return `\n\n[▶ Watch on YouTube](https://www.youtube.com/watch?v=${id})\n\n`;
  },
});
td.addRule("figure-image", {
  filter: "figure",
  replacement: (content) => content + "\n",
});
// Drop inline WP color styles — noisy and non-portable.
td.addRule("strip-color-span", {
  filter: (node) =>
    node.nodeName === "SPAN" && node.getAttribute && node.getAttribute("style"),
  replacement: (content) => content,
});

function htmlToMarkdown(html) {
  const md = td.turndown(html);
  return md.replace(/\n{3,}/g, "\n\n").trim();
}

// -----------------------------------------------------------------------------
// Frontmatter
// -----------------------------------------------------------------------------
function buildFrontmatter({ title, description, category, legacyUrl, publishedAt, order = 999 }) {
  const lines = ["---"];
  lines.push(`title: ${JSON.stringify(title)}`);
  if (description) lines.push(`description: ${JSON.stringify(description)}`);
  if (category) lines.push(`category: "${category}"`);
  lines.push(`order: ${order}`);
  if (legacyUrl) lines.push(`legacyUrl: ${JSON.stringify(legacyUrl)}`);
  if (publishedAt) lines.push(`publishedAt: ${JSON.stringify(publishedAt)}`);
  lines.push("---", "");
  return lines.join("\n");
}

function decodeEntities(s) {
  return String(s || "")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, "");
}

function derivedDescription(md) {
  // First non-empty paragraph, trimmed to ~180 chars.
  const first = md.split(/\n\n+/).map((s) => s.replace(/[#*_>`]+/g, "").trim()).find(Boolean) || "";
  return first.length > 180 ? first.slice(0, 177).trim() + "…" : first;
}

// -----------------------------------------------------------------------------
// WP REST fetch — paginated
// -----------------------------------------------------------------------------
async function fetchAll(host, type) {
  const results = [];
  let page = 1;
  const perPage = 100;
  while (true) {
    const url = `${host}/wp-json/wp/v2/${type}?per_page=${perPage}&page=${page}&_fields=id,slug,link,title,content,parent,date,type,excerpt`;
    const res = await fetch(url);
    if (res.status === 400) break; // page beyond last
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    results.push(...batch);
    const totalPages = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
    if (page >= totalPages) break;
    page++;
  }
  return results;
}

// -----------------------------------------------------------------------------
// Output path resolution
// -----------------------------------------------------------------------------
function outPath({ collection, category, slug }) {
  // services are grouped by category subfolder (chiropractic/spinmed.md, etc.)
  // for readability. Other collections are flat.
  const parts = [CONTENT_ROOT, collection];
  if (collection === "services" && category) parts.push(category);
  parts.push(`${slug}.md`);
  return path.join(...parts);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
async function run() {
  const slugIndex = await loadNavIndex();
  console.log(`Loaded ${slugIndex.size} slug mappings from navigation.ts`);

  let written = 0, skipped = 0, unknownSlugs = 0;

  for (const { locale, host } of SOURCES) {
    console.log(`\n=== ${locale.toUpperCase()} — ${host} ===`);

    for (const type of ["pages", "posts"]) {
      const entries = await fetchAll(host, type);
      console.log(`  ${type}: ${entries.length} total`);

      let processed = 0;
      for (const entry of entries) {
        if (processed >= LIMIT) break;
        processed++;

        const rawSlug = entry.slug || "";
        // Decode percent-encoded slugs (Arabic slugs arrive URL-encoded) and
        // strip WordPress's stray BOM suffix.
        let cleanSlug;
        try {
          cleanSlug = decodeURIComponent(rawSlug);
        } catch {
          cleanSlug = rawSlug;
        }
        cleanSlug = cleanSlug.replace(/(?:﻿|%ef%bb%bf)$/i, "");

        // Filter obvious WP noise. Log what we're dropping so we can eyeball
        // the list and confirm we're not losing real content.
        if (/^(test|hello-world|\d+(?:-\d+)?)$/i.test(cleanSlug) || cleanSlug.length < 2) {
          console.log(`  ~ skip (noise slug): ${cleanSlug}`);
          skipped++;
          continue;
        }

        const nav = slugIndex.get(cleanSlug);
        const mapping = nav ?? {
          collection: type === "posts" ? "posts" : "pages",
          category: undefined,
          newHref: `/${cleanSlug}/`,
        };
        if (!nav) unknownSlugs++;

        const html = entry.content?.rendered || "";
        const title = decodeEntities(entry.title?.rendered || cleanSlug);
        const md = htmlToMarkdown(html);
        if (!md.trim()) {
          console.log(`  ~ skip (empty content): ${cleanSlug}`);
          skipped++;
          continue;
        }

        const description =
          decodeEntities(entry.excerpt?.rendered || "").replace(/<[^>]+>/g, "").trim() ||
          derivedDescription(md);

        const front = buildFrontmatter({
          title,
          description,
          category: mapping.category,
          legacyUrl: entry.link,
          publishedAt: type === "posts" ? entry.date : undefined,
        });

        const dest = outPath({
          collection: mapping.collection,
          category: mapping.category,
          slug: cleanSlug,
        });

        if (DRY) {
          console.log(`  [dry] ${cleanSlug} → ${path.relative(REPO_ROOT, dest)}`);
        } else {
          await mkdir(path.dirname(dest), { recursive: true });
          await writeFile(dest, front + md + "\n");
        }
        written++;
      }
    }
  }

  console.log(`\nDone. Written: ${written}, skipped-empty: ${skipped}, unknown-slugs: ${unknownSlugs}`);
  if (unknownSlugs > 0) {
    console.log(`(unknown-slugs went into the "pages" collection with slug-based path)`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
