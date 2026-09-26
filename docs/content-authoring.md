# Content authoring

How to write an article — the frontmatter, the voice, the bilingual policy,
and where the CMS fits.

For the section widgets themselves (highlights, stats, panels, etc.) see
[`sections.md`](sections.md).

---

## The mental model

Every article is **one Markdown file with YAML frontmatter**, stored on disk at:

```
src/content/<collection>/<slug>/<locale>.md
```

- `<collection>` is one of: `treatments`, `services`, `blog`, `cases`, `doctors`, `pages`.
- `<slug>` is the URL-safe topic name (`back-pain`, `epilepsy`, `endoscopic-spine-surgery`).
- `<locale>` is `en` or `ar`.

Both language versions of the same topic live side by side in the same folder.
They share the slug but their content is independent.

Publish URL: `https://alimran.clinic/<locale>/<collection>/<slug>/`.

---

## Rule 1 — Preserve the doctor's voice

Preserve **the doctor's facts, clinical stance, and terminology.** Repair
machine-translation mistakes, WordPress markup artifacts, and typos — but
don't rephrase what the doctor said, don't soften clinical directness, and
don't add filler ("Are you suffering from back pain? Read on to discover…").

The clinic's writing style is direct, factual, patient-facing. Match it.

## Rule 2 — Both languages carry equal weight

**Neither `en.md` nor `ar.md` is automatically the "original".** Some topics
were written in Arabic first, some in English. When rewriting, read both files
together before touching either. If AR is coherent clinical prose and EN is a
broken auto-translation (`"spinal skid patients"`, `"opening the splint"`),
the AR is the truth and EN needs to be re-translated cleanly, not word-swapped.

## Rule 3 — Frontmatter matches the schema

`src/content.config.ts` is the source of truth for what every collection allows.
Both `astro build` and the CMS validate against it. Fields not listed there
will error the build.

---

## Frontmatter reference

### Fields every collection has (from `pageBase`)

| Field | Required | Type | Purpose |
|---|:-:|---|---|
| `title` | ✅ | string | Page `<title>` + used in listing cards |
| `description` | | string | Meta description + card blurb (~160 chars max — search snippets cut off) |
| `category` | | string | Used to group entries (e.g. `pain` under `treatments`) |
| `order` | | number | Display order within category/menu (default 999) |
| `image` | | string | Hero/OG image path (e.g. `/images/home/foo.jpg`) |
| `imageAlt` | | string | Alt for the hero image |
| `updated` | | date (`YYYY-MM-DD` or ISO) | Last human review date |
| `legacyUrl` | | string | Original alimranmed.com URL — kept for redirect audit |
| `source` | | enum | Provenance tag: `legacy-wp`, `ai-draft`, `human-reviewed`, `original`, `translated-by-llm` |
| `reviewedBy` | | string | Clinician who signed off — surfaces in schema |
| `reviewedAt` | | date | When the review happened |
| `locale` | | string | Deprecated; retained for backward compatibility |

### Extra fields per collection

**`treatments`:**

| Field | Purpose |
|---|---|
| `redesigned: true` | Renders through the new block layout (mandatory for the article to appear in nav) |
| `bodyRegion` | e.g. `spine`, `brain` — feeds the pathway resolver |
| `pathwayOverride` | Force a specific pathway when `category` is legacy-wrong |
| `publishedAt` | Original publish date |
| `faqItems: [{ question, answer }]` | Adds an FAQ block + `FAQPage` JSON-LD |
| `sections: [...]` | The block-based body — see [`sections.md`](sections.md) |

**`services`:**

| Field | Purpose |
|---|---|
| `redesigned: true` | Same as treatments |
| `isHub: true` | This is a category landing (e.g. `services/surgery/`), not a leaf procedure |
| `sections: [...]` | Body blocks |

**`blog`:**

| Field | Purpose |
|---|---|
| `redesigned: true` | Same as treatments |
| `author` | Article byline |
| `publishedAt` | Date |
| `tags: [...]` | Free-form tags |
| `clinicallyRelevant: true` | Show this post on `/conditions/` alongside treatments |
| `relatedTreatments: [slug1, slug2]` | Suggest condition pages at the bottom |
| `sections: [...]` | Body blocks |

**`doctors`:**

