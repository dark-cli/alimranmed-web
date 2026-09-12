# Alimran Medical Center Website — Launch Readiness Plan

**Project:** alimran.clinic  
**Stack:** Astro 5 + Cloudflare Workers  
**Date:** August 10, 2026  
**Status:** Pre-Launch / Staging Review

---

## 1. Executive Summary

The site is architecturally sound (Astro 5, Content Collections, 182 redirects, 394 self-hosted media files, ~200 static pages). However, **mobile performance is the critical blocker** (Lighthouse 72, LCP 8.1s), and **SEO/LLM discoverability is incomplete** despite a technical SEO score of 100. This plan covers Performance, SEO, AI/LLM readiness, and stakeholder presentation requirements.

### Current State Snapshot

| Metric | Desktop | Mobile | Target |
|--------|---------|--------|--------|
| Performance | 90 | **72** | ≥90 |
| Accessibility | 91 | **87** | ≥95 |
| Best Practices | 100 | 100 | 100 |
| SEO (Technical) | 100 | 100 | 100 |
| Agentic Browsing | 2/2 | **1/2** | 2/2 |
| LCP | 2.0s | **8.1s** | <2.5s |
| CLS | 0.003 | 0.002 | <0.1 |
| TBT | 0ms | 0ms | <200ms |

---

## 2. Performance — P0 (Blocker)

### 2.1 Mobile LCP Crisis (8.1s → <2.5s)

**Root Cause:** The hero image/video on the homepage is served at desktop resolution on mobile, and there is no preload/fetchpriority hint.

**Actions:**

1. **Responsive Images with Astro `<Picture>`**
   Replace the hero `<img>` with Astro's `<Picture>` component to serve appropriately sized images:
   ```astro
   <Picture
     src={heroImage}
     widths={[400, 800, 1200, 1600]}
     sizes="(max-width: 768px) 100vw, 50vw"
     formats={['avif', 'webp']}
     alt="Alimran Medical Center building in Basra, Iraq"
     loading="eager"
     fetchpriority="high"
   />
   ```

2. **Preload the LCP Image in `<head>`**
   Add to `BaseLayout.astro` (conditional on homepage):
   ```html
   <link rel="preload" as="image"
         href="/images/hero-800.avif"
         type="image/avif"
         imagesrcset="/images/hero-400.avif 400w, /images/hero-800.avif 800w"
         imagesizes="100vw"
         fetchpriority="high">
   ```

3. **Audit All 394 Media Files**
   - Convert legacy uploads to AVIF/WebP via `scripts/download-media.mjs` or a batch tool
   - Ensure every image below the fold uses `loading="lazy"`
   - Add `width` and `height` attributes to prevent layout shifts

4. **Font Loading Strategy**
   If using custom fonts, ensure:
   ```css
   @font-face {
     font-family: 'YourFont';
     src: url('/fonts/...') format('woff2');
     font-display: swap;
   }
   ```

### 2.2 Accessibility Drop on Mobile (87)

**Likely Causes:**
- Touch targets < 48×48px (buttons, nav links, hamburger menu)
- Missing `aria-label` on icon-only buttons
- Color contrast issues on smaller screens

**Actions:**
- Audit all interactive elements with Chrome DevTools → Accessibility → Issues
- Ensure minimum 48×48px tap targets
- Add `aria-label="Open navigation menu"` to hamburger button
- Verify WCAG AA contrast on all text/background pairs

### 2.3 Agentic Browsing Failure on Mobile (1/2)

**Likely Cause:** A resource (map embed, video iframe, or script) fails or times out on mobile viewport.

**Actions:**
- Inspect Network tab on mobile emulation for failed requests
- Ensure map embed (Google Maps?) has a fallback or lazy-loads
- Check that no third-party script blocks rendering

---

## 3. SEO Readiness — P1

### 3.1 Meta Tags (Currently Missing/Thin)

Every page needs unique `<title>` and `<meta name="description">`. The homepage title is currently generic.

**Implementation:**
- Update `BaseLayout.astro` to accept `title` and `description` props
- Pull from content frontmatter for collection pages
- Pattern: `{Page Title} | Alimran Medical Center — Basra, Iraq`

**Example:**
```astro
<!-- BaseLayout.astro -->
<head>
  <title>{title} | Alimran Medical Center — Basra, Iraq</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={`https://alimran.clinic${Astro.url.pathname}`} />
