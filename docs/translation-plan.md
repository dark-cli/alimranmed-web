# Translation Plan: Turkish + Kurdish

**Status:** proposed · **Cost estimate:** ~2.1M tokens ≈ $15 · **Scope:** ~284 articles → 568 new files

## Goal

Add Turkish and Kurdish versions of every article on the site. The doctor provides
nothing — all translation is done by AI. URLs keep English slugs, only the locale
prefix changes:

- `alimran.clinic/tr/treatments/back-pain/`
- `alimran.clinic/ku/treatments/back-pain/`

## How it works

AI never touches file structure. Four steps, two of them plain scripts:

1. **Extract** — a script pulls every translatable string out of the English
   markdown into a numbered plain-text list (headings, paragraphs, captions,
   buttons — YAML, links, and paths are left untouched).
2. **Bulk translate** — a pool of 8–16 light agents translates one file's list per
   call. Each call uses a self-contained ~120-token prompt ("translate these
   numbered lines to X, keep placeholders as-is"), so an agent's context can be
   cleared after every file and nothing is lost. Agents are spun up once and
   reused for the whole run.
3. **Medical terms** — when a light agent meets a medical term it doesn't know, it
   inserts a `[[TERM:...]]` flag instead of guessing. A stronger model translates
   each flagged term **together with its sentence context** into a shared
   glossary (`docs/glossary-tr.json`, `docs/glossary-ku.json`), and the script
   backfills it everywhere. This is how terminology stays consistent across all
   568 files.
4. **Rebuild** — a script returns each translated line to its exact position and
   writes `tr.md` / `ku.md`, byte-identical in structure to the English source.
   Every file is YAML- and schema-validated before write; site build runs after
   each batch.

## Models

- Bulk translation: a fast/cheap tier is enough — the work is line-by-line, with
  placeholders protecting everything sensitive.
- Medical-term escalation + glossary seeding: strongest available model
  (Claude Sonnet / GPT-4o class) for correct medical register.
- Alternative: DeepL API can replace step 2 as a non-agent backend for these
  language pairs at very low cost; the pipeline stays identical.

## What changes on the site (later, before going live)

- Locale lists in `astro.config.mjs`, `src/lib/i18n.ts`, `src/content.config.ts`,
  and page routes — add `tr` + `ku` next to `en` / `ar`.
- UI label dictionaries `src/i18n/tr.json` + `ku.json` (~60 keys).
- Text direction: Turkish is LTR like English. Kurdish depends on the variant.

## Open item

Which Kurdish variant: **Kurmanji** (Latin script, left-to-right) or **Sorani**
(Arabic script, right-to-left)? This decides the locale code and the `dir`
attribute on pages. Nothing else in the plan changes.

## Rollout

1. Pilot: 10 articles end-to-end, verify pipeline + spot-check pages.
2. Bulk: `treatments/`, then `services/`, `blog/`, `cases/`, `doctors`.
3. Glossary backfill, home/about/contact, final build.
