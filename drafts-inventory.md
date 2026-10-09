# Drafts inventory — alimran.clinic cross-check (STEP 1)

Date: 2026-10-09. Scope: **everything under `drafts/`** (confirmed with user), Arabic and
English drafts both treated as source of truth.

Method: every `.docx` (277 total) extracted to plain text with pandoc and skimmed in full.
277 sources = 274 with text + 3 zero-byte files (`back pain.docx`, `notice.docx`,
`tic.docx` — recorded as EMPTY below). Word counts are approximate (`wc -w` on extracted
text; Arabic counts inflated by table-border tokens in case files). Non-docx junk
(`~$` Word lock files, `~WRL*.tmp`, LOST.DIR) is listed at the bottom and otherwise ignored.

Totals by folder:

| folder | drafts | notes |
|---|---|---|
| `publish/ماذا نعالج/` (AR conditions) | 39 | brain / pain / motor / paediatric / spine |
| `publish/What we deal with/` (EN conditions) | 41 | incl. 1 empty file, 3 stubs |
| `publish/كيف نعالج/` + `publish/How to deal with/` (procedures) | 37 | AR+EN near-duplicate set |
| `publish/حالات/` + `publish/Alimran cases/` (case reports) | 9 | the four site case pages' sources |
| `publish/العلاج الطبيعي/` + `physiotherapy/` + `add/` | 15 | physiotherapy modalities |
| `publish/events/` + `cv/` + loose files | 19 | event reports, CV, mission/vision, clinic profile |
| `ABC articles/` | 88 | encyclopedia-style, EN+AR in one file; incl. 1 empty |
| `Rehablitation medicine update/` | 29 | rehab essays; incl. 1 empty |
| **total** | **277** | |

Language coverage pattern: `publish/` has AR and EN drafts in **separate files** (paired by
topic, Arabic often the richer version). `ABC articles/` and `Rehablitation medicine update/`
are **bilingual within one file** (English prose, Arabic translation appended) — 3
English-only exceptions noted in the tables. This file records per-draft language data;
the "matched article" column is filled in during STEP 2.

---

## 1. `publish/ماذا نعالج/` — Arabic condition drafts (39)

| draft path | topic | slug guess | collection | shape | notes |
|---|---|---|---|---|---|
| publish/ماذا نعالج/الآلام/اضطرابات الأعصاب الطرفية.docx | Peripheral neuropathy | peripheral-neuropathy | treatments | prose + bullets, ~813w | Lists GBS etc.; H1 says "neuropathy", filename "disorders" |
| publish/ماذا نعالج/الآلام/الألم العصبي التالي.docx | Postherpetic neuralgia | postherpetic-neuralgia | treatments | prose, ~770w | |
| publish/ماذا نعالج/الآلام/الاصابات الرياضية.docx | Sports injuries | sports-injuries | treatments | prose + short headings, ~887w | |
| publish/ماذا نعالج/الآلام/التهاب العصب الثالث.docx | Trigeminal neuralgia | trigeminal-neuralgia | treatments | prose + headings, ~484w | Filename "third nerve" but content is the **5th** cranial nerve |
| publish/ماذا نعالج/الآلام/التهاب مفاصل الورك.docx | Hip arthritis | arthritis-of-the-hip | treatments | prose + bullets, ~672w | Broken local image ref (E:\…\hip artheritis.jpg) |
| publish/ماذا نعالج/الآلام/الم اسفل الظهر.docx | Low back pain | back-pain | treatments | prose + warning-signs list, ~704w | Broken local image refs ×2 |
| publish/ماذا نعالج/الآلام/الم الرقبة.docx | Neck pain | neck-pain | treatments | prose, ~981w | Plain prose, no headings |
| publish/ماذا نعالج/الآلام/الم العضل الليفي.docx | Myofascial pain | myofascial-pain | treatments | prose, ~814w | |
| publish/ماذا نعالج/الآلام/امراض الشقيقه.docx | Migraine | migraine | treatments | prose + bullets, ~892w | Body starts at "الأسباب" (no intro/H1) |
| publish/ماذا نعالج/الآلام/تجمد الكتف (الكتف المتجمد).docx | Frozen shoulder | frozen-shoulder | treatments | prose + numbered stages, ~308w | 3 stages |
| publish/ماذا نعالج/الآلام/سوفان.docx | Osteoarthritis ("السوفان") | osteoarthritis | treatments | prose, ~117w | Very short |
| publish/ماذا نعالج/الآلام/متلازمة النفق الرسغي.docx | Carpal tunnel syndrome | carpal-tunnel-syndrome | treatments | Q&A prose, ~545w | |
| publish/ماذا نعالج/الآلام/مرفق التنس.docx | Tennis elbow | tennis-elbow | treatments | prose + headings, ~408w | |
| publish/ماذا نعالج/الآلام/نتوء الكعب.docx | Heel spur | heel-spur | treatments | Q&A prose, ~356w | |
| publish/ماذا نعالج/الآلام/هشاشة العظام.docx | Osteoporosis | osteoporosis-pain | treatments | single prose block, ~99w | Very short |
| publish/ماذا نعالج/الآلام/وربي العصبي.docx | Intercostal (radicular) pain | intercostal-neuralgia | treatments | title + image captions only, ~44w | STUB — 2 figure captions, almost no body |
| publish/ماذا نعالج/الامراض الحركية/الصرع والنوبات.docx | Epilepsy and seizures | epilepsy-seizures | treatments | prose + headings, ~680w | |
| publish/ماذا نعالج/الامراض الحركية/باكنسن.docx | Parkinson's disease | parkinsons-disease | treatments | short prose + numbered list, ~86w | Very short; filename misspelled |
| publish/ماذا نعالج/الامراض الحركية/تشنج شق الوجه.docx | Hemifacial spasm | hemifacial-spasm | treatments | prose + headings, ~290w | |
| publish/ماذا نعالج/الامراض العصبية للأطفال/الحبل الشوكي المربوط.docx | Tethered spinal cord | tethered-spinal-cord | treatments | prose, ~498w | Explicitly adult-focused |
| publish/ماذا نعالج/الامراض العصبية للأطفال/الشلل الدماغي.docx | Cerebral palsy | cerebral-palsy | treatments | Q&A prose, ~949w | |
| publish/ماذا نعالج/الامراض العصبية للأطفال/تعظم الدروز الباكر.docx | Craniosynostosis | craniosynostosis | treatments | Q&A prose, ~438w | |
| publish/ماذا نعالج/الامراض العصبية للأطفال/طب الأطفال استسقاء الرأس.docx | Pediatric hydrocephalus | pediatric-hydrocephalus | treatments | prose, ~859w | |
| publish/ماذا نعالج/الدماغ/إصابة الرأس.docx | Head injury (TBI) | head-injury | treatments | prose + bullets, ~1049w | |
| publish/ماذا نعالج/الدماغ/استسقاء الرأس الضغط العادي  (NPH).docx | Normal pressure hydrocephalus | normal-pressure-hydrocephalus | treatments | prose, ~658w | |
| publish/ماذا نعالج/الدماغ/السكتة النزفية.docx | Hemorrhagic stroke | hemorrhagic-stroke | treatments | prose + bullets, ~309w | One image placeholder |
| publish/ماذا نعالج/الدماغ/خراج الدماغ.docx | Brain abscess | brain-abscess | treatments | Q&A prose, ~532w | Pediatric emphasis |
| publish/ماذا نعالج/الدماغ/عيارات نارية في الجمجمة.docx | Cranial gunshot wounds | cranial-gunshot-wounds | treatments | prose + treatment section, ~320w | |
| publish/ماذا نعالج/الدماغ/ورم الدماغ حالات.docx | Brain tumor — 5+ patient case reports | brain-tumor-cases | cases | case narratives, ~1010w | Pituitary adenoma, temporal glioma, scalp tumor, cerebellar tumor, acoustic neuroma; **0 embedded images** |
| publish/ماذا نعالج/الدماغ/ورم دموي تحت الجافية.docx | Subdural hematoma | subdural-hematoma | treatments | prose + headings, ~341w | Filename says "tumor" — content is hematoma |
| publish/ماذا نعالج/الدماغ/ورم في المخ.docx | Brain tumors (general) | brain-tumor | treatments | Q&A prose, ~1193w | General counterpart to the حالات file above |
| publish/ماذا نعالج/العمود الفقري/اصابة الحبل الشوكي.docx | Spinal cord injury | spinal-cord-injury | treatments | prose, ~648w | Overlaps صدمة العمود الفقري |
| publish/ماذا نعالج/العمود الفقري/الاعتلال النخاعي الفقاري العنقي.docx | Cervical spondylotic myelopathy | cervical-spondylotic-myelopathy | treatments | prose, ~595w | |
| publish/ماذا نعالج/العمود الفقري/التهاب المفصل العجزي الحرقفي.docx | Sacroiliitis | sacroiliitis | treatments | prose + bullets, ~690w | |
| publish/ماذا نعالج/العمود الفقري/السنسنة المشقوقة.docx | Spina bifida (adult) | spina-bifida | treatments | prose + headings, ~1305w | Adult-focused; links to a pediatric page that has no draft here |
| publish/ماذا نعالج/العمود الفقري/تكهف النخاع ( القناة السمعية).docx | Syringomyelia | syringomyelia | treatments | prose, ~371w | Parenthetical "(القناة السمعية)" is wrong/irrelevant |
| publish/ماذا نعالج/العمود الفقري/صدمة العمود الفقري.docx | Spinal trauma | spinal-trauma | treatments | prose, ~458w | Overlaps اصابة الحبل الشوكي (both = SCI) |
| publish/ماذا نعالج/العمود الفقري/ضغط الكسر.docx | Compression fracture | compression-fracture | treatments | prose, ~641w | |
| publish/ماذا نعالج/العمود الفقري/فتق القرص (عنق الرحم، الصدر، أسفل الظهر).docx | Herniated disc (all regions) | herniated-disc | treatments | prose, ~859w | |
| publish/ماذا نعالج/العمود الفقري/متلازمة ذيل الفرس.docx | Cauda equina syndrome | cauda-equina-syndrome | treatments | prose + headings, ~524w | |

## 2. `publish/What we deal with/` — English condition drafts (41)

