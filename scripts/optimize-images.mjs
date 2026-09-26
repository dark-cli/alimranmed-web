#!/usr/bin/env node
/**
 * Build-time image optimizer.
 *
 * Reads every image under TARGET_DIRS and drops responsive WebP variants
 * into `public/optimized/<same-subpath>/<name>-<width>.webp`, plus a
 * high-quality `-full.webp` at native resolution for the progressive HD
 * upgrade in BaseLayout.
 *
 * `public/optimized/` is git-ignored — this script re-creates it every
 * build. It's also outside Sveltia's `media_folder`, so the CMS media
 * picker only ever sees the source images the user actually uploaded.
 *
 * Incremental: variants are re-generated only when the source file's
 * mtime is newer than the manifest entry. Manifest keeps intrinsic
 * dimensions so the SSR helper (src/lib/image.ts) can output correct
 * width/height without re-opening every file.
 *
 * Wired to `npm run build` via package.json.
 */

import fs from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "..");
const PUB       = path.join(ROOT, "public");
const OUT       = path.join(PUB, "optimized");
const MANIFEST  = path.join(OUT, "manifest.json");

// Only optimize images from folders that are actually consumed with the
// responsive helper. Keeps the optimizer fast and avoids generating
// variants for legacy WordPress inline images that already ship as-is.
const TARGET_DIRS = [
  "images/doctors",
  "images/home",
];

// Responsive widths shipped in every srcset. Order matters — the first is
// used as `src` fallback so keep it in the middle of the range.
const WIDTHS  = [480, 800, 1200];
const QUALITY = 78;
// The `-full` variant is the after-load upgrade: same resolution as the
// source, higher quality, still WebP for size.
const FULL_QUALITY = 92;

const IMG_RE = /\.(?:jpe?g|png)$/i;

async function walk(rel) {
  const abs = path.join(PUB, rel);
  if (!existsSync(abs)) return [];
  const out = [];
  async function recurse(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) await recurse(p);
      else if (entry.isFile() && IMG_RE.test(entry.name)) out.push(p);
    }
  }
  await recurse(abs);
  return out;
}

async function loadManifest() {
  if (!existsSync(MANIFEST)) return {};
  try { return JSON.parse(await fs.readFile(MANIFEST, "utf8")); }
  catch { return {}; }
}

async function optimizeOne(srcAbs, manifest) {
  const rel = path.relative(PUB, srcAbs).replaceAll(path.sep, "/");   // e.g. "images/doctors/x.jpg"
  const key = "/" + rel;                                              // manifest keys look like a URL path
  const srcMtime = statSync(srcAbs).mtimeMs;

  // Skip when the manifest is fresher than the source and every variant
  // is on disk. mtime cache alone isn't enough — someone could have
  // deleted /optimized/ manually.
  const cached = manifest[key];
  if (cached && cached.mtime === srcMtime) {
    const allPresent = cached.variants.every((v) => existsSync(path.join(PUB, v.slice(1))));
    if (allPresent) return { skipped: true };
  }

  // Read source metadata to record intrinsic dimensions.
  const meta = await sharp(srcAbs).metadata();
  const nativeWidth  = meta.width  || 0;
  const nativeHeight = meta.height || 0;

  // Mirror the source subpath under /optimized/, dropping the extension.
  const { dir, name } = path.parse(rel);
  const outDir = path.join(OUT, dir);
  await fs.mkdir(outDir, { recursive: true });
  const baseUrl = "/optimized/" + (dir ? dir + "/" : "") + name;

  const variants = [];
  for (const w of WIDTHS) {
    // Never upscale — a 480w version of a 300px image would just look worse.
    const outAbs = path.join(outDir, `${name}-${w}.webp`);
    const target = Math.min(w, nativeWidth || w);
    await sharp(srcAbs)
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(outAbs);
    variants.push(`${baseUrl}-${w}.webp`);
  }
  // Full-res, higher quality — used for the after-load HD upgrade.
  const fullAbs = path.join(outDir, `${name}-full.webp`);
  await sharp(srcAbs)
    .webp({ quality: FULL_QUALITY, effort: 6 })
    .toFile(fullAbs);
  variants.push(`${baseUrl}-full.webp`);

  manifest[key] = {
    mtime: srcMtime,
    width: nativeWidth,
    height: nativeHeight,
    variants,
  };
  return { skipped: false };
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const manifest = await loadManifest();
  let generated = 0, skipped = 0;

  const stillPresent = new Set();
  for (const rel of TARGET_DIRS) {
    const files = await walk(rel);
    for (const f of files) {
      stillPresent.add("/" + path.relative(PUB, f).replaceAll(path.sep, "/"));
      const res = await optimizeOne(f, manifest);
      if (res.skipped) skipped++;
      else {
        generated++;
        process.stdout.write(".");
      }
    }
  }

  // Prune manifest entries whose source is no longer on disk. Also delete
  // the leftover .webp files so re-adding a source with the same name
  // doesn't accidentally reuse a stale variant.
  let pruned = 0;
  for (const key of Object.keys(manifest)) {
    if (stillPresent.has(key)) continue;
    for (const v of manifest[key].variants) {
      const abs = path.join(PUB, v.slice(1));
      if (existsSync(abs)) await fs.unlink(abs);
    }
    delete manifest[key];
    pruned++;
  }

  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nOptimized ${generated} image(s), skipped ${skipped} up-to-date${pruned ? `, pruned ${pruned} stale.` : "."}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
