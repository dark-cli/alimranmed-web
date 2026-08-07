#!/usr/bin/env node
/**
 * Phase 1 of the Arabic translation plan.
 *
 * Fetches every page from ar.alimranmed.com's WP-REST API and tries to
 * match each one to an EN topic in our content collections. Matched
 * pages get written as ar.md next to the existing en.md with
 * source: "legacy-wp" so we know they came from the old site.
 *
 * Matching strategy (best-effort):
 *   1. Build an "AR title → EN topic" lookup from src/data/header-nav.ts
 *      (which already has curated labelAr values for the top items).
 *   2. Normalise both sides (strip diacritics, collapse whitespace, drop "ال").
 *   3. Exact-normalised match wins. Partial matches emit a "SUGGEST" log
 *      the user can review.
 *
 * Unmatched entries stay in scripts/ar-staging/ so we don't lose the
 * content — Phase 2 will pick them up.
 *
 * Run:  node --experimental-strip-types --no-warnings scripts/fetch-ar-content.mjs
 *       (or:   npm run fetch-ar)
 */

import { readdir, stat, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import TurndownService from "turndown";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "src/content");
const STAGING = path.join(ROOT, "scripts/ar-staging");

// -----------------------------------------------------------------------------
// Turndown — same rules as the EN migrator
// -----------------------------------------------------------------------------
const td = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
  strongDelimiter: "**",
});
td.addRule("lyte-youtube", {
  filter: (node) => node.classList && node.classList.contains("lyte-wrapper"),
  replacement: (_content, node) => {
    const html = node.outerHTML || "";
    const m = html.match(/WYL_([A-Za-z0-9_-]+)/);
    return m ? `\n\n[▶ شاهد على يوتيوب](https://www.youtube.com/watch?v=${m[1]})\n\n` : "";
  },
});
function htmlToMarkdown(html) {
  return td.turndown(html).replace(/\n{3,}/g, "\n\n").trim();
}

