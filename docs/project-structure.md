# Project structure

Where every kind of file lives, and why.

---

## Top-level layout

```
alimranmed-web/
├── src/                       # Everything the build reads
│   ├── content/               # Articles (the CMS writes here)
│   ├── pages/                 # Route files (URLs → pages)
│   ├── components/            # Reusable UI components
│   ├── layouts/               # Page shells (BaseLayout + article layouts)
│   ├── lib/                   # Helpers, rehype plugins, i18n, schema
│   ├── styles/                # Global CSS + RTL overrides
│   ├── data/                  # Static data (nav tree, pathway maps)
│   └── content.config.ts      # Content collection schemas (Zod)
├── public/                    # Served as-is at the root
│   ├── admin/                 # Sveltia CMS (config, preview scripts)
│   ├── images/                # All source images (CMS uploads here)
│   ├── optimized/             # WebP variants (build artifact, gitignored)
│   ├── fonts/                 # Self-hosted webfonts
│   ├── _headers               # Cloudflare cache/security headers
│   └── _redirects             # URL redirect map
├── scripts/                   # Utility scripts (see docs/scripts.md)
├── docs/                      # This documentation
├── astro.config.mjs           # Build config
├── package.json
└── wrangler.toml              # Cloudflare Workers config
```

---

## Where articles live

Every article is a Markdown file with YAML frontmatter, organised as
**`src/content/<collection>/<slug>/<locale>.md`**.

```
src/content/
├── treatments/               # Condition pages (~108 topics)
│   ├── als/
│   │   ├── en.md             # English version
│   │   └── ar.md             # Arabic version (both exist for every topic)
│   ├── alzheimers-disease/
│   │   ├── en.md
│   │   └── ar.md
│   └── ...
├── services/                 # Procedures we offer (~90 topics, some nested)
│   ├── surgery/              # Category
│   │   ├── en.md             # Category landing (surgery overview)
│   │   ├── ar.md
│   │   ├── vertebroplasty/   # Sub-procedure
│   │   │   ├── en.md
│   │   │   └── ar.md
│   │   └── ...
│   └── ...
├── blog/                     # Editorial articles (~20)
├── cases/                    # Case reports
├── doctors/                  # Physician CV pages
│   └── hussein-imran-mousa/
│       ├── en.md
│       └── ar.md
└── pages/                    # Misc top-level pages (about, contact copy, etc.)
```

The **collection** determines the URL prefix (`treatments/…` → `/treatments/…/`),
the schema fields the article must have, and the layout it renders through.

See [`content-authoring.md`](content-authoring.md) for how to actually write articles.

## Where routes live

Astro maps files under `src/pages/` to URLs.

```
src/pages/
├── index.astro               # Root redirect (/) → /en/ or /ar/ based on locale
├── admin/                    # Serves the CMS at /admin/
└── [locale]/                 # Everything under a locale prefix
    ├── index.astro           # /en/ and /ar/ — home page
    ├── about.astro           # /en/about/
    ├── contact.astro         # /en/contact/
    ├── conditions/index.astro
    ├── library/index.astro
    ├── blog/
    │   ├── index.astro       # /en/blog/
    │   └── [slug].astro      # /en/blog/<any-slug>/  (reads from content/blog/)
    ├── treatments/
    │   ├── index.astro
    │   └── [...slug].astro   # /en/treatments/<any-path>/
    ├── services/
    │   ├── index.astro
    │   └── [...slug].astro   # /en/services/<any-path>/ (services can nest)
    └── doctors/
        ├── index.astro
        └── [slug].astro
```

**Dynamic routes** (`[slug].astro`, `[...slug].astro`) generate one HTML page
per content entry via `getStaticPaths()`. If you add a new `.md` under
`src/content/treatments/`, no route file needs to change — a new URL just
appears on next build.

## Where UI components live

```
src/components/
├── Image.astro               # Universal <Image> — every img on the site
├── Header.astro              # Site header + nav
├── Footer.astro
├── BaseHead.astro            # <head> block used by BaseLayout
├── CallFab.astro             # Floating call button on mobile
├── SchemaScript.astro        # JSON-LD schema emitter
├── SoonLink.astro            # "Not yet redesigned" link with toast
├── TranslationBanner.astro   # Shown when AR falls back to EN content
├── article/                  # Article-specific chrome
│   ├── ArticleLayout.astro   # Sidebar-and-body layout used by all long-form pages
│   ├── ArticleBody.astro
│   └── ArticleSections.astro # Dispatcher: sections[] → block components
├── blocks/                   # The section widgets (see docs/sections.md)
│   ├── Prose.astro
│   ├── Highlights.astro
│   ├── Stats.astro
│   ├── Facts.astro
│   ├── List.astro
│   ├── Quote.astro
│   ├── Panels.astro
│   ├── Media.astro
│   ├── Pathway.astro
│   ├── Row.astro
│   ├── Cards.astro
│   └── Sections.astro        # The single dispatcher — new blocks register here
└── doctor/                   # Doctor-CV-specific components
    └── CvHero.astro
```

## Where helper code lives

```
src/lib/
├── i18n.ts                   # locale detection + localizedHref
├── image.ts                  # imageVariants() — used by <Image>
├── labels.ts                 # UI strings per collection + locale
├── pathways.ts               # Condition → pathway (brain/spine/pain) map
├── excerpt.ts                # Meta-description trimmer
├── word-count.ts             # Reading-time calculator
├── toc.ts                    # Sidebar table-of-contents builder
├── schema.ts                 # JSON-LD generators (MedicalWebPage, Physician, etc.)
├── related.ts                # Related-article resolvers
├── sitemap-lastmod.mjs       # <lastmod> resolver — passed to @astrojs/sitemap
├── rehype-responsive-images.mjs
├── rehype-lazy-images.mjs
├── rehype-youtube.mjs
├── remark-localize-links.mjs
└── remark-auto-alt.mjs
```

`.ts` files are TypeScript modules imported into `.astro` files.
`.mjs` files are plugins that need to run inside `astro.config.mjs` — Astro
config can't parse `.ts` at load time, so the plugin API stays in vanilla JS.

## Where static files live

```
public/
├── images/                   # SOURCE images — the CMS uploads here
│   ├── doctors/              # Doctor portraits, avatars
│   ├── home/                 # Home page assets
│   └── legacy/               # WordPress-import inline images
├── optimized/                # BUILD OUTPUT — WebP variants
│   ├── manifest.json         # Committed seed; overwritten by every build
│   └── images/**             # Gitignored; regenerated by scripts/optimize-images.mjs
├── fonts/                    # Self-hosted webfonts + fonts.css
├── admin/                    # Sveltia CMS
│   ├── config.yml            # Collection + field definitions
│   ├── preview.js            # Live-preview templates for the CMS
│   └── preview.css           # Preview styling (imports /fonts/fonts.css)
├── favicon.svg
├── llms.txt                  # AI-crawler discovery file
├── robots.txt
├── _headers                  # Cache-control + security headers
└── _redirects                # 301 URL map (legacy → new)
```

## Reading order for someone new to the codebase

1. **`src/content.config.ts`** — the shape of every article, in one file. Understand this and everything else falls out.
2. **`src/pages/[locale]/treatments/[...slug].astro`** — a representative dynamic route that reads a content entry and renders it.
3. **`src/components/blocks/Sections.astro`** — the dispatcher that maps a `sections: []` array in frontmatter to individual block components.
4. **`src/components/article/ArticleLayout.astro`** — the sidebar-and-body shell every article uses.
5. **`public/admin/config.yml`** — the CMS-side mirror of the content schema. Same shape, YAML instead of Zod.
