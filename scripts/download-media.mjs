#!/usr/bin/env node
/**
 * Scan migrated content for wp-content/uploads/* image references, download
 * each into public/images/legacy/YYYY/MM/, and rewrite the markdown to point
 * at the local copy.
 *
 * Two reasons this matters:
 *  1. Portal-mode / captive-portal use requires alimranmed.com to be fully
 *     self-contained pre-auth — assets on the WP CDN would be blocked.
 *  2. The old WordPress install could disappear at any time; the new site
 *     shouldn't depend on it staying up.
 *
 * Run:
 *   npm run media
 *   npm run media -- --dry-run
 */

import { mkdir, writeFile, readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CONTENT_ROOT = path.join(REPO_ROOT, "src", "content");
const MEDIA_ROOT = path.join(REPO_ROOT, "public", "images", "legacy");

const DRY = process.argv.includes("--dry-run");

// Match wp-content/uploads/... URLs on the alimranmed hosts. Non-greedy stop
// on whitespace, closing paren/bracket, quotes.
const RE = /https?:\/\/(?:alimranmed\.com|ar\.alimranmed\.com)\/wp-content\/uploads\/([^)"' \n>]+)/g;

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

// -----------------------------------------------------------------------------
// Discover all unique media URLs
// -----------------------------------------------------------------------------
const files = await walkMdFiles(CONTENT_ROOT);
console.log(`Scanning ${files.length} markdown files…`);

const urls = new Map();  // url -> Set of files that reference it
for (const file of files) {
  const src = await readFile(file, "utf8");
  for (const m of src.matchAll(RE)) {
    const url = m[0];
    if (!urls.has(url)) urls.set(url, new Set());
    urls.get(url).add(file);
  }
}
console.log(`Found ${urls.size} unique media URLs across ${new Set([...urls.values()].flatMap((s) => [...s])).size} files.`);

// -----------------------------------------------------------------------------
// Download each URL to public/images/legacy/YYYY/MM/basename
// -----------------------------------------------------------------------------
const rewrites = new Map();   // originalUrl -> local /images/legacy/... path

let downloaded = 0, cached = 0, failed = 0;

const CONCURRENCY = 6;
const queue = [...urls.keys()];
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    const uploadsPath = url.split("/wp-content/uploads/")[1];
    // Basename may contain unicode (Arabic) — preserve as-is.
    const local = path.join(MEDIA_ROOT, uploadsPath);
    const publicPath = "/images/legacy/" + uploadsPath;
    rewrites.set(url, publicPath);

    if (existsSync(local)) {
      cached++;
      continue;
    }
    if (DRY) {
      console.log(`[dry] ${url} → ${publicPath}`);
      continue;
    }
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await mkdir(path.dirname(local), { recursive: true });
      await writeFile(local, buf);
      downloaded++;
      if (downloaded % 25 === 0) {
        console.log(`  … ${downloaded} downloaded, ${cached} cached, ${failed} failed`);
      }
    } catch (e) {
      failed++;
      console.warn(`  ! ${url} — ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`Downloaded: ${downloaded}, cached (already had): ${cached}, failed: ${failed}`);

// -----------------------------------------------------------------------------
// Rewrite markdown files to reference local URLs
// -----------------------------------------------------------------------------
if (!DRY) {
  let filesTouched = 0;
  for (const file of files) {
    const orig = await readFile(file, "utf8");
    let next = orig;
    for (const [url, local] of rewrites) {
      // Escape regex specials in url
      const esc = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      next = next.replace(new RegExp(esc, "g"), local);
    }
    if (next !== orig) {
      await writeFile(file, next);
      filesTouched++;
    }
  }
  console.log(`Rewrote ${filesTouched} markdown files to use local /images/legacy/ paths.`);
}
