# alimranmed-web

A modern rebuild of the Alimran Medical Center website (originally hosted on WordPress
at [alimranmed.com](https://alimranmed.com)), using [Astro](https://astro.build) with
Content Collections, Cloudflare Workers as the runtime, and a medical-first design
system.

**English-only** for now. The original site has an Arabic mirror at
`ar.alimranmed.com` running on a separate WordPress install; adding Arabic back is
a straightforward re-scope later (see `scripts/migrate.mjs`).

## Stack

- **Astro 5** — static-first site generator, server components
- **Content Collections** — typed frontmatter, glob loaders, schema validation
- **@astrojs/cloudflare** — Workers deployment adapter
- **@astrojs/sitemap** — automatic sitemap generation

## Repository layout

```
src/
  components/           shared Astro components (header, footer, base head, theme toggle)
  content/              content collections (Markdown source of truth)
    treatments/         one file per condition
    services/           grouped by category subfolder (chiropractic, surgery, etc.)
    doctors/            one file per physician
    posts/              blog posts
    cases/              patient case studies
    testimonies/        patient testimonies
    pages/              misc top-level pages
  content.config.ts     schema definitions
  data/
    navigation.ts       MASTER nav tree — mirrors the old site's IA verbatim,
                        with legacyUrl on every leaf for bulk-migration.
  i18n/en.json          UI strings
  layouts/              BaseLayout, ContentLayout
  pages/                routes: dynamic collection routes ([slug].astro) + static pages
  styles/               global.css (design system)
public/
  images/legacy/        self-hosted media pulled from the old WP install
  _redirects            legacy URL → new URL 301 map
docs/
  MIGRATION.md          how the bulk-migration pipeline works
  PORTAL.md             how to add the captive-portal Connect bar later
scripts/
  migrate.mjs           WP-REST → Content Collections migrator
  download-media.mjs    self-host wp-content/uploads assets
  generate-redirects.mjs  emit public/_redirects from navigation.ts
```

## Development

```bash
npm install
npm run dev          # local dev server
npm run build        # production build (dist/)
npm run preview      # build + wrangler dev (Workers runtime)
```

## Content pipeline

```bash
npm run migrate      # pull all pages+posts from WP-REST → src/content/
npm run migrate:dry  # first 5 per source, log-only
npm run media        # scan MD → download uploads → rewrite refs to local
npm run redirects    # rebuild public/_redirects from navigation.ts
```

## Current status

- All ~300 legacy WordPress entries migrated as verbatim Markdown
- Media self-hosted (394+ files) so the site works pre-auth in a walled-garden network
- 182 legacy URL redirects wired up so old inbound Google traffic lands correctly
- 33 YouTube video embeds preserved as visible links
- Build produces ~200 static HTML pages, ~15 MB total

## Deferred (deliberately)

- **Arabic mirror** — dropped for now; see `scripts/migrate.mjs` for how to re-enable
- **Captive-portal Connect bar** — see `docs/PORTAL.md` for the recipe
- **Contact form submission** — the contact page is display-only right now
- **Reslotting orphan pages** — 87 legacy WP entries that aren't in the visible nav
  landed in the `pages` collection; each has a `legacyUrl` field, easy to move later

## Legacy site

The old WordPress site at [alimranmed.com](https://alimranmed.com) remains live
during the migration. Every content entry carries a `legacyUrl` pointing at its
original source.
