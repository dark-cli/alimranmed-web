# Alimran Medical Center — Launch Readiness Implementation Plan

**Branch:** `feature/launch-readiness`  
**Date Created:** 2026-09-12  
**Target Completion:** 5 weeks  
**Effort Estimate:** ~113 hours (2.2 weeks at 50h/week)

---

## Executive Summary

This plan implements the [alimran-launch-readiness-plan.md](./alimran-launch-readiness-plan.md) across 6 phases:

1. **Phase 1 (Week 1):** Performance optimization (hero image, media, accessibility)
2. **Phase 2 (Week 2):** SEO foundation (meta tags, structured data, robots.txt)
3. **Phase 3 (Week 3a):** LLM/AI optimization (content semantics, E-E-A-T, FAQ schema)
4. **Phase 4 (Week 3b):** Contact form & conversion (Cloudflare Worker integration)
5. **Phase 5 (Week 4):** Arabic i18n & local SEO (Google Business Profile, hreflang)
6. **Phase 6 (Week 5):** Testing & validation (Lighthouse, cross-browser, CEO sign-off)

**Key blocker:** Mobile LCP 8.1s → <2.5s (fixed in Phase 1)

---

## Phase 1: Performance Foundation (Week 1)

### P1.1 Hero Image Responsive Optimization (2 days)
- [ ] Create `src/components/PictureResponsive.astro` wrapper for responsive images
- [ ] Implement Astro `Picture` component with AVIF + WebP formats
- [ ] Add `widths={[400, 800, 1200, 1600]}` and `sizes` for mobile-first delivery
- [ ] Update `src/pages/index.astro` to use responsive hero image
- [ ] Add preload hint in `BaseHead.astro` with `fetchpriority="high"`
- [ ] **Target:** LCP 8.1s → ~3.5s

### P1.2 Media Audit & Batch Conversion (2 days)
- [ ] Inventory all 394 files in `/public/images/legacy/`
- [ ] Batch convert JPG/PNG → AVIF (primary) + WebP (fallback)
- [ ] Add explicit `width` and `height` to all `<img>` tags (prevent layout shift)
- [ ] Update image srcset for responsive delivery
- [ ] Add `loading="lazy"` to below-fold images
- [ ] Verify Lighthouse CLS remains <0.1

### P1.3 Accessibility Quick-Fix (1 day)
- [ ] Audit touch targets: aim for 48×48px minimum
- [ ] Add `aria-label` to hamburger menu button
- [ ] Add `aria-label` to theme toggle button
- [ ] Verify WCAG AA contrast on hero text, nav, CTAs
- [ ] **Target:** Accessibility score 87 → ≥92

### P1.4 Meta Tags Foundation (1 day)
- [ ] Update `src/layouts/BaseLayout.astro` to accept `title` and `description` props
- [ ] Ensure all collection pages (treatments, doctors, services) pass unique titles/descriptions
- [ ] Verify canonical tag handling is correct
- [ ] Pattern: `{Page Title} | Alimran Medical Center — Basra, Iraq`

**Success Criteria:**
- [ ] Mobile Lighthouse Performance ≥90
- [ ] Mobile LCP <3s (target: <2.5s)
- [ ] Mobile Accessibility ≥92
- [ ] All images have explicit width/height
- [ ] Hero uses responsive Picture component

---

## Phase 2: SEO & Structured Data (Week 2)

### P2.1 SchemaScript Component Creation (2 days)
- [ ] Create `src/components/SchemaScript.astro`
- [ ] Accept type parameter: `'MedicalOrganization' | 'Physician' | 'MedicalWebPage' | 'FAQPage' | 'BreadcrumbList'`
- [ ] Dynamically inject JSON-LD with schema.org types
- [ ] Include breadcrumb schema for navigation

### P2.2 Homepage & Org-Level Schema (1 day)
- [ ] Add `MedicalOrganization` + `LocalBusiness` schema to homepage
- [ ] Include: phone (+964...), address (Basra, IQ), coordinates (30.5156, 47.7804)
- [ ] Include: specialties (Neurology, Orthopedics, Chiropractic, etc.), hours
- [ ] Wire into `src/pages/index.astro`

