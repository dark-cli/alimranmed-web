# Alimran.clinic — Draft Reconciliation Report

**Date:** 2026-10-09  
**Source:** USB drive containing original clinic drafts (`drafts/` folder, 277 `.docx` files)  
**Status:** First pass complete. Build passing. All changes committed locally.

---

## Executive Summary

| Stat | Number |
|---|---|
| Total drafts reviewed | **277** |
| Articles already on site (no action) | **~160** |
| New articles created from draft | **30** |
| Case pages rebuilt with proper layout | **4** |
| Articles fact-checked against draft | **18** |
| Duplicate pages removed | **1** |
| Internal links fixed after removal | **172** |
| Articles held back (need your decision) | **7** |
| Factual questions for your review | **6** |

**Bottom line:** Every original draft you handed us has been inventoried, matched to the site, and either created, checked, or queued for your decision. The site now contains 30 new articles that were previously missing. Four case pages were rebuilt so image captions line up properly. One duplicate ozone page was removed and all links redirected.

---

## Where These Drafts Came From

You provided a USB drive containing your original clinic drafts — the source of truth. These are Word documents written by you or your team, not content crawled from the old WordPress site. We extracted every file to plain text, read it, and compared it against what is currently live on `alimran.clinic`.

The drafts are organized in folders on the USB:
- `publish/` — clinic brochures, condition pages, procedures, case reports
- `ABC articles/` — encyclopedia-style condition articles (bilingual)
- `Rehablitation medicine update/` — rehabilitation essays (bilingual)
- `events/` — conference reports and case announcements

---

## What We Did (Task Log)

| # | Task | Status | Est. hours |
|---|---|---|---|
| 1 | Inventory all 277 drafts: extract text, record topic, language, shape | Done | ___ |
| 2 | Match every draft to an existing site article (exact / fuzzy / missing) | Done | ___ |
| 3 | Create 30 missing articles from drafts (bilingual where possible) | Done | ___ |
| 4 | Rebuild 4 case pages as block-based articles with image↔caption pairing | Done | ___ |
| 5 | Fact-check 18 matched articles against drafts | Done | ___ |
| 6 | Consolidate ozone-therapy pages: remove duplicate, migrate 172 links, fact-check claims | Done | ___ |
| 7 | Translate 3 single-language articles to close language gaps | Done | ___ |
| 8 | Write this report | Done | ___ |
| 9 | **Pending:** Fact-check ~160 remaining matched articles | **Blocked** | ___ |
| 10 | **Pending:** Extract embedded images from case-report drafts | **Blocked** | ___ |
| 11 | **Pending:** Create or rewrite 7 held-back drafts after your decision | **Blocked** | ___ |

*We stopped after task 8 because we reached the working-hour limit. Tasks 9–11 require your sign-off before we continue.*

---

## Draft Index (Summary)

| Folder | Drafts | Languages | Content type |
|---|---|---|---|
| `publish/ماذا نعالج/` | 39 | AR | Conditions |
| `publish/What we deal with/` | 41 | EN | Conditions (twins of above) |
| `publish/كيف نعالج/` + `How to deal with/` | 37 | AR + EN | Procedures |
| `publish/حالات/` + `Alimran cases/` | 9 | AR + EN | Case reports with images |
| `publish/العلاج الطبيعي/` + `physiotherapy/` | 15 | AR + EN | Physiotherapy modalities |
| `publish/events/` + `cv/` + loose files | 19 | AR + EN | Events, CV, mission/vision |
| `ABC articles/` | 88 | EN + AR | Encyclopedia articles |
| `Rehablitation medicine update/` | 29 | EN + AR | Rehab essays |
| **Total** | **277** | | |

---

## Draft-to-Article Matching

> Already-existing articles are omitted. Only drafts that required an action are listed.

