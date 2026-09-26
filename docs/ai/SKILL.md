---
name: alimranmed-web
description: Content collaborator + engineer for the Alimran Medical Center website. Use for editing articles, adding widgets, running build/lint checks, and turning the doctor's rough drafts into publishable pages.
---

# alimranmed-web — AI skill

You are collaborating on **alimran.clinic** — a bilingual (English/Arabic)
clinical website. Content is authored in Markdown under `src/content/`, built
by Astro, and deployed to Cloudflare Pages on every push to `main`.

The doctor's voice is direct and clinical. Your job is to **preserve it, not
rewrite it.** Repair broken translations and WordPress artefacts. Never soften
clinical directness with generic copy ("Are you suffering from…", "Read on to
discover…"). Every fact goes back to the doctor for confirmation if ambiguous.

---

## Read these before starting any task

- [`../README.md`](../../README.md) — one-screen overview
- [`../project-structure.md`](../project-structure.md) — where everything lives
- [`../content-authoring.md`](../content-authoring.md) — frontmatter rules + bilingual policy
- [`../sections.md`](../sections.md) — every block widget with syntax
- [`../deployment.md`](../deployment.md) — how deploys work (matters when you commit)

Two supporting docs specific to AI work:

- [`article-builder.md`](article-builder.md) — turning a doctor's draft into a block-based article, incl. what to ask the doctor for
- [`checks.md`](checks.md) — the commands you must run before saying "done"

---

## Non-negotiable rules

1. **Always run `npm run build` before saying a task is done.** If it fails, fix it before committing. See [`checks.md`](checks.md).
2. **Never `git push` unless the user asks.** Local commits are fine; pushing triggers a live deploy.
3. **Do not touch `src/content/posts/`** — that collection is not published (see the schema comment).
4. **Do not reintroduce content that was deliberately removed.** Twelve pages 301-redirect for a reason. Ozone-therapy claims were pulled after clinical review. Grep `git log --all --grep=remov` before restoring anything.
5. **Content changes go through the CMS voice discipline** (see [`../content-authoring.md#rule-1—preserve-the-doctors-voice`](../content-authoring.md)). Fix errors; don't rewrite meaning.
6. **Every article has both `en.md` and `ar.md`.** If you create/edit one, address the other in the same task — either update it in parallel or leave a clear TODO in the response so the user knows.
7. **Ask before large refactors.** Fixing a bug is fine; converting a component to a different pattern isn't.
8. **Never bypass `--no-verify` or skip build steps.** If a hook fails, fix the root cause.

---

## Common tasks

### "Add a new article"

1. Pick the collection: is it a **condition** (`treatments/`), a **procedure** (`services/`), an **editorial post** (`blog/`), or a **case report** (`cases/`)?
2. Choose the slug — kebab-case, URL-safe: `epilepsy`, `back-pain`, `endoscopic-spine-surgery`.
3. Create `src/content/<collection>/<slug>/en.md` and `src/content/<collection>/<slug>/ar.md`.
4. Frontmatter must include: `title`, `description`, `redesigned: true`, plus collection-specific required fields ([`../content-authoring.md`](../content-authoring.md#frontmatter-reference)).
5. Body goes in `sections: [...]`. See [`article-builder.md`](article-builder.md) for turning a rough draft into blocks.
6. Run `npm run build`. If it errors on Zod validation, the message names the file and field.
7. Show the user the local preview URL: `http://localhost:4321/en/<collection>/<slug>/`.

### "Edit an existing article"

1. Find the file: `src/content/<collection>/<slug>/<locale>.md`.
2. Make the edit — respecting Rule 1 of [content-authoring.md](../content-authoring.md).
3. If you edited `en.md`, look at `ar.md` — does the change need to be mirrored?
4. Run `npm run build`.

### "Add a new block/widget type"

Widgets are defined in **three places** that must stay in sync:

1. **Zod schema** in `src/content.config.ts` — add a new object to the `section` discriminated union
2. **Component** at `src/components/blocks/<NewBlock>.astro`
3. **Dispatcher** in `src/components/blocks/Sections.astro` — add a case for the new `type`
4. **CMS config** in `public/admin/config.yml` — add the widget under `_sections_field.types:`
5. **CMS preview** in `public/admin/preview.js` — add a rendering function

Then:

6. **Update `docs/sections.md`** — add the widget reference
7. **Add a preview to `src/pages/[locale]/dev-blocks.astro`** so QA can see it in isolation
8. Run `npm run build`

### "Doctor sent a rough draft — build me an article"

See [`article-builder.md`](article-builder.md). Summary:

1. Read the draft in full first
2. Identify the block that fits each chunk of content
3. If a chunk hints at data the draft doesn't include (stats, key facts, related pages), **ask the doctor for it** before assuming
4. Assemble the sections array
5. Draft both languages if you can, or leave the other with a clear TODO
6. Preview + build

### "Something broke on the live site"

1. Reproduce with `npm run build` locally — the error is almost always there too
2. If not, open Cloudflare Pages → Deployments → the failing deploy → Build logs
3. See [`../deployment.md#when-the-site-doesnt-update-after-10-minutes`](../deployment.md)

---

## Deployment cadence

- Local commit is free — do it often, with clear messages.
- **Push only when the user asks.** Every push to `main` triggers a live deploy.
- After push, allow **5–10 minutes** for Cloudflare Pages to build and publish.
- If the site hasn't updated after ~10 minutes, tell the user to check the Pages build log.

---

## Best practices distilled

These are lessons from real fixes on this project. Follow them by default:

- **Media block images** — always use the schema-defined `kind: image` shape, not a raw `<img>`. The `<Image>` component handles srcset for you.
- **Every new image gets responsive variants automatically** if it lives under `public/images/` and is ≥400 px wide. Don't hand-write srcset strings; call `imageVariants()` if you need the URLs.
- **Frontmatter that fails Zod validation** stops the build. The error names the file and field — read it, fix the field, rebuild.
- **RTL is automatic.** Set `dir="rtl"` never happens in article code; the shell handles it based on locale. If you're writing per-block styles, target `html[dir="rtl"] .my-block` globally.
- **Section headings feed the TOC.** If you want a block to appear in the sidebar TOC, give it a `heading:`. If you don't, don't.
- **`redesigned: true`** is what makes an article visible to nav and search. Legacy pages without it live at their URL but don't link into the site.
- **Both locales must always exist** for every topic. If AR is a fallback stub, note it clearly so the AR-only fallback banner shows.
- **`cards` block resolves paths at build time.** Point at a slug; the title/description are pulled from that slug's frontmatter automatically. Don't duplicate them.
- **No custom HTML in Markdown.** Astro's markdown pipeline escapes `<div>`s and inline styles. Use a block widget instead, or a `prose` block with links.

---

## Preferred tools

- `npm run build` — the ONLY reliable way to know if a change is publishable
- `npm run check` — build + tsc + wrangler dry-run (slow but thorough)
- `npm run dev` — HMR-enabled preview for interactive iteration
- `grep -rn "pattern" src/` — fastest way to find where something is used
- Never use `npm audit fix --force` — you'll break the build

---

## Files that AI should not touch

- `package-lock.json` — hand-editing breaks reproducibility
- `.astro/` — build cache
- `dist/` — build output
- `public/optimized/*.webp` — regenerated by the optimizer
- Anything in `.claude/`, `.wrangler/`, `.dev.vars` — local config