### P2.3 Doctor Pages Schema (1 day)
- [ ] Add `Physician` schema to `src/pages/doctors/[slug].astro`
- [ ] Include: credentials, specialty, memberships, alumni affiliations
- [ ] Link to parent organization

### P2.4 Treatment Pages Enhancement (1 day)
- [ ] Add `MedicalWebPage` + `MedicalProcedure` schema to treatment pages
- [ ] Include ICD-10 codes where applicable
- [ ] Link related conditions/treatments

### P2.5 robots.txt & LLM Allowance (0.5 day)
- [ ] Create `public/robots.txt`
- [ ] Explicit Allow for GPTBot, PerplexityBot, Google-Extended
- [ ] Reference sitemap at `https://alimran.clinic/sitemap-index.xml`
- [ ] Verify `@astrojs/sitemap` generates with `<lastmod>` dates

**Success Criteria:**
- [ ] Google Rich Results Test: Homepage passes (MedicalOrganization visible)
- [ ] Doctor pages pass Rich Results Test (Physician schema)
- [ ] All pages have unique `<title>` and `<meta name="description">`
- [ ] OG tags present on all pages
- [ ] robots.txt indexed by crawlers

---

## Phase 3: AI/LLM Content Optimization (Week 3a)

### P3.1 Create `/llms.txt` (0.5 day)
- [ ] Create `public/llms.txt`
- [ ] Summarize clinic: specialties, key pages, content policy
- [ ] Include: location (Basra, Iraq), contact, hours, languages
- [ ] Signal to LLM crawlers what Alimran is

### P3.2 FAQ Schema Implementation (2 days)
- [ ] Add FAQ sections to top 10 treatment pages
- [ ] Create `FAQPage` schema with 3–5 Q&As per page
- [ ] Focus on: "What is recovery time?", "What causes X?", "How much does it cost?"
- [ ] Pages to target: Back pain, neck pain, frozen shoulder, sciatica, herniated disc, etc.

### P3.3 Semantic Content Restructuring (2 days)
- [ ] Audit top 20 treatment pages for H1 → H2 → H3 hierarchy
- [ ] Add definition lists (`<dl>`) for medical terms
- [ ] Insert comparison tables (procedure, recovery time, hospital stay)
- [ ] Add sections: "What is/Causes/Symptoms/Diagnosis/Treatments/Recovery"

### P3.4 Authorship & E-E-A-T Signals (1 day)
- [ ] Extend `src/content.config.ts` schema with `author`, `reviewedBy`, `reviewedAt`, `references` fields
- [ ] Create `src/components/AuthorByline.astro` for "Reviewed by [Doctor]" display
- [ ] Add "Last reviewed: YYYY-MM-DD" timestamp to top 20 treatment pages
- [ ] Add References section linking to PubMed, WHO, medical journals

**Success Criteria:**
- [ ] /llms.txt created and crawlable
- [ ] Top 10 pages have FAQ schema (3+ Q&As each)
- [ ] Top 20 pages follow strict H1→H2→H3 hierarchy
- [ ] Top 20 pages have bylines + last-reviewed dates
- [ ] All treatment pages have reference links

---

## Phase 4: Contact Form & Conversion (Week 3b)

### P4.1 Wire Contact Form to Cloudflare Worker (1.5 days)
- [ ] Create `/api/contact` endpoint in Cloudflare Worker
- [ ] Accept POST with: name, phone, email, service, message
- [ ] Send via Resend API or Telegram bot
- [ ] Add client-side validation (name, phone required)
- [ ] Return JSON: `{ success: true, message: "We'll contact you soon" }`
- [ ] Add success/error messaging UI

### P4.2 Click-to-Call & Map Integration (1 day)
- [ ] Ensure all phone numbers use `tel:` links
- [ ] Verify embedded Google Maps loads correctly on mobile
- [ ] Test on mobile network conditions (3G/4G throttling)

**Success Criteria:**
- [ ] Contact form submissions land in inbox/Telegram
- [ ] All phone numbers are clickable `tel:` links
- [ ] Map loads and shows correct Basra location
- [ ] Form displays thank you/error messages
- [ ] Analytics events fire on submission (if GA4)

---

## Phase 5: Arabic i18n & Local SEO (Week 4)

