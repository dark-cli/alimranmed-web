#!/usr/bin/env node
/**
 * Download the exact font files we use from Google Fonts and drop them into
 * `public/fonts/`. Running this hits Google's CSS API with a modern user
 * agent so the response contains WOFF2 URLs (the smallest format all our
 * targets support), then walks the returned CSS to pull each src URL down.
 *
 * We limit to the character subsets we actually render (`latin`, `latin-ext`,
 * and `arabic`) so the total download stays lean — a full Newsreader family
 * is ~1MB but our subset is ~120KB.
 *
 * Re-run whenever you change the weight list below.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = path.resolve(__dirname, "../public/fonts");

// One Google Fonts family2 request per family. Weight lists must match what
// src/styles/global.css actually declares — extras just bloat the payload.
const FAMILIES = [
  { name: "Newsreader",           spec: "Newsreader:opsz,wght@6..72,400;6..72,500",  subsets: ["latin", "latin-ext"] },
  { name: "IBM Plex Sans",        spec: "IBM+Plex+Sans:wght@400;500;600",             subsets: ["latin", "latin-ext"] },
  { name: "IBM Plex Mono",        spec: "IBM+Plex+Mono:wght@400;500",                 subsets: ["latin", "latin-ext"] },
  { name: "IBM Plex Sans Arabic", spec: "IBM+Plex+Sans+Arabic:wght@400;500;600",      subsets: ["arabic"] },
  { name: "Amiri",                spec: "Amiri:wght@400;700",                          subsets: ["arabic"] },
];

// Modern Chrome UA — instructs Google Fonts to return WOFF2 URLs.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function slug(family) {
  return family.toLowerCase().replace(/\s+/g, "-");
}

// Google Fonts CSS uses `/* subset */` comments before each block. Split into
// per-subset chunks so we can drop the ones we don't need.
function extractBySubset(css) {
  const parts = [];
  const re = /\/\*\s*([a-z0-9-]+)\s*\*\/\s*(@font-face\s*\{[^}]+\})/gi;
  let m;
  while ((m = re.exec(css))) parts.push({ subset: m[1], block: m[2] });
  return parts;
}

async function fetchCss(spec) {
  const url = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function download(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(destPath, buf);
  return buf.length;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  // Concatenate everything into one CSS file (`fonts.css`) so we get a single
  // <link> in the head rather than one per family.
  const finalBlocks = [];
  let totalBytes = 0;

  for (const fam of FAMILIES) {
    process.stdout.write(`• ${fam.name} … `);
    const css = await fetchCss(fam.spec);
    const parts = extractBySubset(css).filter((p) => fam.subsets.includes(p.subset));
    if (parts.length === 0) {
      console.log(`no matching subsets (${fam.subsets.join(", ")})`);
      continue;
    }

    // Each @font-face block contains a `src: url(...) format('woff2')` line.
    // Rewrite each URL to a stable local `/fonts/<slug>-<subset>-<weight>.woff2`
    // path so preload references in BaseHead don't churn on re-download.
    // Multiple blocks can share the same file (e.g., a variable font that
    // covers 400 and 500 reuses the same URL); we only download once per URL
    // but emit a distinct @font-face for each weight the CSS declares.
    const seenUrls = new Map(); // remoteUrl → local filename
    for (const { subset, block } of parts) {
      const urlMatch    = block.match(/url\(([^)]+)\)/);
      const weightMatch = block.match(/font-weight:\s*([0-9]+)/i);
      if (!urlMatch) continue;
      const remoteUrl = urlMatch[1];
      const weight    = weightMatch ? weightMatch[1] : "400";
      let fname = seenUrls.get(remoteUrl);
      if (!fname) {
        fname = `${slug(fam.name)}-${subset}-${weight}.woff2`;
        const localPath = path.join(OUT_DIR, fname);
        const bytes = await download(remoteUrl, localPath);
        totalBytes += bytes;
        seenUrls.set(remoteUrl, fname);
      }
      const rewritten = block.replace(remoteUrl, `/fonts/${fname}`);
      finalBlocks.push(`/* ${fam.name} — ${subset} ${weight} */\n${rewritten}`);
    }
    console.log(`${parts.length} file(s)`);
  }

  const out = finalBlocks.join("\n\n") + "\n";
  await fs.writeFile(path.join(OUT_DIR, "fonts.css"), out);
  console.log(`\nWrote ${OUT_DIR}/fonts.css`);
  console.log(`Total downloaded: ${(totalBytes / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
