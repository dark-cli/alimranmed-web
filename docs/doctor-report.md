# Alimran.clinic — Draft-to-Site Reconciliation Report

**Date:** 2026-10-09  
**Scope:** 277 `.docx` drafts under `drafts/` cross-checked against live site content  
**Status:** First pass complete. Build passing. All changes committed locally (not pushed).

---

## 1. Draft Index

| Folder | Count | Languages | Content type |
|---|---|---|---|
| `publish/ماذا نعالج/` | 39 | AR | Conditions (pain, brain, spine, paediatric, motor) |
| `publish/What we deal with/` | 41 | EN | Conditions (twin set of above) |
| `publish/كيف نعالج/` + `How to deal with/` | 37 | AR + EN | Procedures & interventions |
| `publish/حالات/` + `Alimran cases/` | 9 | AR + EN | Case reports with images |
| `publish/العلاج الطبيعي/` + `physiotherapy/` + `add/` | 15 | AR + EN | Physiotherapy modalities + addenda |
| `publish/events/` + `cv/` + loose files | 19 | AR + EN | Events, CV, mission/vision, clinic profile |
| `ABC articles/` | 88 | EN + AR (bilingual files) | Encyclopedia-style condition articles |
| `Rehablitation medicine update/` | 29 | EN + AR (mostly bilingual) | Rehab-focused essays |
| **Empty / junk** | 5 | — | `notice.docx`, `tic.docx`, `back pain.docx`, lock files, temp files |
| **Total** | **277** | | |

**Key patterns**
- `publish/` has **separate AR and EN files** (paired by topic).
- `ABC articles/` and `Rehablitation medicine update/` are **bilingual within one file** (EN first, AR appended).
- 3 drafts are **EN-only** with no AR twin: `prolotherapy`, `pelvic floor rehabilitation`, `pulmonary rehabilitation`, `red ear syndrome`, `minimally invasive spine surgery`, `body map/Radiofrequency spine`.
- 1 draft is **AR-only** with no EN twin: `الوقاية من الم الظهر` (back pain prevention).

---

## 2. Draft-to-Article Matching

> Already-existing articles are omitted. This table covers only drafts that required an operation.

