# Writer's Guide

**Who this is for:** Anyone writing content for alimran.clinic — doctors sending drafts, assistants typing up notes, translators, or whoever is handing content off to the website.

**What this guide does:** Explains the **three ways** you can get content onto the site, and tells you exactly which other document to open for the details of each one.

> ⚠️ This guide is a map, not a manual. The details live in other files. Each section tells you which file to open and when.

---

## Table of Contents

- [How content gets onto the site (the big picture)](#how-content-gets-onto-the-site)
- [Pick your path](#pick-your-path)
- [Path A: CMS (click-and-type)](#path-a--cms-click-and-type)
- [Path B: Give a draft to an AI](#path-b--give-a-draft-to-an-ai)
- [Path C: Write the Markdown yourself](#path-c--write-the-markdown-yourself)
- [Where files live](#where-files-live)
- [Common questions](#common-questions)

---

## How content gets onto the site

Every article is **two files**: `en.md` (English) and `ar.md` (Arabic), stored in the right folder under `src/content/`. Both files are expected for every topic.

Each file has:

1. **Frontmatter** at the top — metadata (title, description, category…) between `---` lines.
2. **A `sections:` list** — the body of the article, built from **blocks** (highlights, prose, panels, stats, media…).

You don't have to write YAML by hand. Choose the path below that fits you.

---

## Pick your path

| You are… | Use path |
|---|---|
| A writer who doesn't want to touch code | **A — CMS** |
| Someone with a doctor's draft (text, bullets, voice memo) | **B — AI** |
| A developer / technical writer comfortable with Markdown | **C — Manual** |

You can also **mix**: use the AI to generate a first draft, then open it in the CMS to polish it.

Before you start **any** path, open these two reference pages in another tab:

- 📘 [`sections.md`](sections.md) — the full list of block types with YAML examples
- 🖼️ **The live block gallery** → run `npm run dev`, then visit:
  - [http://localhost:4321/en/dev-blocks/](http://localhost:4321/en/dev-blocks/) (English)
  - [http://localhost:4321/ar/dev-blocks/](http://localhost:4321/ar/dev-blocks/) (Arabic)

  Every block is shown twice — first as placeholder structure, then with real content. **Scroll this page before writing** so you know what each block looks like.

---

## Path A — CMS (click-and-type)

**No code. No YAML. A browser form.**

### 1. Start the CMS

```bash
npm install   # first time only
npm run dev
```

Open [http://localhost:4321/admin/](http://localhost:4321/admin/) in **Chrome, Edge, or Brave** (Firefox and Safari are not supported — the CMS uses the File System Access API).

Click **"Work with Local Repository"** → pick the project folder.

### 2. Create or edit an article

- **New article:** Click a collection (Treatments, Services, Blog…) → **"New Entry"**.
- **Edit existing:** Click a collection → pick the article → edit.

### 3. Fill in the fields

The CMS shows one field per form row. For the body, click **"Add Section"** to pick a block (highlights, prose, panels…) and fill its fields.

**If you don't know which block to use for a chunk of content**, flip to the block gallery at `/en/dev-blocks/` and match the content to the block that looks right.

### 4. Save

Hit **"Save"**. The CMS writes directly to the `.md` file on disk. You're done for English.

### 5. Switch locale and repeat

In the CMS, switch to the Arabic entry (or create it) and do the same thing. Both `en.md` and `ar.md` must exist.

### Full CMS reference

- 📘 [`cms.md`](cms.md) — all CMS features, limitations, and troubleshooting

---

## Path B — Give a draft to an AI

**Best for:** Doctors' rough notes, bullet lists, voice-memo transcripts, old WordPress articles you want restructured.

The AI handles the YAML, block layout, bilingual duplication, and schema compliance. **You review the output.**

### Step 1 — Write (or get) a draft

A "draft" is just the raw content. It can be:

- A bullet list
- A few paragraphs
- A voice memo transcript
- A rough WordPress export
- Scanned clinic notes

**Where to put the draft** — pick one:

**Option 1 — Paste it directly into the AI chat** (easiest, works for short drafts).

**Option 2 — Save it as a file under `drafts/`** (recommended for longer drafts or when you want a record):

```
drafts/
├── back-pain.txt        ← your rough draft
├── herniated-disc.md
└── doctor-voice-memo.txt
```

The `drafts/` folder is for your own working notes. Nothing in it is published; it just lives alongside the project so the AI can read it.

### Step 2 — Pick an AI tool

Any capable AI works. Pick based on budget and comfort:

| You want… | Use | Cost |
|---|---|---|
| Best quality, you already have Claude access | **Claude** (claude.ai or Claude Code) | Subscription |
| **Free, no subscription, works out of the box** | **Gemini** at [gemini.google.com](https://gemini.google.com) | Free |
| Free + agentic IDE that can read/write files for you | **[Antigravity](https://antigravity.google/)** (Google's free IDE, powered by Gemini) | Free |
| You already pay for ChatGPT | **ChatGPT** (GPT-4o or newer) | Subscription |

> 💰 **Recommendation if you don't want an ongoing subscription:**
> Install **Antigravity** ([antigravity.google](https://antigravity.google/)) and open this
> project folder in it. Antigravity is Google's free agentic coding environment —
> it uses Gemini under the hood, has generous free limits, and can read the
> project's docs and write the `.md` files for you directly, like Claude Code
> does. It's the closest free equivalent to having a paid AI pair-writer.
>
> Alternative with zero install: paste the prompt into [gemini.google.com](https://gemini.google.com)
> and copy the output back into the CMS yourself.

### Step 3 — Give the AI the right context

The AI needs to read **five files** before it can safely work on an article. Attach them, upload them, or paste their contents in:

1. 📘 [`docs/ai/SKILL.md`](ai/SKILL.md) — project rules, voice policy, non-negotiables
2. 📘 [`docs/ai/article-builder.md`](ai/article-builder.md) — step-by-step workflow for turning a draft into blocks
3. 📘 [`docs/sections.md`](sections.md) — all block types with YAML syntax
4. 📘 [`docs/content-authoring.md`](content-authoring.md) — frontmatter rules + bilingual policy
5. 📘 [`docs/ai/checks.md`](ai/checks.md) — commands to run before saying "done"

> 💡 **If you're using Claude Code or Antigravity inside this repo**, you can skip the manual file-attaching — those tools already read these docs. Just send the prompt below.
>
> **If you're using gemini.google.com or ChatGPT in a browser**, upload the five files (or paste their contents) alongside your prompt.

### Step 4 — Send this prompt (copy-paste, fill in the blanks)

```
I'm writing an article for alimran.clinic. Please build it as block-based
Markdown following the project rules.

STEP 1 — READ THESE FILES FIRST (in this order), BEFORE doing anything else.
Do not start writing until you have read them. Confirm when you are done
reading, then wait for me to say "proceed":

  1. docs/ai/SKILL.md         ← project rules + voice policy (NON-NEGOTIABLE)
  2. docs/ai/article-builder.md ← step-by-step workflow for turning a draft into blocks
  3. docs/sections.md          ← every block type with YAML syntax
  4. docs/content-authoring.md ← frontmatter fields + bilingual policy
  5. docs/ai/checks.md         ← commands to run before saying "done"

(If you can't access these files, tell me — I'll paste their contents.
Do NOT guess the project's rules from memory. The docs are the source of truth.)

STEP 2 — ARTICLE DETAILS (fill these in before sending):

  - Collection: treatments           ← one of: treatments, services, blog, doctors, cases
  - Slug (URL): back-pain            ← kebab-case, no spaces
  - Category: spine                  ← for treatments: spine | brain | pain
  - Source tag: ai-draft             ← see SKILL.md for options

STEP 3 — THE DRAFT:

  [Paste your rough draft here — bullets, paragraphs, voice-memo transcript,
   whatever you have. The AI will restructure it into blocks.]

  OR

  Read the draft from: drafts/back-pain.txt

STEP 4 — WHAT I NEED YOU TO DO (after you've read the docs in Step 1):

  1. Build src/content/treatments/back-pain/en.md with full frontmatter + sections
  2. Build src/content/treatments/back-pain/ar.md (translate, or leave a TODO
     stub as described in content-authoring.md)
  3. If my draft is thin, ASK me for missing pieces before inventing anything —
     follow article-builder.md "Identify gaps — ASK, don't invent"
  4. Preserve the doctor's clinical voice. No filler ("Are you suffering from…").
  5. Only use block types defined in docs/sections.md. Do not invent new ones.
  6. Run `npm run build` when done (as described in docs/ai/checks.md). Fix any
     errors before handing off.
  7. Report back with: the files you created, the preview URL, and any TODOs
     or questions you have for me.
```

> ⚠️ **Why the "read first, then wait" step matters:** AIs will happily
> start writing without checking the rules, which produces articles that
> fail Zod validation or violate the voice policy. The explicit pause
> forces the AI to ground itself in the actual project docs — not its
> general training — before it touches your content.

### Step 5 — Review the AI's output

Before publishing, check:

- [ ] Medical facts match the doctor's draft (nothing invented)
- [ ] Clinical voice preserved (no marketing filler)
- [ ] Both `en.md` and `ar.md` exist (or AR has a clear TODO stub)
- [ ] Links point to real pages (`ls src/content/treatments/<slug>/`)
- [ ] AI ran `npm run build` and it passed
- [ ] Preview in browser: `http://localhost:4321/en/<collection>/<slug>/`

### Step 6 — Polish in the CMS (optional)

If you want to tweak wording, open the CMS (`/admin/`) and edit the entry. The AI-written file is now a normal CMS entry.

### What the AI must follow (summary)

The AI docs enforce these rules — you don't have to repeat them, but you should know they exist:

- Preserve the doctor's voice; never soften clinical directness
- `redesigned: true` is required
- Both `en.md` and `ar.md` must exist
- No invented stats, images, or related-page links
- Must run `npm run build` before handing off

**All of this is in [`docs/ai/SKILL.md`](ai/SKILL.md)** and the AI reads it as part of the prompt.

---

## Path C — Write the Markdown yourself

**For developers / technical writers comfortable with Markdown + YAML.**

### 1. Open the references

- 📘 [`content-authoring.md`](content-authoring.md) — frontmatter fields, bilingual rules, Markdown gotchas
- 📘 [`sections.md`](sections.md) — every block with YAML syntax
- 🖼️ [`/en/dev-blocks/`](http://localhost:4321/en/dev-blocks/) — visual reference

### 2. Create the files

```bash
mkdir -p src/content/treatments/<slug>
touch src/content/treatments/<slug>/en.md
touch src/content/treatments/<slug>/ar.md
```

### 3. Copy a working example

Don't start from a blank file. Pick a similar article and copy it:

```bash
cp src/content/treatments/sciatica/en.md src/content/treatments/<slug>/en.md
```

Then edit the frontmatter and sections. The schema in `src/content.config.ts` is the authoritative source — the build will tell you if a field is wrong.

### 4. Build to validate

```bash
npm run build
```

Zod validation errors name the file + field. Fix them.

### 5. Preview

```bash
npm run dev
# Visit http://localhost:4321/en/treatments/<slug>/
# Visit http://localhost:4321/ar/treatments/<slug>/
```

### Full checklist

See [`docs/ai/checks.md`](ai/checks.md) — the same checks the AI runs, you should run too.

---

## Where files live

```
src/content/
├── treatments/<slug>/en.md       ← conditions (back pain, stroke, epilepsy)
├── treatments/<slug>/ar.md
├── services/<slug>/en.md         ← procedures (TMS, acupuncture, ozone)
├── services/<slug>/ar.md
├── blog/<slug>/en.md             ← articles & news
├── blog/<slug>/ar.md
├── doctors/<slug>/en.md          ← doctor profiles
├── doctors/<slug>/ar.md
└── cases/<slug>/en.md            ← case studies
    cases/<slug>/ar.md

drafts/                           ← YOUR working notes (not published)
├── back-pain.txt
└── voice-memo-2026-01-15.txt
```

Full folder map: [`project-structure.md`](project-structure.md)

---

## Common questions

### "Which path should I use?"

- **I just want to write content → CMS (Path A).**
- **I have a doctor's draft I need restructured → AI (Path B).**
- **I'm a developer → Manual (Path C).**

### "Where do I put my rough draft before giving it to the AI?"

Either:
- **Paste directly** into the AI chat (fine for short drafts), OR
- **Save as a file** under `drafts/<topic>.txt` and tell the AI to read from that path.

The `drafts/` folder is for your working notes — nothing in it is published.

### "Do I have to write both English and Arabic?"

Yes, every topic has both files. If you can only write one, create the other as a stub with a TODO comment — see [`content-authoring.md`](content-authoring.md#the-bilingual-workflow). The site shows a "translation in progress" banner so readers know.

### "How do I know which block to use?"

Open the block gallery: `npm run dev`, then [http://localhost:4321/en/dev-blocks/](http://localhost:4321/en/dev-blocks/). Every block type is shown with placeholder + real-content examples. Match your content to the block that fits.

Quick cheat-sheet (from [`sections.md`](sections.md)):

| You have… | Use block |
|---|---|
| A quick summary (what / symptoms / approach) | `highlights` |
| Paragraphs of explanation | `prose` |
| Hard numbers (percentages, counts) | `stats` |
| 2–5 standalone facts | `facts` |
| A list of items (timeline, memberships) | `list` |
| A memorable quote | `quote` |
| Treatment ladder or comparison | `panels` |
| An image or video | `media` |
| A photo gallery (2–4 images) | `row` |
| Links to related articles | `cards` |

### "What if the build fails?"

The error names the file and field. Open [`docs/ai/checks.md`](ai/checks.md) — it lists the common failures and their fixes.

### "Can I use HTML in the article?"

No. Astro's Markdown pipeline escapes raw `<div>` and inline styles. Use a block, or use Markdown links in a `prose` block.

### "How do I link to another page on the site?"

Use locale-agnostic paths. They auto-localize:

```markdown
See [TMS therapy](/services/tms/) for more.
```

On an English page → `/en/services/tms/`. On an Arabic page → `/ar/services/tms/`.

---

## Reference map

Here's every document you might need, in reading order:

| When you need… | Open |
|---|---|
| An entry point and overview (**you are here**) | `docs/writing-guide.md` |
| Frontmatter fields, bilingual rules | [`docs/content-authoring.md`](content-authoring.md) |
| Block types with YAML syntax | [`docs/sections.md`](sections.md) |
| How to use the CMS | [`docs/cms.md`](cms.md) |
| AI rules, voice policy, non-negotiables | [`docs/ai/SKILL.md`](ai/SKILL.md) |
| AI workflow: draft → article | [`docs/ai/article-builder.md`](ai/article-builder.md) |
| Build/validation commands | [`docs/ai/checks.md`](ai/checks.md) |
| Where every file in the project lives | [`docs/project-structure.md`](project-structure.md) |
| How images are optimized | [`docs/image-optimization.md`](image-optimization.md) |
| Deployment flow | [`docs/deployment.md`](deployment.md) |
| Visual block gallery (live) | `npm run dev` → `/en/dev-blocks/` |

---

**You don't need to memorize anything.** Keep this file + the block gallery open, pick a path, and the detail documents will carry you through.