// -----------------------------------------------------------------------------
// Normalise Arabic strings for matching. Strips diacritics, hamza variants,
// tatweel, common prefixes like "ال", and whitespace.
// -----------------------------------------------------------------------------
function normalizeAr(s) {
  return String(s || "")
    // Remove HTML entities
    .replace(/&[a-z]+;/g, " ")
    // Strip diacritics (harakat) and tatweel
    .replace(/[ً-ٰٟـ]/g, "")
    // Normalise hamza + alif variants
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    // Strip leading "ال"
    .replace(/(^|\s)ال/g, "$1")
    // Collapse whitespace + punctuation
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// -----------------------------------------------------------------------------
// Build "normalised AR title → EN topic path" map from header-nav.ts
// -----------------------------------------------------------------------------
async function buildLookup() {
  const { HEADER_NAV } = await import(path.join(ROOT, "src/data/header-nav.ts"));
  const lookup = new Map();     // normalizedAr → { topicPath, collection }
  function walk(items) {
    for (const item of items) {
      if (item.labelAr && item.href) {
        const key = normalizeAr(item.labelAr);
        // href like "/treatments/headaches/" → collection=treatments, topic=headaches
        const m = item.href.match(/^\/([^/]+)\/(.+?)\/?$/);
        if (m) {
          const [, collection, topicPath] = m;
          if (["treatments", "services", "cases", "blog"].includes(collection)) {
            lookup.set(key, { collection, topicPath });
          }
        }
      }
      if (item.columns) {
        for (const col of item.columns) {
          if (col.labelAr && col.href) {
            const key = normalizeAr(col.labelAr);
            const m = col.href.match(/^\/([^/]+)\/(.+?)\/?$/);
            if (m) {
              const [, collection, topicPath] = m;
              if (["treatments", "services"].includes(collection)) {
                lookup.set(key, { collection, topicPath });
              }
            }
          }
          for (const sub of col.items || []) {
            if (sub.labelAr && sub.href) {
              const key = normalizeAr(sub.labelAr);
              const m = sub.href.match(/^\/([^/]+)\/(.+?)\/?$/);
              if (m) {
                const [, collection, topicPath] = m;
                if (["treatments", "services", "cases", "blog"].includes(collection)) {
                  lookup.set(key, { collection, topicPath });
                }
              }
            }
          }
        }
      }
    }
  }
  walk(HEADER_NAV);
  return lookup;
}

// -----------------------------------------------------------------------------
// Fetch paginated WP-REST
// -----------------------------------------------------------------------------
async function fetchAll(host, type) {
  const results = [];
  let page = 1;
  while (true) {
    const url = `${host}/wp-json/wp/v2/${type}?per_page=100&page=${page}&_fields=id,slug,link,title,content,date`;
    const res = await fetch(url);
    if (res.status === 400) break;
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
// Frontmatter helper
// -----------------------------------------------------------------------------
function frontmatter({ title, description, category, legacyUrl }) {
  const lines = ["---"];
  lines.push(`title: ${JSON.stringify(title)}`);
  if (description) lines.push(`description: ${JSON.stringify(description)}`);
  if (category) lines.push(`category: "${category}"`);
  lines.push(`source: "legacy-wp"`);
  if (legacyUrl) lines.push(`legacyUrl: ${JSON.stringify(legacyUrl)}`);
  lines.push("---", "");
  return lines.join("\n");
}

function decodeEntities(s) {
  return String(s || "")
    .replace(/&#8217;/g, "'").replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–").replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

function pickCategoryFromEnEntry(collection, topicPath) {
  // For services, the topic path looks like "chiropractic/spinmed" — the first
  // segment is the category. For treatments, category comes from the en.md frontmatter.
  if (collection === "services" && topicPath.includes("/")) {
    return topicPath.split("/")[0];
  }
  return null; // let the EN en.md be authoritative
}

// -----------------------------------------------------------------------------
// Load the manual slug-map JSON — the source of truth for AR-slug → EN-topic.
// This grows over time as we identify more pairs.
// -----------------------------------------------------------------------------
async function loadSlugMap() {
  const raw = await readFile(path.join(ROOT, "src/data/ar-slug-map.json"), "utf8");
  const obj = JSON.parse(raw);
  const map = new Map();
  for (const [arSlug, topicPath] of Object.entries(obj)) {
    if (arSlug.startsWith("_")) continue; // skip _comment
    const [collection, ...rest] = topicPath.split("/");
    map.set(arSlug, { collection, topicPath: rest.join("/") });
  }
  return map;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
const lookup = await buildLookup();
const slugMap = await loadSlugMap();
console.log(`Loaded ${lookup.size} EN⇄AR nav label pairs + ${slugMap.size} manual slug mappings`);

let written = 0, staged = 0, skipped = 0, alreadyHave = 0;
const unmatched = [];

for (const type of ["pages", "posts"]) {
  console.log(`\n=== ar.alimranmed.com — ${type} ===`);
  const entries = await fetchAll("https://ar.alimranmed.com", type);
  console.log(`  ${entries.length} entries total`);

  for (const entry of entries) {
    const rawSlug = entry.slug || "";
    let slug;
    try { slug = decodeURIComponent(rawSlug); } catch { slug = rawSlug; }
    const title = decodeEntities(entry.title?.rendered || "");
    const html = entry.content?.rendered || "";

    // Skip obvious junk
    if (!title || /^(test|hello-world|\d+(?:-\d+)?)$/i.test(slug) || slug.length < 2) {
      skipped++;
      continue;
    }

    const md = htmlToMarkdown(html);
    if (!md.trim()) { skipped++; continue; }

    // Try to match this AR page to an EN topic.
    // 1st: the manual slug-map JSON (authoritative)
    // 2nd: the nav labelAr lookup (fuzzy title match)
    const key = normalizeAr(title);
    const match = slugMap.get(slug) || slugMap.get(rawSlug) || lookup.get(key);

    if (match) {
      // Match found → write ar.md into the EN folder
      const dest = path.join(CONTENT, match.collection, match.topicPath, "ar.md");
      if (existsSync(dest)) {
        alreadyHave++;
        continue;
      }
      const enDir = path.dirname(dest);
      if (!existsSync(enDir)) {
        // No matching EN folder — stage it instead
        unmatched.push({ slug, title, reason: "matched to nonexistent EN folder" });
        continue;
      }
      const fm = frontmatter({
        title,
        category: pickCategoryFromEnEntry(match.collection, match.topicPath),
        legacyUrl: entry.link,
      });
      await writeFile(dest, fm + md + "\n");
      console.log(`  ✓ ${slug.slice(0, 40).padEnd(40)} → ${match.collection}/${match.topicPath}/ar.md`);
      written++;
    } else {
      // No match — save to staging area for later manual mapping
      const stagePath = path.join(STAGING, `${slug.replace(/\//g, "_").slice(0, 100)}.md`);
      await mkdir(STAGING, { recursive: true });
      await writeFile(
        stagePath,
        frontmatter({ title, legacyUrl: entry.link }) + md + "\n",
      );
      staged++;
      unmatched.push({ slug: slug.slice(0, 60), title: title.slice(0, 60) });
    }
  }
}

console.log(`\n─── Summary ───`);
console.log(`Written matched:    ${written}`);
console.log(`Already had ar.md:  ${alreadyHave}`);
console.log(`Staged (unmatched): ${staged} → scripts/ar-staging/`);
console.log(`Skipped noise/empty: ${skipped}`);

if (unmatched.length > 0) {
  console.log(`\n─── Unmatched (${unmatched.length}) — first 25 shown ───`);
  for (const u of unmatched.slice(0, 25)) {
    console.log(`  ${u.title.padEnd(45)} (slug: ${u.slug})${u.reason ? "  [" + u.reason + "]" : ""}`);
  }
  if (unmatched.length > 25) console.log(`  … and ${unmatched.length - 25} more`);
}