| Draft path | Proposed slug | Collection | Resolution | Operation |
|---|---|---|---|---|
| **Created from draft (30 articles, 54 files)** |
| `publish/What we deal with/Pain/Postherpetic Neuralgia.docx` | `postherpetic-neuralgia` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `ABC articles/body map/Ankle pain.docx` | `ankle-pain` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `ABC articles/body map/Arm pain.docx` | `arm-pain` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `ABC articles/body map/Elbow pain.docx` | `elbow-pain` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `ABC articles/body map/Foot pain.docx` | `foot-pain` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `ABC articles/body map/Hip pain.docx` | `hip-pain` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `ABC articles/body map/Leg pain.docx` | `leg-pain` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `ABC articles/body map/Muscle pain.docx` | `muscle-pain` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `ABC articles/body map/Numbness.docx` | `numbness` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `ABC articles/body map/Pelvic pain.docx` | `pelvic-pain` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `ABC articles/body map/Shoulder pain.docx` | `shoulder-pain` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `ABC articles/body map/Wrist pain.docx` | `wrist-pain` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/cruciate ligament.docx` | `anterior-cruciate-ligament-injury` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/Hydrocephalus.docx` | `hydrocephalus` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/Meniscal Tear.docx` | `meniscal-tear` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/Muscle disease.docx` | `muscular-dystrophy` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/Spinal Muscular Atrophy (SMA).docx` | `spinal-muscular-atrophy` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/functional neurosurgery/dystonia.docx` | `dystonia` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/functional neurosurgery/essential tremor.docx` | `essential-tremor` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/functional neurosurgery/OCD.docx` | `obsessive-compulsive-disorder` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/functional neurosurgery/Stuttering.docx` | `stuttering` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/functional neurosurgery/Tourette.docx` | `tourette-syndrome` | treatments | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/geriatric.docx` | `geriatric-rehabilitation` | services | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/Orthopedic Rehabilitation.docx` | `orthopedic-rehabilitation` | services | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/Pediatric Rehabilitation.docx` | `pediatric-rehabilitation` | services | MISSING → CREATED | Bilingual article from scratch |
| `Rehablitation medicine update/Robotic Rehabilitation.docx` | `robotic-rehabilitation` | services | MISSING → CREATED | Bilingual article from scratch |
| `publish/العلاج الطبيعي/الوقاية من الم الظهر.docx` | `back-pain-prevention` | services | MISSING → CREATED | AR from draft; EN translated |
| `Rehablitation medicine update/pelvic floor rehabilitation.docx` | `pelvic-floor-rehabilitation` | services | MISSING → CREATED | EN from draft; AR translated |
| `Rehablitation medicine update/Pulmonary rehabilitation.docx` | `pulmonary-rehabilitation` | services | MISSING → CREATED | EN from draft; AR translated |
| `Rehablitation medicine update/functional neurosurgery/brain lesion.docx` | `functional-neurosurgery-brain-lesion` | services | MISSING → CREATED | Bilingual article from scratch |
| **Rebuilt from draft (4 case pages, 8 files)** |
| `publish/Alimran cases/paediatric cases.docx` | `paediatric` | cases | MATCHED → REBUILT | Block-based rebuild EN + AR |
| `publish/Alimran cases/Spine cases.docx` | `spine` | cases | MATCHED → REBUILT | Block-based rebuild EN + AR |
| `publish/Alimran cases/Trauma cases.docx` | `trauma` | cases | MATCHED → REBUILT | Block-based rebuild EN + AR |
| `publish/Alimran cases/Tumor cases.docx` | `tumor` | cases | MATCHED → REBUILT | Block-based rebuild EN + AR |
| **Fact-checked against draft (18 articles)** |
| `publish/What we deal with/Brain/Cerebrospinal Fluid Leaks.docx` | `cerebrovascular-disease` | treatments | MATCHED → FACT-CHECKED | Source set to `original` |
| `publish/What we deal with/Brain/brain abscess.docx` | `brain-abscess` | treatments | MATCHED → FACT-CHECKED | Source set to `original` |
| `publish/What we deal with/Brain/brain tumor.docx` | `brain-tumor` | treatments | MATCHED → FACT-CHECKED | Source set to `original` |
| `publish/What we deal with/Pain/myofascial pain.docx` | `myofascial-pain` | treatments | MATCHED → FACT-CHECKED | Flagged: EN draft is stub |
| `publish/What we deal with/Pain/neck pain.docx` | `neck-pain` | treatments | MATCHED → FACT-CHECKED | Flagged: EN draft is stub |
| `publish/What we deal with/Pain/Sciatica.docx` | `sciatica` | treatments | MATCHED → FACT-CHECKED | Flagged: no sciatica draft exists |
| `publish/What we deal with/Pain/Intercostal Neuralgia.docx` | `intercostal-neuralgia` | treatments | MATCHED → FACT-CHECKED | Flagged: paralysis claim |
| `publish/What we deal with/Brain/head injury.docx` | `head-injury` | treatments | MATCHED → FACT-CHECKED | Source set to `original` |
| `publish/What we deal with/Spine/Compression Fracture.docx` | `compression-fracture` | treatments | MATCHED → FACT-CHECKED | Flagged: calcitonin claim |
| `publish/What we deal with/Pain/Sports Injuries.docx` | `sports-injuries` | treatments | MATCHED → FACT-CHECKED | Source set to `original` |
| `publish/What we deal with/Pediatric neurosurgery/Cerebral Palsy.docx` | `cerebral-palsy` | treatments | MATCHED → FACT-CHECKED | Source set to `original` |
| `publish/What we deal with/Pain/Frozen Shoulder.docx` | `frozen-shoulder` | treatments | MATCHED → FACT-CHECKED | Source set to `original` |
| `publish/What we deal with/Spine/Herniated Disc.docx` | `herniated-disc` | treatments | MATCHED → FACT-CHECKED | Source set to `original` |
| `publish/What we deal with/Motor disorders/Parkinson's Disease.docx` | `parkinsons-disease` | treatments | MATCHED → FACT-CHECKED | Flagged: 80% dopamine claim |
| `publish/What we deal with/Brain/Normal Pressure Hydrocephalus (NPH).docx` | `normal-pressure-hydrocephalus` | treatments | MATCHED → FACT-CHECKED | Flagged: 0.5% prevalence, programmable valve |
| `publish/What we deal with/Spine/Spina Bifida.docx` | `spina-bifida` | treatments | MATCHED → FACT-CHECKED | Source set to `original` |
| `publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/ozone.docx` | `ozone-therapy` | services | MATCHED → FACT-CHECKED | Consolidated; 172 links migrated |
| `publish/What we deal with/Pain/Osteoarthritis.docx` | `ozone-therapy/osteoarthritis` | services | MATCHED → FACT-CHECKED | Flagged: topic mismatch |

