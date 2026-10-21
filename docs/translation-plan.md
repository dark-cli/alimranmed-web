# Translation Plan: Turkish + Kurdish (Sorani)

**Status:** proposed · **Cost estimate:** ~2.5M tokens ≈ $15–20 · **Scope:** ~284 articles → 568 new files

## Goal

Add Turkish and Kurdish versions of every article on the site. The doctor provides
nothing — all translation is done by AI. URLs keep English slugs, only the locale
prefix changes:

- `alimran.clinic/tr/treatments/back-pain/`
- `alimran.clinic/ku/treatments/back-pain/`

## Languages

| Locale | Language | Script / dir | Audience |
|---|---|---|---|
| `tr` | Standard Turkish | Latin, LTR | Turkey — including most Kurds in Turkey, who read Turkish |
| `ckb` (URL `/ku/`) | Sorani / Central Kurdish | Arabic, RTL | Iraqi Kurdistan (Erbil, Sulaymaniyah; official KRG language) |

- **Why Sorani, not Kurmanji:** Sorani is the dominant written standard in Iraqi
  Kurdistan. Kurmanji (Latin script) is the Kurdish of Turkey, but that audience is
  already reached through Turkish. Badini (Duhok) speakers generally read Sorani
  and Arabic. Kurmanji can be added later as a third locale if demand shows up.
- **Locale code:** `lang="ckb"` and `hreflang="ckb"` — not the generic `ku`, which
  search engines can't tie to a dialect. The URL prefix stays `/ku/` for readability.

## How it works

Glossary first, then translate. AI never touches file structure.

1. **Extract** — a script pulls every translatable string out of the English
   markdown into a numbered plain-text list (headings, paragraphs, captions,
   buttons — YAML, links, and paths are left untouched).
2. **Term scan** — a light agent reads each file's list and returns every medical
   term, drug name (generic + brand), procedure, anatomy term, and recurring site
   phrase (clinic name, doctor titles, CTA lines). A script dedupes the results,
   counts frequency and the files each term appears in, and keeps one sample
   sentence per term. Output: one ranked term list (~400–800 entries).
3. **Glossary** — a strong model translates the term list into
   `docs/glossary-tr.json` and `docs/glossary-ckb.json`. For each term it gets the
   English sample sentence **and the matching sentence from the existing `ar.md`**
   (already translated for all articles) to disambiguate meaning — especially
   valuable for Sorani, whose medical vocabulary borrows heavily from Arabic. Each
   entry carries a policy, not just a word:

   ```json
   { "en": "paracetamol", "tr": "parasetamol", "policy": "adapt-spelling" }
   { "en": "radiofrequency ablation", "tr": "radyofrekans ablasyon", "policy": "translate+en-first-mention" }
   { "en": "Lyrica", "policy": "keep" }
   ```

   Policies: `translate`, `adapt-spelling`, `keep` (brands), and
   `translate+en-first-mention` (English in parentheses on first use — common for
   Sorani, where standard medical terms are thin).
4. **Human review (optional, recommended)** — the glossary is one file of a few
   hundred lines. A native speaker can check it in about an hour; every page
   inherits the fix. Far cheaper than reviewing 568 pages.
5. **Translate** — a pool of 8–16 light agents translates one file's list per call.
   A script injects **only the glossary entries that occur in that file**
   (typically 15–40), keeping the prompt short and the model's attention on the
   terms that matter. Context is cleared after every file; agents are reused for
   the whole run.
6. **Verify** — a script checks that each glossary term in the source shows up as
   its glossary translation in the output (stem/prefix match, since Turkish
   suffixes words: *ağrı → ağrısı, ağrıların*). Files with misses are re-translated.
7. **Fallback flag** — if the scan missed a term, the agent emits `[[TERM:...]]`
   instead of guessing. The term is added to the glossary and the file is re-run —
   never patched into finished text.
8. **Rebuild** — a script returns each translated line to its exact position and
   writes `tr.md` / `ckb.md`, byte-identical in structure to the English source.
   Every file is YAML- and schema-validated before write; site build runs after
   each batch.

## Models

- Term scan + bulk translation: a fast/cheap tier — the work is list-shaped, with
  placeholders and the per-file glossary protecting everything sensitive.
- Glossary: strongest available model, for correct medical register and policy
  decisions.
- Alternative: DeepL API (supports glossaries) could replace step 5 for Turkish;
  it has no Sorani support, so Kurdish stays on the agent path.

## Execution & billing

- Claude Code stays logged in on the subscription for all interactive work
  (scripts, term scan, glossary, pilot, review). No login switching.
- The bulk translation (step 5) runs as a plain Node script calling the Anthropic
  API directly — Message Batches API (~half price) + prompt caching — with a
  Console API key read from the gitignored project `.env`. Never export
  `ANTHROPIC_API_KEY` in the shell profile, or Claude Code may pick it up instead
  of the subscription.
- Console account: small prepaid balance, auto-reload off.

## What changes on the site (later, before going live)

- Locale lists in `astro.config.mjs`, `src/lib/i18n.ts`, `src/content.config.ts`,
  and page routes — add `tr` + `ckb` (path `/ku/`) next to `en` / `ar`.
- UI label dictionaries `src/i18n/tr.json` + `ckb.json` (~60 keys) — run through
  the glossary too.
- Text direction: `tr` is LTR; `ckb` is RTL and reuses the existing Arabic RTL
  styling.
- Fonts: Turkish (ş ğ ı İ) is covered by the existing `latin-ext` subset. Sorani
  needs extra letters (ڕ ڵ ێ ۆ ڤ) — verify IBM Plex Sans Arabic / Amiri render
  them during the pilot; swap or add a fallback font if not.

## Rollout

1. Term scan over all articles + glossary build + (optional) native review.
2. Pilot: 10 articles end-to-end in both languages, verify pipeline, glossary
   adherence, Sorani font rendering, and RTL layout.
3. Bulk: `treatments/`, then `services/`, `blog/`, `cases/`, `doctors`.
4. Home/about/contact, UI dictionaries, final build.