| draft path | topic | slug guess | collection | shape | notes |
|---|---|---|---|---|---|
| publish/What we deal with/Brain/brain abscess.docx | Brain abscess | brain-abscess | treatments | prose + Q&A headings, ~603w | Pediatric-flavored wording |
| publish/What we deal with/Brain/brain tumor.docx | Brain tumors | brain-tumor | treatments | prose + headings, ~1380w | Contains dated ACS 2006 statistics |
| publish/What we deal with/Brain/Cerebrospinal Fluid Leaks.docx | Cerebrovascular disease | cerebrovascular-disease | treatments | single prose block, ~171w | **Filename/content mismatch** — named CSF leaks, text is CVA disease |
| publish/What we deal with/Brain/Cranial Gunshot Wounds.docx | Cranial gunshot wounds | cranial-gunshot-wounds | treatments | prose + headings, ~343w | US-centric framing |
| publish/What we deal with/Brain/Epilepsy & Seizures.docx | Epilepsy & seizures | epilepsy-seizures | treatments | prose + headings, ~748w | |
| publish/What we deal with/Brain/head injury.docx | Head injury | head-injury | treatments | prose + headings, ~1884w | Longest brain draft |
| publish/What we deal with/Brain/Hemorrhagic Stroke.docx | Hemorrhagic stroke | hemorrhagic-stroke | treatments | prose + headings, ~325w | |
| publish/What we deal with/Brain/Normal Pressure Hydrocephalus (NPH).docx | NPH | normal-pressure-hydrocephalus | treatments | prose + headings, ~1244w | References "Columbia Adult Hydrocephalus team" (third-party leak) |
| publish/What we deal with/Brain/Subdural Hematoma.docx | Subdural hematoma | subdural-hematoma | treatments | prose + headings, ~382w | |
| publish/What we deal with/Motor disorders/Hemifacial Spasm.docx | Hemifacial spasm | hemifacial-spasm | treatments | prose + headings, ~298w | |
| publish/What we deal with/Motor disorders/Parkinson's Disease.docx | Parkinson's disease | parkinsons-disease | treatments | prose + numbered list, ~233w | Leaks "our physiotherapists at Archive(s)" — third-party clinic text |
| publish/What we deal with/Pain/Carpal Tunnel Syndrome.docx | Carpal tunnel syndrome | carpal-tunnel-syndrome | treatments | prose + headings, ~883w | Broken local image ref |
| publish/What we deal with/Pain/Frozen Shoulder.docx | Frozen shoulder | frozen-shoulder | treatments | prose + numbered stages, ~350w | |
| publish/What we deal with/Pain/heel spur.docx | Heel spur | heel-spur | treatments | prose + headings, ~612w | Broken image ref |
| publish/What we deal with/Pain/Hip artheritis.docx | Arthritis of the hip | arthritis-of-the-hip | treatments | prose + headings, ~985w | Filename typo "artheritis"; "Figure a/b" captions |
| publish/What we deal with/Pain/Intercostal Neuralgia.docx | Intercostal neuralgia | intercostal-neuralgia | treatments | image captions only, ~43w | STUB — placeholders + Figure 1/2 captions |
| publish/What we deal with/Pain/Migrain.docx | Migraine | migraine | treatments | prose + headings, ~960w | Filename typo |
| publish/What we deal with/Pain/myofascial pain.docx | Myofascial pain | myofascial-pain | treatments | title + image ref only, ~7w | **STUB — no body** |
| publish/What we deal with/Pain/neck pain.docx | Neck pain | neck-pain | treatments | image ref + label only, ~7w | **STUB — no body** |
| publish/What we deal with/Pain/Osteoarthritis.docx | Osteoarthritis | osteoarthritis | treatments | prose, ~201w | Leaks "At Archive, we understand…" — third-party clinic text |
| publish/What we deal with/Pain/Osteoporosis.docx | Osteoporosis | osteoporosis | treatments | prose, ~229w | |
| publish/What we deal with/Pain/Peripheral Nerve Disorders.docx | Peripheral nerve disorders | peripheral-nerve-disorders | treatments | prose + bullets, ~863w | |
| publish/What we deal with/Pain/Postherpetic Neuralgia.docx | Postherpetic neuralgia | postherpetic-neuralgia | treatments | prose + headings, ~767w | |
| publish/What we deal with/Pain/sacroilitis.docx | Sacroiliitis | sacroiliitis | treatments | prose + bullets, ~755w | Filename typo |
| publish/What we deal with/Pain/Sciatica.docx | Sciatica | sciatica | treatments | image ref + label only, ~5w | **STUB — no body** |
| publish/What we deal with/Pain/Sports Injuries.docx | Sports injuries | sports-injuries | treatments | prose + per-injury headings, ~1062w | Clinic-marketing intro |
| publish/What we deal with/Pain/Tennis elbow.docx | Tennis elbow | tennis-elbow | treatments | prose + headings, ~610w | |
| publish/What we deal with/Pain/Trigeminal Neuralgia.docx | Trigeminal neuralgia | trigeminal-neuralgia | treatments | prose + headings, ~491w | |
| publish/What we deal with/Pediatric neurosurgery/Cerebral Palsy.docx | Cerebral palsy | cerebral-palsy | treatments | prose + Q&A headings, ~1034w | |
| publish/What we deal with/Pediatric neurosurgery/craniosynostosis.docx | Craniosynostosis | craniosynostosis | treatments | prose + Q&A headings, ~485w | |
| publish/What we deal with/Pediatric neurosurgery/Pediatric Hydrocephalus.docx | Pediatric hydrocephalus | pediatric-hydrocephalus | treatments | prose, ~999w | |
| publish/What we deal with/Pediatric neurosurgery/Tethered Spinal Cord.docx | Tethered spinal cord (adults) | tethered-spinal-cord | treatments | prose + headings, ~611w | Adult-focused despite pediatric folder |
| publish/What we deal with/Spine/back pain.docx | Back pain | back-pain | treatments | — | **EMPTY FILE** (0 bytes, Aug 2016) |
| publish/What we deal with/Spine/Cauda equina syndrome.docx | Cauda equina syndrome | cauda-equina-syndrome | treatments | prose + headings, ~598w | |
| publish/What we deal with/Spine/Cervical Spondylotic Myelopathy.docx | Cervical spondylotic myelopathy | cervical-spondylotic-myelopathy | treatments | prose + headings, ~666w | |
| publish/What we deal with/Spine/Compression Fracture.docx | Compression fracture | compression-fracture | treatments | prose + headings, ~925w | |
| publish/What we deal with/Spine/Herniated Disc (Cervical, Thoracic, Lumbar).docx | Herniated disc (all regions) | herniated-disc | treatments | prose + headings, ~986w | |
| publish/What we deal with/Spine/Spina Bifida.docx | Spina bifida (adults) | spina-bifida | treatments | prose + headings, ~1418w | References "The Spine Hospital at the Neurological Institute of New York" (leak) |
| publish/What we deal with/Spine/Spinal Cord Injury.docx | Spinal cord injury | spinal-cord-injury | treatments | prose + headings, ~773w | |
| publish/What we deal with/Spine/Spinal Trauma.docx | Spinal trauma | spinal-trauma | treatments | prose + headings, ~563w | Overlaps Spinal Cord Injury |
| publish/What we deal with/Spine/Syringomyelia ("Syrinx").docx | Syringomyelia | syringomyelia | treatments | prose, ~413w | |

## 3. Procedures — `publish/كيف نعالج/` (AR) + `publish/How to deal with/` (EN) (37)

Near-complete AR/EN duplicate set; AR translations read like raw machine translation.
The AR "التدخل الموضعي لمعالجة الآلام" folder ≈ translation of EN "INTERVENTIONAL PAIN MANAGEMENT".

| draft path | topic | slug guess | collection | shape | notes |
|---|---|---|---|---|---|
| publish/كيف نعالج/اعتلال الحبل الشوكي حالات.docx | Surgical spinal cord disorder cases | spinal-cord-disorder-cases | cases | case narratives, ~871w | Sits in the procedures folder; **0 embedded images** |
| publish/كيف نعالج/الأشرطة اللاصقة الطبيِة.docx | Kinesiology taping (CureTape) | kinesiology-taping | services | prose, ~382w | AR twin of EN Kinesiology |
| publish/كيف نعالج/العمليات المنظارية.docx | Endoscopic (neuroendoscopic) surgery | endoscopic-surgery | services | prose, ~161w | Short overview |
| publish/كيف نعالج/القرص الاصطناعي.docx | Artificial disc replacement | artificial-disc-replacement | services | Q&A prose, ~352w | AR twin of EN artificial disc |
| publish/كيف نعالج/تثقيب الجمجمة.docx | Burr holes and craniotomy | burr-holes-craniotomy | services | Q&A prose, ~252w | AR twin; garbled MT opening |
| publish/كيف نعالج/تحرير الحبل الشوكي.docx | Spinal decompression | spinal-decompression | services | numbered list + prose, ~264w | AR twin of EN Spinal Decompression |
| publish/كيف نعالج/عملية تثبيث الفقرات واستئصال القرص المنزلق من الجهة الامامية.docx | ACDF | anterior-cervical-discectomy-fusion | services | Q&A prose, ~248w | AR twin of EN ACDF |
| publish/كيف نعالج/مايكرودسك.docx | Lumbar microdiscectomy | lumbar-microdiscectomy | services | prose, ~216w | AR twin of EN Lumbar Microdiscectomy |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/ozne for disc.docx | Ozone therapy for herniated disc | ozone-therapy-for-herniated-disc | services | prose + bullets, ~383w | **English** file inside AR folder; filename typo |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/ozone for joints.docx | Ozone therapy for joints | ozone-therapy-for-joints | services | prose + bullets, ~648w | **English** file inside AR folder |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/اعاقة العصب القحفي الخامس.docx | Gasserian ganglion block/RF | gasserian-ganglion-block | services | short prose, ~90w | AR twin of EN Gasserian ganglion block |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/اعاقة العصب الودي.docx | Lumbar sympathetic block | lumbar-sympathetic-block | services | prose + numbered indications, ~324w | AR twin of EN Sympathetic nerve block |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/التدخل الموضعي لمعالجة الآلام.docx | Interventional pain management (hub) | interventional-pain-management | services | intro + procedure lists, ~256w | AR twin of EN IPM overview |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/الترددات الراديوية.docx | Radiofrequency ablation (facet/arthritis) | radiofrequency-ablation | services | Q&A prose, ~882w | AR twin of EN Radiofrequency |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/العلاج بالأوزون.docx | Ozone therapy (history/effects) | ozone-therapy | services | prose + bullets, ~614w | AR twin of EN ozone |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/العلاج بالبونوكس.docx | Botox injections | botox-injection | services | short prose + indications, ~101w | AR twin of EN Botox injection |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/حقن خارج الجافية.docx | Epidural steroid injection | epidural-steroid-injection | services | short prose, ~119w | AR twin of EN ESI |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/قسطرة وتحفيزالحبل الشوكي.docx | Epidural adhesiolysis (Racz) | epidural-adhesiolysis | services | Q&A prose, ~524w | **Mislabeled** — title says "spinal cord stimulation catheter", body is adhesiolysis |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/كوي العصب عن طريق موجات راديوية.docx | RF neuroablation | radiofrequency-neuroablation | services | short prose, ~100w | AR twin of EN RF neuroblation |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/متلازمة ألمِ المفصل الوجهي المشترك.docx | Facet joint pain syndrome | facet-joint-pain-syndrome | treatments | short prose, ~122w | AR twin of EN Facet Joint pain syndrome |
| publish/How to deal with/Anterior Cervical Discectomy and Fusion.docx | ACDF | anterior-cervical-discectomy-fusion | services | Q&A prose, ~381w | EN master |
| publish/How to deal with/artificial disc.docx | Artificial disc replacement | artificial-disc-replacement | services | Q&A prose, ~368w | EN master |
| publish/How to deal with/Burr Holes and Craniotomy.docx | Burr holes and craniotomy | burr-holes-craniotomy | services | Q&A prose, ~298w | EN master |
| publish/How to deal with/Kinesiology.docx | Kinesiology / medical taping | kinesiology-taping | services | prose + headings, ~390w | EN master |
| publish/How to deal with/Lumbar Microdiscectomy.docx | Lumbar microdiscectomy | lumbar-microdiscectomy | services | Q&A prose, ~277w | EN master |
| publish/How to deal with/Spinal Decompression.docx | Spinal decompression | spinal-decompression | services | prose + bullets, ~357w | EN master |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Adhesiolysis.docx | Adhesiolysis (Racz) | adhesiolysis | services | Q&A prose, ~822w | EN master; AR twin mislabeled |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Botox injection.docx | Botox injections | botox-injection | services | short prose + indications, ~111w | EN master |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Epidural steroid injection.docx | Epidural steroid injection | epidural-steroid-injection | services | short prose, ~106w | EN master |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Facet Joint pain syndrome.docx | Facet joint pain syndrome | facet-joint-pain-syndrome | treatments | short prose, ~152w | Condition article ending in clinic's RF treatment |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Gasserian ganglion block.docx | Gasserian ganglion block/RF | gasserian-ganglion-block | services | short prose, ~116w | EN master |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/INTERVENTIONAL PAIN MANAGEMENT.docx | Interventional pain management (hub) | interventional-pain-management | services | intro + procedure lists, ~241w | EN master; mentions "Alumran Clinic" |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/ozone.docx | Ozone therapy | ozone-therapy | services | prose + bullets, ~801w | EN master; site already has services/ozone-therapy |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/prolotherapy.docx | Prolotherapy | prolotherapy | services | Q&A prose, ~1209w | **No AR twin in this folder** |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Radiofrequency neuroblation.docx | RF neuroablation | radiofrequency-neuroablation | services | short prose, ~116w | Filename typo "neuroblation"; overlaps EN Radiofrequency |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Radiofrequency.docx | Radiofrequency ablation/neurotomy | radiofrequency-ablation | services | Q&A prose + bullets, ~1067w | Second, longer RF draft — dedupe with neuroblation |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Sympathetic nerve block.docx | Sympathetic + celiac plexus block | sympathetic-nerve-block | services | prose + two procedure sections, ~517w | EN master; covers two blocks |

