/**
 * Migrate type:media blocks from the old kind-based schema to dedicated types.
 *   type:media + kind:image  → type:media  (just drop the kind field)
 *   type:media + kind:video  → type:video  (drop kind; if src looks like YouTube → type:youtube)
 *   type:media + kind:youtube → type:youtube (drop kind)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative }                                      from "path";
import yaml                                                    from "js-yaml";

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

function isYouTubeUrl(src) {
  return /youtube\.com|youtu\.be/i.test(src || "");
}

const contentDir = join(ROOT, "src/content");
const files      = walkMd(contentDir);
let changed      = 0;

for (const abs of files) {
  const rel = relative(ROOT, abs);
  const raw = readFileSync(abs, "utf8");

  if (!raw.includes("type: media")) continue;

  const bodyMatch = raw.match(/^---\r?\n[\s\S]*?\r?\n---([\s\S]*)$/);
  const body      = bodyMatch ? bodyMatch[1] : "";
  const data      = parseFrontmatter(raw);

  if (!data.sections || !Array.isArray(data.sections)) continue;

  let dirty = false;

  data.sections = data.sections.map((s) => {
    if (!s || s.type !== "media" || !s.kind) return s;

    const { kind, ...rest } = s;

    if (kind === "image") {
      dirty = true;
      return rest;  // type stays "media", kind dropped
    }

    if (kind === "video") {
      dirty = true;
      // YouTube URL stored with kind:video → fix to youtube type
      const newType = isYouTubeUrl(rest.src) ? "youtube" : "video";
      return { ...rest, type: newType };
    }

    if (kind === "youtube") {
      dirty = true;
      return { ...rest, type: "youtube" };
    }

    return s;
  });

  if (!dirty) continue;

  writeFileSync(abs, stringifyFrontmatter(data, body), "utf8");
  console.log(`✓  ${rel}`);
  changed++;
}

console.log(`\nDone — ${changed} file(s) updated.`);