| Draft file | Slug | Collection | Resolution | Operation |
|---|---|---|---|---|
| `Postherpetic Neuralgia.docx` | `postherpetic-neuralgia` | treatments | MISSING → CREATED | CREATED |
| `Ankle pain.docx` | `ankle-pain` | treatments | MISSING → CREATED | CREATED |
| `Arm pain.docx` | `arm-pain` | treatments | MISSING → CREATED | CREATED |
| `Elbow pain.docx` | `elbow-pain` | treatments | MISSING → CREATED | CREATED |
| `Foot pain.docx` | `foot-pain` | treatments | MISSING → CREATED | CREATED |
| `Hip pain.docx` | `hip-pain` | treatments | MISSING → CREATED | CREATED |
| `Leg pain.docx` | `leg-pain` | treatments | MISSING → CREATED | CREATED |
| `Muscle pain.docx` | `muscle-pain` | treatments | MISSING → CREATED | CREATED |
| `Numbness.docx` | `numbness` | treatments | MISSING → CREATED | CREATED |
| `Pelvic pain.docx` | `pelvic-pain` | treatments | MISSING → CREATED | CREATED |
| `Shoulder pain.docx` | `shoulder-pain` | treatments | MISSING → CREATED | CREATED |
| `Wrist pain.docx` | `wrist-pain` | treatments | MISSING → CREATED | CREATED |
| `cruciate ligament.docx` | `anterior-cruciate-ligament-injury` | treatments | MISSING → CREATED | CREATED |
| `Hydrocephalus.docx` | `hydrocephalus` | treatments | MISSING → CREATED | CREATED |
| `Meniscal Tear.docx` | `meniscal-tear` | treatments | MISSING → CREATED | CREATED |
| `Muscle disease.docx` | `muscular-dystrophy` | treatments | MISSING → CREATED | CREATED |
| `Spinal Muscular Atrophy.docx` | `spinal-muscular-atrophy` | treatments | MISSING → CREATED | CREATED |
| `dystonia.docx` | `dystonia` | treatments | MISSING → CREATED | CREATED |
| `essential tremor.docx` | `essential-tremor` | treatments | MISSING → CREATED | CREATED |
| `OCD.docx` | `obsessive-compulsive-disorder` | treatments | MISSING → CREATED | CREATED |
| `Stuttering.docx` | `stuttering` | treatments | MISSING → CREATED | CREATED |
| `Tourette syndrome.docx` | `tourette-syndrome` | treatments | MISSING → CREATED | CREATED |
| `geriatric.docx` | `geriatric-rehabilitation` | services | MISSING → CREATED | CREATED |
| `Orthopedic Rehabilitation.docx` | `orthopedic-rehabilitation` | services | MISSING → CREATED | CREATED |
| `Pediatric Rehabilitation.docx` | `pediatric-rehabilitation` | services | MISSING → CREATED | CREATED |
| `Robotic Rehabilitation.docx` | `robotic-rehabilitation` | services | MISSING → CREATED | CREATED |
| `الوقاية من الم الظهر.docx` | `back-pain-prevention` | services | MISSING → CREATED | CREATED + TRANSLATED |
| `pelvic floor rehabilitation.docx` | `pelvic-floor-rehabilitation` | services | MISSING → CREATED | CREATED + TRANSLATED |
| `Pulmonary rehabilitation.docx` | `pulmonary-rehabilitation` | services | MISSING → CREATED | CREATED + TRANSLATED |
| `brain lesion.docx` | `functional-neurosurgery-brain-lesion` | services | MISSING → CREATED | CREATED |
| `paediatric cases.docx` | `paediatric` | cases | MATCHED → REBUILT | REBUILT |
| `Spine cases.docx` | `spine` | cases | MATCHED → REBUILT | REBUILT |
| `Trauma cases.docx` | `trauma` | cases | MATCHED → REBUILT | REBUILT |
| `Tumor cases.docx` | `tumor` | cases | MATCHED → REBUILT | REBUILT |
| `Parkinson's Disease.docx` | `parkinsons-disease` | treatments | MATCHED | FACT-CHECKED |
| `Normal Pressure Hydrocephalus.docx` | `normal-pressure-hydrocephalus` | treatments | MATCHED | FACT-CHECKED |
| `Spina Bifida.docx` | `spina-bifida` | treatments | MATCHED | FACT-CHECKED |
| `Cerebrospinal Fluid Leaks.docx` | `cerebrovascular-disease` | treatments | MATCHED | FACT-CHECKED |
| `brain abscess.docx` | `brain-abscess` | treatments | MATCHED | FACT-CHECKED |
| `brain tumor.docx` | `brain-tumor` | treatments | MATCHED | FACT-CHECKED |
| `myofascial pain.docx` | `myofascial-pain` | treatments | MATCHED | FACT-CHECKED |
| `neck pain.docx` | `neck-pain` | treatments | MATCHED | FACT-CHECKED |
| `Sciatica.docx` | `sciatica` | treatments | MATCHED | FACT-CHECKED |
| `Intercostal Neuralgia.docx` | `intercostal-neuralgia` | treatments | MATCHED | FACT-CHECKED |
| `head injury.docx` | `head-injury` | treatments | MATCHED | FACT-CHECKED |
| `Compression Fracture.docx` | `compression-fracture` | treatments | MATCHED | FACT-CHECKED |
| `Sports Injuries.docx` | `sports-injuries` | treatments | MATCHED | FACT-CHECKED |
| `Cerebral Palsy.docx` | `cerebral-palsy` | treatments | MATCHED | FACT-CHECKED |
| `Frozen Shoulder.docx` | `frozen-shoulder` | treatments | MATCHED | FACT-CHECKED |
| `Herniated Disc.docx` | `herniated-disc` | treatments | MATCHED | FACT-CHECKED |
| `ozone.docx` | `ozone-therapy` | services | MATCHED | CONSOLIDATED |
| `Osteoarthritis.docx` | `ozone-therapy/osteoarthritis` | services | MATCHED | FACT-CHECKED |
| `ozone review` | `ozone-therapy/review` | services | DUPLICATE | REMOVED |

