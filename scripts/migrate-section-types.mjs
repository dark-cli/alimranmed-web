/**
 * One-time migration: rename hyphenated section type values to underscored
 * versions so they match TinaCMS template identifiers.
 *
 * Before: `  - type: at-a-glance`
 * After:  `  - type: at_a_glance`
 *
 * Only the four types that contain hyphens are touched:
 *   at-a-glance      → at_a_glance
 *   pull-quote       → pull_quote
 *   comparison-pair  → comparison_pair
 *   stats-facts      → stats_facts
 *   treatment-groups → treatment_groups
 *
 * Run: node scripts/migrate-section-types.mjs
 * Dry:  node scripts/migrate-section-types.mjs --dry-run
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const DRY = process.argv.includes("--dry-run");

const RENAMES = {
  "at-a-glance":      "at_a_glance",
  "pull-quote":       "pull_quote",
  "comparison-pair":  "comparison_pair",
  "stats-facts":      "stats_facts",
  "treatment-groups": "treatment_groups",
};

// Build a single regex that matches any of the old names inside a `type:` line
const pattern = new RegExp(
  `^(  - type: )(${Object.keys(RENAMES).join("|")})$`,
  "gm"
);

async function* walkMd(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walkMd(full);
    else if (e.name.endsWith(".md")) yield full;
  }
}

let changed = 0;
let scanned = 0;

for await (const file of walkMd("src/content")) {
  scanned++;
  const original = await readFile(file, "utf8");
  const updated = original.replace(pattern, (_, prefix, type) => `${prefix}${RENAMES[type]}`);
  if (updated !== original) {
    changed++;
    console.log(`${DRY ? "[dry]" : "[updated]"} ${file}`);
    if (!DRY) await writeFile(file, updated, "utf8");
  }
}

console.log(`\nScanned ${scanned} files — ${changed} updated${DRY ? " (dry run)" : ""}.`);
