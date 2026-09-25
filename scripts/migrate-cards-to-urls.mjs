/**
 * Migrate cards blocks from { slugs: string[] } to { items: string[] }.
 * Each item is a locale-agnostic path: /treatments/{slug}/
 * Cards.astro resolves title/description/date from the collection at build time.
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

const contentDir = join(ROOT, "src/content");
const files      = walkMd(contentDir);
let changed      = 0;

for (const abs of files) {
  const rel = relative(ROOT, abs);
  const raw = readFileSync(abs, "utf8");

  if (!raw.includes("type: cards")) continue;

  const bodyMatch = raw.match(/^---\r?\n[\s\S]*?\r?\n---([\s\S]*)$/);
  const body      = bodyMatch ? bodyMatch[1] : "";
  const data      = parseFrontmatter(raw);

  if (!data.sections || !Array.isArray(data.sections)) continue;

  let dirty = false;

  data.sections = data.sections.map((s) => {
    if (!s || s.type !== "cards" || !s.slugs) return s;

    const { slugs: _dropped, ...rest } = s;
    dirty = true;
    return { ...rest, items: s.slugs.map((slug) => `/treatments/${slug}/`) };
  });

  if (!dirty) continue;

  writeFileSync(abs, stringifyFrontmatter(data, body), "utf8");
  console.log(`✓  ${rel}`);
  changed++;
}

console.log(`\nDone — ${changed} file(s) updated.`);