</head>
```

### 3.2 Open Graph & Twitter Cards

```astro
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage || "https://alimran.clinic/images/og-default.jpg"} />
<meta property="og:type" content="website" />
<meta property="og:locale" content="en_US" />
<meta name="twitter:card" content="summary_large_image" />
```

Generate a default OG image (1200×630) with the Alimran logo and Basra location.

### 3.3 Schema.org Structured Data

Add JSON-LD to every page type. Create a reusable Astro component `SchemaScript.astro`.

#### Homepage — `MedicalOrganization` + `LocalBusiness`
```json
{
  "@context": "https://schema.org",
  "@type": ["MedicalOrganization", "LocalBusiness"],
  "name": "Alimran Medical Center",
  "description": "Specialised care for neurology and musculoskeletal disorders in Basra, Iraq.",
  "url": "https://alimran.clinic",
  "logo": "https://alimran.clinic/images/logo.png",
  "image": "https://alimran.clinic/images/clinic-exterior.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Street Address]",
    "addressLocality": "Basra",
    "addressCountry": "IQ"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "30.5156",
    "longitude": "47.7804"
  },
  "telephone": "+[Phone]",
  "email": "info@alimran.clinic",
  "openingHours": "Mo-Sa 09:00-18:00",
  "medicalSpecialty": [
    "Neurology",
    "Orthopedics",
    "Chiropractic",
    "Physiotherapy",
    "Pain Management"
  ]
}
```

#### Doctor Pages — `Physician`
```json
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Dr. [Name]",
  "medicalSpecialty": "Neurosurgery",
  "worksFor": {
    "@type": "MedicalOrganization",
    "name": "Alimran Medical Center"
  },
  "alumniOf": "University of Baghdad Medical School",
  "memberOf": "Iraqi Medical Association"
}
```

#### Treatment Pages — `MedicalWebPage` + `MedicalProcedure`
```json
{
  "@context": "https://schema.org",
  "@type": ["MedicalWebPage", "MedicalProcedure"],
  "name": "Herniated Disc Treatment",
  "about": {
    "@type": "MedicalCondition",
    "name": "Herniated Disc",
    "code": {
      "@type": "MedicalCode",
      "code": "M51.2",
      "codingSystem": "ICD-10"
    }
  }
}
```

### 3.4 Sitemap & robots.txt

**robots.txt** (`public/robots.txt`):
```
User-agent: *
Allow: /

Sitemap: https://alimran.clinic/sitemap-index.xml

# LLM crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

**Sitemap:** Ensure `@astrojs/sitemap` is configured with `<lastmod>` dates from frontmatter.

### 3.5 Internal Linking & Breadcrumbs

- Every treatment links to relevant doctors
- Every doctor links to their specializations
- Add breadcrumb navigation with `BreadcrumbList` schema
- Ensure the 87 orphan pages have `noindex` until properly integrated

### 3.6 Local SEO for Basra

- **Google Business Profile:** Claim and optimize with address, hours, photos, services
- **NAP Consistency:** Name, Address, Phone must match exactly across site, GBP, and directories
- **Local Keywords:** "neurologist Basra", "chiropractic Iraq", "pain management Basra" in H1s and body copy

---

## 4. LLM / AI-Friendly Optimization — P1

### 4.1 Create `/llms.txt`

Create `public/llms.txt` — an emerging standard for LLM context:

```
# Alimran Medical Center — LLM Context

## About
Alimran Medical Center is a specialist neurology and musculoskeletal clinic in Basra, Iraq. 
We provide consultant-led care in chiropractic, neurosurgery, pain management, physiotherapy, 
and rehabilitation using evidence-based techniques.

## Key Facts
- Location: Basra, Iraq
- Specialties: Neurology, Orthopedics, Chiropractic, Physiotherapy, Pain Management
- Languages: English (Arabic coming soon)
- Contact: [phone], info@alimran.clinic
- Hours: Saturday–Thursday, 9:00 AM – 6:00 PM

## Important Pages
- /treatments/ — Full A–Z treatment index
- /doctors/ — Consultant profiles and specializations
- /services/ — Service categories (chiropractic, surgery, rehabilitation, etc.)
- /contact/ — Appointment booking and clinic location
- /cases/ — Patient case studies

## Content Policy
All medical content is reviewed by licensed physicians before publication.
Last updated: 2026-08-10
```

### 4.2 FAQ Schema for AI Snippets

