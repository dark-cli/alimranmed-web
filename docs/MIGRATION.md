# Phase 2 — bulk content migration

The Phase 1a scaffold has ~15 services populated by hand. The remaining ~600
pages should be pulled from `alimranmed.com` and `ar.alimranmed.com` via a
script rather than one-by-one.

## The source of truth

`src/data/navigation.ts` mirrors the legacy WordPress IA and — critically —
carries a `legacyUrl` on every leaf. `flattenNav()` returns the full flat list
of items with their target new-site paths and their source legacy URLs. That's
the input to the migration script.

## Suggested script shape

Write `scripts/migrate.mjs` (Node, run via `node scripts/migrate.mjs`):

```js
import { flattenNav } from "../src/data/navigation.ts"; // use ts-loader or precompile
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = "src/content";

// Simple English → collection folder mapping. The href already carries the
// intended URL, so we just map the URL prefix back to the collection.
const collectionForHref = (href) => {
  if (href.startsWith("/treatments/")) return "treatments";
  if (href.startsWith("/rehabilitation/")) return "services/rehabilitation";
  if (href.startsWith("/chiropractic/")) return "services/chiropractic";
  if (href.startsWith("/brain-stimulation/")) return "services/brain-stimulation";
  if (href.startsWith("/radiofrequency/")) return "services/radiofrequency";
  if (href.startsWith("/steroid-injection/")) return "services/steroid-injection";
  if (href.startsWith("/ozone-therapy/")) return "services/ozone-therapy";
  if (href.startsWith("/surgery/")) return "services/surgery";
  if (href.startsWith("/physiotherapy/")) return "services/physiotherapy";
  if (href.startsWith("/exercises/")) return "services/exercises";
  if (href.startsWith("/fitness/")) return "services/fitness";
  if (href.startsWith("/cases/")) return "cases";
  return "pages";
};

const slugFromHref = (href) => href.replace(/^\/[^/]+\//, "").replace(/\/$/, "");

for (const item of flattenNav()) {
  if (!item.legacyUrl) continue;
  const html = await fetch(item.legacyUrl).then((r) => r.text());
  const md = htmlToMarkdown(html);   // implement — see options below
  const cat = collectionForHref(item.href);
  const slug = slugFromHref(item.href);
  const outPath = path.join(OUT, cat, "en", `${slug}.md`);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, buildFrontmatter(item) + md);
}
```

### HTML → Markdown conversion

The old site is WordPress — content is wrapped in navigation chrome that must
be stripped before conversion. Two workable approaches:

1. **`@wordpress/api-fetch` against WP REST** — WordPress exposes
   `/wp-json/wp/v2/pages` and `/wp-json/wp/v2/posts` returning clean HTML in
   `content.rendered`. Verify by hitting
   [`https://alimranmed.com/wp-json/wp/v2/pages`](https://alimranmed.com/wp-json/wp/v2/pages).
   If accessible, this is the *right* pipeline: convert `content.rendered` via
   [`turndown`](https://github.com/mixmark-io/turndown) to Markdown. This
   avoids the "scrape the chrome off HTML" problem entirely.

2. **Scrape + isolate `.entry-content`** — parse rendered HTML, pluck the
   article body selector (usually `.entry-content`, `article`, or `main`),
   then run turndown. Fragile; only if the REST API is disabled.

## Arabic mirror

`ar.alimranmed.com` runs a parallel WordPress install. The URL scheme mostly
matches (same slugs), so the same script re-run with `SOURCE=https://ar.alimranmed.com/`
and `OUT=src/content/…/ar/` populates the Arabic collection.

For pages where the slug differs (some old WP installs use transliterated
Arabic slugs for AR), maintain a small `slug-map.json` override alongside
`navigation.ts`.

## Media

Images referenced by `wp-content/uploads/YYYY/MM/foo.jpg` should be:

1. Downloaded (script: iterate posts' image URLs, `fetch` each, save to
   `public/images/legacy/YYYY/MM/foo.jpg`)
2. URL-rewritten in the Markdown (`https://alimranmed.com/wp-content/uploads/` →
   `/images/legacy/`)

## Guardrails while migrating

- **Verbatim policy.** Do not paraphrase medical content. If the source is
  broken English, leave it. Fixing wording is a follow-up review pass.
- **Run in batches of ~50 pages.** After each batch, `npm run build` and eyeball
  a few rendered pages. Cheap way to catch schema mismatches or broken
  frontmatter early.
- **Skip attachment URLs.** The sitemap includes
  `/wp-content/uploads/…` entries — filter those out; they're media, not pages.
- **Trailing-slash consistency.** Astro's static build treats `/foo` and
  `/foo/` as different URLs. Match the legacy pattern (WordPress uses trailing
  slashes) so old inbound links keep working.

## Redirects for legacy URLs

Old inbound links (`/pain/`, `/2020/05/07/regenerative-medicine/` etc.) should
redirect to the new URLs. Add them to Cloudflare `_redirects` file at the root
of `public/`:

```
/pain/                    /treatments/pain/                       301
/what-we-deal-with/       /treatments/                            301
/2020/05/07/regenerative-medicine/  /regenerative-medicine/       301
# … generate the full list from navigation.ts's legacyUrl fields
```

A `scripts/generate-redirects.mjs` doing exactly this from `flattenNav()`
would be trivial.
