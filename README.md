# alimranmed-web

A modern rebuild of the Alimran Medical Center website (originally hosted on WordPress
at [alimranmed.com](https://alimranmed.com)), using [Astro](https://astro.build) with
Content Collections, Cloudflare Workers as the runtime, and a medical-first design
system.

## Stack

- **Astro 5** — static-first site generator, server components, MDX support
- **Content Collections** — typed frontmatter, glob loaders, schema validation
- **@astrojs/cloudflare** — Workers deployment adapter
- **@astrojs/sitemap** — automatic sitemap generation
- **i18n** — English (default) and Arabic (`/ar/…`), RTL-aware

## Repository layout

```
src/
  components/          shared Astro components (header, footer, base head, theme toggle, language switcher)
  content/             content collections (Markdown source of truth)
    treatments/en|ar/  one file per condition
    services/en|ar/    grouped by category subfolder (chiropractic, surgery, etc.)
    doctors/en|ar/     one file per physician
    posts/en|ar/       blog posts
    cases/en|ar/       patient case studies
    testimonies/en|ar/ patient testimonies
    pages/en|ar/       misc top-level pages
  content.config.ts    schema definitions
  data/
    navigation.ts      MASTER nav tree — mirrors the old site's IA verbatim,
                       with legacyUrl on every leaf for bulk-migration.
  i18n/                translation JSON (en.json, ar.json)
  layouts/             BaseLayout, ContentLayout
  pages/               routes: dynamic collection routes ([slug].astro) + static pages
  styles/              global.css (design system)
docs/
  MIGRATION.md         Phase-2 plan: how to bulk-populate remaining content
  PORTAL.md            how to add the captive-portal Connect bar later
```

## Development

```bash
npm install
npm run dev          # local dev server
npm run build        # production build (dist/)
npm run preview      # build + wrangler dev (Workers runtime)
```

## Current status (Phase 1a — scaffold)

- Design system, layout, header (mega-menu mirroring old-site IA), footer, mobile drawer
- English homepage, contact page, doctors listing + Hussein Imran Mousa full profile
- ~15 priority service landing pages populated verbatim from the old site
- Arabic mirror routes exist but content collection entries for `ar/*` are pending
- Blog, cases, testimonies collections defined but empty

## Next phases

1. **Bulk content migration** — see [`docs/MIGRATION.md`](docs/MIGRATION.md). ~650 pages to import.
2. **Arabic mirror** — populate `ar/` entries once English is settled.
3. **Captive-portal integration** — see [`docs/PORTAL.md`](docs/PORTAL.md).
4. **Media** — extract images from the legacy WordPress `wp-content/uploads/` tree and self-host in `public/images/`.
5. **Contact form** — currently the contact page is display-only; wire a form via a Cloudflare Worker function.

## Legacy site

The old WordPress site at [alimranmed.com](https://alimranmed.com) remains authoritative
for content while the migration runs. Every content-collection entry carries a `legacyUrl`
field pointing at its source page.
