#!/usr/bin/env node
/**
 * Scan migrated Markdown for links pointing at the old WordPress site
 * (alimranmed.com/…) and rewrite them to the new-site equivalents.
 *
 * The old site is about to be shut down — any remaining absolute link to it
 * will 404 once that happens. This script has to catch them all.
 *
 * Resolution order for each legacy URL:
 *   1. If navigation.ts has a leaf with matching legacyUrl → rewrite to its href
 *   2. If a content file exists at the guessed path → rewrite to that path
 *   3. Otherwise → log as "unresolved" so the user can decide
 *
 * Unresolved links are left in place; the script prints them at the end so
 * you can decide whether to drop, replace, or add missing pages.
 */

import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "src/content");

const DRY = process.argv.includes("--dry-run");

// -----------------------------------------------------------------------------
// Manual overrides for legacy URLs that neither navigation.ts nor the on-disk
// filesystem can resolve. Each entry maps a raw WordPress URL to either a new
// destination or `null` to strip the link entirely (leaving link text alone).
// -----------------------------------------------------------------------------
const OVERRIDES = {
  // Dated post URLs whose destination lives at a different clean slug
  "http://alimranmed.com/2020/05/10/review-of-ozone-therapy/":            "/services/ozone-therapy/review/",
  "https://alimranmed.com/2020/05/10/review-of-ozone-therapy/":           "/services/ozone-therapy/review/",
  "http://alimranmed.com/2020/05/17/ozone-therapy-for-osteoarthritis/":   "/services/ozone-therapy/osteoarthritis/",
  "https://alimranmed.com/2020/05/17/ozone-therapy-for-osteoarthritis/":  "/services/ozone-therapy/osteoarthritis/",
  "https://alimranmed.com/2020/05/15/ozone-therapy-for-disc-prolapse/":   "/services/ozone-therapy/disc-prolapse/",
  "https://alimranmed.com/2019/03/26/paediatric-cases/":                  "/cases/paediatric/",
  "https://alimranmed.com/2019/03/26/spine-cases/":                       "/cases/spine/",
  "https://alimranmed.com/2020/07/01/tms-in-stroke-patients/":            "/services/brain-stimulation/tms-stroke/",
  "https://alimranmed.com/2020/04/07/amyotrophic-lateral-sclerosis-als/": "/treatments/als/",

  // About-page slugs
  "https://alimranmed.com/our-mission/":                                  "/about/#mission",
  "https://alimranmed.com/our-values/":                                   "/about/#values",
  "https://alimranmed.com/our-vision/":                                   "/about/#vision",

  // Numbered/re-run duplicates whose canonical version exists at the base slug
  "http://alimranmed.com/interventional-pain-management-2/":              "/services/pain-management/interventional-pain-management/",
  "http://alimranmed.com/ozone/":                                         "/services/ozone-therapy/",
  "http://alimranmed.com/short-wave-therapy/":                            "/services/physiotherapy/shortwave/",
  "http://alimranmed.com/laser-therapy-2/":                               "/services/physiotherapy/laser-therapy/",
  "http://alimranmed.com/electrical-stimulation-2/":                      "/services/physiotherapy/electrical-stimulation/",
  "http://alimranmed.com/ultrasonic-therapy/":                            "/services/physiotherapy/ultrasound-therapy/",
  "http://alimranmed.com/prevention-of-back-pain/":                       "/treatments/back-pain/",

  // Exercises — leg/thigh redirect to the closest matching section
  "http://alimranmed.com/leg/":                                           "/services/exercises/",
  "http://alimranmed.com/thigh/":                                         "/services/exercises/hip/",

  // Genuinely missing pages that were never migrated because they're empty/dead
  // on the old site. Redirect to the parent category so users don't hit a 404.
  "http://alimranmed.com/cerebrospinal-fluid-leaks/":                     "/treatments/brain/",
  "http://alimranmed.com/herniated-disc-cervical-thoracic-lumbar/":       "/treatments/herniated-disc/",
};

// -----------------------------------------------------------------------------
// Build slug → new-path index from navigation.ts (authoritative)
// -----------------------------------------------------------------------------
const { NAV, flattenNav } = await import(path.join(ROOT, "src/data/navigation.ts"));