---

## Pages Touched

| URL | Collection | Languages | Tag |
|---|---|---|---|
| `https://alimran.clinic/en/treatments/postherpetic-neuralgia/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/postherpetic-neuralgia/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/ankle-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/ankle-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/arm-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/arm-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/elbow-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/elbow-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/foot-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/foot-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/hip-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/hip-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/leg-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/leg-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/muscle-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/muscle-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/numbness/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/numbness/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/pelvic-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/pelvic-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/shoulder-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/shoulder-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/wrist-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/wrist-pain/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/anterior-cruciate-ligament-injury/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/anterior-cruciate-ligament-injury/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/hydrocephalus/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/hydrocephalus/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/meniscal-tear/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/meniscal-tear/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/muscular-dystrophy/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/muscular-dystrophy/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/spinal-muscular-atrophy/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/spinal-muscular-atrophy/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/dystonia/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/dystonia/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/essential-tremor/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/essential-tremor/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/obsessive-compulsive-disorder/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/obsessive-compulsive-disorder/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/stuttering/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/stuttering/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/treatments/tourette-syndrome/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/ar/treatments/tourette-syndrome/` | treatments | EN + AR | CREATED |
| `https://alimran.clinic/en/services/geriatric-rehabilitation/` | services | EN + AR | CREATED |
| `https://alimran.clinic/ar/services/geriatric-rehabilitation/` | services | EN + AR | CREATED |
| `https://alimran.clinic/en/services/orthopedic-rehabilitation/` | services | EN + AR | CREATED |
| `https://alimran.clinic/ar/services/orthopedic-rehabilitation/` | services | EN + AR | CREATED |
| `https://alimran.clinic/en/services/pediatric-rehabilitation/` | services | EN + AR | CREATED |
| `https://alimran.clinic/ar/services/pediatric-rehabilitation/` | services | EN + AR | CREATED |
| `https://alimran.clinic/en/services/robotic-rehabilitation/` | services | EN + AR | CREATED |
| `https://alimran.clinic/ar/services/robotic-rehabilitation/` | services | EN + AR | CREATED |
| `https://alimran.clinic/en/services/back-pain-prevention/` | services | EN + AR | CREATED + TRANSLATED |
| `https://alimran.clinic/ar/services/back-pain-prevention/` | services | EN + AR | CREATED + TRANSLATED |
| `https://alimran.clinic/en/services/pelvic-floor-rehabilitation/` | services | EN + AR | CREATED + TRANSLATED |
| `https://alimran.clinic/ar/services/pelvic-floor-rehabilitation/` | services | EN + AR | CREATED + TRANSLATED |
| `https://alimran.clinic/en/services/pulmonary-rehabilitation/` | services | EN + AR | CREATED + TRANSLATED |
| `https://alimran.clinic/ar/services/pulmonary-rehabilitation/` | services | EN + AR | CREATED + TRANSLATED |
| `https://alimran.clinic/en/services/functional-neurosurgery-brain-lesion/` | services | EN + AR | CREATED |
| `https://alimran.clinic/ar/services/functional-neurosurgery-brain-lesion/` | services | EN + AR | CREATED |
| `https://alimran.clinic/en/cases/paediatric/` | cases | EN + AR | REBUILT |
| `https://alimran.clinic/ar/cases/paediatric/` | cases | EN + AR | REBUILT |
| `https://alimran.clinic/en/cases/spine/` | cases | EN + AR | REBUILT |
| `https://alimran.clinic/ar/cases/spine/` | cases | EN + AR | REBUILT |
| `https://alimran.clinic/en/cases/trauma/` | cases | EN + AR | REBUILT |
| `https://alimran.clinic/ar/cases/trauma/` | cases | EN + AR | REBUILT |
| `https://alimran.clinic/en/cases/tumor/` | cases | EN + AR | REBUILT |
| `https://alimran.clinic/ar/cases/tumor/` | cases | EN + AR | REBUILT |
| `https://alimran.clinic/en/treatments/parkinsons-disease/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/parkinsons-disease/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/normal-pressure-hydrocephalus/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/normal-pressure-hydrocephalus/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/spina-bifida/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/spina-bifida/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/cerebrovascular-disease/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/cerebrovascular-disease/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/brain-abscess/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/brain-abscess/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/brain-tumor/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/brain-tumor/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/myofascial-pain/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/myofascial-pain/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/neck-pain/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/neck-pain/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/sciatica/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/sciatica/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/intercostal-neuralgia/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/intercostal-neuralgia/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/head-injury/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/head-injury/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/compression-fracture/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/compression-fracture/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/sports-injuries/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/sports-injuries/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/cerebral-palsy/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/cerebral-palsy/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/frozen-shoulder/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/frozen-shoulder/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/treatments/herniated-disc/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/treatments/herniated-disc/` | treatments | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/services/ozone-therapy/ozone-therapy/` | services | EN + AR | CONSOLIDATED |
| `https://alimran.clinic/ar/services/ozone-therapy/ozone-therapy/` | services | EN + AR | CONSOLIDATED |
| `https://alimran.clinic/en/services/ozone-therapy/disc-prolapse/` | services | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/services/ozone-therapy/disc-prolapse/` | services | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/services/ozone-therapy/osteoarthritis/` | services | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/ar/services/ozone-therapy/osteoarthritis/` | services | EN + AR | FACT-CHECKED |
| `https://alimran.clinic/en/services/ozone-therapy/review/` | services | EN + AR | REMOVED |
| `https://alimran.clinic/ar/services/ozone-therapy/review/` | services | EN + AR | REMOVED |

