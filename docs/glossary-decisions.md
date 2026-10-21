# Glossary decisions (TR / CKB)

Site-wide rules from the lead-terminologist pass. They are enforced in
`scripts/translate/glossary-fixes.json` and checked by `scripts/translate/check-glossary.mjs`.
Rebuild with `node scripts/translate/merge-glossary.mjs`.

## decisions

- **hip** → tr *kalça* / ckb **سمت** (*جومگەی سمت* = hip joint). ڕان means thigh, so it is used only for femur/thigh. Exception: *hip girdle* = pelvic girdle → حەوز.
- **knee** → *diz* / **ئەژنۆ** everywhere (چۆک removed); genicular → tr *genikuler*.
- **spinal cord** → *omurilik* / **درکەپەتک** (the standard anatomical term). Colloquial مۆخی دڕک / مۆخی بڕبڕە removed. CSF → *شلەی مێشک و درکەپەتک*.
- **spine / vertebrae** → *omurga* / **بڕبڕەی پشت**. Regions: cervical *boyun/servikal* · مل, thoracic *sırt/torakal* · سنگ, lumbar *bel/lomber* · کەمەر.
- **fusion** → *füzyon* / **لکاندن**. **fixation** (instrumentation) stays جێگیرکردن because it means something different.
- **rehabilitation** → *rehabilitasyon* / **بەتواناکردنەوە** (the KRG / health-sector form). The base entry gives the English on first mention. *retraining / re-education* stay ڕاهێنانەوە because they mean something different.
- **syndrome** → *sendrom* / **سەندرۆم** (سیندرۆم removed). IBS → سەندرۆمی کۆڵۆنی هەستیار.
- **stimulation** → *stimülasyon* / **ورووژاندن** (not وروژاندن).
- **injection** → *enjeksiyon* / **دەرزی** + ezafe written دەرزی (not دەرزیی). Plural دەرزییەکان.
- **block** → *blok* / **بلۆک** · **ablation** → *ablasyon* / **سووتاندن** · **radiofrequency** → *radyofrekans* / **ڕادیۆفریکوێنسی**.
- **epidural** → **ئیپیدیوراڵ** (ئێپیدوراڵ removed) · **stroke** → *inme* / **جەڵتەی مێشک** (جەڵدە removed).
- **chronic** → *kronik* / **درێژخایەن** · **pain** → *ağrı* / **ئازار** · **headache** → *baş ağrısı* / **سەرئێشە** · **tendon** → *tendon* / **وەتەر**.
- **nerve** → *sinir* / **دەمار**. **peripheral** → **دەوروبەر** (see the back-translation check; لاوەکی is kept only where it means *secondary*). **medial branch** → **لقی ناوەکی** (*median* nerve = ناوەڕاست). **occipital** → **پشتی سەر**. **facial** → **ڕوخسار**. **Achilles** → *Aşil* / **ئەخیل**.
- **Clinic name**: ar.md writes العمران (مركز العمران الطبي, 200+ uses), read *al-Imran* like the Latin *Alimran*. tr keeps **Alimran** (*Alimran Tıp Merkezi*, *Alimran Kliniği*). ckb is **ئەلعیمران** (*سەنتەری پزیشکیی ئەلعیمران*, *کلینیکی ئەلعیمران*). It replaces ئەلعومران, which read as *Omran*.
- **Doctor**: ar.md has د. حسين عمران موسى → tr *Dr. Hussein Imran Mousa* (Latin, kept) / ckb **د. حوسێن عیمران مووسا** (full name: … محەمەد). Added as a manual entry.
- **keep policy** means the text is identical to the English in both languages (Botox, SpineMED, Gamma Knife, TENS…). Kurdish-script readings go in `note`. An entry that adds a gloss or grammar (*Botox enjeksiyonu*, *FIBMS (بۆردی عێراقی)*) is `translate`, and the brand stays verbatim inside it.
- **Turkish case**: sentence case. A capital is kept only for eponyms, proper nouns and acronyms (Aşil, Chiari, Lyme, Morton…).
- **Sorani orthography**: no ي ك ة ى or harakat; these are normalised to ی ک ە automatically.

## Term-merge fixes (build-terms)

- **CRP** (C-reactive protein) had been merged into **CRPS** by plural-stripping. It is now split via `split` in `term-overrides.json` and has its own entry.
- **Botox** (the brand, 97 files) had been merged under *Botox injections*. It is now its own `keep` entry, and *Botox injections* is a procedure.
- **decompression** had been merged under *surgical decompression*. That was wrong for the non-surgical SpineMED context, so it is now a generic entry.
- **sedative(s)** (the drugs) had been merged under *sedation* (the state). They are now separate entries.

## Back-translation check (step 4)

A separate model back-translated 1161 tr / 1169 ckb entries without seeing the English. The adjudicator compared every result that was not an exact match, and every row marked odd or unclear. Joined rows are in `.translation/backtrans/compare-{lang}.json` (from `backtrans-compare.mjs`). The verdicts are in `scripts/translate/backtrans-verdicts.json`, and merge-glossary applies them.
- **peripheral** → **دەوروبەر** (*دەمارەکانی دەوروبەر*, *دەماری دەوروبەر*). This replaces دەرەکی, which means *external*; دەرەکی stays only for real *external* (EVD, exoskeleton). This supersedes the rule above.
- **acute** → **کتوپڕ** / *acute pain* **ئازاری کورتخایەن**. توند reads as *severe/tight*, and that word is now forbidden.
- **functional** → **کارکردی**, because کارایی reads as *effective*. **virtual reality** → **واقیعی مەجازی** (گریمانەیی = hypothetical). **neuron** → **خانەی دەماری** (دەمار = nerve).
- **pubic** → **ناوگەڵ**, never زێ (vagina). **straight leg** → **قاچی ڕێک** (قاچی ڕاست = right leg).
- **medial branch** keeps ناوەکی, but gets the English on first mention because it can read as *internal*.
- tr: *KİBAS* means raised-ICP syndrome, so ICP is now **KİB**. *buttock* → **kalça arkası (gluteal bölge)**: *popo* is too informal, and *kalça* alone is hip. *sacrum* → **sağrı kemiği**: *kuyruk sokumu* is the coccyx. *consultant* has no Turkish rank equivalent, so it is dropped (*konsültan* means a doctor called in to consult). *disk bombeleşmesi*, *kauda ekuina*, *pulse oksimetri*, *transkütan*, *tekrarlayan*.
- Policy: checked entries get `verified: "backtrans"`. A clean pass raises confidence one step. A fixed entry is set to medium. A marginal keep is set to low. Every non-keep entry at low gets `translate+en-first-mention`, and the semantic fixes get it too.
