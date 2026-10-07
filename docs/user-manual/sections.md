# Sections — the block widgets

Every redesigned article (`redesigned: true` in frontmatter) renders through a
`sections: []` array, one entry per block. Each block has a `type` field and
its own set of allowed fields.

**Rules that apply to every block:**

- `type` is required and must match one of the values below exactly.
- Field names are case-sensitive.
- Optional fields marked `?` can be omitted entirely; don't leave them as empty strings.
- Multi-line strings use YAML's block style:
  - `>-` folds newlines into spaces, no trailing newline (best for prose)
  - `|` preserves newlines (best for code snippets)
- Any block with a `heading` field appears in the sidebar TOC and gets a numbered anchor (`s-1`, `s-2`, …).

The one-file source of truth for allowed fields is `src/content.config.ts`. When
in doubt, the schema in that file is authoritative and this doc is the summary.

---

## Overview

| Block | Purpose | TOC entry? |
|---|---|:-:|
| [`prose`](#prose) | Paragraphs of text with headings | ✅ (if `heading`) |
| [`highlights`](#highlights) | 2–4 label/value cards ("at a glance") | ❌ |
| [`stats`](#stats) | 2–6 big numbers + short label | ✅ |
| [`facts`](#facts) | Numbered list of standalone facts | ✅ |
| [`list`](#list) | Structured list with 3 layout variants | ✅ |
| [`quote`](#quote) | Pull quote with attribution | ❌ |
| [`panels`](#panels) | 2–4 side-by-side comparison panels | ✅ |
| [`media`](#media) | Image, YouTube, or side-by-side media strip | ❌ |
| [`pathway`](#pathway) | Grouped link chips (used on `/conditions/`) | ✅ |
| [`row`](#row) | 2/3/4-column image row | ✅ |
| [`cards`](#cards) | Related-reading cards (auto-resolves from paths) | ✅ |

---

## `prose`

Paragraphs of text with an optional heading. Simple markdown inline formatting works: `**bold**`, `_italic_`, `[link](/href/)`. Paragraphs split on blank lines.

```yaml
- type: prose
  heading: What it is           # optional — becomes an h2 + TOC entry
  body: >
    First paragraph. Inline
    [links](/services/tms/) are auto-localised.


    Second paragraph. **Bold** and _italic_ work.
```

| Field | Type | Required |
|---|---|:-:|
| `type` | `"prose"` | ✅ |
| `heading` | string | |
| `body` | string (markdown) | ✅ |

---

## `highlights`

An "at a glance" card grid — 2 to 4 label/value pairs. Rendered as small info
cards side by side. The default heading is "At a glance" (EN) / "لمحة سريعة" (AR).

```yaml
- type: highlights
  heading: At a glance          # optional
  items:                        # min 2, max 4
    - label: What it is
      value: A chronic inflammatory disease of the spine.
    - label: Symptoms
      value: Pain, morning stiffness, fatigue.
    - label: Treatment
      value: Physiotherapy, targeted anti-inflammatory drugs, surgery when required.
```

| Field | Type | Required |
|---|---|:-:|
| `type` | `"highlights"` | ✅ |
| `heading` | string | |
| `items` | array of `{label, value}` | ✅ (2–4 items) |

---

## `stats`

Big-number panel — 2 to 6 stats. Use for hard numbers ("5000+", "25 years", "30–50%") not vague adjectives.

```yaml
- type: stats
  heading: What we see in clinic     # optional
  intro: Every metric is the doctor's own or from a published study.  # optional
  items:                              # min 2, max 6
    - value: "30–50%"
      label: Of patients experience pain during active treatment
    - value: "75%"
      label: With advanced disease report pain at some point
```

| Field | Type | Required |
|---|---|:-:|
| `type` | `"stats"` | ✅ |
| `heading` | string | |
| `intro` | string | |
| `items` | array of `{value, label}` | ✅ (2–6 items) |

**Quoting matters:** `"30–50%"` needs quotes because YAML would otherwise parse `30` as a number. Same for `"5,000+"`.

---

## `facts`

A numbered list of standalone facts, one per line. Default heading is "Key facts" (EN) / "حقائق أساسية" (AR).

```yaml
- type: facts
  heading: Key facts            # optional
  items:
    - Uncontrolled cancer pain is one of the strongest predictors of desire for hastened death.
    - Tolerance develops over months to years; this is different from addiction.
    - Interventional procedures can dramatically reduce opioid requirements.
```

| Field | Type | Required |
|---|---|:-:|
| `type` | `"facts"` | ✅ |
| `heading` | string | |
| `items` | array of strings | ✅ (min 1) |

---

## `list`

Structured list with three layout variants. All variants share the same item
shape (`label` + `body` + optional `subtitle`); the `variant` field picks the
visual treatment.

### `variant: rows` — single column, mono label + prose body

Best for: appointments, timeline entries, education.

```yaml
- type: list
  variant: rows
  heading: Appointments
  items:
    - label: "2006 — present"
      body: Consultant Neurosurgeon, Alsadr Teaching Hospital, Basra.
      subtitle: Head of the neurosurgical unit since 2018.  # optional
    - label: "2022 — present"
      body: Iraq Director, Middle East Stereotactic Society.
```

### `variant: wrap` — responsive grid, packs many small entries

Best for: memberships, tags, qualifications.

```yaml
- type: list
  variant: wrap
  heading: Memberships
  items:
    - label: "2022"
      body: European Society for Stereotactic Neurosurgery
    - label: "2020"
      body: World Stroke Organization
```

Subtitle is ignored in `wrap` variant.

### `variant: columns` — fixed 2-column grid

Best for: paired data, before/after comparison lists.

```yaml
- type: list
  variant: columns
  heading: Fellowships
  items:
    - label: "2013"
      body: Interventional Pain Management, Mobi Pain Clinic, Mumbai
      subtitle: Six-month attachment.  # optional
    - label: "2017"
      body: Anaesthesiology & Pain Medicine, Seoul National University
```

| Field | Type | Required |
|---|---|:-:|
| `type` | `"list"` | ✅ |
| `variant` | `"rows"` \| `"wrap"` \| `"columns"` | ✅ |
| `heading` | string | ✅ |
| `items` | array of `{label, body, subtitle?}` | ✅ (min 1) |

---

## `quote`

Pull quote with optional attribution.

```yaml
- type: quote
  text: The role of the physician is to help nature — nothing more, nothing less.
  attribution: — Hippocratic principle   # optional
```

| Field | Type | Required |
|---|---|:-:|
| `type` | `"quote"` | ✅ |
| `text` | string | ✅ |
| `attribution` | string | |

---

## `panels`

2 to 4 side-by-side panels. Two panels read as a comparison; three or four
read as an options grid.

```yaml
- type: panels
  heading: Treatment ladder       # optional
  intro: We follow the same escalation for every new patient.  # optional
  note: Not every patient needs step 3 — most stop at step 1 or 2.  # optional
  panels:                          # min 2, max 4
    - eyebrow: First               # optional — small caps line above title
      title: Conservative
      subtitle: 6–8 weeks          # optional
      items:                       # bullet list inside the panel
        - Physiotherapy
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
        - Microdiscectomy
        - Decompression + fusion
```

| Field | Type | Required |
|---|---|:-:|
| `type` | `"panels"` | ✅ |
| `heading` | string | |
| `intro` | string | |
| `note` | string | |
| `panels` | array of `{eyebrow?, title, subtitle?, items[]}` | ✅ (2–4 panels) |

---

## `media`

One or more images / YouTube videos, laid out as a full-width figure (single item) or as a side-by-side grid (multiple items). Every image is auto-optimised through the [image pipeline](image-optimization.md) — you never need to write srcset yourself.

### Single image

```yaml
- type: media
  items:
    - kind: image
      src: /images/legacy/2021/02/nerve-diagram.jpg
      alt: Diagram showing the path of the greater occipital nerve.
      caption: Greater occipital nerve pathway.       # optional
      aspect: "4/3"                                    # optional
```

### YouTube

```yaml
- type: media
  items:
    - kind: youtube
      src: https://www.youtube.com/watch?v=abc123XYZ  # bare ID, watch URL, youtu.be, shorts, all OK
      caption: A 4-minute overview of TMS therapy.
      aspect: "16/9"                                   # optional (defaults to 16/9 for youtube)
      uploadDate: "2024-03-15"                         # optional — helps Google index the video
```

### Multi-item side-by-side

```yaml
- type: media
  heading: Before and after                    # optional
  items:
    - kind: image
      src: /images/case/before.jpg
      alt: MRI before treatment
      caption: Before, month 0.
    - kind: image
      src: /images/case/after.jpg
      alt: MRI after treatment
      caption: After, month 6.
```

Multi-item media stacks vertically below 560 px.

| Field | Type | Required |
|---|---|:-:|
| `type` | `"media"` | ✅ |
| `heading` | string | |
| `items` | array of media items | ✅ (min 1) |
| `items[].kind` | `"image"` \| `"youtube"` | ✅ |
| `items[].src` | string (path or URL) | ✅ |
| `items[].alt` | string | (recommended for image) |
| `items[].caption` | string | |
| `items[].aspect` | `"16/9"` \| `"4/3"` \| `"3/2"` \| `"1/1"` | |
| `items[].uploadDate` | string (ISO date) | |

---

## `pathway`

Grouped chip lists — used on the `/conditions/` page to break the treatment index into brain / spine / pain pathways.

```yaml
- type: pathway
  heading: What we treat            # optional
  intro: Every referral falls into one of three pathways.  # optional
  groups:                            # min 1
    - eyebrow: "PATHWAY 01"          # optional
      title: Brain
      items:                         # min 1
        - name: Brain tumour
          href: /treatments/brain-tumor/
        - name: Stroke
          href: /treatments/stroke/
    - eyebrow: "PATHWAY 02"
      title: Spine
      items:
        - name: Herniated disc
          href: /treatments/herniated-disc/
```

`href` is locale-agnostic — `/treatments/foo/` becomes `/en/treatments/foo/` on EN pages, `/ar/treatments/foo/` on AR.

---

## `row`

2–4 column image row with optional captions and links.

```yaml
- type: row
  heading: Inside the clinic         # optional
  columns: "3"                       # "auto" | "2" | "3" | "4"
  items:
    - src: /images/facility/reception.jpg
      alt: Reception area
      caption: Reception              # optional
      href: /about/                   # optional — makes the whole cell a link
      aspect: "4/3"                   # optional
```

- `columns: auto` fits as many columns as space allows.
- Row images are optimised the same way as media images.

| Field | Type | Required |
|---|---|:-:|
| `type` | `"row"` | ✅ |
| `heading` | string | |
| `columns` | `"auto"` \| `"2"` \| `"3"` \| `"4"` | (defaults to `"auto"`) |
| `items` | array of `{src, alt?, caption?, href?, aspect?}` | ✅ (min 1) |

---

## `cards`

Related-reading cards. Each item is just a locale-agnostic path — the card's
title, description, category, and date are resolved from that entry's
frontmatter automatically at build time.

```yaml
- type: cards
  heading: Related reading           # optional — defaults to locale label
  items:
    - /treatments/herniated-disc/
    - /treatments/sciatica/
    - /blog/living-with-back-pain/   # works across any collection
```

- Cards can point at any collection (`treatments`, `services`, `blog`, `cases`).
- If the target entry doesn't exist, the card is silently skipped.
- If the target isn't `redesigned: true`, the card shows a "coming soon" pill and is unclickable.

| Field | Type | Required |
|---|---|:-:|
| `type` | `"cards"` | ✅ |
| `heading` | string | |
| `items` | array of paths (strings) | ✅ (min 1) |

---

## When to use which

A rough guide for building an article from a doctor's rough draft:

| The draft says… | Reach for… |
|---|---|
| "What is it: …", "Symptoms: …", "Approach: …" (three or four short bullets) | `highlights` — right at the top |
| "5,000 operations", "30% of patients", "25 years of practice" | `stats` |
| "It's important to know that…", "One key fact is…" | `facts` |
| A wall of text | `prose` — split into two or three blocks with headings |
| Timeline (education, appointments) | `list` variant `rows` |
| A big grid of qualifications/memberships | `list` variant `wrap` |
| "Before we do X, we first try Y, then Z" | `panels` — one panel per stage |
| A memorable quote from the doctor | `quote` |
| A photo or video | `media` |
| Links to related conditions | `cards` |
| Multiple photos of the facility | `row` |
| An index of many conditions grouped by category | `pathway` (used on `/conditions/` only) |