const navBySlug = new Map();
for (const item of flattenNav(NAV)) {
  if (!item.legacyUrl) continue;
  try {
    const u = new URL(item.legacyUrl);
    let slug = u.pathname.replace(/^\/|\/$/g, "").replace(/(?:﻿|%ef%bb%bf)$/i, "");
    navBySlug.set(slug, item.href);
    try { navBySlug.set(decodeURIComponent(slug), item.href); } catch {}
  } catch {}
}

// -----------------------------------------------------------------------------
// Build path index from actual files on disk — for slugs we auto-migrated
// that never made it into navigation.ts.
// -----------------------------------------------------------------------------
const fileBySlug = new Map();  // slug → /url/path/

async function walk(dir, collection = null, category = null) {
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) {
      const nextCollection = collection ?? name;
      const nextCategory = collection ? (category ?? name) : null;
      await walk(p, nextCollection, nextCategory);
    } else if (name.endsWith(".md")) {
      const slug = name.replace(/\.md$/, "");
      let url;
      if (collection === "services" && category) {
        url = `/services/${category}/${slug}/`;
      } else if (collection === "pages" && category === "about") {
        url = `/about/#${slug}`;
      } else if (collection) {
        url = `/${collection}/${slug}/`;
      } else continue;
      fileBySlug.set(slug, url);
    }
  }
}
await walk(CONTENT);

// -----------------------------------------------------------------------------
// Rewrite loop
// -----------------------------------------------------------------------------
const RE = /https?:\/\/(?:www\.)?(?:ar\.)?alimranmed\.com\/([^)"' \n<>]*)/g;

async function walkMdFiles(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) out.push(...(await walkMdFiles(p)));
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

const files = await walkMdFiles(CONTENT);
const unresolvedByUrl = new Map();
let rewritten = 0, filesTouched = 0;

function splitFrontmatter(text) {
  if (!text.startsWith("---\n")) return { front: "", body: text };
  const end = text.indexOf("\n---\n", 4);
  if (end < 0) return { front: "", body: text };
  return { front: text.slice(0, end + 5), body: text.slice(end + 5) };
}

for (const file of files) {
  const orig = await readFile(file, "utf8");
  const { front, body } = splitFrontmatter(orig);
  let nextBody = body;
  const seen = new Set();

  for (const m of body.matchAll(RE)) {
    const full = m[0];
    if (seen.has(full)) continue;
    seen.add(full);

    // Skip anything under /wp-content/ (should already be rewritten by media
    // script; if any leaked through, they're broken uploads).
    if (full.includes("/wp-content/")) continue;

    const slugPart = m[1].replace(/\/$/, "").replace(/(?:﻿|%ef%bb%bf)$/i, "");
    let decoded;
    try { decoded = decodeURIComponent(slugPart); } catch { decoded = slugPart; }

    // Manual override → nav → filesystem → bare-slug fallback
    let target =
      OVERRIDES[full] ||
      navBySlug.get(slugPart) ||
      navBySlug.get(decoded) ||
      fileBySlug.get(slugPart.split("/").pop()) ||
      fileBySlug.get(decoded.split("/").pop());

    if (!target) {
      const bucket = unresolvedByUrl.get(full) ?? new Set();
      bucket.add(path.relative(ROOT, file));
      unresolvedByUrl.set(full, bucket);
      continue;
    }

    nextBody = nextBody.split(full).join(target);
    rewritten++;
  }

  if (nextBody !== body) {
    if (!DRY) await writeFile(file, front + nextBody);
    filesTouched++;
  }
}

console.log(`Rewrote ${rewritten} legacy URLs across ${filesTouched} files${DRY ? " [dry-run]" : ""}.`);

if (unresolvedByUrl.size > 0) {
  console.log(`\n${unresolvedByUrl.size} unresolved legacy URLs (left in place):`);
  const sorted = [...unresolvedByUrl.entries()].sort((a, b) => b[1].size - a[1].size);
  for (const [url, files] of sorted) {
    console.log(`  ${url}   (${files.size} file${files.size > 1 ? "s" : ""})`);
  }
}
