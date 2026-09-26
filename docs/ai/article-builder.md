# Building an article from the doctor's draft

The most common request: the doctor sends a rough draft (usually a few
paragraphs of prose, sometimes bullet points, maybe a photo attachment) and
asks for a proper article. Turn it into a block-based `sections: []` structure.

**Preserve the doctor's voice** ([`../content-authoring.md#rule-1—preserve-the-doctors-voice`](../content-authoring.md)).
Your job is layout and structure, not rewriting.

---

## The workflow

### 1. Read the whole draft first

Don't start assembling blocks until you've read the entire draft. You want to
map the doctor's structure onto the widgets, not just linearise the paragraphs.

### 2. Identify the collection + slug

| Content type | Collection | Slug format |
|---|---|---|
| A condition ("Back pain", "Epilepsy") | `treatments` | `back-pain`, `epilepsy` |
| A procedure we offer ("TMS", "Vertebroplasty") | `services` | `tms`, `vertebroplasty` |
| A general-audience article ("What is a stroke?") | `blog` | Kebab-case topic |
| A patient case report | `cases` | `paediatric`, `spine` (grouped) |

If uncertain, ask the doctor whether they view the topic as a condition to be
treated or a procedure they offer.

### 3. Match content chunks to blocks

Go through the draft chunk by chunk. Reach for these widgets, in this order:

| Draft says… | Use block |
|---|---|
| "In summary: it's X. Symptoms are Y. Approach is Z." | **`highlights`** at the top |
| A long "what is it" explanation | **`prose`** with a heading |
| Hard numbers ("5,000 operations", "25 years", "30–50%") | **`stats`** |
| A short list of standalone bullet-point facts | **`facts`** |
| "First we try A, then B, then C" (staged treatment) | **`panels`** — one panel per stage |
| Timeline (education, appointments) | **`list`** variant `rows` |
| Big grid of qualifications | **`list`** variant `wrap` |
| A memorable quote | **`quote`** |
| Photo or video | **`media`** |
| Related conditions/procedures | **`cards`** at the bottom |

See [`../sections.md`](../sections.md) for the full syntax of each.

### 4. Identify gaps — ASK, don't invent

The doctor's draft rarely fits every block cleanly. **Ask** for missing pieces
rather than making them up:

- **Stats block feels light** → "Do you have any patient-count or outcome statistics for this? e.g. how many operations, what percentage improve?"
- **No facts block** → "Are there 2–3 specific facts you want patients to remember about this — the kind of thing you'd say twice in a consultation?"
- **Missing images** → "Do you have a diagram or photo I could include? Even a phone photo is useful."
- **No FAQ items** → "What are the 3–5 questions patients most commonly ask you about this?"
- **No related pages** → "Which of our existing conditions or procedures should this link to?"
- **Category unclear** → "Does this fall under the brain, spine, or pain pathway?"

Ask in a batched, brief way. Don't ask ten questions one at a time.

### 5. Assemble the sections array

Start with the minimum viable article:

```yaml
sections:
  - type: highlights       # short summary at the top
    items: [...]
  - type: prose            # what it is
    heading: What it is
    body: >
      ...
  - type: prose            # how we treat it
    heading: Treatment
    body: >
      ...
  - type: cards            # related reading
    items:
      - /treatments/...
```

Add more blocks as the content deserves. Don't pad with empty blocks.

### 6. Write frontmatter

```yaml
---
title: <same title the doctor would use in speech>
description: <one sentence, ~150 chars, for the meta description>
category: <pain | spine | brain | ...>       # for treatments/blog
bodyRegion: <spine | brain>                   # for treatments only
redesigned: true                              # required for the article to show
source: original                              # or ai-draft, human-reviewed, etc.
sections:
  - ...
---
```

Every article MUST have `redesigned: true` to appear in nav and search.

### 7. Duplicate for both locales

Every topic has both `en.md` and `ar.md`. Options:

- **You can write both** → do it. Same frontmatter shape, translated content.
- **You can only write one comfortably** → save the other as a minimal stub with a TODO:
  ```yaml
  ---
  title: <topic>
  description: <machine translation, TODO clinical review>
  redesigned: true
  source: ai-draft
  sections:
    - type: prose
      heading: TODO
      body: >
        <TODO — clinical Arabic translation needed>
  ---
  ```
  This makes the AR-only fallback banner show, which signals to the user that they need to translate.

### 8. Preview

```bash
npm run dev
```

Open:
- `http://localhost:4321/en/<collection>/<slug>/`
- `http://localhost:4321/ar/<collection>/<slug>/`

Check:
- Sidebar TOC has the right entries
- Meta widget shows correct category/reading time
- No broken links to related pages
- Images render (if you added any — they'll be raw src in dev; that's expected)

### 9. Build + report

```bash
npm run build
```

If the build succeeds, tell the user:
- The URL where they can preview it
- Any TODOs you left in the AR version (or vice versa)
- Any images or data you invented — flag these so the doctor can confirm

If the build fails, fix the frontmatter/schema error and retry. Don't hand off
a broken build.

---

## Anti-patterns

Don't do these. Ever.

### ❌ Padding stats with round numbers you invented

```yaml
- type: stats
  items:
    - value: "1000+"      # ← where did this number come from?
      label: Patients treated
```

If the doctor didn't give you a number, don't use a stats block. Ask.

### ❌ Adding a "conclusion" or "summary" prose block at the end

Medical articles don't need marketing conclusions. The information is the
article; a summary is filler. If the doctor's draft ends abruptly, that's fine.

### ❌ Rewriting the doctor's wording to sound smoother

If the doctor writes "Chiropractic manipulation can worsen an unrecognised
disc herniation" — leave it. Don't smooth it to "Chiropractic care may not be
suitable in every case." The clinical directness IS the value.

### ❌ Adding stock photos

Every image on the site is either a real facility photo, a doctor portrait, or
a purchased/licensed medical diagram. Never insert stock imagery from Unsplash
etc. unless the doctor explicitly asks for it.

### ❌ Filling `related` cards with slugs you didn't verify exist

```yaml
- type: cards
  items:
    - /treatments/lumbar-decompression/     # ← does this article actually exist?
```

Check with `ls src/content/treatments/lumbar-decompression/`. If it doesn't
exist, either omit the card or create a stub — but tell the user.

---

## When the draft is really thin

Sometimes the doctor sends "Back pain — chronic pain in the lower back, usually
mechanical, treated conservatively first."

**That's not enough.** Options in order of preference:

1. **Ask a batch of questions.** "For back pain I'd want to cover: symptoms
   patients typically describe, common causes, your treatment ladder from
   conservative to surgical, when someone should see a specialist urgently, and
   any interesting stats or facts. Can you send a few bullets on each?"
2. **Search similar existing articles.** `ls src/content/treatments/ | grep -i pain`
   — if there's already a related article, pattern-match its structure.
3. **Draft a skeleton with `TODO`s.** Give the user a starting point they can
   fill in, rather than fabricating clinical content.

Fabricating medical content is worse than an incomplete article. **Always ask
before making up facts.**
