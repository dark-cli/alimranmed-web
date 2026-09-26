# Checks — commands to run before saying "done"

Order matters. Fastest checks first so failure is caught cheap.

## 1. Build always

Before ever telling the user a task is done, run:

```bash
npm run build
```

Expected output ends with `[build] Complete!`. If it fails, fix the error.
This runs the image optimizer + `astro build` + all rehype plugins. It's the
single most important check.

## 2. Full check when touching TypeScript

When you edited a `.ts` file, a component prop shape, or the content schema:

```bash
npm run check
```

This runs prebuild + `astro build` + `tsc --noEmit` + `wrangler deploy --dry-run`.
Slower (~30s) but catches type errors the build alone won't.

## 3. Link check when reshaping URLs

When adding a new article, renaming a slug, or touching nav/pathways:

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run check:links
```

Waits for the dev server, crawls internally, HEAD-checks externally.
False positives to ignore:
- `fonts.googleapis.com/` and `fonts.gstatic.com/` root URLs return 404 (they only serve at parametrised paths).
- YouTube URLs that need login for view count APIs — irrelevant.

## 4. Preview manually when you changed layout or CSS

Automated checks can't catch "the sidebar overlaps the body at 900 px" or "the
Arabic h1 wraps weirdly". If your change affects layout, open the page in a
browser at both desktop and mobile widths, in both EN and AR.

```bash
npm run dev
# Then browse http://localhost:4321/en/... and .../ar/...
```

## 5. When you finished — status + summary

Once every relevant check has passed:

- Tell the user what you changed (list of files)
- Tell them how to preview it (local URL)
- Note any TODOs you left (missing translations, invented data flagged for
  confirmation)
- If they asked you to commit, commit with a clear message
- **Do not push** unless they explicitly asked you to

---

## When checks fail

**"Zod validation error"** — the frontmatter shape doesn't match
`src/content.config.ts`. The error names the file and field. Fix the field.

**"Cannot find module `x`"** — you renamed something and didn't update all
callers. `grep -rn "x" src/` finds them.

**"Type 'X' is not assignable to type 'Y'"** — TypeScript error. Read the file
and line number, fix the mismatch.

**Cloudflare-only errors** — if `npm run check` passes locally but Cloudflare
fails, the environment differs (usually Node version or missing env var). Check
the build log in Cloudflare Pages → Deployments.

**Sharp/image errors** — an image file is corrupt or too small.
`identify path/to/image.jpg` shows dimensions. Delete the broken image; the
build will skip the missing manifest entry gracefully.
