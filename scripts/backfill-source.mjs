#!/usr/bin/env node
/**
 * One-shot: annotate every content .md with a `source:` frontmatter field.
 * - EN files:            source: "legacy-wp" (they came from WP scrape)
 * - AR files hand-written by us on this branch: source: "original"
 *
 * Files that already have a `source:` line are left alone (idempotent).
 */

import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.resolve(__dirname, "../src/content");

// Any ar.md that we wrote by hand on this branch (not auto-migrated) is "original".
// The rest of ar.md files don't exist yet — this list will grow as we translate.
const ORIGINAL_AR_FILES = new Set([
  "pages/about/mission/ar.md",
  "pages/about/vision/ar.md",
  "pages/about/values/ar.md",
  "treatments/headaches/ar.md",
]);

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) out.push(...(await walk(p)));
    else if (name === "en.md" || name === "ar.md") out.push(p);
  }
  return out;
}

let updated = 0;
let skipped = 0;

for (const file of await walk(CONTENT)) {
  const rel = path.relative(CONTENT, file);
  const text = await readFile(file, "utf8");

  if (/^source:/m.test(text)) {
    skipped++;
    continue;
  }

  const isAr = file.endsWith("/ar.md");
  const isOriginal = isAr && ORIGINAL_AR_FILES.has(rel);
  const source = isOriginal ? "original" : "legacy-wp";

  // Insert `source: "..."` before the closing --- of the frontmatter
  const fmEnd = text.indexOf("\n---\n", 4);
  if (fmEnd < 0) {
    console.warn(`  ! no frontmatter: ${rel}`);
    skipped++;
    continue;
  }
  const patched =
    text.slice(0, fmEnd) +
    `\nsource: "${source}"` +
    text.slice(fmEnd);
  await writeFile(file, patched);
  updated++;
}

console.log(`Updated: ${updated}, already tagged: ${skipped}`);
