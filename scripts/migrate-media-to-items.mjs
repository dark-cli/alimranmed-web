/**
 * Migrate top-level media/video/youtube section blocks to the new format:
 *   type:media (no items)  → type:media, items:[{kind:"image", ...fields}]
 *   type:video             → type:media, items:[{kind:"video", ...fields}]
 *   type:youtube           → type:media, items:[{kind:"youtube", ...fields}]
 *
 * Blocks already in the new format (have `items`) are left untouched.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative }                                     from "path";
import yaml                                                   from "js-yaml";

const ROOT = new URL("..", import.meta.url).pathname;

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? yaml.load(m[1]) : {};
}

function stringifyFrontmatter(data, body) {
  const fm = yaml.dump(data, { lineWidth: 120, noRefs: true, quotingType: '"' });
  return `---\n${fm}---${body}`;
}

function walkMd(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkMd(full, results);
    else if (entry.endsWith(".md")) results.push(full);
  }
  return results;
}

/** Copy only defined, non-null keys */
function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) out[k] = obj[k];
  }
  return out;
}

const contentDir = join(ROOT, "src/content");
const files      = walkMd(contentDir);
let changed      = 0;

for (const abs of files) {
  const rel = relative(ROOT, abs);
  const raw = readFileSync(abs, "utf8");

  const hasOldMedia = raw.includes("type: media") || raw.includes("type: video") || raw.includes("type: youtube");
  if (!hasOldMedia) continue;

  const bodyMatch = raw.match(/^---\r?\n[\s\S]*?\r?\n---([\s\S]*)$/);
  const body      = bodyMatch ? bodyMatch[1] : "";
  const data      = parseFrontmatter(raw);

  if (!data.sections || !Array.isArray(data.sections)) continue;

  let dirty = false;

  data.sections = data.sections.map((s) => {
    if (!s) return s;

    // Already in new format — leave alone
    if (s.type === "media" && Array.isArray(s.items)) return s;

    if (s.type === "media") {
      // Old flat image block — needs src to be meaningful
      if (!s.src) return s;
      dirty = true;
      const fields = pick(s, ["src", "alt", "caption", "aspect"]);
      return { type: "media", items: [{ kind: "image", ...fields }] };
    }

    if (s.type === "video") {
      dirty = true;
      const fields = pick(s, ["src", "caption", "aspect"]);
      return { type: "media", items: [{ kind: "video", ...fields }] };
    }

    if (s.type === "youtube") {
      dirty = true;
      const fields = pick(s, ["src", "caption", "aspect", "uploadDate"]);
      return { type: "media", items: [{ kind: "youtube", ...fields }] };
    }

    return s;
  });

  if (!dirty) continue;

  writeFileSync(abs, stringifyFrontmatter(data, body), "utf8");
  console.log(`✓  ${rel}`);
  changed++;
}

console.log(`\nDone — ${changed} file(s) updated.`);