### P5.1 Arabic Content Localization (2 days)
- [ ] Translate UI strings in `src/i18n/ar.json`
- [ ] Translate top 30 treatment pages (create `treatments/topic/ar.md` variants)
- [ ] Use `scripts/migrate.mjs` pattern for frontmatter sync

### P5.2 Hreflang Implementation (1 day)
- [ ] Ensure `BaseHead.astro` includes hreflang for all page pairs (en + ar)
- [ ] Verify `/` redirects to `/ar/` for Arabic-speaking users
- [ ] Submit both versions to Google Search Console

### P5.3 Google Business Profile & Local SEO (1 day)
- [ ] Claim Alimran Medical Center on Google Business Profile
- [ ] Verify address, hours, phone (NAP consistency)
- [ ] Add photos, services, categories
- [ ] Link to website

### P5.4 Local Keywords & Basra Targeting (1 day)
- [ ] Audit H1s for "neurologist Basra", "chiropractic Iraq", "pain management Basra"
- [ ] Update treatment page titles with location modifiers
- [ ] Add Basra-specific content snippets

**Success Criteria:**
- [ ] Top 30 treatment pages available in Arabic
- [ ] Hreflang tags correct on all page pairs
- [ ] Google Business Profile claimed + verified
- [ ] NAP consistent across all channels
- [ ] Arabic pages indexed in Google Search Console

---

## Phase 6: Testing & Validation (Week 5)

### P6.1 Lighthouse Full Audit (1 day)
- [ ] Desktop: maintain ≥90 across all metrics
- [ ] Mobile: achieve ≥90 Performance, ≥95 Accessibility
- [ ] LCP: verify <2.5s on 4G
- [ ] CLS: maintain <0.1
- [ ] Run 3 times, average results

### P6.2 Cross-Browser & Device Testing (1 day)
- [ ] Desktop: Chrome, Firefox, Safari
- [ ] Mobile: iOS Safari (iPhone), Android Chrome (Pixel/Galaxy)
- [ ] Test: hamburger menu, forms, video facade, theme toggle

### P6.3 Schema.org & SEO Validation (1 day)
- [ ] Google Rich Results Test: verify schemas on 5 key pages
- [ ] Google Search Console: submit updated sitemap
- [ ] Structured Data Testing Tool: validate JSON-LD

### P6.4 Form & Conversion Testing (0.5 day)
- [ ] End-to-end contact form submission
- [ ] Email delivery verification
- [ ] Phone click-to-call on mobile
- [ ] Analytics event tracking

### P6.5 Redirect Validation (0.5 day)
- [ ] Sample 20 of 182 legacy redirects
- [ ] Verify 301 status codes
- [ ] Test mobile redirect behavior

### P6.6 LLM Citation Testing (0.5 day)
- [ ] Query Perplexity AI and ChatGPT for "neurologist Basra", "spinal surgery Iraq"
- [ ] Check if Alimran appears in citations
- [ ] Note search intent mismatches

### P6.7 CEO Sign-Off Walkthrough (1 day)
- [ ] Load site on 4G mobile
- [ ] Verify call button works
- [ ] Check Arabic toggle is visible
- [ ] Confirm doctor profiles display correctly
- [ ] Test contact form submission
- [ ] Demonstrate Google Business Profile

**Success Criteria:**
- [ ] Mobile Lighthouse: ≥90 Performance, ≥95 Accessibility
- [ ] Desktop Lighthouse: ≥90 all metrics
- [ ] LCP <2.5s on throttled 4G
- [ ] All 182 redirects pass (301 status)
- [ ] Schema validation: 0 errors on 10 pages
- [ ] CEO sign-off complete

---

## Critical Files for Implementation

### Core Components
- `src/layouts/BaseLayout.astro` — Wire schema props
- `src/components/BaseHead.astro` — Schema injection slots
- `src/components/SchemaScript.astro` (NEW) — JSON-LD injection
- `src/components/AuthorByline.astro` (NEW) — E-E-A-T bylines
- `src/components/PictureResponsive.astro` (NEW) — Responsive images

