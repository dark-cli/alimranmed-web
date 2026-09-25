/**
 * Migrate deprecated block types to the unified widget catalog.
 *
 * Renames:
 *   at_a_glance      → highlights  (type rename only)
 *   pull_quote       → quote       (type rename only)
 *   related          → cards       (type rename only)
 *   cv_stats         → stats       (type + field rename: fig→value, desc→label)
 *   treatment_groups → panels      (type rename + groups→panels)
 *   stats_facts      → stats + facts  (split into two blocks)
 *   comparison_pair  → panels      (a/b become panels[0/1], label→eyebrow)
 *
 * Run:      node scripts/migrate-block-types.mjs
 * Dry run:  node scripts/migrate-block-types.mjs --dry-run
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import yaml from "js-yaml";

const DRY = process.argv.includes("--dry-run");

async function* walkMd(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walkMd(full);
    else if (e.name.endsWith(".md")) yield full;
  }
}

function migrateSection(section) {
  switch (section.type) {
    case "at_a_glance":
      return [{ ...section, type: "highlights" }];

    case "pull_quote":
      return [{ ...section, type: "quote" }];

    case "related":
      return [{ ...section, type: "cards" }];

    case "cv_stats": {
      const { type, items, ...rest } = section;
      return [{
        type: "stats",
        ...rest,
        items: (items || []).map(({ fig, desc, ...item }) => ({
          value: fig ?? item.value,
          label: desc ?? item.label,
          ...Object.fromEntries(Object.entries(item).filter(([k]) => k !== "value" && k !== "label")),
        })),
      }];
    }

    case "treatment_groups": {
      const { type, groups, ...rest } = section;
      return [{ type: "panels", ...rest, panels: groups ?? [] }];
    }

    case "stats_facts": {
      const { type, heading, intro, stats, facts, ...rest } = section;
      const out = [];
      if (stats && stats.length > 0) {
        out.push({ type: "stats", ...(heading ? { heading } : {}), ...(intro ? { intro } : {}), items: stats });
      }
      if (facts && facts.length > 0) {
        out.push({ type: "facts", items: facts });
      }
      return out;
    }

    case "comparison_pair": {
      const { type, a, b, ...rest } = section;
      const panels = [];
      if (a) {
        const { label, ...panelRest } = a;
        panels.push({ ...(label ? { eyebrow: label } : {}), ...panelRest });
      }
      if (b) {
        const { label, ...panelRest } = b;
        panels.push({ ...(label ? { eyebrow: label } : {}), ...panelRest });
      }
      return [{ type: "panels", ...rest, panels }];
    }

    default:
      return [section];
  }
}

const NEEDS_MIGRATION = new Set([
  "at_a_glance", "pull_quote", "related", "cv_stats",
  "treatment_groups", "stats_facts", "comparison_pair",
]);

function needsMigration(sections) {
  return Array.isArray(sections) && sections.some(s => NEEDS_MIGRATION.has(s?.type));
}

let scanned = 0;
let changed = 0;
let errors = 0;

for await (const file of walkMd("src/content")) {
  scanned++;
  const original = await readFile(file, "utf8");

  // Split frontmatter from body
  const match = original.match(/^---\n([\s\S]*?)\n---(\n[\s\S]*)?$/);
  if (!match) continue;

  const [, fmRaw, body = ""] = match;

  let fm;
  try {
    fm = yaml.load(fmRaw);
  } catch (e) {
    console.error(`[error] ${file}: ${e.message}`);
    errors++;
    continue;
  }

  if (!fm || typeof fm !== "object" || !needsMigration(fm.sections)) continue;

  const newSections = [];
  for (const section of fm.sections) {
    newSections.push(...migrateSection(section));
  }
  fm.sections = newSections;

  const newFm = yaml.dump(fm, {
    lineWidth: 120,
    quotingType: '"',
    forceQuotes: false,
    noRefs: true,
  });

  const updated = `---\n${newFm}---${body}`;

  changed++;
  console.log(`${DRY ? "[dry]" : "[updated]"} ${file}`);
  if (!DRY) await writeFile(file, updated, "utf8");
}

console.log(`\nScanned ${scanned} files — ${changed} updated, ${errors} errors${DRY ? " (dry run)" : ""}.`);