## 4. Case reports — `publish/حالات/` (AR) + `publish/Alimran cases/` (EN) (9)

These are almost certainly the source material for the four existing grouped `cases/` pages.
**The Arabic versions are substantially richer** (more cases, more images) than the English ones.
Word counts inflated by pandoc grid-table border tokens; real AR word counts ~20–30% lower.

| draft path | topic | slug guess | collection | shape | embedded images |
|---|---|---|---|---|---|
| publish/Alimran cases/paediatric cases.docx | Paediatric neurosurgery cases (hydrocephalus, meningoceles, Dandy-Walker) | paediatric | cases | intro prose + case paragraphs in grid tables with CT/MRI captions, ~1080w | 15 |
| publish/Alimran cases/Spine cases.docx | Spinal disorder cases (back pain, herniated disc, spinal tumors, fixation) | spine | cases | intro prose + case descriptions with MRI/x-ray captions, ~1204w | **1** (nearly imageless — Arabic twin holds all 26 scans) |
| publish/Alimran cases/Trauma cases.docx | Trauma cases (missile/bullet injuries, RTAs, shrapnel) | trauma | cases | intro + numbered cases with CT-caption tables, ~1620w | 24 |
| publish/Alimran cases/Tumor cases.docx | Brain tumor cases (pituitary, temporal, cerebellar) | tumor | cases | intro + cases with MRI/CT before/after captions, ~1935w | 30 |
| publish/Alimran cases/الجراحة العصبية للأطفال.docx | Paediatric neurosurgery (text-only) | pediatric-neurosurgery-cases | cases | plain prose only, no images, ~628w | 0 — TEXT-ONLY duplicate of the paediatric topic (same cases as the two image versions) |
| publish/حالات/حالات اصابة.docx | Trauma cases (AR, superset of EN) | trauma | cases | intro + numbered case vignettes in 3-column grid tables, ~3562w | **44** (most in the whole set) |
| publish/حالات/حالات اطفال.docx | Paediatric cases (AR) | paediatric | cases | intro + case vignettes with scan captions, ~2048w | 19 |
| publish/حالات/حالات اورام الدماغ.docx | Brain tumor cases (AR, superset of EN) | tumor | cases | intro + cases with MRI/CT before/after captions, ~2664w | 32 |
| publish/حالات/حالات للعمود الفقري.docx | Spinal disorder cases (AR, richer than EN) | spine | cases | intro + case vignettes in 3-column grid tables, ~2472w | 26 |

Image refs inside these files point to legacy paths (`E:\alumran2\neuro.net\*.jpg`); the images
themselves ARE embedded in the docx (counts above) — extraction will be needed at rebuild time.

Also case-report-like: `publish/ماذا نعالج/الدماغ/ورم الدماغ حالات.docx` (brain-tumor cases, 0 images)
and `publish/كيف نعالج/اعتلال الحبل الشوكي حالات.docx` (surgical spine cases, 0 images).

## 5. Physiotherapy + add — `publish/العلاج الطبيعي/`, `publish/physiotherapy/`, `publish/add/` (15)

| draft path | topic | slug guess | collection | shape | notes |
|---|---|---|---|---|---|
| publish/العلاج الطبيعي/العلاج الطبيعي.docx | Physiotherapy overview (AR) | physiotherapy | services | prose + headings + lists, ~546w | AR twin of physiotherapy1.docx |
| publish/العلاج الطبيعي/التحفيز الكهربائي.docx | Electrical stimulation TENS/IFT (AR) | electrical-stimulation | services | prose + benefits + contraindications, ~457w | AR twin |
| publish/العلاج الطبيعي/العلاج بالليزر.docx | **Cold** laser therapy (AR) | laser-therapy | services | prose + functions list, ~187w | AR cold-laser vs EN broader low-level laser |
| publish/العلاج الطبيعي/العلاج بالموجات القصيرة.docx | Shortwave therapy (AR) | shortwave-therapy | services | prose + contraindications, ~237w | Garbled MT: "نابض الخنزير" = "Pulsed Shortwave" |
| publish/العلاج الطبيعي/العلاج بالموجات فوق الصوتية.docx | Ultrasound therapy (AR) | ultrasound-therapy | services | prose + Q&A + benefits, ~313w | AR twin |
| publish/العلاج الطبيعي/الوقاية من الم الظهر.docx | Back pain prevention (AR) | back-pain-prevention | blog | advice sections + imperative bullets, ~723w | Patient-education essay; **no EN twin in this slice** |
| publish/physiotherapy/physiotherapy.docx | Physiotherapy overview | physiotherapy | services | prose + types list + benefits, ~183w | Shortest of 3 overlapping EN overview drafts |
| publish/physiotherapy/physiotherapy1.docx | What is physiotherapy? | physiotherapy | services | prose + Q&A + conditions list, ~473w | EN twin of AR العلاج الطبيعي.docx — pick one |
| publish/physiotherapy/Ultrasound Therapy.docx | Ultrasound therapy | ultrasound-therapy | services | prose + Q&A + precautions, ~470w | EN master |
| publish/physiotherapy/Laser Therapy.docx | Laser therapy | laser-therapy | services | prose + Q&A + indications, ~365w | EN master (broader than AR cold-laser) |
| publish/physiotherapy/Shortwave.docx | Pulsed shortwave therapy | shortwave-therapy | services | prose + headings + contraindications, ~379w | EN master |
| publish/physiotherapy/Electrical stimulation.docx | Electrical stimulation TENS/IFT | electrical-stimulation | services | prose + types + benefits + contraindications, ~586w | EN master |
| publish/add/add2/axial spinal stenosis.docx | Axial spinal stenosis | axial-spinal-stenosis | treatments | prose + bracketed captions + scraped link list, ~485w | 3 embedded images; **scraped from another spine-surgery site** — "BOOK ONLINE CONSULTATION", "Related by Category" junk to strip; Verbiest citations; NOT on the site yet |
| publish/add/add2/Kyphoplasty.docx | Balloon kyphoplasty | kyphoplasty | services | 2 paragraphs + indications list, ~92w | Very short; NOT in existing services/ |
| publish/add/add2/Postoperative Information.docx | Post-op info for minimally invasive lumbar spine surgery | postoperative-information | services | headed sections (week 1/2, 6-week) + bullets, ~814w | **Adapted from a UK clinic leaflet** — references "Mr. Knight", "the Foundation", GP surgery; needs localization review |

## 6. Events, CV, clinic blurbs — `publish/events/`, `publish/cv/`, loose files (19)

Every event report exists in both languages; the Arabic version is always the "- Copy" file
(or "RF -A"), even when it keeps an English filename.

