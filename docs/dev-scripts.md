# Utility scripts

Under `scripts/`. Each is standalone Node — no build step, no bundler.

## Reference

| Script | Runs during | What it does |
|---|---|---|
| [`optimize-images.mjs`](../scripts/optimize-images.mjs) | `npm run build` (via prebuild hook) | Generates WebP variants — see [`image-optimization.md`](image-optimization.md) |
| [`check-links.mjs`](../scripts/check-links.mjs) | manual, ad hoc | Crawls the dev server + checks external links; reports broken ones |
| [`download-fonts.mjs`](../scripts/download-fonts.mjs) | manual (rare) | Fetches font files from Google Fonts into `public/fonts/` and writes `fonts.css` |
| [`generate-redirects.mjs`](../scripts/generate-redirects.mjs) | manual after nav changes | Rebuilds `public/_redirects` from `src/data/navigation.ts` |

---

## `optimize-images.mjs`

Runs automatically before every build via the `prebuild` script in `package.json`.

```bash
npm run optimize:images   # manual invocation, e.g. after changing WIDTHS/QUALITY
```

Reads: `public/images/**` (recursive), `public/optimized/manifest.json`
Writes: `public/optimized/images/**`, updates the manifest

See [`image-optimization.md`](image-optimization.md) for full details.

---

## `check-links.mjs`

```bash
# 1. Start the dev server or a preview server in another terminal
npm run dev

# 2. Run the checker (crawls http://localhost:4321 by default)
npm run check:links
```

Or against a different origin:

```bash
node scripts/check-links.mjs https://alimran.clinic
```

The script:

- Crawls every internal URL recursively starting from the given base
- Follows internal `<a href>` and `<img src>` links
- HEAD-requests every external URL (once)
- Reports:
  - **BROKEN** — 4xx/5xx or timeouts on internal pages, or 4xx on referenced images
  - **WARN** — redirects (may or may not be intentional)

Expected false positives:

- `fonts.googleapis.com/` and `fonts.gstatic.com/` — these return 404 at the
  path root but serve fine when a real font URL is requested. Ignore.
- YouTube channel/watch URLs that require login. Ignore.

---

## `download-fonts.mjs`

Rare — only when you need to update font weights or add a new family.

```bash
npm run fonts
```

The script:

- Fetches the CSS from Google Fonts with a modern Chromium UA (so it returns WOFF2)
- Parses each `@font-face` block
- Downloads every `src: url(...)` file into `public/fonts/`
- Rewrites the URLs to point at the local paths
- Concatenates into a single `public/fonts/fonts.css` that BaseHead links to

**Files it produces** are gitignored by pattern-then-negate; commit them explicitly with `git add public/fonts/*.woff2 public/fonts/fonts.css`.

To change which weights or subsets are downloaded, edit the `FAMILIES` constant at the top of the script.

---

## `generate-redirects.mjs`

Rebuilds `public/_redirects` from `src/data/navigation.ts` (which carries a
`legacyUrl` on every leaf so we can generate a WordPress → new URL map).

```bash
npm run redirects
```

Only rerun this when the nav tree in `navigation.ts` changes. Commit both files
together.
