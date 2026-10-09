# Building an article from the doctor's draft

The most common request: the doctor sends a rough draft (usually a few
paragraphs of prose, sometimes bullet points, maybe a photo attachment) and
asks for a proper article. Turn it into a block-based `sections: []` structure.

**Preserve the doctor's voice** ([`../user-manual/content-authoring.md#rule-1—preserve-the-doctors-voice`](../user-manual/content-authoring.md)).
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

Go through the draft chunk by chunk and pick the right widget for each.
**Don't restate the catalog here — it drifts.** Use the live reference:

- **Full "when to use which" cheat-sheet** — [`../user-manual/sections.md#when-to-use-which`](../user-manual/sections.md#when-to-use-which). Covers all 22 blocks: content (prose, highlights, stats, facts, list, quote, panels, faq), media (media, image-row, map), navigation/CTAs (pathway, cards, button, button-row, social-row, chips), composed building blocks (doctor-credit, contact-strip, label-tile), and the two layout primitives (row, column).
- **Full YAML syntax for every block** — the per-block sections of [`../user-manual/sections.md`](../user-manual/sections.md).

A rough priority order when assembling a clinical article:

1. **Summary first** — if the draft has a "what / symptoms / treatment" structure, open with `highlights`.
2. **Narrative** — long explanations go in `prose` with headings.
3. **Hard numbers** — `stats` (quote any value with digits so YAML doesn't parse it).
4. **Standalone facts** — `facts` for 2–5 items the doctor would repeat in a consultation.
5. **Staged treatment** — `panels` (2 reads as a comparison; 3–4 as options).
6. **Patient questions** — `faq` (auto-generates FAQPage JSON-LD).
7. **Media** — `media` for one or two anchor images; `image-row` for a facility gallery.
8. **Related reading** — `cards` at the bottom, pointing at related slugs.

Reach for layout primitives (`row`, `column`) only when a chunk really is
"two things side by side" — most clinical content is a vertical sequence.

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

Full field list per collection is in
[`../user-manual/content-authoring.md#frontmatter-reference`](../user-manual/content-authoring.md#frontmatter-reference)
— load it rather than guessing. Minimum shape for a sections-based
article:

```yaml
---
title: <same title the doctor would use in speech>
description: <one sentence, ~150 chars, for the meta description>
redesigned: true                              # tells ArticleBody to render sections[]
source: original                              # or ai-draft, human-reviewed, etc.
sections:
  - ...
---
```

Collection-specific additions (treatments' `category` + `bodyRegion`,
blog's `publishedAt` + `tags`, services' `isHub`, cases' `condition` +
`outcome`) are listed in the reference above.

Pages without `redesigned: true` still render — their Markdown body
goes through `ArticleBody`'s fallback — but you lose the sections
dispatcher. Set it when you're using blocks.

### 7. Duplicate for both locales

Every topic has both `en.md` and `ar.md`. If you can draft both,
do it; same frontmatter shape, translated content. If not, save the
AR side as a minimal stub with `source: ai-draft` and a clear TODO in
the body — the AR-only fallback banner will flag it to the user.

Full bilingual policy and voice rules:
[`../user-manual/content-authoring.md#the-bilingual-workflow`](../user-manual/content-authoring.md#the-bilingual-workflow)
+ Rule 1 of the same doc.

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
