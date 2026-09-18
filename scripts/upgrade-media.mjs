#!/usr/bin/env node
/**
 * Upgrade legacy WordPress thumbnails to full-size originals.
 *
 * WordPress auto-generates size-suffixed thumbnails alongside every upload:
 *   foo.jpg              ← original
 *   foo-300x169.jpg      ← WP thumbnail (usually what got inserted into posts)
 *
 * The initial `npm run media` pulled the thumbnails that were referenced
 * in the post HTML — so the local cache is full of tiny 300px versions
 * that look pixelated when displayed at article width. This script:
 *
 *   1. Walks public/images/legacy/** for files matching *-WxH.(jpg|png|…)
 *   2. Fetches the un-suffixed original from the WP hosts (both en + ar)
 *   3. Saves it locally next to the thumbnail
 *   4. Rewrites markdown references from the thumbnail path → original path
 *
 * The thumbnail files are left on disk (harmless; useful for rollback).
 * Files whose `-N` suffix is a collision counter (e.g. `images-4-1.jpg`)
 * are ignored — that pattern is not a size, it's WP's dedupe suffix.
 *
 * Run:
 *   npm run media:upgrade
 *   npm run media:upgrade -- --dry-run
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

const HOSTS = ["https://alimranmed.com", "https://ar.alimranmed.com"];
const IMG_EXT = /\.(jpe?g|png|webp|gif)$/i;
const SIZE_SUFFIX = /-(\d+)x(\d+)(?=\.[^.]+$)/;

async function walk(dir, out = []) {
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

async function walkMdFiles(dir, out = []) {
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) await walkMdFiles(p, out);
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

// -----------------------------------------------------------------------------
// Find every locally-cached thumbnail and pair it with its original name
// -----------------------------------------------------------------------------
const localFiles = await walk(MEDIA_ROOT);
const thumbs = [];   // { thumbLocal, thumbRel, origLocal, origRel, name }
for (const f of localFiles) {
  if (!IMG_EXT.test(f)) continue;
  const rel = path.relative(MEDIA_ROOT, f);        // e.g. 2020/12/foo-300x169.jpg
  const base = path.basename(rel);
  if (!SIZE_SUFFIX.test(base)) continue;
  const origBase = base.replace(SIZE_SUFFIX, "");  // strip -300x169
  const origRel = path.join(path.dirname(rel), origBase);
  const origLocal = path.join(MEDIA_ROOT, origRel);
  thumbs.push({ thumbLocal: f, thumbRel: rel, origLocal, origRel, name: base });
}

console.log(`Found ${thumbs.length} locally-cached thumbnails with size suffixes.`);

// -----------------------------------------------------------------------------
// Fetch originals from the WP hosts
// -----------------------------------------------------------------------------
const rewrites = new Map();  // "/images/legacy/OLD" -> "/images/legacy/NEW"
let downloaded = 0, cached = 0, missing = 0;

// Retry with backoff; distinguish transient errors (retry) from definitive
// misses (return null immediately). Concurrent hammering of the WP host
// triggers TCP resets — hence the retry loop.
async function fetchFirstOkOnce(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (res.status === 404) return { def: null };
  if (!res.ok) throw new Error("HTTP " + res.status);
  const ct = res.headers.get("content-type") || "";
  if (!ct.startsWith("image/")) return { def: null };
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 200) return { def: null };
  return { buf };
}
async function fetchFirstOk(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetchFirstOkOnce(url);
      return r.buf ?? null;
    } catch (e) {
      lastErr = e;
      // Backoff: 250ms, 750ms, 2s
      await new Promise((r) => setTimeout(r, 250 * Math.pow(3, i)));
    }
  }
  // Bubble transient failures so caller can distinguish from 404
  throw lastErr;
}

const CONCURRENCY = 2;
const queue = [...thumbs];
async function worker() {
  while (queue.length) {
    const t = queue.shift();
    const thumbPublic = "/images/legacy/" + t.thumbRel.split(path.sep).join("/");
    const origPublic  = "/images/legacy/" + t.origRel.split(path.sep).join("/");

    if (existsSync(t.origLocal)) {
      cached++;
      rewrites.set(thumbPublic, origPublic);
      continue;
    }

    if (DRY) {
      console.log(`[dry] ${t.thumbRel}  →  ${t.origRel}`);
      rewrites.set(thumbPublic, origPublic);
      continue;
    }

    // Try each host; the same uploads/ path exists on whichever WP install
    // this image came from originally.
    const relUrl = "/wp-content/uploads/" + t.origRel.split(path.sep).join("/");
    let buf = null;
    let transientFail = false;
    for (const host of HOSTS) {
      try {
        buf = await fetchFirstOk(host + encodeURI(relUrl));
        if (buf) break;
      } catch {
        transientFail = true;
      }
    }
    if (!buf) {
      if (transientFail) {
        missing++;
        console.warn(`  ! transient fail for ${t.thumbRel} (retry later)`);
      } else {
        missing++;
        console.warn(`  ! missing original for ${t.thumbRel}`);
      }
      continue;
    }
    await mkdir(path.dirname(t.origLocal), { recursive: true });
    await writeFile(t.origLocal, buf);
    downloaded++;
    rewrites.set(thumbPublic, origPublic);
    if (downloaded % 20 === 0) {
      console.log(`  … ${downloaded} downloaded, ${cached} already-had, ${missing} missing`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`Originals — downloaded: ${downloaded}, already-had: ${cached}, missing: ${missing}`);

// -----------------------------------------------------------------------------
// Rewrite markdown references thumbnail → original
// -----------------------------------------------------------------------------
if (rewrites.size === 0) {
  console.log("No rewrites to apply.");
  process.exit(0);
}

const mdFiles = await walkMdFiles(CONTENT_ROOT);
let filesTouched = 0, refsRewritten = 0;

for (const file of mdFiles) {
  const orig = await readFile(file, "utf8");
  let next = orig;
  for (const [oldPath, newPath] of rewrites) {
    const esc = oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(esc, "g");
    const matches = next.match(re);
    if (matches) {
      refsRewritten += matches.length;
      next = next.replace(re, newPath);
    }
  }
  if (next !== orig) {
    if (!DRY) await writeFile(file, next);
    filesTouched++;
  }
}
console.log(
  `${DRY ? "[dry] would rewrite" : "Rewrote"} ${refsRewritten} references across ${filesTouched} markdown files.`
);
