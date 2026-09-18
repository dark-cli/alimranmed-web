# Content Conversion Guide

**Purpose:** Convert legacy markdown articles (blog / treatments / services)
into the block-based schema so they render through the new templates with
proper structure, TOC, media, and cross-links.

This is a **preservation task, not a rewrite task**. Read Rule 1 before
touching anything.

---

## Rule 1 — Faithful to the doctor, not to the mistakes

The clinic's writing has character — clinical voice, specific terminology,
direct patient-facing stance. **Preserve the doctor's facts, clinical
stance, and voice.** Repair machine-translation mistakes, WordPress
markup artifacts, and typos.

### The bilingual source policy

Every article has both an `en.md` and an `ar.md`. **Neither is
automatically "the original."** The old WordPress site had some articles
authored in Arabic and some in English; when the site was rebuilt, gaps
were filled by translation in both directions. So:

- **Read both files together** before you write anything.
- **Take the clearest phrasing from whichever language has it.** If the AR
  is coherent doctor-speak and the EN is a broken auto-translation
  (`"spinal skid patients"`, `"opening the splint"`), the AR is the truth
  and the EN needs to be re-translated cleanly.
- **The reverse also happens.** Some articles are original in English,
  with a rough auto-translation to Arabic. In that case the EN is the
  truth and the AR needs re-translation.
- **Some content only exists in one language.** Translate faithfully into
  the other.

### Proportionality

Match the depth of the conversion to the depth of the source.

- **Short, thin source** (~100–300 words, one point, no numbers, no
  comparisons): a modest output is correct. 2–4 blocks, a small
  at-a-glance, one or two prose sections, media, done. Don't invent
  richness that isn't there.
- **Long, detailed source** (~500+ words, multiple aspects, real
  clinical detail): the full sciatica-quality treatment is expected.
  at-a-glance + multiple prose + comparison-pair where the source
  compares things + stats-facts where the source has real numbers +
  treatment-groups + related.

`/en/treatments/sciatica/` is the north star for a detailed article.
Don't force short articles up to that level; don't leave long articles
down at vasotrain-level either.

### You DO:
- Move the doctor's facts and stance into the appropriate blocks.
- Repair broken auto-translations by consulting the sibling-language
  source and writing proper clinical English (or proper clinical Arabic).
- Add `at-a-glance`, split prose into named sections, add
  `comparison-pair` / `stats-facts` blocks — where the source content
  supports them.
- Convert list-style content into `treatment-groups` where it structurally
  fits (needs 2–4 groups; single-list content stays as prose bullets).
- Replace legacy `![alt](url)` images with `media` blocks.
- Replace YouTube links with `media` blocks of `kind: youtube`.
- Add `[text](url)` links on the **first mention** of a treatment or service
  that has its own page (see §6 Cross-linking).
- Fix obvious typos, WordPress heading-wrap markup (`##### **text**`), and
  duplicated boilerplate paragraphs from bad WP imports.

### You DO NOT:
- Invent facts, statistics, or clinical claims that aren't in either
  source file.
- Force block variety when the source is genuinely thin. A short article
  is allowed to stay short.
- Change the doctor's clinical stance (what they treat, what they don't,
  their thresholds for surgery/injection/etc.).
- Add stats blocks with made-up percentages.
- Add comparison-pair blocks when the source doesn't actually compare
  two things.
- Delete unusual phrasings that are clearly the doctor's voice (as
  opposed to translator errors).

If in doubt: **preserve the clinical content, upgrade the language.**
The doctor is the author; the translator was a broken machine.

---

## Rule 2 — The frontmatter

Every converted file must have this frontmatter shape. Keep any existing
fields that aren't listed here (e.g. `legacyUrl`, `source`, `order`).

```yaml
---
title: "..."                    # keep the original
description: "..."              # keep the original; add one if missing (one sentence)
publishedAt: "YYYY-MM-DDTHH:MM:SS"   # keep existing timestamp
redesigned: true                # required — flags this file for the block dispatcher
clinicallyRelevant: true|false  # blog only: true if this is medical content that belongs on /conditions/
sections:                       # ← the new block array; see §3
  - type: ...
  - type: ...
---
```

If the file was previously marked `redesigned: true` but had no `sections:`
array, it was rendering via the raw-markdown fallback. Once you add
`sections:`, the fallback is bypassed for structured blocks, and only
`![](url)` images left in the raw body are auto-rendered as trailing media
figures (leftover legacy image handling).

**Once conversion is complete, delete the redundant raw-markdown body
entirely** except for `![](url)` image lines you want as trailing figures.
If every image is inside a `media` block already, delete the whole body.

