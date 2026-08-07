#!/usr/bin/env node
/**
 * Copy structural (non-textual) frontmatter fields from en.md to ar.md
 * so the AR page renders with the same category, ordering, image,
 * memberships, etc. as its EN sibling.
 *
 * TEXTUAL fields (title, description) stay AR-authored — those are
 * translated content, not structure.
 * STRUCTURAL fields (category, order, image, memberships, titles,
 * photo, tags, publishedAt, author) get copied over.
 *
 * Safe to run repeatedly — only adds missing fields, never overwrites
 * fields already present in ar.md.
 */

import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.resolve(__dirname, "../src/content");

// Fields to copy from en.md → ar.md when missing on the AR side.
// Explicitly NOT copying: title, description (translations), body content,
// source (each has its own provenance), legacyUrl (different URL for AR).
const STRUCTURAL_FIELDS = [
  "category",
  "order",
  "image",
  "imageAlt",
  "updated",
  // doctor-specific
  "fullName",
  "specialty",
  "titles",
  "photo",
  "memberships",
  "languages",
  // post-specific
  "author",
  "publishedAt",
  "tags",
  // treatment-specific
  "bodyRegion",
  // case-specific
  "condition",
  "outcome",
  // testimony-specific
  "patientInitials",
];

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) out.push(...(await walk(p)));
    else if (name === "en.md") out.push(p);
  }
  return out;
}

function splitFrontmatter(text) {
  const m = text.match(/^---\n(.*?)\n---\n?/s);
  if (!m) return { fm: "", body: text };
  return { fm: m[1], body: text.slice(m[0].length) };
}

/**
 * Parse frontmatter into a list of top-level field blocks.
 * Preserves the ORDER and VALUE (including multi-line list values) exactly
 * as authored — so we can serialize back losslessly.
 * Returns: [ { key, raw } ] where `raw` includes the field + its full value.
 */
function parseFmBlocks(fm) {
  const lines = fm.split("\n");
  const blocks = [];
  let current = null;
  for (const line of lines) {
    // Top-level field: not indented, has "key:" pattern
    const topLevel = /^([A-Za-z_][A-Za-z0-9_-]*)\s*:/.exec(line);
    if (topLevel && !line.startsWith(" ") && !line.startsWith("\t")) {
      if (current) blocks.push(current);
      current = { key: topLevel[1], raw: line };
    } else if (current) {
      current.raw += "\n" + line;
    }
  }
  if (current) blocks.push(current);
  return blocks;
}

function getBlock(blocks, key) {
  return blocks.find((b) => b.key === key);
}

let touched = 0;
let unchanged = 0;

for (const enPath of await walk(CONTENT)) {
  const arPath = enPath.replace(/\/en\.md$/, "/ar.md");
  if (!existsSync(arPath)) continue;

  const enText = await readFile(enPath, "utf8");
  const arText = await readFile(arPath, "utf8");
  const enFm = splitFrontmatter(enText);
  const arFm = splitFrontmatter(arText);

  const enBlocks = parseFmBlocks(enFm.fm);
  const arBlocks = parseFmBlocks(arFm.fm);
  const arKeys = new Set(arBlocks.map((b) => b.key));

  const toAdd = [];
  for (const field of STRUCTURAL_FIELDS) {
    if (arKeys.has(field)) continue;
    const enBlock = getBlock(enBlocks, field);
    if (!enBlock) continue;
    toAdd.push(enBlock);
  }

  if (toAdd.length === 0) {
    unchanged++;
    continue;
  }

  // Insert new blocks right after the last existing structural field (or at end)
  const newFm = [...arBlocks, ...toAdd].map((b) => b.raw).join("\n");
  const newText = `---\n${newFm}\n---\n${arFm.body}`;
  await writeFile(arPath, newText);
  console.log(
    `  + ${path.relative(CONTENT, arPath).padEnd(60)} added: ${toAdd.map((b) => b.key).join(", ")}`,
  );
  touched++;
}

console.log(`\nTouched: ${touched}, unchanged: ${unchanged}`);
