#!/usr/bin/env node
/**
 * One-shot reslotter: moves specific orphan slugs from src/content/pages/ into
 * their proper collection/category, rewriting `category:` frontmatter as it
 * goes. This isn't intended to be re-run — it captures human classification
 * decisions for the 33 orphans that survived the auto-migration.
 */

import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PAGES = path.join(ROOT, "src/content/pages");
const CONTENT = path.join(ROOT, "src/content");

// slug → { collection, category?, newSlug? }
// Classifications made by reading each page's title + content.
const MOVES = {
  // Treatments — new conditions not previously in the nav
  "ankylosing-spondylitis":                                    { collection: "treatments", category: "spine" },
  "anterior-cutaneous-nerve-entrapment-syndrome-acnes":        { collection: "treatments", category: "pain" },
  "chronic-pelvic-pain-in-women":                              { collection: "treatments", category: "pain" },
  "facet-joint-pain-syndrome":                                 { collection: "treatments", category: "pain" },
  "hemorrhagic-stroke":                                        { collection: "treatments", category: "brain" },
  "peripheral-vascular-disease":                               { collection: "treatments", category: "pain" },
  "sciatica":                                                  { collection: "treatments", category: "spine" },
  "tension-headache":                                          { collection: "treatments", category: "pain" },
  "whiplash":                                                  { collection: "treatments", category: "spine" },
  "neurogenic-bladder":                                        { collection: "treatments" },

  // Services — Surgery
  "anterior-cervical-discectomy-and-fusion":                   { collection: "services", category: "surgery" },
  "artificial-disc":                                           { collection: "services", category: "surgery" },
  "lumbar-microdiscectomy":                                    { collection: "services", category: "surgery" },
  "spinal-decompression":                                      { collection: "services", category: "surgery" },

  // Services — Steroid injections / interventional pain
  "adhesiolysis":                                              { collection: "services", category: "steroid-injection" },
  "epidural-steroid-injection":                                { collection: "services", category: "steroid-injection" },
  "gasserian-ganglion-block":                                  { collection: "services", category: "steroid-injection" },
  "sympathetic-nerve-block":                                   { collection: "services", category: "steroid-injection" },
  "interventional-pain-management":                            { collection: "services", category: "pain-management" },

  // Services — Physiotherapy
  "electrical-stimulation":                                    { collection: "services", category: "physiotherapy" },
  "kinesiology":                                               { collection: "services", category: "physiotherapy" },
  "laser-therapy":                                             { collection: "services", category: "physiotherapy" },
  "physical-therapy":                                          { collection: "services", category: "physiotherapy" },
  "shortwave":                                                 { collection: "services", category: "physiotherapy" },
  "ultrasound-therapy":                                        { collection: "services", category: "physiotherapy" },

  // Services — Radiofrequency
  "radiofrequency":                                            { collection: "services", category: "radiofrequency" },
  "radiofrequency-neuroblation":                               { collection: "services", category: "radiofrequency" },

  // Services — Regenerative / BOTOX / other
  "prolotherapy":                                              { collection: "services", category: "regenerative-medicine" },
  "botox-injection":                                           { collection: "services", category: "botox" },
  "natural-therapy":                                           { collection: "services" },

  // Static "About" pages — stay in pages/ under a sub-folder so URLs
  // become /about/mission etc. via a route we'll add separately.
  "our-mission":                                               { collection: "pages", category: "about", newSlug: "about/mission" },
  "our-vision":                                                { collection: "pages", category: "about", newSlug: "about/vision" },
  "our-values":                                                { collection: "pages", category: "about", newSlug: "about/values" },
};

async function updateCategory(text, category) {
  // Insert or replace `category:` line inside the frontmatter.
  const fmEnd = text.indexOf("\n---", 4);
  if (fmEnd < 0) return text;
  const fm = text.slice(0, fmEnd);
  const rest = text.slice(fmEnd);
  const lines = fm.split("\n");
  const catIdx = lines.findIndex((l) => l.startsWith("category:"));
  const catLine = `category: "${category}"`;
  if (catIdx >= 0) lines[catIdx] = catLine;
  else lines.splice(lines.length, 0, catLine);
  return lines.join("\n") + rest;
}

let moved = 0, missing = 0;

for (const [slug, { collection, category, newSlug }] of Object.entries(MOVES)) {
  const src = path.join(PAGES, `${slug}.md`);
  if (!existsSync(src)) {
    console.warn(`  ! not found: ${slug}`);
    missing++;
    continue;
  }

  const targetSlug = newSlug ?? slug;
  const destBase = path.join(CONTENT, collection);
  const dest = collection === "services" && category
    ? path.join(destBase, category, `${slug}.md`)
    : path.join(destBase, `${targetSlug}.md`);

  await mkdir(path.dirname(dest), { recursive: true });

  let text = await readFile(src, "utf8");
  if (category) text = await updateCategory(text, category);
  await writeFile(dest, text);
  const { unlink } = await import("node:fs/promises");
  await unlink(src);

  console.log(`  ${slug} → ${path.relative(ROOT, dest)}`);
  moved++;
}

console.log(`\nDone. Moved: ${moved}, missing: ${missing}`);
console.log(`Remaining in src/content/pages/: (should only be about/ subfolder now)`);