Add FAQ sections to top treatment pages. This is the #1 way to appear in AI-generated answers.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the recovery time for spinal surgery at Alimran Medical Center?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Recovery time varies by procedure. Minimally invasive discectomy patients typically return to normal activities within 2-4 weeks, while spinal fusion may require 3-6 months. Our Basra-based rehabilitation team provides personalized recovery plans."
      }
    }
  ]
}
```

### 4.3 HowTo Schema for Procedures

For pre-surgery prep, rehab exercises, or first-visit guidance:

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to prepare for your first chiropractic visit",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Bring medical records",
      "text": "Bring any X-rays, MRI scans, or previous treatment records to help your consultant provide an accurate diagnosis."
    }
  ]
}
```

### 4.4 Semantic Content Architecture

**Heading Hierarchy:** Use strict H1→H2→H3 structure. Never skip levels.

**Definition Lists for Medical Terms:**
```html
<dl>
  <dt>Sciatica</dt>
  <dd>Pain radiating along the sciatic nerve, often caused by a herniated disc.</dd>
</dl>
```

**Tables for Comparisons:**
```html
<table>
  <caption>Recovery Timeline by Procedure</caption>
  <thead>
    <tr><th>Procedure</th><th>Hospital Stay</th><th>Return to Work</th></tr>
  </thead>
  <tbody>
    <tr><td>Microdiscectomy</td><td>1 day</td><td>2–4 weeks</td></tr>
  </tbody>
</table>
```

### 4.5 Direct Answer Format (Journalist's Questions)

Structure treatment content to answer these explicitly:
- What is [condition]?
- What are the symptoms?
- How is it diagnosed?
- What treatments are available?
- What is the recovery time?
- How much does it cost?

**Example:**
> **What causes lower back pain?**  
> Lower back pain is most commonly caused by muscle strain, herniated discs, spinal stenosis, or degenerative disc disease. In Basra, sedentary lifestyles and occupational lifting are frequent contributing factors.

### 4.6 Authorship & E-E-A-T Signals

Every article/treatment page should display:
```html
<div class="author">
  <span>Reviewed by</span>
  <a href="/doctors/dr-ahmed-alimran/">Dr. Ahmed Alimran</a>
  <span>Neurosurgeon, 15 years experience</span>
  <span>Last reviewed: 2026-08-01</span>
</div>
```

Include a "References" section with proper citations linking to PubMed, WHO, or medical journals.

### 4.7 Entity Linking

Link every page to related entities:
- Treatment → Doctors, Related Conditions, Services
- Doctor → Specializations, Treatments, Case Studies
- Case Study → Condition, Treatment, Doctor, Outcome

Link externally to authoritative sources (WHO, PubMed, ICD-10 codes) to signal expertise.

---

## 5. Arabic Version — P1 (Highest ROI Feature)

### Why This Matters
- Basra patients primarily speak Arabic
- Arabic medical content is scarce online → less competition
- Google `.iq` and Arabic queries are far less saturated
- AI systems have fewer authoritative Arabic medical sources

### Implementation Path
1. Enable Astro i18n routing: `ar.alimran.clinic`
2. Re-use `scripts/migrate.mjs` (already wired for Arabic)
3. Translate UI strings in `i18n/ar.json`
4. Add `hreflang` tags:
   ```html
   <link rel="alternate" hreflang="en" href="https://alimran.clinic/treatment/slug" />
   <link rel="alternate" hreflang="ar" href="https://ar.alimran.clinic/treatment/slug" />
   ```
5. Ensure RTL CSS support (`dir="rtl"` on `<html>`)

---

## 6. Conversion & Functionality — P1