### Content & Config
- `src/content.config.ts` — Add schema fields (author, reviewedBy, faqItems)
- `src/i18n/en.json` — Already complete
- `src/i18n/ar.json` — Extend with new UI strings

### Pages & Routes
- `src/pages/index.astro` — Add schema, responsive hero
- `src/pages/doctors/[slug].astro` — Add Physician schema
- `src/pages/treatments/[...slug].astro` — Enhance with schema

### Content (Mass Update)
- `src/content/treatments/` (107 files) — Add author, reviewedBy, reviewedAt, FAQ frontmatter
- `src/content/doctors/` — Add credentials
- `src/content/services/` — Extend descriptions

### Public Files
- `public/robots.txt` (NEW) — Crawler rules + sitemap
- `public/llms.txt` (NEW) — LLM context file
- `public/images/` (AUDIT & CONVERT) — AVIF/WebP variants

### Backend
- `wrangler.json` or `dist/_worker.js` — Add `/api/contact` POST endpoint

---

## Effort Estimates

| Phase | Hours | Notes |
|-------|-------|-------|
| Phase 1 (Performance) | 23 | Media conversion may parallelize |
| Phase 2 (SEO & Schema) | 16 | Reusable SchemaScript component |
| Phase 3 (LLM Content) | 26 | Content-heavy; can parallelize FAQ + semantic work |
| Phase 4 (Contact Form) | 10 | Form submission + Worker integration |
| Phase 5 (Arabic & Local) | 21 | Translation dependent on native speaker |
| Phase 6 (Testing) | 17 | Cross-browser + validation |
| **Total** | **113 hours** | ~2.2 weeks at 50h/week |

---

## Success Metrics (30 Days Post-Launch)

| Metric | Baseline | Target | Status |
|--------|----------|--------|--------|
| Mobile Lighthouse Performance | 72 | ≥90 | ⬜ |
| Mobile LCP | 8.1s | <2.5s | ⬜ |
| Mobile Accessibility | 87 | ≥95 | ⬜ |
| Indexed Pages | ~200 | 200+ | ⬜ |
| Contact Form Submissions | 0 | ≥10/month | ⬜ |
| Arabic Page Views | 0 | ≥30% of total | ⬜ |
| AI Citation Mentions | 0 | ≥1 (Perplexity/ChatGPT) | ⬜ |

---

## Quick Reference: Implementation Sequence

```
Week 1: Phase 1 (Performance)
  → P1.1 Hero responsive (2d)
  → P1.2 Media conversion (2d)
  → P1.3 Accessibility (1d)
  → P1.4 Meta tags (1d)

Week 2: Phase 2 (SEO & Schema)
  → P2.1 SchemaScript component (2d)
  → P2.2 Org schema (1d)
  → P2.3 Doctor schema (1d)
  → P2.4 Treatment schema (1d)
  → P2.5 robots.txt (0.5d)

Week 3a: Phase 3 (LLM Content)
  → P3.1 /llms.txt (0.5d)
  → P3.2 FAQ schema on 10 pages (2d)
  → P3.3 Semantic content rewrite (2d)
  → P3.4 E-E-A-T bylines (1d)

Week 3b: Phase 4 (Contact Form) [Parallel]
  → P4.1 Worker endpoint (1.5d)
  → P4.2 Click-to-call + map (1d)

Week 4: Phase 5 (Arabic & Local)
  → P5.1 Arabic translation (2d)
  → P5.2 Hreflang (1d)
  → P5.3 Google Business Profile (1d)
  → P5.4 Local keywords (1d)

Week 5: Phase 6 (Testing)
  → P6.1 Lighthouse audit (1d)
  → P6.2 Cross-browser (1d)
  → P6.3 Schema validation (1d)
  → P6.4-6.7 Form, redirects, LLM, CEO (3d)
```

---

## Next Steps

1. **Start Phase 1 (Performance)** — This is the critical blocker
   - Begin with P1.1 (hero image responsive optimization)
   - Parallelize P1.2 (media conversion) with a batch script
   
2. **Create task items** for each phase using TaskCreate

3. **Track progress** using TaskUpdate as each phase completes

---

*Implementation Plan compiled: 2026-09-12*  
*Plan reference: alimran-launch-readiness-plan.md*  
*Branch: feature/launch-readiness*