| Field | Required | Purpose |
|---|:-:|---|
| `fullName` | ✅ | On the h1 fallback + listing card |
| `title` | ✅ | Page `<title>` |
| `titles: [MBChB, FIBMS…]` | | Credential chips |
| `specialty` | | Small caps chip on listing card |
| `photo` | | Portrait path (e.g. `/images/doctors/name.jpg`) |
| `photoAlt` | | Alt (defaults to `fullName`) |
| `languages: [...]` | | Only shown on listing card |
| `heroEyebrow` | ✅ | Small caps line above the h1 |
| `heroHeadline` | | Overrides `fullName` as the h1 |
| `heroLede` | ✅ | Paragraph under the h1 |
| `sections: [...]` | | CV body: stats, appointments, education, memberships, publications |

**`cases`:**

| Field | Purpose |
|---|---|
| `condition` | The condition treated |
| `outcome` | Short outcome summary |

---

## A minimal treatment article

```markdown
---
title: Back pain
description: Chronic and acute back pain — diagnosis, non-surgical options and when surgery is the answer.
category: spine
bodyRegion: spine
redesigned: true
sections:
  - type: highlights
    items:
      - label: What it is
        value: >-
          Pain in the lower or upper back that has lasted more than three months,
          or new pain following an injury.
      - label: Symptoms
        value: >-
          Stiffness on waking, pain radiating into the leg, weakness, numbness
          in the foot.
      - label: When to see a doctor
        value: >-
          Numbness, loss of bladder or bowel control, or unexplained weight loss
          alongside back pain — see a neurosurgeon within days, not weeks.
  - type: prose
    heading: What causes back pain
    body: >
      Most back pain has a mechanical cause: a strain, a bulging disc, or wear
      of the facet joints. …
  - type: panels
    heading: Treatment ladder
    panels:
      - eyebrow: First
        title: Conservative
        items:
          - Physiotherapy for 6–8 weeks
          - Analgesia (NSAIDs, muscle relaxants)
          - Postural correction
      - eyebrow: Then
        title: Interventional
        items:
          - Epidural injections
          - Facet joint blocks
      - eyebrow: Last
        title: Surgical
        items:
          - Microdiscectomy for herniated disc
          - Decompression + fusion for stenosis
---
```

- `title` and `description` are the only required fields at the frontmatter level.
- `redesigned: true` is what puts the article into the block-based layout and turns on nav visibility.
- `sections: []` is the body. Every block has a `type` and its own fields — see [`sections.md`](sections.md).
- **No Markdown body** is expected below the `---` closing fence for redesigned articles. Everything is in `sections`.
- For legacy articles that haven't been rebuilt yet, the body markdown below `---` still renders — it just goes through the old prose pipeline (no TOC, no sidebar meta).

---

## The bilingual workflow

Every topic must have **both** `en.md` and `ar.md`. If one is missing, the site
falls back to the other and shows a "translation in progress" banner — which
looks unfinished. So:

1. **Author both files.** If you're only comfortable writing in one language, save the other as a stub with a TODO comment (`# TODO: proper Arabic translation`) so the fallback banner shows.
2. **Keep frontmatter shape identical** between locales. Titles, descriptions, and section labels differ; slugs, categories, and `redesigned` don't.
3. **RTL is automatic.** The Arabic page loads with `dir="rtl"` and swaps to Arabic fonts (Amiri + IBM Plex Sans Arabic). Content authors don't need to think about it.

## Special Markdown syntax

Redesigned articles use **structured `sections`** (see [`sections.md`](sections.md))
so the Markdown syntax mostly doesn't matter. For legacy body prose and for
`prose`-block `body` fields, the following applies:

**Paragraphs** — separate with a blank line, as normal.

**Links** — `[label](/services/tms/)`. Internal links (starting with `/`) are
auto-localised, so `[TMS](/services/tms/)` becomes `/en/services/tms/` on English
pages and `/ar/services/tms/` on Arabic.

**Bold** and _italic_ — standard `**` / `_`.

**Images** — `![Alt text](/images/legacy/…jpg)`. Any image ≥400 px wide is
auto-optimised at build time — no need to do anything special. See
[`image-optimization.md`](image-optimization.md) for how.

**YouTube embeds** — write the URL on its own line:
```
[▶ Watch on YouTube](https://www.youtube.com/watch?v=abc123XYZ)
```
The `rehype-youtube` plugin swaps this for an iframe embed.

**No custom HTML.** Astro's Markdown pipeline is Markdown-only; any `<div>`s
you write will be escaped.