### 6.1 Working Contact Form
Currently display-only. Wire to:
- Cloudflare Worker (you're already on Workers)
- Resend, EmailJS, or a Telegram bot for quick delivery
- Include fields: Name, Phone, Email, Service Interest, Message

### 6.2 Click-to-Call
Ensure phone numbers use `tel:` links:
```html
<a href="tel:+964XXXXXXXXXX">Call Us</a>
```

### 6.3 Map Integration
Verify the embedded map shows the correct Basra location and loads properly on mobile.

---

## 7. CEO / Stakeholder Presentation Checklist

When presenting to the clinic owner/CEO, ensure these are demonstrable:

| # | Check | Status |
|---|-------|--------|
| 1 | Site loads in under 3 seconds on mobile (3G/4G) | ⬜ |
| 2 | "Book Appointment" or "Call Now" button works | ⬜ |
| 3 | Phone number is click-to-call on mobile | ⬜ |
| 4 | Arabic toggle is visible (even if "Coming Soon") | ⬜ |
| 5 | Map shows correct Basra location | ⬜ |
| 6 | Doctor profiles have real photos (not stock) | ⬜ |
| 7 | Contact form sends email successfully | ⬜ |
| 8 | Professional email domain (info@alimran.clinic) | ⬜ |
| 9 | SSL certificate active (Cloudflare ✅) | ✅ |
| 10 | Google Business Profile claimed | ⬜ |

---

## 8. Implementation Timeline

### Week 1: Performance & Technical Foundation
- [ ] Fix mobile LCP (responsive hero image, preload)
- [ ] Batch-convert 394 media files to AVIF/WebP
- [ ] Fix accessibility touch targets and labels
- [ ] Fix agentic browsing mobile failure
- [ ] Add unique titles + meta descriptions to all pages
- [ ] Add canonical tags
- [ ] Create `robots.txt` with LLM allowances
- [ ] Submit sitemap to Google Search Console

### Week 2: Structured Data & AI Readiness
- [ ] Build `SchemaScript.astro` component
- [ ] Add `MedicalOrganization` schema to homepage
- [ ] Add `Physician` schema to doctor pages
- [ ] Add `MedicalWebPage` + `MedicalProcedure` to treatment pages
- [ ] Add FAQ schema to top 10 treatment pages
- [ ] Create `/llms.txt`
- [ ] Add authorship bylines + last-reviewed dates
- [ ] Implement breadcrumb navigation + schema

### Week 3: Content & Conversion
- [ ] Wire contact form to Cloudflare Worker
- [ ] Add click-to-call across all pages
- [ ] Re-structure top 20 treatment pages with direct-answer format
- [ ] Add definition lists and comparison tables
- [ ] Add references/citations to treatment pages
- [ ] Set up Google Analytics 4 or Plausible

### Week 4: Arabic & Local SEO
- [ ] Enable Arabic i18n routing (`ar.alimran.clinic`)
- [ ] Translate UI strings and top 20 pages
- [ ] Implement `hreflang` tags
- [ ] Claim and optimize Google Business Profile
- [ ] Ensure NAP consistency across all channels
- [ ] Add local keywords to H1s and body copy

### Week 5: Testing & Launch
- [ ] Full Lighthouse audit (mobile + desktop)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile device testing (iOS Safari, Android Chrome)
- [ ] Form submission end-to-end test
- [ ] 301 redirect validation (all 182 redirects)
- [ ] Schema.org validation (Google Rich Results Test)
- [ ] LLM citation test (Perplexity, ChatGPT)
- [ ] CEO walkthrough + sign-off

---

## 9. Quick Reference: File Changes

| File | Change |
|------|--------|
| `src/layouts/BaseLayout.astro` | Add `<title>`, `<meta>`, OG tags, canonical, preload |
| `src/components/SchemaScript.astro` | New: JSON-LD injection component |
| `src/components/Breadcrumb.astro` | New: Breadcrumb nav + schema |
| `content.config.ts` | Add `author`, `lastReviewed`, `description` fields |
| `public/robots.txt` | New: Crawler rules + sitemap reference |
| `public/llms.txt` | New: LLM context file |
| `src/content/treatments/*.md` | Add FAQ frontmatter, restructure for direct answers |
| `src/pages/contact.astro` | Wire form submission |
| `astro.config.mjs` | Enable i18n routing for Arabic |
| `src/i18n/ar.json` | New: Arabic UI strings |

---

## 10. Success Metrics (30 Days Post-Launch)

| Metric | Baseline | Target |
|--------|----------|--------|
| Mobile Lighthouse Performance | 72 | ≥90 |
| Mobile LCP | 8.1s | <2.5s |
| Accessibility | 87 | ≥95 |
| Indexed Pages | ~200 | 200+ |
| Organic Traffic (Google Search Console) | 0 | Baseline + growth |
| Contact Form Submissions | 0 | ≥10/month |
| Arabic Page Views | 0 | ≥30% of total |
| AI Citation Mentions | 0 | ≥1 (Perplexity/ChatGPT) |

---

*Plan compiled for: Alimran Medical Center (alimran.clinic)*  
*Compiled on: August 10, 2026*
