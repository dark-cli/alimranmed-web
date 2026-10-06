# Writer's Guide — How to Create Articles

This guide is for **content writers** (not developers) who want to write and publish articles on the Alimran Medical Center website.

You have **three options** for writing: use the CMS (easiest), write manually, or use AI assistance. This guide covers all three.

---

## Table of Contents

1. [File locations](#file-locations)
2. [The three ways to write](#the-three-ways-to-write)
3. [Understanding blocks (sections)](#understanding-blocks-sections)
4. [Each block type explained](#each-block-type-explained)
5. [Frontmatter guide](#frontmatter-guide)
6. [Bilingual articles](#bilingual-articles)
7. [Tips and best practices](#tips-and-best-practices)

---

## File Locations

Every article lives on disk in a folder with two files — one for English, one for Arabic:

```
src/content/
├── treatments/
│   ├── back-pain/
│   │   ├── en.md          ← English article
│   │   └── ar.md          ← Arabic article
│   └── sciatica/
│       ├── en.md
│       └── ar.md
├── services/
│   ├── tms/
│   │   ├── en.md
│   │   └── ar.md
├── blog/
├── doctors/
└── cases/
```

**Collections explained:**

| Collection | What goes here | URL format |
|---|---|---|
| `treatments` | Conditions & diagnoses (back pain, stroke, epilepsy) | `/treatments/back-pain/` |
| `services` | Procedures & therapies (TMS, acupuncture, physiotherapy) | `/services/tms/` |
| `blog` | Articles & news | `/blog/living-with-pain/` |
| `doctors` | Doctor profiles & CVs | `/doctors/hussein-imran-mousa/` |
| `cases` | Case studies | `/cases/herniated-disc-recovery/` |

---

## The Three Ways to Write

### Option 1: Use the CMS (Easiest) ✅ **Recommended for non-technical writers**

**What it is:** A web-based editor that runs locally. You click buttons instead of writing code.

**How to start:**
1. Run: `npm run dev`
2. Open [http://localhost:4321/admin/](http://localhost:4321/admin/) in Chrome or Edge
3. Click "Work with Local Repository" and select the project folder
4. Click to create or edit an article

**Pros:** Graphical interface, real-time preview, can't break the format

**Cons:** Requires running locally, Chrome/Edge/Brave only

**Full CMS guide:** See [`cms.md`](cms.md)

---

### Option 2: Write Manually (For developers or technical writers)

**What it is:** Edit the `.md` files directly in a text editor (VS Code, Sublime, etc.).

**Files you edit:**
- `src/content/treatments/your-topic/en.md`
- `src/content/treatments/your-topic/ar.md`

**Structure:**
```markdown
---
title: Article Title
description: 160 characters max.
category: spine
redesigned: true
sections:
  - type: highlights
    items:
      - label: What it is
        value: Short explanation
  - type: prose
    heading: More details
    body: >
      Longer paragraph here.
---
```

**Pros:** Full control, works in any text editor, Git-friendly

**Cons:** Must follow YAML format, typos can break things, steeper learning curve

**How to validate:** Run `npm run build` to check for errors before publishing.

---

### Option 3: Write a Draft + Use AI Assistance ✅ **Recommended for medical content**

**What it is:** Write a rough draft, give it to Claude (or another AI) along with this guide, and the AI formats it into article structure for you.

**Your workflow:**

1. **Write a rough draft** (any format — bullets, paragraphs, notes):
   ```
   What is back pain?
   - Chronic pain in lower or upper back
   - Can last months or years
   - Causes include muscle strain, disc bulge, arthritis
   
   When to worry
   - Numbness in legs
   - Loss of bladder control
   - Unexplained weight loss
   
   Treatment options
   - First: physical therapy, rest, medication
   - If that doesn't work: injections, nerve blocks
   - Last resort: surgery
   ```

2. **Send to Claude** with these instructions:
   ```
   I have a medical article draft for the Alimran Medical Center website.
   Please format it into our article structure using these blocks:
   
   [Include this writing guide document or paste key sections]
   
   Collection: treatments
   Topic: back pain
   
   Here's my draft:
   [Paste your rough draft here]
   
   Please:
   - Create the YAML frontmatter with title, description, category
   - Organize content into appropriate blocks (highlights, prose, panels, etc.)
   - Keep the doctor's clinical voice
   - Reference the writing guide for block structure and field rules
   - Create both en.md and ar.md versions (translate or note TODO)
   ```

3. **Review the AI output** — check medical facts, tone, structure

4. **Add to CMS or edit manually** using the formatted content

**Pros:** 
- Fast — AI handles formatting
- Less technical
- Good for content creators who think in bullets/outlines
- AI can translate too

**Cons:** 
- Requires human review (important!)
- AI might change the doctor's voice unintentionally
- AI may misunderstand medical terminology

**Pro tip:** The better your draft, the better the AI output. Include context like "This is for a neurosurgery clinic in Iraq" and "Keep the direct, clinical tone."

---

## Understanding Blocks (Sections)

A modern article on Alimran is built from **blocks** — visual components, each with a type and its own fields.

Think of LEGO blocks — each piece has a specific purpose:

```
┌─ HIGHLIGHTS block ─────────────────┐
│ At a glance                        │
│ • What it is                       │
│ • Symptoms                         │
│ • Approach                         │
└────────────────────────────────────┘
        ↓
┌─ PROSE block ──────────────────────┐
│ What causes back pain?             │
│ Lorem ipsum dolor sit amet...      │
│ Lorem ipsum dolor sit amet...      │
└────────────────────────────────────┘
        ↓
┌─ PANELS block ─────────────────────┐
│ Treatment ladder                   │
│ [First]  [Then]  [Last]            │
│  •pain    •nerve   •surgery        │
│  •rest    •inject                  │
└────────────────────────────────────┘
```

**Why blocks?**
- Professional, consistent look across all articles
- Mobile-friendly and responsive layout
- SEO optimized with proper headings and structure
- Reusable — doctors can copy structure from one article to another

**Visual preview:** Visit [http://localhost:4321/en/dev-blocks/](http://localhost:4321/en/dev-blocks/) after running `npm run dev` to see **every block type rendered live** with real examples. This is your reference for how articles look on the site.

---

## Each Block Type Explained

### 1. **`highlights`** — "At a Glance" Summary

**Best for:** Quick overview at the top (what it is, symptoms, approach).

**Visual:** 2–4 cards in a grid.

**Example:**
```yaml
- type: highlights
  items:
    - label: What it is
      value: A chronic inflammatory disease of the spine that causes progressive fusion of vertebrae.
    - label: Symptoms
      value: Pain, morning stiffness in lower back and hips, neck pain, fatigue.
    - label: Approach
      value: No cure. Goals are to relieve pain, preserve mobility, and delay spinal fusion.
```

**When to use:** Every article should start with this. It's the visual headline.

---

### 2. **`prose`** — Paragraphs & Body Text

**Best for:** Regular explanatory text, background, how it works.

**Visual:** Paragraphs with an optional heading (h2). Supports inline formatting: `**bold**`, `_italic_`, `[links](/path/)`.

**Example:**
```yaml
- type: prose
  heading: What causes back pain
  body: >
    Most back pain has a mechanical cause: a strain, a bulging disc,
    or wear of the facet joints. Occasionally, pain radiates into the leg,
    indicating nerve compression.

    The spine is a marvel of engineering — 33 vertebrae stacked with
    discs in between. But this load-bearing structure can fail under strain.
```

**When to use:** After highlights, explain the condition in depth. Split long text into 2–3 prose blocks with different headings.

**Note on formatting:**
- Use `>-` to fold multiple lines into one paragraph (best for prose)
- Use `|` to preserve line breaks (best for code/lists)
- Blank lines separate paragraphs

---

### 3. **`stats`** — Big Numbers

**Best for:** Clinical data: "30–50% of patients", "25 years experience", "5,000 procedures".

**Visual:** 2–6 large numbers with labels underneath.

**Example:**
```yaml
- type: stats
  heading: What we see in clinic
  intro: Every metric is from the doctor's own practice or published research.
  items:
    - value: "30–50%"
      label: Of cancer patients experience pain during active treatment
    - value: "75%"
      label: With advanced disease report pain
    - value: "60–70%"
      label: Achieve adequate analgesia with opioids and adjuvants
```

**When to use:** After prose, if you have strong numbers. Omit if you don't have data.

**Important:** Quote numbers like `"30–50%"` to prevent YAML parsing errors.

---

### 4. **`facts`** — Numbered List

**Best for:** Key facts that stand alone (one idea per bullet).

**Visual:** Auto-numbered list (01, 02, 03...). Uses Arabic numerals on Arabic pages.

**Example:**
```yaml
- type: facts
  heading: Key facts
  items:
    - Uncontrolled cancer pain is one of the strongest predictors of desire for hastened death.
    - Tolerance develops over months to years; this is different from addiction.
    - Interventional procedures can dramatically reduce opioid requirements.
```

**When to use:** 2–5 standalone facts that don't belong in a prose paragraph.

---

### 5. **`list`** — Structured Lists (3 Layouts)

A single block type with three visual styles. Pick one variant based on your content.

#### **5a. `list` variant `rows`** — Timeline / Education

**Visual:** Single column, stacked rows. Label on left (mono), body on right, optional subtitle beneath.

**Best for:** Appointments, education history, timeline entries.

**Example:**
```yaml
- type: list
  variant: rows
  heading: Appointments
  items:
    - label: "2006 — present"
      body: Consultant Neurosurgeon, Alsadr Teaching Hospital, Basra.
      subtitle: Head of the neurosurgical unit since 2018.
    - label: "2022 — present"
      body: Iraq Director, Middle East Stereotactic Society.
```

#### **5b. `list` variant `wrap`** — Grid / Memberships

**Visual:** Auto-fit responsive grid. Packs as many columns as the screen allows.

**Best for:** Short entries: memberships, certifications, tags, qualifications.

**Example:**
```yaml
- type: list
  variant: wrap
  heading: Memberships
  items:
    - label: "2022"
      body: European Society for Stereotactic Neurosurgery
    - label: "2020"
      body: World Stroke Organization
    - label: "2020"
      body: International Spinal Cord Society
```

#### **5c. `list` variant `columns`** — Fixed 2-Column Grid

**Visual:** Always 2 columns (collapses to 1 on mobile). Good for paired or medium-length entries.

**Best for:** Fellowships, paired comparisons, medium-length entries.

**Example:**
```yaml
- type: list
  variant: columns
  heading: Fellowships
  items:
    - label: "2013"
      body: Interventional Pain Management, Mobi Pain Clinic, Mumbai
      subtitle: Six-month attachment.
    - label: "2017"
      body: Anaesthesiology & Pain Medicine, Seoul National University
```

**Pick which one?**

| Use case | Variant |
|---|---|
| Timeline, education, appointments | `rows` |
| Many short items (memberships, tags) | `wrap` |
| Paired or medium-length items | `columns` |

---

### 6. **`quote`** — Pull Quote

**Best for:** Memorable statements, clinical principles, doctor's voice.

**Visual:** Styled quote with accent border, serif font, optional attribution.

**Example:**
```yaml
- type: quote
  text: The role of the physician is to help nature — nothing more, nothing less.
  attribution: — Hippocratic principle
```

**When to use:** Sparingly. One per article max. Use for statements that deserve emphasis.

---

### 7. **`panels`** — Comparison or Options Grid

**Best for:** Treatment ladders, before/after, step-by-step processes, multiple options.

**Visual:** 2–4 side-by-side panels. With 2 panels = comparison. With 3–4 = options grid.

**Example (2 panels = comparison):**
```yaml
- type: panels
  heading: Two approaches
  intro: Before and after adopting multi-modal pain management.
  panels:
    - eyebrow: Before
      title: Symptom-focused
      items:
        - Rest and NSAIDs
        - Escalating opioids
        - Repeat imaging
    - eyebrow: After
      title: Root-cause treatment
      items:
        - Nerve blocks + radiofrequency
        - Guided physiotherapy
        - Ozone injections
```

**Example (4 panels = options grid):**
```yaml
- type: panels
  heading: Treatment options at Alimran Medical Center
  panels:
    - title: Neuromodulation
      items:
        - "[rTMS](/services/tms/)"
        - Spinal cord stimulation
    - title: Injection therapies
      items:
        - Epidural steroids
        - "[Ozone injection](/services/ozone/)"
    - title: Advanced therapies
      items:
        - Pulsed radiofrequency
        - "[Acupuncture](/services/acupuncture/)"
    - title: Physiotherapy
      items:
        - Electrical stimulation
        - Laser therapy
```

**When to use:** Mid-to-late article for decision trees or treatment options.

---

### 8. **`media`** — Images & Videos

**Best for:** Photos, diagrams, YouTube videos.

**Visual:** Single image (full width) or multiple images (side-by-side grid).

**Example (single image):**
```yaml
- type: media
  items:
    - kind: image
      src: /images/clinic/reception.jpg
      alt: Alimran Medical Center reception area
      caption: Our modern clinic reception.
      aspect: "16/9"
```

**Example (side-by-side images):**
```yaml
- type: media
  heading: Before and after
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

**Example (YouTube video):**
```yaml
- type: media
  items:
    - kind: youtube
      src: https://www.youtube.com/watch?v=abc123XYZ
      caption: 4-minute overview of TMS therapy.
      aspect: "16/9"
      uploadDate: "2024-03-15"
```

**Image paths:** Use `/images/clinic/`, `/images/doctors/`, `/images/cases/`, etc.

**When to use:** Scattered throughout. Images break up text visually.

---

### 9. **`row`** — Image Gallery

**Best for:** Gallery of 2–4 images (facility photos, case studies).

**Visual:** 2–4 columns of images with optional captions and clickable links.

**Example:**
```yaml
- type: row
  heading: Inside the clinic
  columns: "3"
  items:
    - src: /images/facility/reception.jpg
      alt: Reception area
      caption: Reception
    - src: /images/facility/procedure-room.jpg
      alt: Procedure room
      caption: Procedure room
    - src: /images/facility/therapy-gym.jpg
      alt: Therapy gym
      caption: Therapy gym
```

**Columns option:**
- `"auto"` — responsive, fits as many as space allows
- `"2"`, `"3"`, `"4"` — fixed number of columns

**When to use:** Near the end, to showcase the clinic or case progression.

---

### 10. **`cards`** — Related Reading

**Best for:** Suggesting related articles at the end.

**Visual:** Grid of cards linking to other pages (auto-resolves title, description, date from the target page).

**Example:**
```yaml
- type: cards
  heading: Related reading
  items:
    - /treatments/herniated-disc/
    - /treatments/sciatica/
    - /blog/living-with-back-pain/
```

**When to use:** End of article. Links readers to related treatments/blog posts.

**Note:** Just provide paths. The system automatically pulls the title, description, and metadata from those pages.

---

### 11. **`pathway`** — Grouped Link Chips

**Best for:** Condition index pages (which conditions we treat, grouped by category).

**Visual:** Rows of grouped link chips.

**Example:**
```yaml
- type: pathway
  heading: Conditions we treat
  groups:
    - eyebrow: PATHWAY 01
      title: Brain
      items:
        - name: Brain tumour
          href: /treatments/brain-tumor/
        - name: Stroke
          href: /treatments/stroke/
    - eyebrow: PATHWAY 02
      title: Spine
      items:
        - name: Herniated disc
          href: /treatments/herniated-disc/
```

**When to use:** Only for index/hub pages (e.g., `/conditions/`).

---

## Frontmatter Guide

Every article starts with **frontmatter** — metadata in YAML format between `---` markers.

### Minimal Example (works for any collection):

```yaml
---
title: Article Title
description: 160 character max summary. Appears in search results and listing cards.
category: spine
redesigned: true
sections: [...]
---
```

### Full Example (treatments):

```yaml
---
title: Back Pain
description: >-
  Chronic and acute back pain — diagnosis, non-surgical options,
  and when surgery is the answer.
category: spine
bodyRegion: spine
order: 10
image: /images/treatments/back-pain-hero.jpg
imageAlt: Illustration of the spine
source: original
redesigned: true
updated: 2025-01-15
reviewedBy: Dr. Hussein
reviewedAt: 2025-01-15
sections:
  - type: highlights
    items: [...]
  - type: prose
    heading: What is back pain
    body: >
      Long explanation here...
---
```

### Field Reference:

| Field | Required? | What it's for | Example |
|---|:-:|---|---|
| `title` | ✅ | Page heading + browser tab + search results | `"Back Pain"` |
| `description` | | Search snippet (~160 chars) + listing card blurb | `"Chronic and acute back pain..."` |
| `category` | | Grouping in menus | `"spine"`, `"brain"`, `"pain"` |
| `order` | | Display priority (lower = higher on list). Default 999 | `10` |
| `image` | | Hero image path | `"/images/treatments/back-pain.jpg"` |
| `imageAlt` | | Alt text for hero image | `"Illustration of the spine"` |
| `redesigned` | ✅ | Must be `true` for new articles | `true` |
| `source` | | Content origin (for audit trail) | `original`, `legacy-wp`, `ai-draft`, `human-reviewed`, `translated-by-llm` |
| `updated` | | Last review date | `2025-01-15` |
| `reviewedBy` | | Clinician who approved | `"Dr. Hussein Imran Mousa"` |
| `reviewedAt` | | When reviewed | `2025-01-15` |

**For `treatments` only:**
- `bodyRegion` — used to group on `/conditions/` → `spine`, `brain`, `pain`

**For `blog` only:**
- `author` — byline
- `publishedAt` — publish date
- `tags` — free-form tags
- `clinicallyRelevant` — show on `/conditions/` too

**For `doctors` only:**
- `fullName` — used as h1
- `titles` — credentials (MBChB, FIBMS, etc.)
- `photo` — portrait path
- `heroLede` — tagline under name

---

## Bilingual Articles

**Every article must have both English and Arabic versions.** They live side-by-side:

```
src/content/treatments/back-pain/
  ├── en.md    ← English
  └── ar.md    ← Arabic
```

### Rules:

1. **File paths and categories must match** — both use the same folder name (`back-pain`)
2. **Frontmatter structure matches** — same fields, but content differs
3. **Content is independent** — EN and AR are separate; you don't need to translate word-for-word
4. **Pick the better version** — if one language is cleaner/more clinical, use that as the reference

### Example:

**English (`en.md`):**
```yaml
---
title: Back Pain
description: Chronic and acute back pain — diagnosis and treatment options.
category: spine
redesigned: true
sections:
  - type: highlights
    items:
      - label: What it is
        value: Pain in the lower or upper back lasting more than three months.
---
```

**Arabic (`ar.md`):**
```yaml
---
title: ألم الظهر
description: ألم الظهر المزمن والحاد — التشخيص والخيارات العلاجية.
category: spine
redesigned: true
sections:
  - type: highlights
    items:
      - label: ما هو
        value: ألم في أسفل أو أعلى الظهر استمر أكثر من ثلاثة أشهر.
---
```

### If you're not fluent in both languages:

1. Write one language fully
2. Create a stub for the other with a TODO comment:
   ```yaml
   ---
   title: TODO — Arabic title needed
   # TODO: This article needs a proper Arabic translation.
   # English version is complete at en.md.
   sections: []
   ---
   ```

The site will show a "translation in progress" banner, so readers know.

---

## Tips and Best Practices

### 1. **Start with a real example**
Copy an existing article in your collection (e.g., another treatment) and adapt it. Don't start from scratch.

### 2. **Use the dev-blocks page for visual reference**
After running `npm run dev`, visit:
- [http://localhost:4321/en/dev-blocks/](http://localhost:4321/en/dev-blocks/) — English blocks
- [http://localhost:4321/ar/dev-blocks/](http://localhost:4321/ar/dev-blocks/) — Arabic blocks

Every block type is shown twice: structure (placeholder) and in use (real example). **Look here first** before writing your own.

### 3. **Keep it direct and clinical**
Avoid filler like "Are you suffering from back pain? Read on to discover…" The site's voice is factual and doctor-forward.

### 4. **Preserve the doctor's voice**
If content comes from the doctor's notes, keep their terminology and clinical stance. Repair grammar/translation, but don't rephrase.

### 5. **Use `>-` for paragraphs, `|` for lists/code**

In YAML:
- `>-` folds multi-line text into one paragraph (best for prose)
- `|` keeps line breaks (best for bullet lists)

```yaml
# Use >- for prose
body: >-
  This is a long paragraph that spans
  multiple lines in the YAML but will
  fold into one paragraph in the output.

# Use | for lists/code
items:
  - "Item one"
  - "Item two"
```

### 6. **Quote numbers in YAML**
Prevent parsing errors:

```yaml
# ✅ Correct
- value: "30–50%"
  label: Of patients

# ❌ Wrong — YAML reads 30 as a number
- value: 30–50%
  label: Of patients
```

### 7. **Write 160 characters max for descriptions**
That's the limit for search snippets. Shorter is better.

```yaml
# ✅ Good (155 chars)
description: >-
  Chronic and acute back pain — diagnosis, non-surgical options,
  and when surgery is the answer.

# ❌ Too long (will be cut off in search results)
description: >-
  Learn all about back pain, including what causes it, how to treat it
  at home, when to see a doctor, and all the surgical options available...
```

### 8. **Link to other pages**
Use locale-agnostic paths; the system auto-localizes:

```yaml
body: >-
  For more on [HLA-B27](/blog/hla-b27/), see our blog post.
```

On English pages → `/en/blog/hla-b27/`
On Arabic pages → `/ar/blog/hla-b27/`

### 9. **Use blocks to avoid walls of text**
Don't write one massive prose block. Break long text into:
- Highlights (top)
- Prose + heading (what it is)
- Stats (if you have data)
- Prose + heading (how we treat it)
- Panels (options)
- Cards (related reading)

### 10. **Validate before publishing**
If editing manually: run `npm run build` to check for YAML/Markdown errors.

---

## Quick Checklist

Before publishing, verify:

- [ ] **File location:** `src/content/<collection>/<slug>/<locale>.md`
- [ ] **Frontmatter:** title, description, category, `redesigned: true`
- [ ] **Bilingual:** Both `en.md` and `ar.md` exist
- [ ] **Blocks:** At least highlights + prose
- [ ] **Descriptions:** ~160 chars max
- [ ] **Numbers quoted:** `"30–50%"` not `30–50%`
- [ ] **Links checked:** `/treatments/foo/` format (locale-agnostic)
- [ ] **Images:** Paths exist, alt text filled
- [ ] **Visual check:** Run `npm run dev`, visit the live page
- [ ] **Grammar:** Spell-checked (especially Arabic)

---

## Need Help?

- **For block syntax details:** See [`sections.md`](sections.md)
- **For technical fields:** See [`content-authoring.md`](content-authoring.md)
- **For CMS help:** See [`cms.md`](cms.md)
- **To see all blocks live:** Visit [/en/dev-blocks/](http://localhost:4321/en/dev-blocks/) (after `npm run dev`)

---

**Happy writing!** 🏥✍️