---

## Remaining Work (Stopped — Needs Your Go-Ahead)

We reached the working-hour limit. The following tasks are ready to start once you confirm.

### Held back (need your decision)

| Draft | Proposed slug | Issue | Your decision |
|---|---|---|---|
| `axial spinal stenosis.docx` | `axial-spinal-stenosis` | Scraped from UK site; strip third-party refs | Create after rewrite / Discard |
| `Postoperative Information.docx` | `postoperative-information` | UK clinic leaflet; mentions "Mr. Knight", GP surgery | Localize / Discard |
| `minimally invasive spine surgery.docx` | `minimally-invasive-spine-surgery` | Truncated mid-word | Complete / Discard |
| `red ear syndromw.docx` | `red-ear-syndrome` | Textbook excerpt; copyright concern | Rewrite / Discard |
| `why choise alimran center.docx` | — | 4-bullet promo blurb only | Add to About page / Discard |
| `tble.docx` | — | Glossary table, not an article | Use as site component / Discard |
| `tic.docx` | — | Empty file | Discard |

### Backlog

| Task | Scope | Why blocked |
|---|---|---|
| Fact-check ~160 matched articles | All existing condition + procedure pages | Time limit |
| Extract case images from drafts | 100+ CT/MRI scans embedded in `.docx` | Time limit |

---

## Questions for Your Review

**Default rule:** Where a draft contradicts the live article, we treat the draft as the source of truth and will update the site to match — unless the draft makes a claim that is hard to believe or clinically unusual. The questions below are the exceptions where we need your word before changing anything.

| # | Article | Live article says | Your draft says | Action needed |
|---|---|---|---|---|
| 1 | **Parkinson's disease** | No dopamine-depletion % given | Symptoms appear at **80% dopamine depletion** | Shall we add the 80% figure? |
| 2 | **NPH** | No prevalence cited | **0.5% of population over 65** | Shall we add this figure? |
| 3 | **NPH** | "All shunts at Alimran contain a magnetically programmable valve" | No mention of hardware | Is this claim accurate for every shunt? |
| 4 | **Intercostal neuralgia** | "Paralysis and atrophy of the muscles" listed as advanced symptom | Both drafts are stubs (only image captions) | Is paralysis realistic for this condition? If not, we will remove it. |
| 5 | **Compression fracture** | "Short-term calcitonin may modestly reduce pain" | Not mentioned | NICE does not recommend calcitonin for acute osteoporotic fracture pain. Remove? |
| 6 | **Ozone therapy** | Broad indication list on live pages | Drafts support even broader claims (cancer, 99% bactericidal) | We have **not** added the unsupported claims. Confirm you are happy with the current conservative scope. |

**If we hear nothing on items 1–5, we will take the safe option:**
- Items 1–3: Add the draft figures (they are your original words).
- Item 4: Remove the "paralysis and atrophy" claim (the draft does not support it and it is clinically unusual).
- Item 5: Remove the calcitonin claim (evidence is weak).
- Item 6: Leave ozone scope as-is.

---

## Appendix: Reference Files

- `drafts-inventory.md` — full 277-draft inventory
- `flagged-facts.md` — detailed per-article fact-check notes
- `pending-articles.md` — created vs held-back status
- Git commits `c92e58c` through `6d15423` contain all changes
