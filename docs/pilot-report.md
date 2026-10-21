# Translation pilot report: TR + CKB (Oct 2026)

## Method
- 3 articles (treatments/back-pain 64 lines, treatments/bells-palsy 34, blog/physiotherapy 119),
  each translated by Haiku and Sonnet into tr and ckb: 12 blind docs, 217 lines per (lang, model).
- For each doc I compared source, target, and an independent blind back-translation line by line,
  and read the target directly. The key was opened only after every doc was scored.
- Severity: CRITICAL = meaning reversed / wrong medical fact, drug or body part; MAJOR = wrong
  term, omission, misleading; MINOR = awkward, register, orthography. Back-translator artifacts
  were discounted. Examples: چارەسەری سروشتی and چاودێریی چڕ are the standard KRG terms for
  physiotherapy and ICU, توند is the usual word for "acute", and COPD listed under cardiovascular
  comes from the source.
- Line-level fixes for every CRITICAL/MAJOR line: `.translation/eval/fixes.json` (16 entries).

## Results (per 100 lines; fluency = back-translator's 1-5 score, mean of 3 docs)

| lang | model  | critical | major | minor | fluency |
|------|--------|---------:|------:|------:|--------:|
| tr   | haiku  | 0.5 (1)  | 0.0   | 9.2   | 4.0 |
| tr   | sonnet | 0.0      | 0.5 (1) | 6.5 | 4.7 |
| ckb  | haiku  | 0.0      | 4.6 (10) | 20.7 | 2.3 |
| ckb  | sonnet | 0.0      | 1.8 (4)  | 17.5 | 3.3 |

Placeholders, line counts and ids are intact in all 12 docs; no ك ي ة leaks; ڕ ڵ ۆ ێ used correctly.

## Top 10 issues
1. CRITICAL tr/haiku back-pain #11: "taramayı değil hastayı tedavi etmek" says treating the *patient* causes unnecessary procedures (reversed).
2. MAJOR ckb/haiku back-pain #13: saddle-area numbness (cauda equina red flag) becomes "area under the thigh". The glossary already has the right phrase (نێوان ڕانەکان) under `saddle anaesthesia`, but that entry was not matched.
3. MAJOR ckb/sonnet bells-palsy #6, #12: drooling = "ئاو هاتنە دەم" (mouth-watering idiom).
4. MAJOR ckb both bells-palsy #10: circular definition ("facial paralysis is a facial paralysis") because the glossary renders Bell's palsy as ئیفلیجی ڕوخسار, the same as `facial palsy`.
5. MAJOR ckb/haiku back-pain #37, #58: "indications" rendered as ئامادەکاری (preparation). The term is missing from the glossary.
6. MAJOR ckb both physiotherapy #70: "activity limitations" becomes "limiting activity", as if therapists restrict activity.
7. MAJOR ckb/haiku physiotherapy #21, #70: acute = توندوتیژ ("violent").
8. MAJOR tr/sonnet bells-palsy #8: residual weakness = "kalıcı" (permanent).
9. MAJOR ckb/haiku bells-palsy #12 (jaw becomes chin, چەناگە), #15 ("may be added" becomes "is added").
10. MINOR, systemic, ckb both models: Latin-script English glosses in headings and short list items
    (back-pain #23, #53-56; bells-palsy #23, #25, #14 nested). The prompt forbids this.

## Sorani diagnosis
- **Not orthography.** The script and letters are clean in every doc.
- **Glossary policy is the largest single cause of the "foreign" feel.** 709/1829 ckb entries
  (39%) are `translate+en-first-mention`, against 29 in tr. Both models produce *identical* Latin
  parentheticals in short UI lines, ignoring the prompt's exception rule. Some entries carry their
  own nested gloss (`سیاتیکا (ئازاری دەماری ڕان)`, `سەندرۆمی کلکی ئەسپ (کۆدا ئیکواینا)`), which
  then stacks (back-pain #23 on Sonnet). There are also glossary defects:
  - Bell's palsy duplicates facial palsy and has the misspelling بێڵز پاڵسی.
  - فیزیۆسێراپیست vs فیزیۆتێراپی are inconsistent.
  - خاڵی هاندەر vs خاڵی هەستیار for trigger point.
  - خەرەفان (dotage) is used for dementia.
- **Coverage gap.** The glossary has the rare jargon but not the common clinical words where models
  guessed wrong: indication, acute, conservative care, stiffness, drooling, posture, trauma,
  prognosis, complication, quality of life, activity limitation.
- **Model is the second factor.** Haiku makes grammar errors (agreement, "نەتوانین … داخەین" 1pl,
  ezafe + کە, malformed دەیانبەکاربهێنن) and wrong word picks. Sonnet is +1 fluency and has 60% fewer
  majors, but still makes idiom slips. Sonnet's remaining errors are lexical, not grammatical.

## Fixes before bulk
1. Glossary (ckb):
   - Downgrade `translate+en-first-mention` to `translate` except ~100 key procedure/diagnosis terms.
   - Strip glosses that are built into renderings.
   - Fix Bell's palsy (ئیفلیجی بێلز), physiotherapist (فیزیۆتێراپیست), trigger point and dementia.
   - Add about 40 general clinical words (list above).
2. Scripts: have `rebuild.mjs`/`verify.mjs` delete any `(latin…)` gloss in lines under 6 words, or
   in title/description/headings, instead of trusting the prompt.
3. Prompt (ckb): add 5-6 "wrong → right" examples (indication, acute, drooling, quality of life,
   activity limitation) and "prefer everyday KRG clinic wording over calques".

## Recommendation
- **tr: Sonnet, no polish pass.** It has 0 critical and one major in 217 lines. Haiku was close
  but produced the only meaning reversal. Run `verify.mjs`, plus a cheap Haiku back-translation
  diff flagging "inverted/contradicts" only. Re-translate flagged lines with Sonnet.
- **ckb: Sonnet translation + Sonnet "native fluency polish" pass** after the glossary and script
  fixes above. The polish pass sees the source and the draft, may only edit wording (never terms
  locked by the glossary), and outputs the same JSON. This roughly doubles ckb Sonnet cost, still
  well under one Opus pass. Do not use Haiku for ckb: 2.5x the majors and grammar breaks a polish
  pass cannot fully clean.
- **Opus**: use it only as an adjudicator on lines a back-translation diff flags (about 2-5% of
  lines). Do not use it for bulk. Its several-times cost buys little over Sonnet + polish here.
- Re-pilot ckb on 3 new articles after the glossary changes, and accept the setup if majors stay
  at or below 1 per 100 lines and fluency is at least 4.
