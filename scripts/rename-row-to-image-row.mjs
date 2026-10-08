#!/usr/bin/env node
/**
 * One-off migration: rename `type: row` -> `type: image-row` in frontmatter.
 *
 * Context: the original `row` block was image-only. When the generic `row`
 * primitive (any child blocks) was introduced, the image-only version was
 * renamed to `image-row` so writers have a dedicated gallery widget and the
 * generic row stays composable.
 *
 * The script walks every .md file under src/content/, finds `type: row`
 * lines inside the YAML frontmatter, and rewrites them to `type: image-row`.
 * Everything outside the frontmatter is untouched, and formatting (comments,
 * folded scalars, indentation) is preserved — we do a targeted textual
 * replacement, not a full YAML parse/round-trip.
 *
 * Idempotent: files that already use `image-row` are skipped.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const CONTENT_DIR = resolve(__dirname, "..", "src", "content");

async function walkMd(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...await walkMd(path));
    } else if (entry.name.endsWith(".md")) {
      out.push(path);
    }
  }
  return out;
}

/**
 * Replace `type: row` -> `type: image-row` ONLY within the frontmatter block.
 * Matches `type:` at any indentation, optionally preceded by a `-` list bullet.
 * Does not touch body prose below the closing `---` fence.
 */
function migrate(content) {
  const fmMatch = content.match(/^(---\n)([\s\S]*?)(\n---(?:\n|$))/);
  if (!fmMatch) return { content, changed: false };

  const [, open, body, close] = fmMatch;
  // Line-anchored, allows optional leading `-` bullet, requires `type: row`
  // as a bare value (no following word character).
  const re = /^(\s*(?:-\s+)?)type:\s*row(\s*(?:#.*)?)$/gm;
  const newBody = body.replace(re, (_m, prefix, suffix) => `${prefix}type: image-row${suffix}`);
  if (newBody === body) return { content, changed: false };

  const rest = content.slice(fmMatch[0].length);
  return { content: open + newBody + close + rest, changed: true };
}

async function main() {
  const files = await walkMd(CONTENT_DIR);
  let changed = 0;
  for (const file of files) {
    const original = await readFile(file, "utf8");
    const result = migrate(original);
    if (result.changed) {
      await writeFile(file, result.content);
      changed++;
      console.log(`  rewrote  ${file.slice(CONTENT_DIR.length + 1)}`);
    }
  }
  console.log(`\nDone. ${changed} file(s) updated out of ${files.length} .md file(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