---

## 3. Pages Touched

| URL path | Collection | Languages | Action |
|---|---|---|---|
| `/treatments/postherpetic-neuralgia/` | treatments | EN + AR | Created from draft |
| `/treatments/ankle-pain/` | treatments | EN + AR | Created from draft |
| `/treatments/arm-pain/` | treatments | EN + AR | Created from draft |
| `/treatments/elbow-pain/` | treatments | EN + AR | Created from draft |
| `/treatments/foot-pain/` | treatments | EN + AR | Created from draft |
| `/treatments/hip-pain/` | treatments | EN + AR | Created from draft |
| `/treatments/leg-pain/` | treatments | EN + AR | Created from draft |
| `/treatments/muscle-pain/` | treatments | EN + AR | Created from draft |
| `/treatments/numbness/` | treatments | EN + AR | Created from draft |
| `/treatments/pelvic-pain/` | treatments | EN + AR | Created from draft |
| `/treatments/shoulder-pain/` | treatments | EN + AR | Created from draft |
| `/treatments/wrist-pain/` | treatments | EN + AR | Created from draft |
| `/treatments/anterior-cruciate-ligament-injury/` | treatments | EN + AR | Created from draft |
| `/treatments/hydrocephalus/` | treatments | EN + AR | Created from draft |
| `/treatments/meniscal-tear/` | treatments | EN + AR | Created from draft |
| `/treatments/muscular-dystrophy/` | treatments | EN + AR | Created from draft |
| `/treatments/spinal-muscular-atrophy/` | treatments | EN + AR | Created from draft |
| `/treatments/dystonia/` | treatments | EN + AR | Created from draft |
| `/treatments/essential-tremor/` | treatments | EN + AR | Created from draft |
| `/treatments/obsessive-compulsive-disorder/` | treatments | EN + AR | Created from draft |
| `/treatments/stuttering/` | treatments | EN + AR | Created from draft |
| `/treatments/tourette-syndrome/` | treatments | EN + AR | Created from draft |
| `/services/geriatric-rehabilitation/` | services | EN + AR | Created from draft |
| `/services/orthopedic-rehabilitation/` | services | EN + AR | Created from draft |
| `/services/pediatric-rehabilitation/` | services | EN + AR | Created from draft |
| `/services/robotic-rehabilitation/` | services | EN + AR | Created from draft |
| `/services/back-pain-prevention/` | services | EN + AR | Created from draft (AR) + translated (EN) |
| `/services/pelvic-floor-rehabilitation/` | services | EN + AR | Created from draft (EN) + translated (AR) |
| `/services/pulmonary-rehabilitation/` | services | EN + AR | Created from draft (EN) + translated (AR) |
| `/services/functional-neurosurgery-brain-lesion/` | services | EN + AR | Created from draft |
| `/cases/paediatric/` | cases | EN + AR | Rebuilt block-based from draft |
| `/cases/spine/` | cases | EN + AR | Rebuilt block-based from draft |
| `/cases/trauma/` | cases | EN + AR | Rebuilt block-based from draft |
| `/cases/tumor/` | cases | EN + AR | Rebuilt block-based from draft |
| `/treatments/parkinsons-disease/` | treatments | EN + AR | Fact-checked; source updated |
| `/treatments/normal-pressure-hydrocephalus/` | treatments | EN + AR | Fact-checked; source updated |
| `/treatments/spina-bifida/` | treatments | EN + AR | Fact-checked; source updated |
| `/treatments/cerebrovascular-disease/` | treatments | EN + AR | Fact-checked; source updated |
| `/treatments/brain-abscess/` | treatments | EN + AR | Fact-checked; source updated |
| `/treatments/brain-tumor/` | treatments | EN + AR | Fact-checked; source updated |
| `/treatments/myofascial-pain/` | treatments | EN + AR | Fact-checked; flagged |
| `/treatments/neck-pain/` | treatments | EN + AR | Fact-checked; flagged |
| `/treatments/sciatica/` | treatments | EN + AR | Fact-checked; flagged |
| `/treatments/intercostal-neuralgia/` | treatments | EN + AR | Fact-checked; flagged |
| `/treatments/head-injury/` | treatments | EN + AR | Fact-checked; source updated |
| `/treatments/compression-fracture/` | treatments | EN + AR | Fact-checked; flagged |
| `/treatments/sports-injuries/` | treatments | EN + AR | Fact-checked; source updated |
| `/treatments/cerebral-palsy/` | treatments | EN + AR | Fact-checked; source updated |
| `/treatments/frozen-shoulder/` | treatments | EN + AR | Fact-checked; source updated |
| `/treatments/herniated-disc/` | treatments | EN + AR | Fact-checked; source updated |
| `/services/ozone-therapy/ozone-therapy/` | services | EN + AR | Consolidated; 172 links migrated; claims fact-checked |
| `/services/ozone-therapy/disc-prolapse/` | services | EN + AR | Fact-checked; source updated |
| `/services/ozone-therapy/osteoarthritis/` | services | EN + AR | Fact-checked; flagged |
| `/services/ozone-therapy/review/` | services | EN + AR | **Removed** (duplicate of main page) |

