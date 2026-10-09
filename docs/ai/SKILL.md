---
name: alimranmed-web
description: Use when editing content, adding sections or widgets, converting a doctor's rough draft into blocks, adding a new content collection, or running build/lint checks for the Alimran Medical Center website (alimran.clinic). A bilingual (EN/AR) clinical site built with Astro + Sveltia CMS, deployed to Cloudflare Pages on every push to main.
---

# alimranmed-web — AI collaborator brief

You are collaborating on **alimran.clinic**, a bilingual clinical site.
Content is Markdown under `src/content/`, built by Astro, deployed on
push to `main`. This file is the AI-specific contract on top of the
project docs — it tells you **how** to work, not **what** the project
looks like. Load the human docs below for schemas, syntax, workflows.

The doctor's voice is direct and clinical. Your job is to **preserve
it, not rewrite it.** Repair broken translations and WordPress
artefacts. Never soften clinical directness with generic copy ("Are
you suffering from…", "Read on to discover…"). Every fact goes back
to the doctor for confirmation if ambiguous.

---

## Read before any task

Project orientation and schema reference are maintained once, in the
human-facing docs. Load the ones relevant to the task:

- [`../../README.md`](../../README.md) — one-screen overview
- [`../dev/project-structure.md`](../dev/project-structure.md) — where everything lives
- [`../dev/deployment.md`](../dev/deployment.md) — how deploys work (matters when you commit)
- [`../user-manual/content-authoring.md`](../user-manual/content-authoring.md) — frontmatter rules + bilingual policy + voice discipline
- [`../user-manual/sections.md`](../user-manual/sections.md) — every one of the 22 block widgets with YAML syntax + the "when to use which" cheat-sheet
- [`../user-manual/cms.md`](../user-manual/cms.md) — Sveltia admin tour (useful when a request is really a CMS workflow)

Two supporting docs here that are AI-only:

- [`article-builder.md`](article-builder.md) — turning a doctor's draft into a block-based article: workflow + anti-patterns + what to ask the doctor for
- [`checks.md`](checks.md) — the commands you must run before saying "done"

---

## Non-negotiable rules

1. **Always run `npm run build` before saying a task is done.** If it fails, fix it before committing. See [`checks.md`](checks.md).
2. **Never `git push` unless the user asks.** Local commits are fine; pushing triggers a live deploy.
3. **Do not touch `src/content/posts/`** — that collection is not published (see the schema comment).
4. **Do not reintroduce content that was deliberately removed.** Twelve pages 301-redirect for a reason. Ozone-therapy claims were pulled after clinical review. Grep `git log --all --grep=remov` before restoring anything.
5. **Content changes go through the CMS voice discipline** (see [`../user-manual/content-authoring.md#rule-1—preserve-the-doctors-voice`](../user-manual/content-authoring.md)). Fix errors; don't rewrite meaning.
6. **Every article has both `en.md` and `ar.md`.** If you create/edit one, address the other in the same task — either update it in parallel or leave a clear TODO in the response so the user knows.
7. **Ask before large refactors.** Fixing a bug is fine; converting a component to a different pattern isn't.
8. **Never bypass `--no-verify` or skip build steps.** If a hook fails, fix the root cause.

---

## Common tasks

### "Add a new article"

1. Pick the collection: **condition** (`treatments/`), **procedure** (`services/`), **editorial** (`blog/`), or **case report** (`cases/`).
2. Choose the slug — kebab-case, URL-safe: `epilepsy`, `back-pain`, `endoscopic-spine-surgery`.
3. Create `src/content/<collection>/<slug>/en.md` and `.../ar.md`.
4. Frontmatter per [`../user-manual/content-authoring.md#frontmatter-reference`](../user-manual/content-authoring.md). Set `redesigned: true` **if** the body uses `sections:` — otherwise the Markdown body renders through `ArticleBody`'s fallback and `redesigned` is optional.
5. Body goes in `sections: [...]`. See [`article-builder.md`](article-builder.md) for turning a rough draft into blocks.
6. Run `npm run build`. Zod validation errors name the file + field.
7. Show the user the preview URL: `http://localhost:4321/en/<collection>/<slug>/`.

### "Edit an existing article"

1. Find the file: `src/content/<collection>/<slug>/<locale>.md`.
2. Make the edit — respecting Rule 1 of [content-authoring.md](../user-manual/content-authoring.md).
3. If you edited `en.md`, look at `ar.md` — does the change need to be mirrored?
4. Run `npm run build`.

### "Add a new block/widget type"

Widgets are defined in **five places** that must stay in sync:

1. **Zod schema** — `src/content.config.ts`, add an object to the `section` discriminated union
2. **Component** — `src/components/blocks/<NewBlock>.astro`
3. **Dispatcher** — `src/components/blocks/Sections.astro`, add a case for the new `type`
4. **CMS config** — `public/admin/config.yml`, add the widget under the `_sections_field` anchors
5. **CMS preview** — `public/admin/preview.js`, add a rendering function + a dispatcher case

Then:

6. **Document it** in [`../user-manual/sections.md`](../user-manual/sections.md) — writers depend on this reference
7. **Add a showcase** in `src/pages/[locale]/dev-blocks.astro` (both structure + in-use variants) so QA can see it in isolation
8. Run `npm run build`

### "Add a new content collection" (e.g. `surgeries/`)

The catch-all route (`src/pages/[locale]/[...slug].astro`) + the
article registry (`src/lib/article-registry.ts`) mean a new collection
does **not** need a new `.astro` route. Four places:

1. **Content** — create `src/content/<collection>/<slug>/{en,ar}.md`
2. **Zod** — add a `defineCollection(...)` in `src/content.config.ts`
3. **Registry** — add an entry in `src/lib/article-registry.ts` with its labels, schema function, and breadcrumb trail. Collections not listed in the registry fall back to the generic ArticleLayout chrome.
4. **CMS** (optional, if content editors need it) — add a collection block in `public/admin/config.yml` and register its preview in `public/admin/preview.js`.

Run `npm run build` — new URLs appear in the build output.

### "Doctor sent a rough draft — build me an article"

See [`article-builder.md`](article-builder.md). Summary:

1. Read the draft in full first.
2. Match each chunk to a block — the "When to use which" cheat-sheet at the bottom of [`../user-manual/sections.md`](../user-manual/sections.md#when-to-use-which) covers all 22 blocks.
3. If a chunk hints at data the draft doesn't include (stats, key facts, related pages, FAQ items), **ask the doctor for it** before assuming.
4. Assemble the sections array.
5. Draft both languages if you can, or leave the other with a clear TODO.
6. Preview + build.

### "Something broke on the live site"

1. Reproduce with `npm run build` locally — the error is almost always there too
2. If not, open Cloudflare Pages → Deployments → the failing deploy → Build logs
3. See [`../dev/deployment.md#when-the-site-doesnt-update-after-10-minutes`](../dev/deployment.md)

---

## Deployment cadence

- Local commit is free — do it often, with clear messages.
- **Push only when the user asks.** Every push to `main` triggers a live deploy.
- After push, allow **5–10 minutes** for Cloudflare Pages to build and publish.
- If the site hasn't updated after ~10 minutes, tell the user to check the Pages build log.

---

## Best practices distilled

These are lessons from real fixes on this project. Follow them by default:

- **Media block images** — always use the schema-defined `kind: image` shape, not a raw `<img>`. The image pipeline handles srcset for you.
- **Every new image gets responsive variants automatically** if it lives under `public/images/` and is ≥400 px wide. Don't hand-write srcset strings; call `imageVariants()` if you need the URLs.
- **Frontmatter that fails Zod validation stops the build.** The error names the file and field — read it, fix the field, rebuild.
- **RTL is automatic.** You never set `dir="rtl"` in article code; the shell handles it based on locale. For per-block styles, target `html[dir="rtl"] .my-block` globally.
- **Section headings feed the TOC.** If you want a block to appear in the sidebar TOC, give it a `heading:`. If you don't, don't.
- **`redesigned: true`** switches the body renderer from Markdown fallback to the `sections[]` dispatcher. Legacy pages without it still render — their Markdown body goes through `ArticleBody`'s slot, which is why the cases collection still works. Nav visibility is separate (controlled by each collection's listing page).
- **Both locales must always exist** for every topic. If AR is a fallback stub, note it clearly so the AR-only fallback banner shows.
- **`cards` block resolves paths at build time.** Point at a slug; title/description/date/category are pulled from that slug's frontmatter automatically. Don't duplicate them.
- **Adjacent image lines in a Markdown body auto-collapse into one gallery grid** via `rehype-responsive-images.mjs`. You don't need to wrap them yourself.
- **No custom HTML in Markdown.** Astro's Markdown pipeline escapes raw `<div>`s and inline styles. Use a block widget instead, or a `prose` block with links.

---

## Preferred tools

- `npm run build` — the ONLY reliable way to know if a change is publishable
- `npm run check` — build + tsc + wrangler dry-run (slow but thorough)
- `npm run dev` — HMR-enabled preview for interactive iteration
- `grep -rn "pattern" src/` — fastest way to find where something is used
- Never use `npm audit fix --force` — you'll break the build

---

## Files AI should not touch

- `package-lock.json` — hand-editing breaks reproducibility
- `.astro/`, `node_modules/.astro/`, `node_modules/.vite/` — build caches (nuclear-clean these when a rehype plugin seems not to fire)
- `dist/` — build output
- `public/optimized/*.webp` — regenerated by the image optimizer
- Anything in `.claude/`, `.wrangler/`, `.dev.vars` — local config / secrets
