#!/usr/bin/env node
/**
 * Replace all https://alimranmed.com/ and https://ar.alimranmed.com/ links
 * in content files with their new-site equivalents.
 *
 * EN files: old link → /en/new-path/
 * AR files: old link → /ar/new-path/
 *
 * Links with no mapping are de-linked (text kept, href removed).
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(REPO_ROOT, "src/content");

const { NAV, flattenNav } = await import(path.join(REPO_ROOT, "src/data/navigation.ts"));

// Build map: legacyUrl pathname (normalised) → bare href (without locale)
const legacyMap = new Map();
for (const item of flattenNav(NAV)) {
  if (!item.legacyUrl) continue;
  try {
    const u = new URL(item.legacyUrl);
    // normalise: lowercase, strip trailing slash for matching
    const key = u.pathname.replace(/\/+$/, "").toLowerCase();
    if (!legacyMap.has(key)) legacyMap.set(key, item.href);
  } catch { /* skip */ }
}

// Also add some manual mappings for paths known to differ
const MANUAL = {
  "/osteoporosis-pain": "/en/blog/osteoporosis/",
  "/2020/12/03/osteoporosis": "/en/blog/osteoporosis/",
  "/spine": "/en/treatments/",
  "/back": "/en/treatments/",
  "/pain": "/en/treatments/pain/",
  "/brain": "/en/treatments/brain/",
  "/surgery": "/en/services/surgery/",
  "/radiofrequency": "/en/services/radiofrequency/",
  "/chiropractic": "/en/services/chiropractic/",
  "/physicaltherapy": "/en/services/physiotherapy/physical-therapy/",
  "/physical-therapy": "/en/services/physiotherapy/physical-therapy/",
  "/physiotherapy-3": "/en/services/physiotherapy/physical-therapy/",
  "/physiotherapy": "/en/services/physiotherapy/",
  "/radiofrequency-neuroblation": "/en/services/radiofrequency/radiofrequency/",
};
for (const [k, v] of Object.entries(MANUAL)) {
  if (!legacyMap.has(k)) legacyMap.set(k, v);
}

function resolveOldUrl(rawUrl, locale) {
  let u;
  try { u = new URL(rawUrl); } catch { return null; }

  const host = u.hostname;
  const isAlimran = host === "alimranmed.com" || host === "ar.alimranmed.com";
  if (!isAlimran) return null;

  const pathname = u.pathname.replace(/\/+$/, "").toLowerCase() || "/";

  // Try direct match
  let bare = legacyMap.get(pathname);

  // Try without leading slash
  if (!bare) bare = legacyMap.get(pathname.replace(/^\//, ""));

  // Try decoding URL-encoded path
  if (!bare) {
    try {
      const decoded = decodeURIComponent(pathname).replace(/\/+$/, "").toLowerCase();
      bare = legacyMap.get(decoded);
    } catch { /* skip */ }
  }

  if (!bare) return null;

  // bare is like /treatments/X/ — prefix with locale
  const stripped = bare.replace(/^\/(?:en|ar)(?=\/|$)/, "");
  return `/${locale}${stripped}`;
}

// Replace markdown links [text](url) where url is alimranmed.com
function fixLinks(content, locale) {
  return content.replace(
    /\[([^\]]*)\]\((https?:\/\/(?:ar\.)?alimranmed\.com[^)]*)\)/g,
    (match, text, url) => {
      const newHref = resolveOldUrl(url, locale);
      if (newHref) return `[${text}](${newHref})`;
      // No mapping: keep text, strip link
      return text;
    }
  );
}

// Also fix bare href="..." in HTML-style links in markdown
function fixHtmlLinks(content, locale) {
  return content.replace(
    /href=["'](https?:\/\/(?:ar\.)?alimranmed\.com[^"']*)["']/g,
    (match, url) => {
      const newHref = resolveOldUrl(url, locale);
      if (newHref) return `href="${newHref}"`;
      return `href="${url}"`;
    }
  );
}

async function* walkMd(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkMd(full);
    else if (entry.name.endsWith(".md")) yield full;
  }
}

let filesChanged = 0;
let linksFixed = 0;

for await (const file of walkMd(CONTENT_DIR)) {
  const content = await readFile(file, "utf8");
  const isAr = file.endsWith("/ar.md") || content.includes('\nlocale: "ar"');
  const locale = isAr ? "ar" : "en";

  let updated = fixLinks(content, locale);
  updated = fixHtmlLinks(updated, locale);

  if (updated !== content) {
    await writeFile(file, updated);
    filesChanged++;
    // Count replacements roughly
    const oldMatches = (content.match(/alimranmed\.com/g) || []).length;
    const newMatches = (updated.match(/alimranmed\.com/g) || []).length;
    linksFixed += oldMatches - newMatches;
    console.log(`  fixed: ${path.relative(REPO_ROOT, file)}`);
  }
}

console.log(`\nDone — ${filesChanged} files updated, ~${linksFixed} links replaced.`);