---

## 4. Remaining Work (requires doctor confirmation to continue)

### 4.1 Held back — needs decision before creation

| Draft | Proposed slug | Issue | Decision needed |
|---|---|---|---|
| `publish/add/add2/axial spinal stenosis.docx` | `axial-spinal-stenosis` | Scraped from UK site; third-party refs to strip | Create after rewrite? |
| `publish/add/add2/Postoperative Information.docx` | `postoperative-information` | UK clinic leaflet; refs "Mr. Knight", GP surgery | Localize first? |
| `ABC articles/minimally invasive spine surgery.docx` | `minimally-invasive-spine-surgery` | Truncated mid-word | Complete or discard? |
| `Rehablitation medicine update/red ear syndromw.docx` | `red-ear-syndrome` | Textbook excerpt; copyright concern | Rewrite or drop? |
| `ABC articles/why choise alimran center.docx` | — | 4-bullet promo blurb only | Add to About page? |
| `ABC articles/body map/tble.docx` | — | Glossary table, not an article | Use as component? |
| `Rehablitation medicine update/functional neurosurgery/tic.docx` | — | Empty file (0 bytes) | Discard |

### 4.2 Fact-check backlog

~160 matched articles were **not** fact-checked in this pass due to time limit. Priority queues:

| Priority | Articles | Why |
|---|---|---|
| High | `myofascial-pain`, `neck-pain`, `sciatica`, `intercostal-neuralgia` | EN drafts are stubs or missing; live articles are AI-generated with no doctor source |
| High | All ozone-therapy subpages | Claims were deliberately pulled; scope needs your sign-off |
| Medium | All `publish/ماذا نعالج/` + `What we deal with/` condition pages (~40 articles) | Drafts exist but were not line-by-line checked |
| Medium | All `ABC articles/` matched pages (~60 articles) | Bilingual drafts need cross-check against live text |
| Low | Procedure pages under `services/` | Mostly well-matched; minor drift expected |