| draft path | topic | slug guess | collection | shape | notes |
|---|---|---|---|---|---|
| publish/events/16th pain congress.docx | IASP 16th World Congress on Pain, Yokohama 2016 (pulsed-RF abstract) | iasp-16th-world-congress-on-pain-2016 | blog | 1 paragraph, ~50w | EN |
| publish/events/16th pain congress - Copy.docx | المؤتمر العالمي السادس عشر للآلام (يوكوهاما 2016) | iasp-16th-world-congress-on-pain-2016 | blog | 1 paragraph, ~27w | AR twin (Arabic text, English filename) |
| publish/events/baclofen pump.docx | Intrathecal baclofen pump for severe spasticity | intrathecal-baclofen-pump-spasticity | blog | 1 paragraph, ~39w | EN; announcement of ITB surgery at Al-Sadr Teaching Hospital |
| publish/events/baclofen pump - Copy.docx | مضخة الباكلوفين تحت الجلد (ITB) | intrathecal-baclofen-pump-spasticity | blog | 1 paragraph, ~43w | AR twin |
| publish/events/cervical rf.docx | Cervical disc prolapse treated with RF + ozone | cervical-disc-rf-ozone-treatment | blog | 1 paragraph, ~80w | EN; 5 companion photos cervical rf*.jpg |
| publish/events/cervical rf - Copy.docx | علاج انزلاق الفقرات العنقية بالراديوفركونسي والأوزون | cervical-disc-rf-ozone-treatment | blog | 3 short paras, ~150w | AR twin, slightly richer |
| publish/events/craniocervical fixation.docx | Craniocervical fixation (titanium) after RTA | craniocervical-fixation-case | blog | case report with follow-up, ~172w | EN; only event draft structured as a case report — could fit cases/ |
| publish/events/craniocervical fixation - Copy.docx | تثبيت قاعدة الجمجمة مع العمود الفقري العنقي | craniocervical-fixation-case | blog | 1 paragraph, ~45w | AR twin |
| publish/events/cranioplasty.docx | Titanium-mesh cranioplasty, 6-year-old child | pediatric-titanium-mesh-cranioplasty | blog | 1 paragraph, ~58w | EN; 4 companion photos cranioplasty*.jpg (no #2) |
| publish/events/cranioplasty - Copy.docx | ترقيع الجمجمة لطفل (6 سنوات) | pediatric-titanium-mesh-cranioplasty | blog | 1 paragraph, ~41w | AR twin |
| publish/events/Ozone for disc.docx | Ozone injections for lumbar disc prolapse | ozone-therapy-for-lumbar-disc | blog | ~4 paras, ~248w | EN; 4 companion photos Ozone for disc*.jpg (no #2) |
| publish/events/Ozone for disc - Copy.docx | غاز الأوزون لعلاج انزلاق الفقرات القطنية | ozone-therapy-for-lumbar-disc | blog | ~5 paras, ~210w | AR twin |
| publish/events/RF.docx | Radiofrequency ablation FAQ | radiofrequency-ablation | blog | Q&A prose + bullets, ~1067w | EN; substantive patient-education article (thermal vs pulsed); AR twin is "RF -A" |
| publish/events/RF -A.docx | الترددات الراديوية العلاجية لآلام التهاب المفاصل | radiofrequency-ablation | blog | Q&A prose + bullets, ~882w | AR twin |
| publish/cv/Dr.Hussein Imran Mousa CV - Copy.docx | CV — Dr. Hussein Imran Mousa | — | non-article | structured CV, ~1484w | EN; email neurosurgeon14@gmail.com; companion photo 201710102224201000.jpg |
| publish/cv/السيرة الذاتية عيادة العمران.docx | السيرة الذاتية (AR CV) | — | non-article | structured CV, ~1098w | AR twin; references alumran-clinic.com |
| publish/Mission and vision.docx | Mission, vision, values | — | non-article | short prose + 6 value bullets, ~207w | EN |
| publish/المهمة والرؤية.docx | الرؤية والرسالة والقيم | — | non-article | short prose + 6 value bullets, ~180w | AR twin, MT-flavored |
| publish/عيادة العمران.docx | Whole-clinic profile (conditions, devices, services) | — | non-article | grid tables + device/service lists, ~889w | AR; brochure text, mentions shockwave device + endoscopic spine surgery |

Event companion media (not drafts): `events/cervical rf*.jpg` ×5, `cranioplasty*.jpg` ×4,
`Ozone for disc*.jpg` ×4, `16th congress/*.png` ×3, `16th congress/IMG_3186.MOV` (~80 MB),
`IMG_3192.MOV` (~94 MB). None are referenced inside the extracted text.

## 7. `ABC articles/` — encyclopedia-style, bilingual single files (88)

Common pattern: **English encyclopedia-style prose first, Arabic translation appended** in the
same file; most condition articles end with a standardized "At Alimran Medical Center, we may
recommend…" block. All rows below are EN+AR unless noted.

| draft path | topic | slug guess | collection | shape | notes |
|---|---|---|---|---|---|
| ABC articles/Achilles tendinitis.docx | Achilles tendinitis | achilles-tendinitis | treatments | prose + headings + bullets, ~1043w | Also exists as site blog/achilles-tendinitis — collection call needed |
| ABC articles/Achondroplasia.docx | Achondroplasia | achondroplasia | treatments | prose + headings + bullets, ~1023w | |
| ABC articles/acoustic neuroma.docx | Acoustic neuroma | acoustic-neuroma | treatments | prose + headings + bullets, ~560w | |
| ABC articles/acromegaly.docx | Acromegaly | acromegaly | treatments | prose + headings + bullets, ~1635w | |
| ABC articles/Alzheimer's disease.docx | Alzheimer's disease | alzheimers-disease | treatments | prose + headings + bullets, ~1185w | |
| ABC articles/Ankylosing spondylitis.docx | Ankylosing spondylitis | ankylosing-spondylitis | treatments | prose + headings + bullets, ~1179w | |
| ABC articles/Anterior Cutaneous Nerve Entrapment Syndrome (ACNES).docx | ACNES | anterior-cutaneous-nerve-entrapment-syndrome-acnes | treatments | prose + headings, ~939w | References "the figure below" (no figure embedded) |
| ABC articles/Avascular necrosis.docx | Avascular necrosis | avascular-necrosis | treatments | prose + headings + bullets, ~766w | |
| ABC articles/Bell's palsy.docx | Bell's palsy | bells-palsy | treatments | prose + headings + bullets, ~1242w | |
| ABC articles/Brachial plexus injuries.docx | Brachial plexus injuries | brachial-plexus-injuries | treatments | prose + headings + bullets, ~1876w | "[Diagram of the brachial plexus…]" placeholders |
| ABC articles/Bursitis.docx | Bursitis | bursitis | treatments | prose + headings + bullets, ~793w | |
| ABC articles/Central Pain Syndrome.docx | Central pain syndrome | central-pain-syndrome | treatments | prose + headings + bullets, ~632w | Cites NINDS |
| ABC articles/Chronic pelvic pain in women.docx | Chronic pelvic pain in women | chronic-pelvic-pain-in-women | treatments | prose + headings + bullets, ~1568w | |
| ABC articles/Claudication.docx | Claudication | claudication | treatments | prose + headings + bullets, ~1334w | Duplicate of Intermittent cludic.docx |
| ABC articles/Cluster headaches.docx | Cluster headache | cluster-headache | treatments | prose + headings + bullets, ~1090w | |
| ABC articles/Depression.docx | Depression | depression | treatments | prose + headings + bullets, ~1551w | |
| ABC articles/De Quervain's tenosynovitis.docx | De Quervain's tenosynovitis | de-quervains-tenosynovitis | treatments | prose + headings + bullets, ~798w | |
| ABC articles/Diabetic neuropathies.docx | Diabetic neuropathy | diabetic-neuropathy | treatments | prose + headings + bullets, ~2089w | |
| ABC articles/Failed Back Surgery syndrome.docx | Failed back surgery syndrome | failed-back-surgery-syndrome | treatments | prose + numbered list + bullets, ~937w | |
| ABC articles/Flatfeet.docx | Flatfeet | flatfeet | treatments | prose + headings + bullets, ~810w | |
| ABC articles/Foot drop.docx | Foot drop | foot-drop | treatments | prose + headings + bullets, ~1207w | |
| ABC articles/Gout.docx | Gout | gout | treatments | prose + headings + bullets, ~1679w | |
| ABC articles/Intermittent cludic.docx | Intermittent claudication | intermittent-claudication | treatments | prose + bullets, ~587w | Filename typo; duplicate of Claudication.docx |
| ABC articles/Knee injuries and disorder.docx | Knee pain | knee-pain | treatments | prose + headings + bullets, ~2339w | Body is knee pain; overlaps body map/Knee pin.docx |
| ABC articles/Kyphosis.docx | Kyphosis | kyphosis | treatments | prose + headings + bullets, ~1151w | |
| ABC articles/Magnetic Field Therapy.docx | Magnetic field therapy | magnetic-field-therapy | services | prose + headings, ~845w | Technique → services; not on site |
| ABC articles/Meralgia Paresthetica.docx | Meralgia paresthetica | meralgia-paresthetica | treatments | prose + headings + bullets, ~818w | |
| ABC articles/Metatarsalgia.docx | Metatarsalgia | metatarsalgia | treatments | prose + headings + bullets, ~1161w | |
| ABC articles/minimally invasive spine surgery.docx | Minimally invasive spine surgery | minimally-invasive-spine-surgery | services | prose, ~145w | **EN-only; truncated** mid-word ("MINIMALLY INVAS") |
| ABC articles/Muscle cramp.docx | Muscle cramp | muscle-cramp | treatments | prose + headings + bullets, ~844w | |
| ABC articles/Muscle strains.docx | Muscle strains | muscle-strains | treatments | prose + headings + bullets, ~1084w | |
| ABC articles/Neuropathic Pain.docx | Neuropathic pain | neuropathic-pain | treatments | prose + headings + bullets, ~1407w | Cites ClevelandClinic.org |
| ABC articles/occipital neuralgia.docx | Occipital neuralgia | occipital-neuralgia | treatments | prose + headings + bullets, ~768w | |
| ABC articles/Osteomalacia.docx | Osteomalacia | osteomalacia | treatments | prose + headings + bullets, ~1273w | |
| ABC articles/pituitary tumors.docx | Pituitary tumors | pituitary-tumors | treatments | prose + headings + bullets, ~3059w | |
| ABC articles/Polymyalgia rheumatica.docx | Polymyalgia rheumatica | polymyalgia-rheumatica | treatments | prose + headings + bullets, ~950w | |
| ABC articles/Raynaud's Disease.docx | Raynaud's disease | raynauds-disease | treatments | prose + headings + bullets, ~1893w | |
| ABC articles/Restless Leg Syndrome.docx | Restless legs syndrome | restless-legs-syndrome | treatments | prose + headed sections, ~1445w | Textbook-style voice |
| ABC articles/Rotator cuff injury.docx | Rotator cuff injury | rotator-cuff-injury | treatments | prose + headings + bullets, ~955w | |
| ABC articles/Sacroiliitis.docx | Sacroiliitis | sacroiliitis | treatments | prose + headings + bullets, ~745w | |
| ABC articles/Sciatica.docx | Sciatica | sciatica | treatments | prose + headings + bullets, ~1113w | |
| ABC articles/Scoliosis.docx | Scoliosis | scoliosis | treatments | prose + headings + bullets, ~1741w | |
| ABC articles/Sickle cell anemia.docx | Sickle cell anemia | sickle-cell-anemia | treatments | prose + headings + bullets, ~2121w | |
| ABC articles/sleep disorder.docx | Primary sleep disorders (dyssomnias) | primary-sleep-disorders-dyssomnias | treatments | prose + headings + bullets, ~1143w | |
| ABC articles/Spasmodic Torticollis.docx | Cervical dystonia (spasmodic torticollis) | spasmodic-torticollis | treatments | prose + headings + bullets, ~712w | |
| ABC articles/spasticity.docx | Spasticity | spasticity | treatments | prose + headings + bullets, ~1224w | |
| ABC articles/Spinal Injections and Nerve Blocks Treat Neck and Back Pain.docx | Spinal injections / nerve blocks | spinal-injections-and-nerve-blocks | services | prose + headings + bullets, ~1815w | Not on site as such; see services/steroid-injection |
| ABC articles/Sprains.docx | Sprains | sprains | treatments | prose + headings + bullets, ~1061w | |
| ABC articles/Steroid injection for joint pain.docx | Steroid injection for joint pain | steroid-injection | services | prose + headings + bullets, ~901w | Overlaps steroid injection.docx |
| ABC articles/steroid injection.docx | Corticosteroid injections | steroid-injection | services | prose + bullets, ~941w | "[Nurse Administers Injection]" placeholder; overlaps file above |
| ABC articles/stroke.docx | Stroke | stroke | treatments | prose + headings + bullets, ~2343w | |
| ABC articles/Temporal arteritis.docx | Giant cell arteritis | temporal-arteritis | treatments | prose + headings + bullets, ~995w | |
| ABC articles/Temporomandibular Joint.docx | TMJ disorders | tmj | treatments | prose + headings + bullets, ~680w | |
| ABC articles/Tendinitis.docx | Tendinitis | tendinitis | treatments | prose + headings + bullets, ~853w | |
| ABC articles/tension headaches.docx | Tension headache | tension-headaches | treatments | prose + headings + bullets, ~833w | Exists in BOTH treatments/ and blog/ on site |
| ABC articles/Transient ischemic attack (TIA).docx | TIA | tia | treatments | prose + headings + bullets, ~1921w | |
| ABC articles/Transverse Myelitis.docx | Transverse myelitis | transverse-myelitis | treatments | prose + headings + bullets, ~2317w | |
| ABC articles/Trigger point injections.docx | Trigger point injections | trigger-point-injections | services | prose + headings + bullets, ~822w | Not on site |
| ABC articles/Vascular Pain.docx | Peripheral artery disease | peripheral-vascular-disease | treatments | prose + headings + bullets, ~1615w | Filename misleading — content is PAD |
| ABC articles/vertigo.docx | BPPV | bppv | treatments | prose + headings + bullets, ~919w | Filename says vertigo, content is BPPV |
| ABC articles/Vulvodynia.docx | Vulvodynia | vulvodynia | treatments | prose + headings + bullets, ~789w | |
| ABC articles/Whiplash.docx | Whiplash | whiplash | treatments | prose + headings + bullets, ~1266w | |
| ABC articles/why choise alimran center.docx | Why Choose Alimran Medical Center | why-choose-alimran-medical-center | non-article | 4 bullets, ~224w | Promo blurb; same text closes many other ABC drafts |
| ABC articles/notice.docx | — | — | — | — | **EMPTY FILE** (0 bytes) |
| ABC articles/body map/Ankle pain.docx | Ankle pain | ankle-pain | treatments | prose + causes list, ~376w | |
| ABC articles/body map/Arm pain.docx | Arm pain | arm-pain | treatments | prose + causes list, ~292w | |
| ABC articles/body map/Back pain.docx | Back pain | back-pain | treatments | prose + headings + bullets, ~728w | |
| ABC articles/body map/Elbow pain.docx | Elbow pain | elbow-pain | treatments | prose + causes list, ~337w | |
| ABC articles/body map/Foot pain.docx | Foot pain | foot-pain | treatments | prose + causes list, ~562w | |
| ABC articles/body map/headache.docx | Headache (overview) | headaches | treatments | prose + headings + bullets, ~1352w | Primary/secondary classification |
| ABC articles/body map/Hip pain.docx | Hip pain | hip-pain | treatments | prose + grouped bullets, ~465w | |
| ABC articles/body map/Knee pin.docx | Knee pain | knee-pain | treatments | prose + causes list, ~400w | Filename typo; duplicates Knee injuries and disorder.docx |
| ABC articles/body map/Leg pain.docx | Leg pain | leg-pain | treatments | prose + causes list, ~702w | |
| ABC articles/body map/Muscle pain.docx | Muscle pain | muscle-pain | treatments | prose + causes list, ~448w | |
| ABC articles/body map/neck pin.docx | Neck pain | neck-pain | treatments | prose + headings + bullets, ~785w | Filename typo |
| ABC articles/body map/Numbness.docx | Numbness | numbness | treatments | prose + grouped bullets, ~726w | |
| ABC articles/body map/Pelvic pain.docx | Pelvic pain | pelvic-pain | treatments | prose + grouped bullets, ~719w | |
| ABC articles/body map/Radiofrequency spine.docx | RF ablation for spine/SI pain | radiofrequency-ablation | services | prose + bullets, ~218w | **EN-only** (only body-map draft without AR) |
| ABC articles/body map/Shoulder pain.docx | Shoulder pain | shoulder-pain | treatments | prose + causes list, ~350w | |
| ABC articles/body map/tble.docx | EN↔AR condition-name glossary | — | non-article | grid table, ~638w | Not an article; "Brain tumor" row duplicated |
| ABC articles/body map/Wrist pain.docx | Wrist pain | wrist-pain | treatments | prose + headings + bullets, ~969w | |
| ABC articles/surgery/Anterior Cervical Discectomy and Fusion.docx | ACDF | anterior-cervical-discectomy-and-fusion | services | prose + bullets, ~758w | Second ACDF draft (also in publish/) — pick one |
| ABC articles/surgery/Deep brain stimulation.docx | Deep brain stimulation (DBS) | deep-brain-stimulation | services | prose + bullets, ~560w | "Indictions" typo heading; overlaps services/brain-stimulation |
| ABC articles/surgery/Lumbar Spinal Fusion Surgery.docx | Lumbar spinal fusion | lumbar-spinal-fusion | services | prose + bullets, ~664w | |
| ABC articles/surgery/Rhizotomy.docx | Selective dorsal rhizotomy | selective-dorsal-rhizotomy | services | prose, ~203w | Short |
| ABC articles/surgery/RIWOspine.docx | RIWOspine full-endoscopic spine surgery | endoscopic-spine-surgery (or riwospine) | services | prose + headings + bullets, ~2979w | Longest surgery draft; external riwospine.com image URLs |
| ABC articles/surgery/Stereotactic radiosurgery.docx | Stereotactic radiosurgery | stereotactic-radiosurgery | services | prose + bullets, ~1987w | |
| ABC articles/surgery/transsphenoidal surgery.docx | Transsphenoidal surgery | transsphenoidal-surgery | services | 2 short paragraphs, ~57w | Very short stub |

## 8. `Rehablitation medicine update/` — rehab essays (29)

Key discovery: **23 of 27 non-empty drafts are bilingual** (EN prose first, AR appended).
Exceptions: `pelvic floor rehabilitation.docx` (EN only), `Pulmonary rehabilitation.docx` (EN only),
`red ear syndromw.docx` (EN only).

| draft path | topic | slug guess | collection | shape | notes |
|---|---|---|---|---|---|
| Rehablitation medicine update/Brachial Plexus Injury.docx | Brachial plexus injury | brachial-plexus-injury | treatments | prose + Q&A headings, ~1875w | Overlaps treatments/brachial-plexus-injuries (plural) |
| Rehablitation medicine update/Cerebral palsy.docx | Cerebral palsy | cerebral-palsy | treatments | prose + Q&A headings, ~1073w | |
| Rehablitation medicine update/cruciate ligament.docx | ACL injury | anterior-cruciate-ligament-injury | treatments | prose + Q&A headings, ~864w | Rehab-focused |
| Rehablitation medicine update/geriatric.docx | Geriatric rehabilitation | geriatric-rehabilitation | services | prose + Q&A headings, ~2251w | |
| Rehablitation medicine update/Hemiplegia cva.docx | Hemiplegia (stroke) | hemiplegia-stroke | treatments | prose + Q&A headings, ~890w | Overlaps treatments/stroke |
| Rehablitation medicine update/Hydrocephalus.docx | Hydrocephalus (adult + pediatric) | hydrocephalus | treatments | prose + Q&A headings, ~1452w | Overlaps NPH + pediatric-hydrocephalus pages |
| Rehablitation medicine update/Meniscal Tear.docx | Meniscal tear | meniscal-tear | treatments | prose + Q&A headings, ~985w | |
| Rehablitation medicine update/MS.docx | Multiple sclerosis | multiple-sclerosis | treatments | prose + Q&A headings, ~1997w | |
| Rehablitation medicine update/Muscle disease.docx | Muscle diseases / muscular dystrophy | muscular-dystrophy | treatments | prose + Q&A + bullets, ~1349w | |
| Rehablitation medicine update/Orthopedic Rehabilitation.docx | Orthopedic rehabilitation | orthopedic-rehabilitation | services | prose + Q&A headings, ~1464w | |
| Rehablitation medicine update/parkinson.docx | Parkinson's disease | parkinsons-disease | treatments | prose + Q&A headings, ~2066w | |
| Rehablitation medicine update/Pediatric Rehabilitation.docx | Pediatric rehabilitation | pediatric-rehabilitation | services | prose + Q&A headings, ~994w | Heading repeated 6× (formatting artifact) |
| Rehablitation medicine update/pelvic floor rehabilitation.docx | Pelvic floor rehabilitation | pelvic-floor-rehabilitation | services | prose + bullets, ~545w | **EN only** |
| Rehablitation medicine update/Physical Therapy.docx | Physical therapy / physiotherapy | physical-therapy | services | prose + Q&A + method list, ~1030w | Overlaps services/physiotherapy |
| Rehablitation medicine update/Pulmonary rehabilitation.docx | Pulmonary rehabilitation | pulmonary-rehabilitation | services | prose + Q&A headings, ~798w | **EN only** |
| Rehablitation medicine update/red ear syndromw.docx | Red ear syndrome | red-ear-syndrome | treatments | prose, ~271w | **EN only; textbook excerpt** ("Box 14-1", "Figure 14-1") — copyright concern; filename typo |
| Rehablitation medicine update/Robotic Rehabilitation.docx | Robotic rehabilitation | robotic-rehabilitation | services | prose + headings + bullets, ~1280w | |
| Rehablitation medicine update/scoliosis.docx | Scoliosis | scoliosis | treatments | prose + Q&A headings, ~2328w | |
| Rehablitation medicine update/spina bifida.docx | Spina bifida | spina-bifida | treatments | prose + Q&A headings, ~1932w | |
| Rehablitation medicine update/Spinal Muscular Atrophy (SMA).docx | Spinal muscular atrophy | spinal-muscular-atrophy | treatments | prose + Q&A headings, ~2415w | |
| Rehablitation medicine update/spine rehab.docx | Spinal cord injury rehabilitation | spinal-cord-injury | treatments | prose + Q&A headings, ~2380w | Title says "spine rehab", content is SCI |
| Rehablitation medicine update/functional neurosurgery/brain lesion.docx | RF brain lesioning | radiofrequency-brain-lesioning | services | prose + bullets, ~1089w | For Parkinson's, dystonia, tremor, OCD; fits radiofrequency service |
| Rehablitation medicine update/functional neurosurgery/dystonia.docx | Dystonia | dystonia | treatments | prose + headings + bullets, ~1394w | Mayo-style |
| Rehablitation medicine update/functional neurosurgery/essential tremor.docx | Essential tremor | essential-tremor | treatments | prose + headings + bullets, ~1803w | Mayo-style |
| Rehablitation medicine update/functional neurosurgery/Obsessive-compulsive disorder (OCD).docx | OCD | obsessive-compulsive-disorder-ocd | treatments | prose + headings + bullets, ~2053w | Psychiatric condition — could be blog |
| Rehablitation medicine update/functional neurosurgery/Stuttering.docx | Stuttering | stuttering | treatments | prose + headings + bullets, ~1567w | Mayo-style |
| Rehablitation medicine update/functional neurosurgery/Tourette (too-RET) syndrome.docx | Tourette syndrome | tourette-syndrome | treatments | prose + headings + bullets, ~1889w | Filename contains pronunciation |
| Rehablitation medicine update/functional neurosurgery/tic.docx | Tic | tic | treatments | — | **EMPTY FILE** (0 bytes) — topic covered by Tourette draft |

---

## Cross-cutting observations (for review before STEP 2)

1. **Ozone content is everywhere in the drafts** (`العلاج بالأوزون`, EN `ozone.docx`,
   `ozne for disc`, `ozone for joints`, event reports "Ozone for disc", "cervical rf").
   SKILL.md Rule 4: ozone-therapy claims were deliberately pulled from the site after clinical
   review. Per the brief: **flag, do not reintroduce.**
2. **Third-party text leaks** in several EN publish/ drafts (Parkinson's + Osteoarthritis mention
   the "Archive(s)" physiotherapy clinic; NPH mentions Columbia; Spina Bifida mentions The Spine
   Hospital at the Neurological Institute of New York; Postoperative Information references
   "Mr. Knight"/"the Foundation"). These read as copied handouts — fact-check carefully.
3. **Crawler/scrape artefacts**: `axial spinal stenosis.docx` is scraped from a spine-surgery
   website (book-online junk, "Related by Category" links); `red ear syndrome.docx` is a textbook
   excerpt (copyright concern).
4. **Duplicates needing a "pick one" decision**: brain tumor general + حالات; SCI vs spinal
   trauma (both AR & EN); RF long vs RF-neuroblation short (AR & EN); Claudication vs
   Intermittent cludic; knee pain ×3; steroid injection ×2; physiotherapy overview ×3 (AR+2 EN);
   ACDF ×2 (publish + ABC); paediatric cases ×3 (EN image, AR image, AR text-only).
5. **Filename↔content mismatches** (flag, don't silently "fix" the article): "التهاب العصب الثالث"
   = 5th nerve; "Cerebrospinal Fluid Leaks" = cerebrovascular disease; "ورم دموي تحت الجافية" =
   hematoma not tumor; "vertigo" = BPPV; "Vascular Pain" = PAD; "قسطرة وتحفيزالحبل الشوكي" =
   adhesiolysis; "تكهف النخاع (القناة السمعية)" wrong parenthetical.
6. **Stubs** (no or near-no body): AR وربي العصبي, EN Intercostal Neuralgia (captions only), EN
   myofascial pain / neck pain / Sciatica (image ref only), AR باكنسن/هشاشة العظام/سوفان (very short),
   transsphenoidal surgery (2 paragraphs), Kyphoplasty (92 words), tic.docx (empty).
7. **Broken image references**: many condition drafts reference `E:\اعلام عيادة العمران\gallary\
   clints\*.jpg` / `E:\alumran2\neuro.net\*.jpg` — images never embedded; the case-report docx
   files DO have embedded images (counts in section 4) which will need extraction at rebuild time.
8. **Language gaps** (draft exists in only one language — STEP 6 applies):
   - AR-only (no EN twin found): الوقاية من الم الظهر (back pain prevention).
   - EN-only (no AR twin): prolotherapy, ozne for disc, ozone for joints, minimally invasive
     spine surgery (also truncated), body map/Radiofrequency spine, pelvic floor rehabilitation,
     Pulmonary rehabilitation, red ear syndrome.
   - Site-language gaps are recorded per-article in STEP 2.
9. **Not on the site at all** (candidates for pending-articles.md after STEP 2 confirms):
   body-map pain locations (ankle, arm, elbow, foot, hip, leg, muscle, numbness, pelvic,
   shoulder, wrist, muscle…), Magnetic Field Therapy, Trigger point injections, Spinal injections
   & nerve blocks (distinct from steroid-injection page), Kyphoplasty, axial spinal stenosis,
   minimally invasive spine surgery, RIWOspine, DBS, stereotactic radiosurgery, transsphenoidal,
   lumbar spinal fusion, rhizotomy, prolotherapy, adhesiolysis, gasserian ganglion block,
   sympathetic nerve block, kinesiology taping, endoscopic surgery overview, burr holes/
   craniotomy, artificial disc, ACDF, microdiscectomy, spinal decompression, all event reports,
   rehab-folder essays (geriatric/orthopedic/pediatric/pelvic floor/pulmonary/robotic rehab,
   ACL, meniscal tear, SMA, muscular dystrophy, dystonia, essential tremor, OCD, stuttering,
   Tourette, RF brain lesioning, red ear syndrome, hydrocephalus general), Mission & Vision,
   CV, clinic profile, why-choose-Alimran blurb.

## Non-draft files (ignored for content; listed for completeness)

- **Word lock/temp junk (safe to ignore/delete):** ~20 `~$*.docx` locks, 4 `~WRL*.tmp` files,
  orphan lock `~$eep deprivation.docx` (no matching draft — a renamed/deleted "sleep deprivation"
  draft), locks for non-existent "Sports Injuries.docx" in both physiotherapy folders.
- **`drafts/LOST.DIR/`** — flash-drive recovery junk, not inventoried.
- **Images/videos:** `publish/events/*.jpg` (13 photos), `publish/events/16th congress/*.png` (3)
  + 2 × ~90 MB .MOV; `publish/cv/201710102224201000.jpg` (doctor photo); `publish/كارت.jpg`;
  `publish/مجمع العمران الطبي.jpg` ×2 (clinic building). None referenced from extracted text.

---


---


---

## STEP 2 — Draft-to-article resolution


### 1. `publish/ماذا نعالج/` — Arabic condition drafts
| draft path | resolution | method | matched locales | notes |
|---|---|---|---|---|
| publish/ماذا نعالج/الآلام/اضطرابات الأعصاب الطرفية.docx | treatments/peripheral-nerve-disorders | fuzzy | en+ar | site slug uses 'disorders' |
| publish/ماذا نعالج/الآلام/الألم العصبي التالي.docx | MISSING | none | n/a |  |
| publish/ماذا نعالج/الآلام/الاصابات الرياضية.docx | treatments/sports-injuries | exact | en+ar |  |
| publish/ماذا نعالج/الآلام/التهاب العصب الثالث.docx | treatments/trigeminal-neuralgia | exact | en+ar |  |
| publish/ماذا نعالج/الآلام/التهاب مفاصل الورك.docx | treatments/arthritis-of-the-hip | exact | en+ar |  |
| publish/ماذا نعالج/الآلام/الم اسفل الظهر.docx | treatments/back-pain | exact | en+ar |  |
| publish/ماذا نعالج/الآلام/الم الرقبة.docx | treatments/neck-pain | exact | en+ar |  |
| publish/ماذا نعالج/الآلام/الم العضل الليفي.docx | treatments/myofascial-pain | exact | en+ar |  |
| publish/ماذا نعالج/الآلام/امراض الشقيقه.docx | treatments/migraine | exact | en+ar |  |
| publish/ماذا نعالج/الآلام/تجمد الكتف (الكتف المتجمد).docx | treatments/frozen-shoulder | exact | en+ar |  |
| publish/ماذا نعالج/الآلام/سوفان.docx | services/ozone-therapy/osteoarthritis | exact | en+ar | nested under ozone-therapy |
| publish/ماذا نعالج/الآلام/متلازمة النفق الرسغي.docx | treatments/carpal-tunnel-syndrome | exact | en+ar |  |
| publish/ماذا نعالج/الآلام/مرفق التنس.docx | treatments/tennis-elbow | exact | en+ar |  |
| publish/ماذا نعالج/الآلام/نتوء الكعب.docx | treatments/heel-spur | exact | en+ar |  |
| publish/ماذا نعالج/الآلام/هشاشة العظام.docx | treatments/osteoporosis-pain | exact | en+ar |  |
| publish/ماذا نعالج/الآلام/وربي العصبي.docx | treatments/intercostal-neuralgia | exact | en+ar |  |
| publish/ماذا نعالج/الامراض الحركية/الصرع والنوبات.docx | treatments/epilepsy-seizures | exact | en+ar |  |
| publish/ماذا نعالج/الامراض الحركية/باكنسن.docx | treatments/parkinsons-disease | exact | en+ar |  |
| publish/ماذا نعالج/الامراض الحركية/تشنج شق الوجه.docx | treatments/hemifacial-spasm | exact | en+ar |  |
| publish/ماذا نعالج/الامراض العصبية للأطفال/الحبل الشوكي المربوط.docx | treatments/tethered-spinal-cord | exact | en+ar |  |
| publish/ماذا نعالج/الامراض العصبية للأطفال/الشلل الدماغي.docx | treatments/cerebral-palsy | exact | en+ar |  |
| publish/ماذا نعالج/الامراض العصبية للأطفال/تعظم الدروز الباكر.docx | treatments/craniosynostosis | exact | en+ar |  |
| publish/ماذا نعالج/الامراض العصبية للأطفال/طب الأطفال استسقاء الرأس.docx | treatments/pediatric-hydrocephalus | exact | en+ar |  |
| publish/ماذا نعالج/الدماغ/إصابة الرأس.docx | treatments/head-injury | exact | en+ar |  |
| publish/ماذا نعالج/الدماغ/استسقاء الرأس الضغط العادي  (NPH).docx | treatments/normal-pressure-hydrocephalus | exact | en+ar |  |
| publish/ماذا نعالج/الدماغ/السكتة النزفية.docx | treatments/hemorrhagic-stroke | exact | en+ar |  |
| publish/ماذا نعالج/الدماغ/خراج الدماغ.docx | treatments/brain-abscess | exact | en+ar |  |
| publish/ماذا نعالج/الدماغ/عيارات نارية في الجمجمة.docx | treatments/cranial-gunshot-wounds | exact | en+ar |  |
| publish/ماذا نعالج/الدماغ/ورم الدماغ حالات.docx | cases/tumor | fuzzy | en+ar | grouped tumor cases page |
| publish/ماذا نعالج/الدماغ/ورم دموي تحت الجافية.docx | treatments/subdural-hematoma | exact | en+ar |  |
| publish/ماذا نعالج/الدماغ/ورم في المخ.docx | treatments/brain-tumor | exact | en+ar |  |
| publish/ماذا نعالج/العمود الفقري/اصابة الحبل الشوكي.docx | treatments/spinal-cord-injury | exact | en+ar |  |
| publish/ماذا نعالج/العمود الفقري/الاعتلال النخاعي الفقاري العنقي.docx | treatments/cervical-spondylotic-myelopathy | exact | en+ar |  |
| publish/ماذا نعالج/العمود الفقري/التهاب المفصل العجزي الحرقفي.docx | treatments/sacroiliitis | exact | en+ar |  |
| publish/ماذا نعالج/العمود الفقري/السنسنة المشقوقة.docx | treatments/spina-bifida | exact | en+ar |  |
| publish/ماذا نعالج/العمود الفقري/تكهف النخاع ( القناة السمعية).docx | treatments/syringomyelia | exact | en+ar |  |
| publish/ماذا نعالج/العمود الفقري/صدمة العمود الفقري.docx | treatments/spinal-trauma | exact | en+ar |  |
| publish/ماذا نعالج/العمود الفقري/ضغط الكسر.docx | treatments/compression-fracture | exact | en+ar |  |
| publish/ماذا نعالج/العمود الفقري/فتق القرص (عنق الرحم، الصدر، أسفل الظهر).docx | treatments/herniated-disc | exact | en+ar |  |
| publish/ماذا نعالج/العمود الفقري/متلازمة ذيل الفرس.docx | treatments/cauda-equina-syndrome | exact | en+ar |  |


### 2. `publish/What we deal with/` — English condition drafts
| draft path | resolution | method | matched locales | notes |
|---|---|---|---|---|
| publish/What we deal with/Brain/brain abscess.docx | treatments/brain-abscess | exact | en+ar |  |
| publish/What we deal with/Brain/brain tumor.docx | treatments/brain-tumor | exact | en+ar |  |
| publish/What we deal with/Brain/Cerebrospinal Fluid Leaks.docx | treatments/cerebrovascular-disease | exact | en+ar |  |
| publish/What we deal with/Brain/Cranial Gunshot Wounds.docx | treatments/cranial-gunshot-wounds | exact | en+ar |  |
| publish/What we deal with/Brain/Epilepsy & Seizures.docx | treatments/epilepsy-seizures | exact | en+ar |  |
| publish/What we deal with/Brain/head injury.docx | treatments/head-injury | exact | en+ar |  |
| publish/What we deal with/Brain/Hemorrhagic Stroke.docx | treatments/hemorrhagic-stroke | exact | en+ar |  |
| publish/What we deal with/Brain/Normal Pressure Hydrocephalus (NPH).docx | treatments/normal-pressure-hydrocephalus | exact | en+ar |  |
| publish/What we deal with/Brain/Subdural Hematoma.docx | treatments/subdural-hematoma | exact | en+ar |  |
| publish/What we deal with/Motor disorders/Hemifacial Spasm.docx | treatments/hemifacial-spasm | exact | en+ar |  |
| publish/What we deal with/Motor disorders/Parkinson's Disease.docx | treatments/parkinsons-disease | exact | en+ar |  |
| publish/What we deal with/Pain/Carpal Tunnel Syndrome.docx | treatments/carpal-tunnel-syndrome | exact | en+ar |  |
| publish/What we deal with/Pain/Frozen Shoulder.docx | treatments/frozen-shoulder | exact | en+ar |  |
| publish/What we deal with/Pain/heel spur.docx | treatments/heel-spur | exact | en+ar |  |
| publish/What we deal with/Pain/Hip artheritis.docx | treatments/arthritis-of-the-hip | exact | en+ar |  |
| publish/What we deal with/Pain/Intercostal Neuralgia.docx | treatments/intercostal-neuralgia | exact | en+ar |  |
| publish/What we deal with/Pain/Migrain.docx | treatments/migraine | exact | en+ar |  |
| publish/What we deal with/Pain/myofascial pain.docx | treatments/myofascial-pain | exact | en+ar |  |
| publish/What we deal with/Pain/neck pain.docx | treatments/neck-pain | exact | en+ar |  |
| publish/What we deal with/Pain/Osteoarthritis.docx | services/ozone-therapy/osteoarthritis | exact | en+ar | nested under ozone-therapy |
| publish/What we deal with/Pain/Osteoporosis.docx | blog/osteoporosis | fuzzy | en+ar | matched in blog instead of treatments |
| publish/What we deal with/Pain/Peripheral Nerve Disorders.docx | treatments/peripheral-nerve-disorders | exact | en+ar |  |
| publish/What we deal with/Pain/Postherpetic Neuralgia.docx | MISSING | none | n/a |  |
| publish/What we deal with/Pain/sacroilitis.docx | treatments/sacroiliitis | exact | en+ar |  |
| publish/What we deal with/Pain/Sciatica.docx | treatments/sciatica | exact | en+ar |  |
| publish/What we deal with/Pain/Sports Injuries.docx | treatments/sports-injuries | exact | en+ar |  |
| publish/What we deal with/Pain/Tennis elbow.docx | treatments/tennis-elbow | exact | en+ar |  |
| publish/What we deal with/Pain/Trigeminal Neuralgia.docx | treatments/trigeminal-neuralgia | exact | en+ar |  |
| publish/What we deal with/Pediatric neurosurgery/Cerebral Palsy.docx | treatments/cerebral-palsy | exact | en+ar |  |
| publish/What we deal with/Pediatric neurosurgery/craniosynostosis.docx | treatments/craniosynostosis | exact | en+ar |  |
| publish/What we deal with/Pediatric neurosurgery/Pediatric Hydrocephalus.docx | treatments/pediatric-hydrocephalus | exact | en+ar |  |
| publish/What we deal with/Pediatric neurosurgery/Tethered Spinal Cord.docx | treatments/tethered-spinal-cord | exact | en+ar |  |
| publish/What we deal with/Spine/back pain.docx | treatments/back-pain | exact | en+ar |  |
| publish/What we deal with/Spine/Cauda equina syndrome.docx | treatments/cauda-equina-syndrome | exact | en+ar |  |
| publish/What we deal with/Spine/Cervical Spondylotic Myelopathy.docx | treatments/cervical-spondylotic-myelopathy | exact | en+ar |  |
| publish/What we deal with/Spine/Compression Fracture.docx | treatments/compression-fracture | exact | en+ar |  |
| publish/What we deal with/Spine/Herniated Disc (Cervical, Thoracic, Lumbar).docx | treatments/herniated-disc | exact | en+ar |  |
| publish/What we deal with/Spine/Spina Bifida.docx | treatments/spina-bifida | exact | en+ar |  |
| publish/What we deal with/Spine/Spinal Cord Injury.docx | treatments/spinal-cord-injury | exact | en+ar |  |
| publish/What we deal with/Spine/Spinal Trauma.docx | treatments/spinal-trauma | exact | en+ar |  |
| publish/What we deal with/Spine/Syringomyelia ("Syrinx").docx | treatments/syringomyelia | exact | en+ar |  |


### 3. Procedures — `publish/كيف نعالج/` + `publish/How to deal with/`
| draft path | resolution | method | matched locales | notes |
|---|---|---|---|---|
| publish/كيف نعالج/اعتلال الحبل الشوكي حالات.docx | cases/spine | fuzzy | en+ar | surgical spine-case vignettes |
| publish/كيف نعالج/الأشرطة اللاصقة الطبيِة.docx | services/physiotherapy/kinesiology | fuzzy | en+ar | site slug is kinesiology |
| publish/كيف نعالج/العمليات المنظارية.docx | services/surgery/endoscopic-spine | fuzzy | en+ar | site page is endoscopic-spine |
| publish/كيف نعالج/القرص الاصطناعي.docx | services/surgery/artificial-disc | fuzzy | en+ar | site slug is artificial-disc |
| publish/كيف نعالج/تثقيب الجمجمة.docx | services/surgery/burr-holes-craniotomy | exact | en+ar | nested under surgery |
| publish/كيف نعالج/تحرير الحبل الشوكي.docx | services/surgery/spinal-decompression | exact | en+ar | nested under surgery |
| publish/كيف نعالج/عملية تثبيث الفقرات واستئصال القرص المنزلق من الجهة الامامية.docx | services/surgery/anterior-cervical-discectomy-and-fusion | fuzzy | en+ar | site slug has 'and' |
| publish/كيف نعالج/مايكرودسك.docx | services/surgery/lumbar-microdiscectomy | exact | en+ar | nested under surgery |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/ozne for disc.docx | services/ozone-therapy/disc-prolapse | fuzzy | en+ar | ozone for lumbar disc |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/ozone for joints.docx | services/ozone-therapy/osteoarthritis | fuzzy | en+ar | ozone for joints → osteoarthritis page |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/اعاقة العصب القحفي الخامس.docx | services/steroid-injection/gasserian-ganglion-block | exact | en+ar | nested under steroid-injection |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/اعاقة العصب الودي.docx | services/steroid-injection/sympathetic-nerve-block | exact | en+ar | site slug is sympathetic-nerve-block |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/التدخل الموضعي لمعالجة الآلام.docx | services/pain-management/interventional-pain-management | exact | en+ar | nested under pain-management |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/الترددات الراديوية.docx | services/radiofrequency/radiofrequency | fuzzy | en+ar | site subpage radiofrequency |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/العلاج بالأوزون.docx | services/ozone-therapy | exact | ar only |  |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/العلاج بالبونوكس.docx | services/botox/botox-injection | exact | en+ar | nested under botox |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/حقن خارج الجافية.docx | services/steroid-injection/epidural-steroid-injection | exact | en+ar | nested under steroid-injection |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/قسطرة وتحفيزالحبل الشوكي.docx | services/radiofrequency/epidural-adhesiolysis | exact | en+ar | nested under radiofrequency |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/كوي العصب عن طريق موجات راديوية.docx | services/radiofrequency/radiofrequency-neuroblation | exact | en+ar | site keeps 'neuroblation' spelling |
| publish/كيف نعالج/التدخل الموضعي لمعالجة الآلام/متلازمة ألمِ المفصل الوجهي المشترك.docx | treatments/facet-joint-pain-syndrome | exact | en+ar |  |
| publish/How to deal with/Anterior Cervical Discectomy and Fusion.docx | services/surgery/anterior-cervical-discectomy-and-fusion | fuzzy | en+ar | site slug has 'and' |
| publish/How to deal with/artificial disc.docx | services/surgery/artificial-disc | fuzzy | en+ar | site slug is artificial-disc |
| publish/How to deal with/Burr Holes and Craniotomy.docx | services/surgery/burr-holes-craniotomy | exact | en+ar | nested under surgery |
| publish/How to deal with/Kinesiology.docx | services/physiotherapy/kinesiology | fuzzy | en+ar | site slug is kinesiology |
| publish/How to deal with/Lumbar Microdiscectomy.docx | services/surgery/lumbar-microdiscectomy | exact | en+ar | nested under surgery |
| publish/How to deal with/Spinal Decompression.docx | services/surgery/spinal-decompression | exact | en+ar | nested under surgery |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Adhesiolysis.docx | services/steroid-injection/adhesiolysis | exact | en+ar | nested under steroid-injection |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Botox injection.docx | services/botox/botox-injection | exact | en+ar | nested under botox |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Epidural steroid injection.docx | services/steroid-injection/epidural-steroid-injection | exact | en+ar | nested under steroid-injection |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Facet Joint pain syndrome.docx | treatments/facet-joint-pain-syndrome | exact | en+ar |  |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Gasserian ganglion block.docx | services/steroid-injection/gasserian-ganglion-block | exact | en+ar | nested under steroid-injection |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/INTERVENTIONAL PAIN MANAGEMENT.docx | services/pain-management/interventional-pain-management | exact | en+ar | nested under pain-management |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/ozone.docx | services/ozone-therapy | exact | ar only |  |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/prolotherapy.docx | services/regenerative-medicine/prolotherapy | exact | en+ar | nested under regenerative-medicine |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Radiofrequency neuroblation.docx | services/radiofrequency/radiofrequency-neuroblation | exact | en+ar | site keeps misspelling |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Radiofrequency.docx | services/radiofrequency/radiofrequency | fuzzy | en+ar | site subpage radiofrequency |
| publish/How to deal with/INTERVENTIONAL PAIN MANAGEMENT/Sympathetic nerve block.docx | services/steroid-injection/sympathetic-nerve-block | exact | en+ar | nested under steroid-injection |


### 4. Case reports — `publish/حالات/` + `publish/Alimran cases/`
| draft path | resolution | method | matched locales | notes |
|---|---|---|---|---|
| publish/Alimran cases/paediatric cases.docx | cases/paediatric | exact | en+ar |  |
| publish/Alimran cases/Spine cases.docx | cases/spine | exact | en+ar |  |
| publish/Alimran cases/Trauma cases.docx | cases/trauma | exact | en+ar |  |
| publish/Alimran cases/Tumor cases.docx | cases/tumor | exact | en+ar |  |
| publish/Alimran cases/الجراحة العصبية للأطفال.docx | cases/paediatric | exact | en+ar | text-only duplicate of paediatric topic |
| publish/حالات/حالات اصابة.docx | cases/trauma | exact | en+ar |  |
| publish/حالات/حالات اطفال.docx | cases/paediatric | exact | en+ar |  |
| publish/حالات/حالات اورام الدماغ.docx | cases/tumor | exact | en+ar |  |
| publish/حالات/حالات للعمود الفقري.docx | cases/spine | exact | en+ar |  |


### 5. Physiotherapy + add
| draft path | resolution | method | matched locales | notes |
|---|---|---|---|---|
| publish/العلاج الطبيعي/العلاج الطبيعي.docx | services/physiotherapy | exact | en+ar |  |
| publish/العلاج الطبيعي/التحفيز الكهربائي.docx | services/physiotherapy/electrical-stimulation | exact | en+ar | nested under physiotherapy |
| publish/العلاج الطبيعي/العلاج بالليزر.docx | services/physiotherapy/laser-therapy | exact | en+ar | nested under physiotherapy |
| publish/العلاج الطبيعي/العلاج بالموجات القصيرة.docx | services/physiotherapy/shortwave-therapy | exact | en+ar | nested under physiotherapy |
| publish/العلاج الطبيعي/العلاج بالموجات فوق الصوتية.docx | services/physiotherapy/ultrasound-therapy | exact | en+ar | nested under physiotherapy |
| publish/العلاج الطبيعي/الوقاية من الم الظهر.docx | MISSING | none | n/a |  |
| publish/physiotherapy/physiotherapy.docx | services/physiotherapy | exact | en+ar |  |
| publish/physiotherapy/physiotherapy1.docx | services/physiotherapy | exact | en+ar |  |
| publish/physiotherapy/Ultrasound Therapy.docx | services/physiotherapy/ultrasound-therapy | exact | en+ar | nested under physiotherapy |
| publish/physiotherapy/Laser Therapy.docx | services/physiotherapy/laser-therapy | exact | en+ar | nested under physiotherapy |
| publish/physiotherapy/Shortwave.docx | services/physiotherapy/shortwave-therapy | exact | en+ar | nested under physiotherapy |
| publish/physiotherapy/Electrical stimulation.docx | services/physiotherapy/electrical-stimulation | exact | en+ar | nested under physiotherapy |
| publish/add/add2/axial spinal stenosis.docx | MISSING | none | n/a |  |
| publish/add/add2/Kyphoplasty.docx | services/surgery/vertebroplasty | fuzzy | en+ar | no dedicated kyphoplasty page; section of vertebroplasty |
| publish/add/add2/Postoperative Information.docx | MISSING | none | n/a |  |


### 6. Events, CV, clinic blurbs
| draft path | resolution | method | matched locales | notes |
|---|---|---|---|---|
| publish/events/16th pain congress.docx | doctors/hussein-imran-mousa | fuzzy | en+ar | congress highlight on doctor profile |
| publish/events/16th pain congress - Copy.docx | doctors/hussein-imran-mousa | fuzzy | en+ar | AR twin |
| publish/events/baclofen pump.docx | blog/what-is-an-intrathecal-pump | fuzzy | en+ar | ITB pump topic |
| publish/events/baclofen pump - Copy.docx | blog/what-is-an-intrathecal-pump | fuzzy | en+ar | AR twin |
| publish/events/cervical rf.docx | services/radiofrequency/spine | fuzzy | en+ar | RF+ozone cervical disc |
| publish/events/cervical rf - Copy.docx | services/radiofrequency/spine | fuzzy | en+ar | AR twin |
| publish/events/craniocervical fixation.docx | cases/trauma | fuzzy | en+ar | RTA trauma case |
| publish/events/craniocervical fixation - Copy.docx | cases/trauma | fuzzy | en+ar | AR twin |
| publish/events/cranioplasty.docx | cases/paediatric | fuzzy | en+ar | 6-year-old paediatric case |
| publish/events/cranioplasty - Copy.docx | cases/paediatric | fuzzy | en+ar | AR twin |
| publish/events/Ozone for disc.docx | services/ozone-therapy/disc-prolapse | fuzzy | en+ar | ozone for lumbar disc |
| publish/events/Ozone for disc - Copy.docx | services/ozone-therapy/disc-prolapse | fuzzy | en+ar | AR twin |
| publish/events/RF.docx | blog/for-neurology-and-musculoskeletal-disorders | fuzzy | en+ar | RF FAQ article |
| publish/events/RF -A.docx | blog/for-neurology-and-musculoskeletal-disorders | fuzzy | en+ar | AR twin |
| publish/cv/Dr.Hussein Imran Mousa CV - Copy.docx | doctors/hussein-imran-mousa | fuzzy | en+ar | CV lives in doctor profile |
| publish/cv/السيرة الذاتية عيادة العمران.docx | doctors/hussein-imran-mousa | fuzzy | en+ar | AR CV twin |
| publish/Mission and vision.docx | about | fuzzy | en+ar | mission/vision sections on about page |
| publish/المهمة والرؤية.docx | about | fuzzy | en+ar | AR twin |
| publish/عيادة العمران.docx | pages/home | fuzzy | en+ar | whole-clinic profile matches home page |


### 7. `ABC articles/`
| draft path | resolution | method | matched locales | notes |
|---|---|---|---|---|
| ABC articles/Achilles tendinitis.docx | blog/achilles-tendinitis | fuzzy | en+ar | matched in blog instead of treatments |
| ABC articles/Achondroplasia.docx | treatments/achondroplasia | exact | en+ar |  |
| ABC articles/acoustic neuroma.docx | treatments/acoustic-neuroma | exact | en+ar |  |
| ABC articles/acromegaly.docx | treatments/acromegaly | exact | en+ar |  |
| ABC articles/Alzheimer's disease.docx | treatments/alzheimers-disease | exact | en+ar |  |
| ABC articles/Ankylosing spondylitis.docx | treatments/ankylosing-spondylitis | exact | en+ar |  |
| ABC articles/Anterior Cutaneous Nerve Entrapment Syndrome (ACNES).docx | treatments/anterior-cutaneous-nerve-entrapment-syndrome-acnes | exact | en+ar |  |
| ABC articles/Avascular necrosis.docx | treatments/avascular-necrosis | exact | en+ar |  |
| ABC articles/Bell's palsy.docx | treatments/bells-palsy | exact | en+ar |  |
| ABC articles/Brachial plexus injuries.docx | treatments/brachial-plexus-injuries | exact | en+ar |  |
| ABC articles/Bursitis.docx | treatments/bursitis | exact | en+ar |  |
| ABC articles/Central Pain Syndrome.docx | treatments/central-pain-syndrome | exact | en+ar |  |
| ABC articles/Chronic pelvic pain in women.docx | treatments/chronic-pelvic-pain-in-women | exact | en+ar |  |
| ABC articles/Claudication.docx | treatments/claudication | exact | en+ar |  |
| ABC articles/Cluster headaches.docx | treatments/cluster-headache | exact | en+ar |  |
| ABC articles/Depression.docx | treatments/depression | exact | en+ar |  |
| ABC articles/De Quervain's tenosynovitis.docx | treatments/de-quervains-tenosynovitis | exact | en+ar |  |
| ABC articles/Diabetic neuropathies.docx | treatments/diabetic-neuropathy | exact | en+ar |  |
| ABC articles/Failed Back Surgery syndrome.docx | treatments/failed-back-surgery-syndrome | exact | en+ar |  |
| ABC articles/Flatfeet.docx | treatments/flatfeet | exact | en+ar |  |
| ABC articles/Foot drop.docx | treatments/foot-drop | exact | en+ar |  |
| ABC articles/Gout.docx | treatments/gout | exact | en+ar |  |
| ABC articles/Intermittent cludic.docx | treatments/intermittent-claudication | exact | en+ar |  |
| ABC articles/Knee injuries and disorder.docx | treatments/knee-pain | exact | en+ar |  |
| ABC articles/Kyphosis.docx | treatments/kyphosis | exact | en+ar |  |
| ABC articles/Magnetic Field Therapy.docx | services/physiotherapy/magnetic-field-therapy | exact | en+ar | nested under physiotherapy |
| ABC articles/Meralgia Paresthetica.docx | treatments/meralgia-paresthetica | exact | en+ar |  |
| ABC articles/Metatarsalgia.docx | treatments/metatarsalgia | exact | en+ar |  |
| ABC articles/minimally invasive spine surgery.docx | MISSING | none | n/a | truncated draft; no dedicated MIS page |
| ABC articles/Muscle cramp.docx | treatments/muscle-cramp | exact | en+ar |  |
| ABC articles/Muscle strains.docx | treatments/muscle-strains | exact | en+ar |  |
| ABC articles/Neuropathic Pain.docx | treatments/neuropathic-pain | exact | en+ar |  |
| ABC articles/occipital neuralgia.docx | treatments/occipital-neuralgia | exact | en+ar |  |
| ABC articles/Osteomalacia.docx | treatments/osteomalacia | exact | en+ar |  |
| ABC articles/pituitary tumors.docx | treatments/pituitary-tumors | exact | en+ar |  |
| ABC articles/Polymyalgia rheumatica.docx | treatments/polymyalgia-rheumatica | exact | en+ar |  |
| ABC articles/Raynaud's Disease.docx | treatments/raynauds-disease | exact | en+ar |  |
| ABC articles/Restless Leg Syndrome.docx | treatments/restless-legs-syndrome | exact | en+ar |  |
| ABC articles/Rotator cuff injury.docx | treatments/rotator-cuff-injury | exact | en+ar |  |
| ABC articles/Sacroiliitis.docx | treatments/sacroiliitis | exact | en+ar |  |
| ABC articles/Sciatica.docx | treatments/sciatica | exact | en+ar |  |
| ABC articles/Scoliosis.docx | treatments/scoliosis | exact | en+ar |  |
| ABC articles/Sickle cell anemia.docx | treatments/sickle-cell-anemia | exact | en+ar |  |
| ABC articles/sleep disorder.docx | treatments/primary-sleep-disorders-dyssomnias | exact | en+ar |  |
| ABC articles/Spasmodic Torticollis.docx | treatments/spasmodic-torticollis | exact | en+ar |  |
| ABC articles/spasticity.docx | treatments/spasticity | exact | en+ar |  |
| ABC articles/Spinal Injections and Nerve Blocks Treat Neck and Back Pain.docx | services/steroid-injection/spinal | fuzzy | en+ar |  |
| ABC articles/Sprains.docx | treatments/sprains | exact | en+ar |  |
| ABC articles/Steroid injection for joint pain.docx | services/steroid-injection/joint-pain | exact | en+ar | nested under steroid-injection hub |
| ABC articles/steroid injection.docx | services/steroid-injection/steroid-injection | exact | en+ar | nested under steroid-injection hub |
| ABC articles/stroke.docx | treatments/stroke | exact | en+ar |  |
| ABC articles/Temporal arteritis.docx | treatments/temporal-arteritis | exact | en+ar |  |
| ABC articles/Temporomandibular Joint.docx | treatments/tmj | exact | en+ar |  |
| ABC articles/Tendinitis.docx | treatments/tendinitis | exact | en+ar |  |
| ABC articles/tension headaches.docx | treatments/tension-headaches, blog/tension-headaches | exact | en+ar | topic exists in both collections |
| ABC articles/Transient ischemic attack (TIA).docx | treatments/tia | exact | en+ar |  |
| ABC articles/Transverse Myelitis.docx | treatments/transverse-myelitis | exact | en+ar |  |
| ABC articles/Trigger point injections.docx | services/steroid-injection/trigger-point | fuzzy | en+ar |  |
| ABC articles/Vascular Pain.docx | treatments/peripheral-vascular-disease | fuzzy | en+ar | content is PAD despite filename |
| ABC articles/vertigo.docx | treatments/bppv | exact | en+ar |  |
| ABC articles/Vulvodynia.docx | treatments/vulvodynia | exact | en+ar |  |
| ABC articles/Whiplash.docx | treatments/whiplash | exact | en+ar |  |
| ABC articles/why choise alimran center.docx | MISSING | none | n/a |  |
| ABC articles/notice.docx | treatments/ | fuzzy | n/a | matched in treatments instead of — |
| ABC articles/body map/Ankle pain.docx | MISSING | none | n/a |  |
| ABC articles/body map/Arm pain.docx | MISSING | none | n/a |  |
| ABC articles/body map/Back pain.docx | treatments/back-pain | exact | en+ar |  |
| ABC articles/body map/Elbow pain.docx | MISSING | none | n/a |  |
| ABC articles/body map/Foot pain.docx | MISSING | none | n/a |  |
| ABC articles/body map/headache.docx | treatments/headaches | fuzzy | en+ar | site page 'Chronic and daily headache' |
| ABC articles/body map/Hip pain.docx | MISSING | none | n/a |  |
| ABC articles/body map/Knee pin.docx | treatments/knee-pain | exact | en+ar |  |
| ABC articles/body map/Leg pain.docx | MISSING | none | n/a |  |
| ABC articles/body map/Muscle pain.docx | MISSING | none | n/a |  |
| ABC articles/body map/neck pin.docx | treatments/neck-pain | exact | en+ar |  |
| ABC articles/body map/Numbness.docx | MISSING | none | n/a |  |
| ABC articles/body map/Pelvic pain.docx | MISSING | none | n/a | general pelvic pain; site has women-specific page only |
| ABC articles/body map/Radiofrequency spine.docx | services/radiofrequency/spine | fuzzy | en+ar |  |
| ABC articles/body map/Shoulder pain.docx | MISSING | none | n/a |  |
| ABC articles/body map/tble.docx | MISSING | none | n/a | glossary table, not an article |
| ABC articles/body map/Wrist pain.docx | MISSING | none | n/a |  |
| ABC articles/surgery/Anterior Cervical Discectomy and Fusion.docx | services/surgery/anterior-cervical-discectomy-and-fusion | exact | en+ar | nested under surgery |
| ABC articles/surgery/Deep brain stimulation.docx | services/surgery/dbs | fuzzy | en+ar |  |
| ABC articles/surgery/Lumbar Spinal Fusion Surgery.docx | services/surgery/lumbar-spinal-fusion | exact | en+ar | nested under surgery |
| ABC articles/surgery/Rhizotomy.docx | services/surgery/sdr | fuzzy | en+ar |  |
| ABC articles/surgery/RIWOspine.docx | services/surgery/endoscopic-spine | fuzzy | en+ar |  |
| ABC articles/surgery/Stereotactic radiosurgery.docx | services/surgery/stereotactic-radiosurgery | exact | en+ar | nested under surgery |
| ABC articles/surgery/transsphenoidal surgery.docx | services/surgery/transnasal-transsphenoidal | fuzzy | en+ar |  |


### 8. `Rehablitation medicine update/`
| draft path | resolution | method | matched locales | notes |
|---|---|---|---|---|
| Rehablitation medicine update/Brachial Plexus Injury.docx | treatments/brachial-plexus-injuries | fuzzy | en+ar | site uses plural slug |
| Rehablitation medicine update/Cerebral palsy.docx | treatments/cerebral-palsy | exact | en+ar |  |
| Rehablitation medicine update/cruciate ligament.docx | MISSING | none | n/a |  |
| Rehablitation medicine update/geriatric.docx | MISSING | none | n/a |  |
| Rehablitation medicine update/Hemiplegia cva.docx | treatments/stroke | fuzzy | en+ar | content overlaps stroke page |
| Rehablitation medicine update/Hydrocephalus.docx | MISSING | none | n/a | overlaps NPH + pediatric-hydrocephalus; no general hydrocephalus page |
| Rehablitation medicine update/Meniscal Tear.docx | MISSING | none | n/a |  |
| Rehablitation medicine update/MS.docx | treatments/multiple-sclerosis | exact | en+ar |  |
| Rehablitation medicine update/Muscle disease.docx | MISSING | none | n/a |  |
| Rehablitation medicine update/Orthopedic Rehabilitation.docx | MISSING | none | n/a |  |
| Rehablitation medicine update/parkinson.docx | treatments/parkinsons-disease | exact | en+ar |  |
| Rehablitation medicine update/Pediatric Rehabilitation.docx | MISSING | none | n/a |  |
| Rehablitation medicine update/pelvic floor rehabilitation.docx | MISSING | none | n/a | EN only |
| Rehablitation medicine update/Physical Therapy.docx | services/physiotherapy/physical-therapy | exact | en+ar | nested under physiotherapy |
| Rehablitation medicine update/Pulmonary rehabilitation.docx | MISSING | none | n/a | EN only |
| Rehablitation medicine update/red ear syndromw.docx | MISSING | none | n/a | EN only; textbook excerpt |
| Rehablitation medicine update/Robotic Rehabilitation.docx | MISSING | none | n/a |  |
| Rehablitation medicine update/scoliosis.docx | treatments/scoliosis | exact | en+ar |  |
| Rehablitation medicine update/spina bifida.docx | treatments/spina-bifida | exact | en+ar |  |
| Rehablitation medicine update/Spinal Muscular Atrophy (SMA).docx | MISSING | none | n/a |  |
| Rehablitation medicine update/spine rehab.docx | treatments/spinal-cord-injury | fuzzy | en+ar | content is SCI |
| Rehablitation medicine update/functional neurosurgery/brain lesion.docx | MISSING | none | n/a | no dedicated RF brain-lesioning page |
| Rehablitation medicine update/functional neurosurgery/dystonia.docx | MISSING | none | n/a |  |
| Rehablitation medicine update/functional neurosurgery/essential tremor.docx | MISSING | none | n/a |  |
| Rehablitation medicine update/functional neurosurgery/Obsessive-compulsive disorder (OCD).docx | MISSING | none | n/a |  |
| Rehablitation medicine update/functional neurosurgery/Stuttering.docx | MISSING | none | n/a |  |
| Rehablitation medicine update/functional neurosurgery/Tourette (too-RET) syndrome.docx | MISSING | none | n/a |  |
| Rehablitation medicine update/functional neurosurgery/tic.docx | MISSING | none | n/a | empty file |

---

## Language gaps summary

Drafts that exist in only one language (no translation was created — **do not translate without clinician approval**).

| Draft path | Language available | Matched site article | Gap |
|---|---|---|---|
| Rehablitation medicine update/pelvic floor rehabilitation.docx | EN only | MISSING | AR translation pending |
| Rehablitation medicine update/Pulmonary rehabilitation.docx | EN only | MISSING | AR translation pending |
| Rehablitation medicine update/red ear syndromw.docx | EN only | MISSING | AR translation pending |

*Note:* The AR-only resolution-table entries for `ozone.docx` and `العلاج بالأوزون.docx` are a script artefact — both languages are present (EN master + AR twin). No true AR-only gaps were found among the 277 drafts.

