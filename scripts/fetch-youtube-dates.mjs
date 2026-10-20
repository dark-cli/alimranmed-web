/**
 * Fetches the real upload date of every YouTube video referenced in
 * src/content and records it in src/data/youtube-dates.json, keyed by
 * video ID. The Media components read that file to fill VideoObject
 * uploadDate — Google requires the field and it must be accurate.
 *
 * Usage:
 *   npm run youtube:dates
 *
 * Re-run after adding new videos. Existing entries are kept; only IDs
 * missing from the JSON are fetched.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const contentDir = join(root, "src", "content");
const outFile = join(root, "src", "data", "youtube-dates.json");

const ID_RE =
  /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/g;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const ids = new Set();
for (const file of walk(contentDir)) {
  if (!/\.(md|mdx|ya?ml|json)$/.test(file)) continue;
  for (const m of readFileSync(file, "utf8").matchAll(ID_RE)) ids.add(m[1]);
}

let dates = {};
try {
  dates = JSON.parse(readFileSync(outFile, "utf8"));
} catch {}

const missing = [...ids].filter((id) => !dates[id]).sort();
console.log(`${ids.size} videos in content, ${missing.length} without a date`);

const failed = [];
for (const id of missing) {
  const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: { "Accept-Language": "en-US,en;q=0.9", "User-Agent": "Mozilla/5.0" },
  });
  const html = await res.text();
  const m =
    html.match(/<meta itemprop="uploadDate" content="([^"]+)"/) ||
    html.match(/"uploadDate":"([^"]+)"/) ||
    html.match(/<meta itemprop="datePublished" content="([^"]+)"/) ||
    html.match(/"publishDate":"([^"]+)"/);
  if (m) {
    dates[id] = m[1];
    console.log(`  ${id}  ${m[1]}`);
  } else {
    failed.push(id);
    console.warn(`  ${id}  NOT FOUND (HTTP ${res.status})`);
  }
}

const sorted = Object.fromEntries(Object.entries(dates).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(outFile, JSON.stringify(sorted, null, 2) + "\n");
console.log(`Wrote ${Object.keys(sorted).length} dates to src/data/youtube-dates.json`);
if (failed.length) {
  console.warn(`Failed: ${failed.join(", ")} — their schema will omit uploadDate`);
  process.exitCode = 1;
}