---

## Rule 3 — Block reference

The full schema lives at `src/content.config.ts` (search for
`articleSection`). Each block type below has its purpose and shape.

### `at-a-glance`
Surface-tinted panel at the top of an article. 2–4 short label/value
cards. Use it as the article's opening summary — "what is this / what
causes it / who gets it" style.

```yaml
- type: at-a-glance
  items:
    - label: "What is osteoporosis?"
      value: "Bone disease with loss of density..."
    - label: "Common causes"
      value: "Hormonal changes, calcium deficiency..."
```

Use for: overview cards at article top.
Skip if: article is too short / too specific for a summary panel.

### `prose`
The workhorse. Optional heading (creates a TOC entry + numbered section),
then a markdown body. Supports `[text](url)` links.

```yaml
- type: prose
  heading: "Overview"           # optional; appears in TOC and gets 01/02/03 numbering
  body: |
    First paragraph text here. Preserve the original phrasing.

    Second paragraph after a blank line.

    - Bullet lists
    - Are supported
```

Use for: any narrative content, explanations, background, symptoms lists.

### `pull-quote`
2px accent border-inline-start, serif type, optional attribution. Use
sparingly — one per article max, for a genuinely memorable statement.

```yaml
- type: pull-quote
  text: "Recovery is measured in weeks, not days."
  attribution: "Hussein Imran Mousa, consultant neurosurgeon"
```

Use for: high-signal statements the reader should remember.
Skip if: nothing in the source begs to be highlighted.

### `comparison-pair`
Two side-by-side hairline columns. Use for "with vs without" or "surgical
vs conservative" comparisons.

```yaml
- type: comparison-pair
  heading: "Conservative vs surgical"
  intro: "The choice depends on..."   # optional
  a:
    label: "OPTION A"
    title: "Conservative"
    items: ["Rest", "Physical therapy", "..."]
  b:
    label: "OPTION B"
    title: "Surgical"
    items: ["Discectomy", "Fusion", "..."]
```

Use for: genuine comparisons in the source.
Skip if: forcing a comparison distorts the original narrative.

### `stats-facts`
2–4 large stats + a list of key facts. Requires real numbers/statistics.

```yaml
- type: stats-facts
  heading: "By the numbers"
  intro: "..."               # optional
  stats:
    - value: "50M"
      label: "adults affected in the US"
    - value: "1 in 5"
      label: "over 65 develop the condition"
  facts:
    - "Fact one from the source."
    - "Fact two."
```

Use for: articles with real statistics.
Skip if: no numbers in the source — don't invent any.

### `treatment-groups`
2–4 hairline cards, each with a title, optional subtitle, and a list.
Items support markdown links (`[text](url)`).

```yaml
- type: treatment-groups
  heading: "Treatment options at Alimran Center"
  intro: "..."               # optional
  note: "..."                # optional trailing note under the grid
  groups:
    - title: "Physical therapy"
      subtitle: "..."        # optional
      items:
        - "[Electrical stimulation](/services/physiotherapy/electrical-stimulation/)"
        - "Therapeutic exercises"
    - title: "Injections"
      items:
        - "Steroid injections"
        - "Trigger point injections"
```

Use for: catalogued lists of treatments/services offered.
Skip if: the source doesn't have grouped list content.

### `media`
Image, self-hosted video, or YouTube embed. Not numbered / not in the TOC.

```yaml
- type: media
  kind: image        # or "video" or "youtube"
  src: /images/legacy/2020/12/foo.jpg   # or full URL for youtube
  alt: "Description for accessibility"   # required for image
  caption: "Optional caption under the frame"
  aspect: "16/9"     # optional — "16/9" | "4/3" | "3/2" | "1/1"
```

For YouTube: `src` accepts any of:
- Bare 11-char ID: `abc123XYZ00`
- Watch URL: `https://www.youtube.com/watch?v=abc123XYZ00`
- Short URL: `https://youtu.be/abc123XYZ00`
- Embed URL: `https://www.youtube.com/embed/abc123XYZ00`

Aspect defaults: images keep intrinsic aspect (no crop); video/youtube
default to 16/9.

Use for: any inline figure the article references.

### `related`
Currently non-functional in blog (renders as empty list). Skip it for now.

---

## Rule 4 — Media conversion

Legacy raw markdown media in the body of the article:

- `![](/images/legacy/2020/12/foo.jpg)` → convert to `media` block with
  `kind: image`, `src`, and infer an `alt` from context.
- `[youtube link](https://youtu.be/abc123XYZ00)` → convert to `media` block
  with `kind: youtube` and the URL as `src`.
