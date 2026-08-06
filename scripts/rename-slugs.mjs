#!/usr/bin/env node
/**
 * Rename migrated files from WP slugs to the clean slugs used in navigation.ts.
 * Runs after reslot.mjs. One-shot script — captures a decision, not a pipeline.
 *
 * Each entry: { collection, from: "wp-slug.md", to: "clean-slug.md" }.
 */

import { rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "src/content");

const RENAMES = [
  // Treatments — nav hrefs use short forms
  { collection: "treatments",              from: "amyotrophic-lateral-sclerosis-als.md",   to: "als.md" },
  { collection: "treatments",              from: "back-pain-2.md",                         to: "back-pain.md" },
  { collection: "treatments",              from: "benign-paroxysmal-positional-vertigo-bppv.md", to: "bppv.md" },
  { collection: "treatments",              from: "depression-major-depressive-disorder.md", to: "depression.md" },
  { collection: "treatments",              from: "migrain.md",                             to: "migraine.md" },
  { collection: "treatments",              from: "peripral-nerve-disordershe.md",          to: "peripheral-nerve-disorders.md" },
  { collection: "treatments",              from: "syringomyelia-syrinx.md",                to: "syringomyelia.md" },
  { collection: "treatments",              from: "﻿tension-headaches.md",             to: "tension-headaches.md" },
  { collection: "treatments",              from: "transient-ischemic-attack-tia.md",       to: "tia.md" },
  { collection: "treatments",              from: "the-temporomandibular-joint-tmj.md",     to: "tmj.md" },
  { collection: "treatments",              from: "nervous-bladder.md",                     to: "neurogenic-bladder.md" },

  // Cases — nav uses short forms, migrator emitted "*-cases.md"
  { collection: "cases",                   from: "paediatric-cases.md",                    to: "paediatric.md" },
  { collection: "cases",                   from: "spine-cases.md",                         to: "spine.md" },
  { collection: "cases",                   from: "trauma-cases.md",                        to: "trauma.md" },
  { collection: "cases",                   from: "tumor-cases.md",                         to: "tumor.md" },

  // Services — radiofrequency (nav uses topic-only slugs)
  { collection: "services/radiofrequency", from: "radiofrequency-ablation-review.md",       to: "review.md" },
  { collection: "services/radiofrequency", from: "radiofrequency-for-headache.md",          to: "headache.md" },
  { collection: "services/radiofrequency", from: "radiofrequency-of-knee-joint.md",         to: "knee.md" },
  { collection: "services/radiofrequency", from: "radiofrequency-ablation-for-spine.md",    to: "spine.md" },
  { collection: "services/radiofrequency", from: "epidural-adhesiolysis-with-pulsed-radiofrequency.md", to: "epidural-adhesiolysis.md" },
  { collection: "services/radiofrequency", from: "radiofrequency-for-trigeminal-neuralgia.md", to: "trigeminal-neuralgia.md" },

  // Ozone — same pattern
  { collection: "services/ozone-therapy",  from: "review-of-ozone-therapy.md",             to: "review.md" },
  { collection: "services/ozone-therapy",  from: "ozone-therapy-for-disc-prolapse.md",     to: "disc-prolapse.md" },
  { collection: "services/ozone-therapy",  from: "ozone-therapy-for-osteoarthritis.md",    to: "osteoarthritis.md" },

  // Steroid injections
  { collection: "services/steroid-injection", from: "spinal-injections.md",                to: "spinal.md" },
  { collection: "services/steroid-injection", from: "steroid-injection-for-joint-pain.md", to: "joint-pain.md" },
  { collection: "services/steroid-injection", from: "trigger-point-injections.md",         to: "trigger-point.md" },

  // Brain stimulation
  { collection: "services/brain-stimulation", from: "tms-in-stroke-patients.md",           to: "tms-stroke.md" },
  { collection: "services/brain-stimulation", from: "transcranial-magnetic-stimulation-tms-for-migraine.md", to: "tms-migraine.md" },
  { collection: "services/brain-stimulation", from: "repetitive-transcranial-magnetic-stimulation-rtms-for-treating-various-pain-conditions.md", to: "tms-pain.md" },
  { collection: "services/brain-stimulation", from: "alzheimer-s-disease.md",              to: "tms-alzheimer.md" },
  { collection: "services/brain-stimulation", from: "tinnitus.md",                         to: "tms-tinnitus.md" },
  { collection: "services/brain-stimulation", from: "repetitive-transcranial-magnetic-stimulation-rtms-for-neuropsychiatric-disorders.md", to: "tms-neuropsychiatric.md" },
  { collection: "services/brain-stimulation", from: "tms-result.md",                       to: "tms-results.md" },
  { collection: "services/brain-stimulation", from: "rtms.md",                             to: "tms.md" },

  // Surgery
  { collection: "services/surgery",        from: "endoscopic-transnasal-transsphenoidal-surgery.md", to: "transnasal-transsphenoidal.md" },
  { collection: "services/surgery",        from: "endoscopic-spine-surgery.md",            to: "endoscopic-spine.md" },
  { collection: "services/surgery",        from: "a-selective-dorsal-rhizotomysdr.md",     to: "sdr.md" },
  { collection: "services/surgery",        from: "lumbar-spinal-fusion-surgery.md",        to: "lumbar-spinal-fusion.md" },
  { collection: "services/surgery",        from: "anterior-cervical-discectomy-and-fusion-3.md", to: "acdf.md" },
  { collection: "services/surgery",        from: "deep-brain-stimulation.md",              to: "dbs.md" },
  { collection: "services/surgery",        from: "an-intrathecal-pump.md",                 to: "intrathecal-pump.md" },
  { collection: "services/surgery",        from: "arthroplasty-artificial-disc-replacement.md", to: "arthroplasty.md" },
  { collection: "services/surgery",        from: "burr-holes-and-craniotomy-2.md",         to: "burr-holes-craniotomy.md" },
  { collection: "services/surgery",        from: "spinal-decompression-2.md",              to: "spinal-decompression.md" },

  // Physiotherapy
  { collection: "services/physiotherapy",  from: "magnetic-field-therapy.md",              to: "magnetic-field-therapy.md" },
  { collection: "services/physiotherapy",  from: "shortwave-therapy.md",                   to: "shortwave-therapy.md" },
  { collection: "services/physiotherapy",  from: "laser-therapy-3.md",                     to: "laser-therapy.md" },
  { collection: "services/physiotherapy",  from: "electrical-stimulation-3.md",            to: "electrical-stimulation.md" },
  { collection: "services/physiotherapy",  from: "ultrasound-therapy-2.md",                to: "ultrasound-therapy.md" },
  { collection: "services/physiotherapy",  from: "virtual-reality.md",                     to: "virtual-reality.md" },
  { collection: "services/physiotherapy",  from: "virtual-reality-for-stroke.md",          to: "virtual-reality-stroke.md" },
  { collection: "services/physiotherapy",  from: "kinesiology-2.md",                       to: "kinesiology.md" },

  // Exercises
  { collection: "services/exercises",      from: "neek.md",                                to: "neck.md" },

  // Chiropractic — already correct

  // Fitness
  { collection: "services/fitness",        from: "cryosens-new-skin-slimming-and-tightening-device.md", to: "cryosens.md" },

  // Rehabilitation
  { collection: "services/rehabilitation", from: "bladder-rehabilitation.md",              to: "bladder-rehabilitation.md" },
  { collection: "services/rehabilitation", from: "bed-sore.md",                            to: "bed-sore.md" },
  { collection: "services/rehabilitation", from: "nursing-care.md",                        to: "nursing-care.md" },
  { collection: "services/rehabilitation", from: "spinal-cord-rehabilitation.md",          to: "spinal-cord-rehabilitation.md" },
];

let renamed = 0, missing = 0, collision = 0, noop = 0;

for (const { collection, from, to } of RENAMES) {
  const src = path.join(CONTENT, collection, from);
  const dst = path.join(CONTENT, collection, to);
  if (from === to) { noop++; continue; }
  if (!existsSync(src)) {
    console.warn(`  ! missing: ${collection}/${from}`);
    missing++;
    continue;
  }
  if (existsSync(dst)) {
    console.warn(`  ! collision — dst exists: ${collection}/${to}`);
    collision++;
    continue;
  }
  await rename(src, dst);
  console.log(`  ${collection}/${from} → ${to}`);
  renamed++;
}

console.log(`\nDone. Renamed ${renamed}, missing ${missing}, collision ${collision}, noop ${noop}`);
