#!/usr/bin/env node
/**
 * One-shot migration: turn flat markdown files into folder-per-page structure.
 *
 * Before:  src/content/treatments/headaches.md
 * After:   src/content/treatments/headaches/en.md
 *
 * The folder name is the topic slug (URL). Each language lives inside as its
 * own markdown file. Adding Arabic later = drop ar.md next to en.md.
 *
 * Respects existing nested folders: services/chiropractic/spinmed.md →
 *                                   services/chiropractic/spinmed/en.md
 */

import { readdir, stat, rename, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "src/content");

let moved = 0;

async function walk(dir) {
  const entries = await readdir(dir);
  // Snapshot BEFORE mutating (rename would confuse the loop)
  const files = [];
  const dirs = [];
  for (const name of entries) {
    const p = path.join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) dirs.push(p);
    else if (name.endsWith(".md")) files.push(p);
  }

  // Recurse first
  for (const d of dirs) await walk(d);

  // Then move each flat .md into its own folder as en.md
  for (const f of files) {
    // Skip if the file is already inside a per-page folder (name is en.md/ar.md)
    const base = path.basename(f, ".md");
    if (base === "en" || base === "ar") continue;

    const folder = path.join(path.dirname(f), base);
    await mkdir(folder, { recursive: true });
    const dest = path.join(folder, "en.md");
    await rename(f, dest);
    console.log(`  ${path.relative(ROOT, f)} → ${path.relative(ROOT, dest)}`);
    moved++;
  }
}

await walk(CONTENT);
console.log(`\nMoved ${moved} files into per-page folders.`);