- Bare YouTube URLs on their own line → same conversion.
- `<iframe>` embeds → convert to `media` block with `kind: youtube` and
  extract the video ID.

**Position matters.** Place the media block where it logically belongs in
the narrative flow — usually just before the section that references it, or
between paragraphs where the source had the image inline. Don't dump all
media at the top.

**Alt text:** if the original `![]()` had no alt text (very common in the
legacy WP content), infer one from the surrounding context — e.g., an
X-ray image next to "arthritis of the hip" gets `alt: "X-ray showing
arthritis of the hip"`. Keep it factual, short (under 100 chars).

---

## Rule 5 — Section headings and the TOC

Every `prose`, `comparison-pair`, `stats-facts`, and `treatment-groups`
block can have an optional `heading:` field. Blocks with headings:

- Appear in the article's Table of Contents (right side on desktop)
- Get an automatic `01`, `02`, `03` numbering prefix
- Get a scroll anchor generated (`#s-1`, `#s-2`, etc.)

Blocks without headings render inline without the numbered chrome.

**Guidance:** if the source article has H2/H3 headings, use them as
block headings (verbatim). If the source has none, don't invent them —
just use unheaded `prose` blocks and let the article read as continuous
prose.

---

## Rule 6 — Cross-linking

When the article mentions a treatment, service, or condition that has its
own page on the site, link to it. **First mention only.** Subsequent
mentions stay as plain text.

- Treatments live at `/treatments/{slug}/` (109 pages)
- Services live at `/services/{category}/{slug}/` (96 pages)
- Blog articles live at `/blog/{slug}/`

To find the right slug, look inside `src/content/treatments/`,
`src/content/services/`, and `src/content/blog/`.

Use relative paths without the locale prefix — the template adds `/en/` or
`/ar/` automatically:

```markdown
Good: [radiofrequency ablation](/services/radiofrequency/radiofrequency/)
Bad:  [radiofrequency ablation](/en/services/radiofrequency/radiofrequency/)
```

Don't force links. If the article mentions "pain" or "physical therapy"
generically without pointing at a specific service, don't link.

---

## Rule 7 — Frontmatter for the AR mirror

Every EN article has (or should have) an AR mirror at `../ar.md`. When
converting an EN file, also convert the AR sibling. The AR file uses:

- Same `sections:` structure with `type` fields matching EN
- All user-facing text translated to Arabic
- Same media `src` paths (legacy images serve to both languages)
- Slugs in links stay in English (routing is locale-independent below `/`)

If the AR file's original content differs meaningfully from the EN (Arabic
often has extra local context or different examples), preserve the AR
differences — don't force a 1:1 mirror.

---

## Rule 8 — Verification

Before marking a file done, verify:

1. **Astro type-check passes.** Zod will complain if `type:` values are
   invalid or required fields are missing. Watch dev-server output.
2. **The page renders at its URL.** Load `/en/blog/{slug}/` (or the
   equivalent path) and confirm:
   - Header band shows title + description + reading time
   - Table of Contents on the right lists your headed blocks
   - Every block renders (no "type: xxx" text visible as fallback)
   - Media plays / images load
   - Internal `[text](url)` links resolve (no 404s)
3. **The AR mirror at `/ar/blog/{slug}/` also renders.**
4. **The original character survives.** Re-read the source alongside your
   converted output. If a sentence sounds different, revert it.

---

## Rule 9 — Legacy body cleanup

After the `sections:` array is complete and every image/video has a `media`
block, the raw markdown body below the frontmatter usually becomes redundant.

- If every image is in a `media` block → delete the raw body entirely.
- If some `![](url)` images should render as trailing figures (rare) →
  leave those lines only; the template's fallback picks them up.
- Never leave text in the body that duplicates text now in `sections`.
  It renders twice.

---

## Reference: worked examples

Read these before you start — they're already-converted files that follow
this guide:

- `src/content/blog/osteoporosis/en.md` — small blog, at-a-glance + prose
  + treatment-groups
- `src/content/blog/arthritis/en.md` — larger blog, multiple prose sections
- `src/content/blog/tms-for-migraine/en.md` — content with medical detail
- `src/content/treatments/back-pain/en.md` — treatment article pattern
  (different collection, same block schema)

---

## Reference: what the schema exports

- Schema definitions: `src/content.config.ts` (search `articleSection`)
- Block components: `src/components/article/` — one `.astro` file per
  block type
- Blog article template: `src/pages/en/blog/[slug].astro`
- Treatment article template: `src/pages/en/treatments/[...slug].astro`
- Media component: `src/components/article/Media.astro`