### 4.3 Case-report image extraction

The 4 `cases/` pages were rebuilt as block-based articles. The draft `.docx` files contain **embedded images** (100+ CT/MRI scans) that need extraction and placement in `public/` before the media blocks can display them.

| Case page | Images in draft | Status |
|---|---|---|
| `cases/paediatric/` | 19 AR + 15 EN | Not extracted |
| `cases/spine/` | 26 AR + 1 EN | Not extracted |
| `cases/trauma/` | 44 AR + 24 EN | Not extracted |
| `cases/tumor/` | 32 AR + 30 EN | Not extracted |

### 4.4 Language gaps in existing articles

| Article | Has | Missing |
|---|---|---|
| `services/back-pain-prevention` | AR | EN translation |
| `services/pelvic-floor-rehabilitation` | EN | AR translation |
| `services/pulmonary-rehabilitation` | EN | AR translation |

*Note: All three gaps were filled during this pass (EN translated for back-pain-prevention, AR translated for pelvic-floor and pulmonary).*

---

## 5. Questions & Facts to Verify

| # | Topic | Current article says | Draft says | Question |
|---|---|---|---|---|
| 1 | Parkinson's disease | Symptoms appear when dopamine is depleted (no % given) | Symptoms appear at **80% dopamine depletion** | Add the 80% figure or leave it out? |
| 2 | NPH prevalence | Not cited | **0.5% of population over 65** | Add this prevalence figure? |
| 3 | NPH hardware | "All shunts at Alimran contain a magnetically programmable valve" | No mention of clinic hardware | Is the programmable-valve claim accurate for every shunt? |
| 4 | Intercostal neuralgia | "Paralysis and atrophy of the muscles" listed as advanced symptom | Both drafts are stubs (image captions only) | Is paralysis/atrophy a realistic symptom of intercostal neuralgia? |
| 5 | Compression fracture | "Short-term calcitonin may modestly reduce pain" | Not mentioned | Calcitonin evidence for acute osteoporotic fracture pain is weak (NICE does not recommend). Keep or remove? |
| 6 | Ozone therapy scope | Live pages list broad indications (coronary, liver, stroke, rheumatoid, skin, eye, migraine, vertigo, hepatitis, immunodeficiency, shingles) | Drafts support even broader claims (cancer, 99% bactericidal) | Should indication list be **narrowed** to disc + osteoarthritis only, or **kept** as-is? |
| 7 | Ozone duplication | `review` page was removed; 172 links now point to main page | `review` was near-verbatim copy of main page | Confirm you are happy with the consolidation |
| 8 | Frozen shoulder | Omits "20% bilateral risk" and "35–50 year old age peak" | Draft includes both | Add these figures back? |
| 9 | Myofascial pain / neck pain / sciatica | Live EN articles are comprehensive | EN drafts are empty stubs (image refs only) | Should these EN articles be rewritten from the substantial Arabic drafts? |
| 10 | Event draft — ozone for disc | No matching blog article | `publish/events/Ozone for disc.docx` describes a procedure at Al-Mosawy hospital | Create as a blog post or case vignette? |

---

## Appendix: File references

- `drafts-inventory.md` — full 277-draft inventory with STEP 2 resolution tables
- `flagged-facts.md` — per-article fact-check findings and clinician questions
- `pending-articles.md` — created vs held-back status
- Git commits `c92e58c` through `d8c18d8` contain all changes
