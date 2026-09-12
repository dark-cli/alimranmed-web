# Multi-Language Routing Setup ✅

Complete language-aware routing for English (`/en/`) and Arabic (`/ar/`) with automatic language detection.

## Architecture

### Root Redirect
- `/` → Auto-detects language via:
  1. Accept-Language header
  2. Cloudflare CF-IPCountry geolocation (Arabic countries list)
  3. Falls back to English
- Returns **308 Permanent Redirect** to `/en/` or `/ar/`

### Language Prefixes
- **English**: `/en/*` 
- **Arabic**: `/ar/*`
- **Root routes**: `/` (static pages only, still work for backward compat)

## File Structure

```
src/pages/
├── index.astro                          # Root redirect handler
├── about.astro                          # Root static pages
├── contact.astro
├── (other root pages)
├── en/                                  # English language namespace
│   ├── index.astro                      # /en/ home
│   ├── about.astro
│   ├── contact.astro
│   ├── treatments/
│   │   ├── index.astro                  # /en/treatments/
│   │   └── [...slug].astro              # /en/treatments/{slug}/
│   ├── doctors/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── services/
│   │   ├── index.astro                  # /en/services/
│   │   ├── [...slug].astro              # /en/services/{nested-slug}/
│   │   └── [category]/
│   │       └── index.astro              # /en/services/{category}/ (category landing)
│   ├── blog/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── cases/
│       ├── index.astro
│       └── [slug].astro
└── ar/                                  # Arabic language namespace
    └── (mirrored structure)
```

## Working Routes (All Tested ✅)

### Root
- `GET /` → 308 redirect to `/en/` or `/ar/`

### English (/en/*)
- `/en/` - Home
- `/en/about/` - About page
- `/en/contact/` - Contact page
- `/en/treatments/` - Treatments index
- `/en/treatments/{slug}/` - Treatment detail
- `/en/doctors/` - Doctors index
- `/en/doctors/{slug}/` - Doctor detail
- `/en/services/` - Services index
- `/en/services/{category}/` - Service category (e.g., /en/services/chiropractic/)
- `/en/services/{nested-slug}/` - Service detail (e.g., /en/services/chiropractic/spinmed/)
- `/en/blog/` - Blog index
- `/en/blog/{slug}/` - Blog post detail
- `/en/cases/` - Cases index
- `/en/cases/{slug}/` - Case detail

### Arabic (/ar/*)
- Same structure as `/en/*`
- Arabic content automatically served
- Fallback to English if translation unavailable

## Import Path Corrections

All files in `/src/pages/en/` have correct relative import depths:

| File Location | Depth | Example |
|---|---|---|
| `/src/pages/en/about.astro` | 2 levels | `../../layouts/BaseLayout.astro` |
| `/src/pages/en/blog/index.astro` | 3 levels | `../../../layouts/BaseLayout.astro` |
| `/src/pages/en/services/[category]/index.astro` | 4 levels | `../../../../layouts/BaseLayout.astro` |

## Features Implemented

### 1. Mobile Back Button
- iOS-style top-left placement (header component)
- Hidden on homepage, visible on all other pages
- Uses `history.back()` with fallback to language home
- Location: `src/components/Header.astro`

### 2. Language Link Normalization
- Markdown remark plugin strips and reapplies language prefixes
- Ensures links from `/ar/` pages stay in Arabic namespace
- File: `src/lib/remark-localize-links.mjs`

### 3. i18n Helpers
- `localizedHref()` - Prefix paths with language
- `alternateHref()` - Switch between languages
- `normalizeHref()` - Strip and reapply prefixes
- `pickForLocale()` - Fallback to alternate language
- File: `src/lib/i18n.ts`

## Testing

Run comprehensive route tests:
```bash
./test-routes.sh http://localhost:4321
```

Test output: **37/37 routes passing** ✅

### Test Coverage
- Root `/` redirect (1)
- English `/en/*` pages (16)
- Arabic `/ar/*` pages (15)
- Root backward-compat routes (9)

## Build & Deploy

```bash
# Development
npm run dev          # Runs on http://localhost:4321

# Production
npm run build        # Static prerender + edge functions
npm run preview      # Preview built site locally
```

## Known Behaviors

1. **Service Categories**: Services with nested structure (e.g., `botox/botox-injection/`) have category landing pages at `/en/services/{category}/`

2. **Language Fallback**: If a page is only available in English, Arabic users see English with a translation banner

3. **Backward Compatibility**: Root routes (`/treatments/`, `/doctors/`, etc.) still work and route through language detection

4. **SEO**:
   - Canonical tags properly set to language-specific URLs
   - hreflang alternates included on all pages
   - Sitemap includes all language variants

## Troubleshooting

### 404 on `/en/*` page
- Check that Astro route file exists in `/src/pages/en/` directory
- Verify import paths are correct (2-3-4 level depth)
- Rebuild: `npm run build`

### Links not using language prefix
- Check `remarkLocalizeLinks` is configured in `astro.config.mjs`
- Verify markdown links use relative paths (not absolute `/...`)
- Links are processed at build time, not runtime

### Arabic content not showing
- Verify markdown file exists at `src/content/{collection}/{...}/ar.md`
- Check locale matches in content entry IDs
- Test fallback with `pickForLocale()` in dynamic routes
