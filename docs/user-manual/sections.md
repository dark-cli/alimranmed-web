# Sections — the block widgets

Every redesigned article (`redesigned: true` in frontmatter) and every
page-level file (home, about, contact, doctor profiles) renders through
a `sections: []` array, one entry per block. Each block has a `type`
field and its own set of allowed fields.

**Rules that apply to every block:**

- `type` is required and must match one of the values below exactly.
- Field names are case-sensitive.
- Optional fields can be omitted entirely; don't leave them as empty strings.
- Multi-line strings use YAML's block style:
  - `>-` folds newlines into spaces, no trailing newline (best for prose)
  - `|` preserves newlines (best for code snippets)
- Any block with an explicit `heading` field appears in the sidebar TOC and gets a numbered anchor (`s-1`, `s-2`, …).

The one-file source of truth for allowed fields is `src/content.config.ts`. When
in doubt, the schema in that file is authoritative and this doc is the summary.

---

## Overview

**Content**

| Block | Purpose | TOC entry? |
|---|---|:-:|
| [`prose`](#prose) | Paragraphs of text, optional heading | ✅ (if `heading`) |
| [`highlights`](#highlights) | 2–4 label/value cards ("at a glance") | ✅ (if `heading`) |
| [`stats`](#stats) | 2–6 big numbers + short label | ✅ (if `heading`) |
| [`facts`](#facts) | Numbered list of standalone facts | ✅ (if `heading`) |
| [`list`](#list) | Structured list, 3 layout variants | ✅ (if `heading`) |
| [`quote`](#quote) | Pull quote with attribution | ❌ |
| [`panels`](#panels) | 2–4 side-by-side comparison panels | ✅ (if `heading`) |
| [`faq`](#faq) | Q&A block, auto FAQPage JSON-LD | ✅ (if `heading`) |

**Media**

| Block | Purpose | TOC entry? |
|---|---|:-:|
| [`media`](#media) | Image, YouTube, or side-by-side strip | ✅ (if `heading`) |
| [`image-row`](#image-row) | 2/3/4-column image gallery | ✅ (if `heading`) |
| [`map`](#map) | Embedded Google / OSM map iframe | ✅ (if `heading`) |

**Navigation + CTAs**

| Block | Purpose | TOC entry? |
|---|---|:-:|
| [`pathway`](#pathway) | Grouped link chips (used on `/conditions/`) | ✅ (if `heading`) |
| [`cards`](#cards) | Related-reading auto-cards | ✅ (if `heading`) |
| [`button`](#button) | Single call-to-action button | ❌ |
| [`button-row`](#button-row) | Row of CTA buttons | ❌ |
| [`social-row`](#social-row) | Row of circular social icon links | ✅ (if `heading`) |
| [`chips`](#chips) | Inline label-only badges | ✅ (if `heading`) |

**Composed building blocks**

| Block | Purpose | TOC entry? |
|---|---|:-:|
| [`doctor-credit`](#doctor-credit) | Avatar + "Led by Name, title" byline | ❌ |
| [`contact-strip`](#contact-strip) | Bordered 1–3 column contact card | ❌ |
| [`label-tile`](#label-tile) | Typographic placeholder tile | ❌ |

**Layout primitives**

| Block | Purpose | TOC entry? |
|---|---|:-:|
| [`row`](#row) | Side-by-side layout holding any blocks | ✅ (if `heading`) |
| [`column`](#column) | Vertical stack of any blocks | ✅ (if `heading`) |

---

## `prose`

Paragraphs of text with optional heading, eyebrow, section number, and a `hero` variant for display-size headings. Markdown inline formatting works: `**bold**`, `_italic_`, `[link](/href/)`. Paragraphs split on blank lines.

```yaml
- type: prose
  heading: What it is           # optional — becomes an h2 + TOC entry
  body: >
    First paragraph. Inline
    [links](/services/tms/) are auto-localised.


    Second paragraph. **Bold** and _italic_ work.
```

**Hero variant** — display-size heading + larger body text. Match the
old home/doctor hero. Use at the very top of a hero row only.

```yaml
- type: prose
  variant: hero
  eyebrow: NEUROSURGERY · PAIN · REHAB
  heading: Specialist clinical care for Basra and the south.
  body: Modern, evidence-based treatment for conditions of the brain,
    spine, and musculoskeletal system — in-person at our Basra clinic.
```

**Numbered section** — mono "01" prefix with bottom rule above the heading. Use for structured documents (CV, procedure guides).

```yaml
- type: prose
  number: "01"
  heading: Background
  body: >-
    Trained at Mustansiriya University (MBChB, 1998), with
    fellowships in interventional pain management.
```

| Field | Type | Required | Notes |
|---|---|:-:|---|
| `type` | `"prose"` | ✅ | |
| `number` | string | | Mono prefix like `"01"`. Quote so YAML doesn't parse as a number. |
| `eyebrow` | string | | Small-caps accent line above the heading. Use with `variant: hero`. |
| `heading` | string | | Appears in the TOC when set. |
| `headingLevel` | `"h2"` \| `"h3"` | | Default `"h2"`. Use `"h3"` inside a split/panel. |
| `variant` | `"default"` \| `"hero"` | | Default `"default"`. |
| `body` | string (markdown) | | Omit when the block is just a numbered section header. |

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

**Band variant** — breaks out of the article container into a full-bleed strip with hairlines top + bottom. Matches the old home + doctor stat bands.

```yaml
- type: stats
  variant: band
  items:
    - { value: "5,000+", label: "Operations performed" }
    - { value: "25", label: "Years of practice" }
    - { value: "3", label: "Specialist fellowships" }
```

| Field | Type | Required | Notes |
|---|---|:-:|---|
| `type` | `"stats"` | ✅ | |
| `heading` | string | | |
| `intro` | string | | |
| `variant` | `"default"` \| `"band"` | | Default `"default"`. `"band"` is full-bleed. |
| `items` | array of `{value, label}` | ✅ (2–6 items) | |

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
| `heading` | string | |
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
      reading:                     # optional per-panel "related reading" links
        - title: Herniated disc
          href: /treatments/herniated-disc/
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
| `panels` | array of `{eyebrow?, title, subtitle?, items[], reading?}` | ✅ (2–4 panels) |
| `panels[].reading` | array of `{title, href}` | |

---

## `faq`

Question/answer list. Always visible (no accordion), optimised for Googlebot
indexing. Every item is automatically harvested into FAQPage JSON-LD on the
page — writers get SEO structured data for free.

```yaml
- type: faq
  heading: Common questions     # optional — defaults to locale label
  items:                        # min 1
    - question: Will I need surgery?
      answer: >-
        Most back pain resolves without surgery. We only recommend it
        when conservative care has failed and imaging confirms a
        structural cause. See [the treatment ladder](#treatment-ladder).
    - question: How soon will I feel better?
      answer: Typically within 2–4 weeks of starting physiotherapy.
```

Markdown inline links work inside `answer`. Default heading is "Common questions" (EN) / "أسئلة شائعة" (AR).

| Field | Type | Required |
|---|---|:-:|
| `type` | `"faq"` | ✅ |
| `heading` | string | |
| `items` | array of `{question, answer}` | ✅ (min 1) |

---

## `media`

One or more images / YouTube videos, laid out as a full-width figure (single item) or as a side-by-side grid (multiple items). Every image is auto-optimised through the image pipeline — you never need to write srcset yourself.

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

## `image-row`

Dedicated 2/3/4-column photo gallery. Use this when the content is a visual
grid (facility shots, procedure sequence, before/after sets). For mixed
content side-by-side (image + text), use the generic [`row`](#row).

```yaml
- type: image-row
  heading: Inside the clinic         # optional
  columns: "3"                       # "auto" | "2" | "3" | "4"
  items:
    - src: /images/facility/reception.jpg
      alt: Reception area
      caption: Reception              # optional
      href: /about/                   # optional — makes the whole cell a link
      aspect: "4/3"                   # optional
    - src: /images/facility/consult-room.jpg
      alt: Consultation room
    - src: /images/facility/or.jpg
      alt: Operating theatre
```

- `columns: auto` fits as many columns as space allows.
- Row images are optimised the same way as media images.

| Field | Type | Required |
|---|---|:-:|
| `type` | `"image-row"` | ✅ |
| `heading` | string | |
| `columns` | `"auto"` \| `"2"` \| `"3"` \| `"4"` | (defaults to `"auto"`) |
| `items` | array of `{src, alt?, caption?, href?, aspect?}` | ✅ (min 1) |

---

## `map`

Embedded Google Maps / OpenStreetMap iframe wrapped in a framed container.
The writer supplies the full iframe `src` URL — grab it from Google Maps →
Share → Embed a map → copy the `src="…"` value.

```yaml
- type: map
  heading: Find us on the map                       # optional
  title: Alimran Medical Center location in Basra   # required — iframe accessible title
  aspect: "16/9"                                    # optional — default "16/9"
  embedUrl: "https://www.google.com/maps/embed?pb=…"
```

| Field | Type | Required | Notes |
|---|---|:-:|---|
| `type` | `"map"` | ✅ | |
| `heading` | string | | |
| `embedUrl` | string | ✅ | Full iframe `src` URL. |
| `title` | string | ✅ | Accessible label for the iframe. |
| `aspect` | `"16/9"` \| `"4/3"` \| `"3/2"` \| `"1/1"` | | Default `"16/9"`. |

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
  footerLink:                        # optional — "see all" link below the groups
    label: See every condition
    href: /treatments/
```

`href` is locale-agnostic — `/treatments/foo/` becomes `/en/treatments/foo/` on EN pages, `/ar/treatments/foo/` on AR.

| Field | Type | Required |
|---|---|:-:|
| `type` | `"pathway"` | ✅ |
| `heading` | string | |
| `intro` | string | |
| `groups` | array of `{eyebrow?, title, items[]}` | ✅ (min 1) |
| `groups[].items` | array of `{name, href}` | ✅ (min 1) |
| `footerLink` | `{label, href}` | |

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

## `button`

A single call-to-action link, styled as a filled/outline/text button. Mostly
useful inside a [`row`](#row) or [`column`](#column); for a group of CTAs at
natural widths use [`button-row`](#button-row) instead.

```yaml
- type: button
  label: Book an appointment
  href: /contact/
  variant: primary        # "primary" | "secondary" | "quiet"
  newTab: false           # optional
```

| Field | Type | Required | Notes |
|---|---|:-:|---|
| `type` | `"button"` | ✅ | |
| `label` | string | ✅ | |
| `href` | string | ✅ | Internal paths starting with `/` are locale-aware. External URLs pass through. |
| `variant` | `"primary"` \| `"secondary"` \| `"quiet"` | | Default `"primary"`. |
| `newTab` | boolean | | Default `false`. |

---

## `button-row`

Row of CTA buttons at natural widths, with controllable alignment and gap.
Preferred over nesting `button` widgets inside a generic `row` — predictable
layout, no accidental grid stretching.

```yaml
- type: button-row
  align: start            # "start" | "center" | "end"
  gap: tight              # "tight" | "normal" | "wide"
  items:                  # min 1
    - label: See conditions
      href: /conditions/
      variant: primary
    - label: Meet the doctor
      href: /doctors/hussein-imran-mousa/
      variant: secondary
    - label: Call now
      href: tel:+9647801926801
      variant: quiet
      newTab: false
```

| Field | Type | Required | Notes |
|---|---|:-:|---|
| `type` | `"button-row"` | ✅ | |
| `align` | `"start"` \| `"center"` \| `"end"` | | Default `"start"`. |
| `gap` | `"tight"` \| `"normal"` \| `"wide"` | | Default `"tight"`. |
| `items` | array of button items | ✅ (min 1) | Same shape as [`button`](#button) minus the `type` field. |

---

## `social-row`

Row of circular icon-only social links. The `platform` string picks the icon
from FontAwesome Brands; the parent page's layout must have FontAwesome
loaded (`fontAwesome: true` on BaseLayout — already the case on the contact
page).

```yaml
- type: social-row
  heading: Follow us                                 # optional
  items:                                             # min 1
    - { platform: facebook,  href: "https://facebook.com/alimranmed" }
    - { platform: instagram, href: "https://instagram.com/alimranmed/" }
    - { platform: youtube,   href: "https://youtube.com/channel/…" }
    - { platform: telegram,  href: "https://t.me/alimraned" }
    - { platform: tiktok,    href: "https://tiktok.com/@alimranm" }
```

| Field | Type | Required | Notes |
|---|---|:-:|---|
| `type` | `"social-row"` | ✅ | |
| `heading` | string | | |
| `items[].platform` | enum (see below) | ✅ | |
| `items[].href` | string | ✅ | Full external URL. |
| `items[].label` | string | | Accessible label; defaults to the platform name. |

**Supported platforms:** `facebook`, `instagram`, `youtube`, `telegram`,
`tiktok`, `twitter`, `x`, `linkedin`, `whatsapp`.

---

## `chips`

Horizontal flex of small bordered labels. Use for credential badges (MBChB,
FRCS), tag lists, or any non-clickable short labels. For clickable chip
groups use [`pathway`](#pathway).

```yaml
- type: chips
  heading: Credentials      # optional
  items:
    - MBChB
    - MSc, Neurosurgery
    - Fellow, Stereotactic Society
```

| Field | Type | Required |
|---|---|:-:|
| `type` | `"chips"` | ✅ |
| `heading` | string | |
| `items` | array of strings | ✅ (min 1) |

---

## `doctor-credit`

Avatar + "Led by Name, title" byline with an optional profile link. Used on
the home page under the hero copy; could also appear as a byline inside
articles.

```yaml
- type: doctor-credit
  avatar: /images/doctors/hussein-imran-mousa-portrait.jpg
  avatarAlt: Dr Hussein Imran Mousa
  leadLabel: Led by                                        # optional
  name: Hussein Imran Mousa
  title: consultant neurosurgeon, pain and rehab physician
  linkLabel: Read full CV                                  # optional
  linkHref: /doctors/hussein-imran-mousa/
```

Default `leadLabel`: "Led by" (EN) / "بإشراف" (AR).

| Field | Type | Required | Notes |
|---|---|:-:|---|
| `type` | `"doctor-credit"` | ✅ | |
| `avatar` | string | ✅ | Image path — a round portrait, WebP works best. |
| `avatarAlt` | string | | |
| `leadLabel` | string | | Defaults to locale "Led by". |
| `name` | string | ✅ | |
| `title` | string | ✅ | E.g. "consultant neurosurgeon". |
| `linkLabel` | string | | Optional CV / profile link label. |
| `linkHref` | string | | Target of the link. |

---

## `contact-strip`

Bordered surface card with an eyebrow + intro body and 1–3 columns of
labelled contact entries. Powers the home-page referral band and the contact
page.

```yaml
- type: contact-strip
  eyebrow: Reach us                      # optional
  body: >-                               # optional
    We answer during clinic hours.
  columns:                               # min 1, max 3
    - label: Secretary
      items:
        - text: "+964-780-1926-801"
          href: tel:+9647801926801
        - text: "+964-770-6774-773"
          href: tel:+9647706774773
    - label: Email
      items:
        - text: info@alimranmed.com
          href: mailto:info@alimranmed.com
    - label: Address
      items:
        - text: Basra, Breaha, Alnkba Medical Collection
```

| Field | Type | Required |
|---|---|:-:|
| `type` | `"contact-strip"` | ✅ |
| `eyebrow` | string | |
| `body` | string | |
| `columns` | array of `{label, items[]}` | ✅ (1–3 columns) |
| `columns[].items` | array of `{text, href?}` | ✅ (min 1) |

`href` accepts `tel:`, `mailto:`, or a web URL.

---

## `label-tile`

Typographic placeholder tile — ALL CAPS top line + smaller sublabel on a
bordered surface. Used inside mixed-content image grids where one cell is a
real image and the rest are typographic tiles ("INSIDE THE CLINIC" / "A
WORKING SPACE").

```yaml
- type: label-tile
  label: INSIDE THE CLINIC
  sublabel: A working space, not a showroom.   # optional
```

| Field | Type | Required |
|---|---|:-:|
| `type` | `"label-tile"` | ✅ |
| `label` | string | ✅ |
| `sublabel` | string | |

---

## `row`

Side-by-side layout that holds **any** mix of child blocks (prose, media,
buttons, nested rows, nested columns, …). Collapses to a single column on
mobile. For a photo-only gallery use the dedicated [`image-row`](#image-row).

```yaml
- type: row
  heading: Inside the clinic      # optional
  columns: "2"                    # "auto" | "2" | "3" | "4"
  gap: normal                     # "tight" | "normal" | "wide"
  align: stretch                  # "start" | "center" | "stretch"
  items:                          # min 1 — any mix of blocks
    - type: prose
      heading: What you'll find
      body: >-
        Three consultation rooms, an interventional suite, a quiet
        waiting area with hot/cold drinks on request.
    - type: media
      items:
        - kind: image
          src: /images/facility/reception.jpg
          alt: Reception
```

- `columns: auto` fits children at a sensible natural width.
- Items can themselves be rows/columns — up to 3 levels of nesting in the CMS editor, unlimited when editing the Markdown directly.

| Field | Type | Required | Notes |
|---|---|:-:|---|
| `type` | `"row"` | ✅ | |
| `heading` | string | | |
| `columns` | `"auto"` \| `"2"` \| `"3"` \| `"4"` | | Default `"auto"`. |
| `gap` | `"tight"` \| `"normal"` \| `"wide"` | | Default `"normal"`. |
| `align` | `"start"` \| `"center"` \| `"stretch"` | | Default `"stretch"` (vertical alignment of children). |
| `items` | array of any blocks | ✅ (min 1) | |

---

## `column`

Vertical stack of child blocks. Mainly useful inside a row (e.g. "left
column: heading + prose + buttons") or on its own when a section needs a
tight vertical rhythm distinct from the article flow.

```yaml
- type: column
  gap: tight                      # "tight" | "normal" | "wide"
  align: start                    # "start" | "center" | "end" | "stretch"
  items:
    - type: prose
      heading: Modern clinical care
      body: Evidence-based diagnosis and treatment.
    - type: button-row
      items:
        - { label: Book now, href: /contact/, variant: primary }
```

| Field | Type | Required | Notes |
|---|---|:-:|---|
| `type` | `"column"` | ✅ | |
| `heading` | string | | |
| `gap` | `"tight"` \| `"normal"` \| `"wide"` | | Default `"normal"`. |
| `align` | `"start"` \| `"center"` \| `"end"` \| `"stretch"` | | Default `"stretch"` (horizontal alignment of children). |
| `items` | array of any blocks | ✅ (min 1) | |

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
| A big grid of qualifications / memberships | `list` variant `wrap` |
| "Before we do X, we first try Y, then Z" | `panels` — one panel per stage |
| Patient-asked questions | `faq` — automatically becomes SEO structured data |
| A memorable quote from the doctor | `quote` |
| A photo or video | `media` |
| Multiple photos of the facility | `image-row` |
| A photo PLUS some adjacent text or buttons | `row` with mixed children |
| Vertical stack of mixed blocks | `column` |
| Credential badges (MBChB, Fellow …) | `chips` |
| A "Led by Dr X" byline below the hero | `doctor-credit` |
| Phones, emails, address in a bordered card | `contact-strip` |
| Social media icon row | `social-row` |
| An embedded Google map | `map` |
| A single CTA button | `button` |
| Several CTAs clustered together | `button-row` |
| Typographic placeholder tile next to a real image | `label-tile` |
| Links to related conditions | `cards` |
| An index of many conditions grouped by category | `pathway` (used on `/conditions/` only) |
