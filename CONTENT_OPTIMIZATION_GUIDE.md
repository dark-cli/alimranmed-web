# Phase 3: LLM Content Optimization Guide

**Goal:** Optimize treatment/service pages for AI-generated answer rankings and human readability.

**Timeline:** Phase 3a (Week 3a) — Focus on top 20 pages first, then expand to 100+

**Success Metrics:**
- [ ] Top 10 pages have FAQ schema (3+ Q&A pairs each)
- [ ] Top 20 pages follow strict H1→H2→H3 hierarchy
- [ ] All treatment pages have byline + last-reviewed metadata
- [ ] 10+ pages have definition lists + comparison tables

---

## P3.2: FAQ Schema for Top 10 Pages

### Why FAQ Schema Matters
FAQ schema is the #1 way to appear in AI-generated summaries (Google SGE, Perplexity, ChatGPT). When you answer "What is the recovery time for X?" directly in a structured format, LLMs cite your content.

### Target Pages (Priority Order)
These are high-traffic conditions based on search interest:

1. Back pain (`/treatments/back-pain/`)
2. Neck pain (`/treatments/neck-pain/`)
3. Herniated disc (`/treatments/herniated-disc/`)
4. Frozen shoulder (`/treatments/frozen-shoulder/`)
5. Sciatica (`/treatments/sciatica/`)
6. Spinal stenosis (`/treatments/spinal-stenosis/`)
7. Arthritis (`/treatments/arthritis-of-the-hip/` or `/treatments/arthritis/`)
8. Fibromyalgia (`/treatments/fibromyalgia/`)
9. Sports injuries (`/treatments/sports-injuries/`)
10. Head injury (`/treatments/head-injury/`)

### Implementation: Frontmatter FAQ Field

Update `src/content.config.ts` to include a `faqItems` field:

```typescript
// In the treatments schema:
schema: pageBase.extend({
  bodyRegion: z.string().optional(),
  faqItems: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
}),
```

### Example: Back Pain Treatment Frontmatter

```yaml
---
title: "Back Pain Treatment at Alimran Medical Center"
description: "Evidence-based diagnosis and treatment for acute and chronic back pain using manual therapy, injections, physiotherapy, and neurosurgery."
faqItems:
  - question: "What causes lower back pain?"
    answer: "Lower back pain is most commonly caused by muscle strain, herniated discs, spinal stenosis, or degenerative disc disease. In Basra, sedentary lifestyles and occupational lifting are frequent contributing factors."
  - question: "How is back pain diagnosed?"
    answer: "Diagnosis involves physical examination, imaging (X-ray, MRI), and sometimes specialized nerve tests. At Alimran, our physicians perform a thorough evaluation to identify the exact cause."
  - question: "What is the recovery time for back pain treatment?"
    answer: "Recovery varies by treatment type. Conservative treatment (physiotherapy, medication) typically improves symptoms in 4–6 weeks. Minimally invasive procedures like epidural injections may provide relief in 2–3 weeks, while spinal surgery recovery can take 3–6 months."
  - question: "Can back pain be prevented?"
    answer: "Yes. Prevention includes proper posture, regular exercise, weight management, and safe lifting techniques. Avoiding prolonged sitting and maintaining core strength are particularly effective."
  - question: "How much does back pain treatment cost at Alimran?"
    answer: "Costs vary by treatment. Conservative physiotherapy starts at [amount], while advanced procedures are priced individually. Contact us for a consultation and cost estimate."
---
```

### Template for FAQ Component (optional UI)

If you want to display FAQs in the page UI, create `src/components/FAQ.astro`:

```astro
---
interface Props {
  items: Array<{ question: string; answer: string }>;
}

const { items = [] } = Astro.props;
---

{items.length > 0 && (
  <section class="faq-section">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-list">
      {items.map((item, index) => (
        <details class="faq-item" key={index}>
          <summary class="faq-question">{item.question}</summary>
          <p class="faq-answer">{item.answer}</p>
        </details>
      ))}
    </div>
  </section>
)}

<style>
  .faq-section { margin: 2rem 0; padding: 1.5rem; background: var(--surface-alt); border-radius: var(--radius-lg); }
  .faq-list { margin-top: 1rem; }
  .faq-item { margin-bottom: 0.75rem; border-bottom: 1px solid var(--border); }
  .faq-question { padding: 0.75rem 0; cursor: pointer; font-weight: 600; color: var(--brand); }
  .faq-question:hover { text-decoration: underline; }
  .faq-answer { padding: 0.75rem 0; color: var(--ink-soft); margin: 0; }
  details[open] .faq-question { color: var(--ink); }
</style>
```

### JSON-LD FAQ Schema Generation

The SchemaScript component will automatically generate FAQPage schema from frontmatter. In the EntryPage component, add:

```typescript
// If faqItems exist, add FAQPage schema
const faqSchema = entry.data.faqItems?.length > 0 ? {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: entry.data.faqItems.map((item: any) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
} : null;
```

---

## P3.3: Semantic Content Restructuring

### Target: Strict H1→H2→H3 Hierarchy

**Bad (current structure):**
```markdown
# Back Pain Treatment

Back pain is very common...

#### When to Seek Help
- High fever
- Inability to walk

**Treatment Options**

Our clinic offers...

### Physical Therapy
...
```

**Good (strict hierarchy):**
```markdown
# Back Pain Treatment

Back pain is very common...

## When to Seek Help

### Emergency Warning Signs
- High fever
- Inability to walk

## Treatment Options

Our clinic offers...

### Physical Therapy
...

### Surgical Treatment
...
```

**Rules:**
- Only ONE `# H1` per page (the title)
- Use `## H2` for major sections
- Use `### H3` for subsections only
- Never skip levels (H1 → H3 is wrong; do H1 → H2 → H3)
- Avoid duplicate H1s or multiple H1s

### Add Definition Lists for Medical Terms

Definition lists (`<dl>`) help LLMs understand medical terminology.

```markdown
## Glossary

Herniated Disc
: A condition where the soft center of a spinal disc pushes through a tear in the outer layer, often causing nerve compression and pain.

Sciatica
: Pain radiating along the sciatic nerve, often caused by a herniated disc or piriformis muscle tightness.

Stenosis
: Abnormal narrowing of the spinal canal, which can compress the spinal cord or nerve roots.
```

### Add Comparison Tables

Tables help LLMs compare treatments and understand options.

```markdown
## Treatment Comparison

| Treatment | Type | Recovery Time | Hospital Stay | Cost* |
|-----------|------|---------------|---------------|----- |
| Physiotherapy | Conservative | 4–6 weeks | Outpatient | Low |
| Epidural Injection | Minimally Invasive | 2–3 weeks | Outpatient | Moderate |
| Microdiscectomy | Surgical | 2–4 weeks | 1 day | High |
| Spinal Fusion | Surgical | 3–6 months | 2–3 days | Very High |

*Consult Alimran for current pricing
```

### Direct Answer Format (Journalist's Questions)

Structure each treatment page to explicitly answer these questions:

```markdown
# [Condition] Treatment at Alimran Medical Center

## What is [Condition]?
[Define the condition in 2–3 sentences. Include prevalence and cause.]

## What are the symptoms?
[List common symptoms. Use a bulleted list.]

## How is it diagnosed?
[Describe diagnostic procedures available at Alimran.]

## What treatments are available?
[Describe all available treatments. Use subsections for each.]

## What is the recovery time?
[Provide recovery timelines for each treatment option.]

## How much does it cost?
[Price range or note to contact for estimate.]

## Can it be prevented?
[Lifestyle modifications and prevention strategies.]
```

---

## P3.4: Authorship & E-E-A-T Signals

### Update Content Frontmatter

Extend frontmatter with these fields (already in schema):

```yaml
---
title: "..."
description: "..."
reviewedBy: "Dr. Hussein Imran Mousa"
reviewedAt: 2026-08-15
# Optional: author name if different from reviewer
author: "Dr. Ahmed Khalil"
---
```

### Add Byline to Templates

Update `EntryPage.astro` to display bylines:

```astro
<article>
  <div class="prose">
    <Content />
  </div>
  
  {entry.data.reviewedBy && (
    <AuthorByline 
      reviewedBy={entry.data.reviewedBy}
      reviewedAt={entry.data.reviewedAt}
      specialty="Neurosurgeon"
    />
  )}
</article>
```

### Add Medical References

Add a "References" section at the end of treatment pages:

```markdown
## References & Further Reading

1. **PubMed Central**: [Back Pain Review](https://www.ncbi.nlm.nih.gov/pmc/articles/...)
2. **WHO Guidelines**: [Low Back Pain Treatment](https://www.who.int/...)
3. **ICD-10 Code**: M54.5 (Low back pain)
4. **Medical Journal**: [Journal of Spine Surgery, 2024](...)

All content on this page has been reviewed by Dr. Hussein Imran Mousa (Neurosurgeon, 15+ years).
Last reviewed: August 15, 2026.
```

---

## Implementation Checklist

### Priority 1: Top 10 Pages (Week 3a)
- [ ] Back pain
- [ ] Neck pain
- [ ] Herniated disc
- [ ] Frozen shoulder
- [ ] Sciatica
- [ ] Spinal stenosis
- [ ] Arthritis
- [ ] Fibromyalgia
- [ ] Sports injuries
- [ ] Head injury

For each page:
1. [ ] Add FAQ section to frontmatter (3–5 Q&As)
2. [ ] Fix heading hierarchy (strict H1→H2→H3)
3. [ ] Add 1 definition list
4. [ ] Add 1 comparison table if applicable
5. [ ] Add byline metadata (reviewedBy, reviewedAt)
6. [ ] Add References section with PubMed/WHO links
7. [ ] Test: Run `npm run build` to verify no errors
8. [ ] Validate: Use Google Rich Results Test for FAQ schema

### Priority 2: Top 20 Pages (Week 3b)
- [ ] Remaining arthritis conditions
- [ ] Nerve-related: Carpal tunnel, neuropathy, etc.
- [ ] Sports conditions: ACL, rotator cuff, etc.
- [ ] Specialized: Ozone therapy, radiofrequency, etc.

### Priority 3: All 100+ Pages (Ongoing)
- [ ] Apply same pattern to remaining treatments
- [ ] Focus on FAQ for high-traffic pages (use Analytics)
- [ ] Update review dates quarterly

---

## Tools & Validation

### Test FAQ Schema
```bash
# After building, test with Google's tool:
# https://search.google.com/test/rich-results
```

### Verify Heading Hierarchy
Use VS Code extension "markdownlint" or check manually:
```bash
grep -E "^(#{1,3})" src/content/treatments/back-pain/en.md
```

Should output:
```
# Back Pain Treatment
## What is back pain?
### Emergency symptoms
## Diagnosis
## Treatment Options
### Physical Therapy
### Surgery
```

### Check for Accessibility
Ensure all images have alt text, links have descriptive text, etc.

---

## Content Template

Create a standard template in `src/content/treatments/TEMPLATE.md`:

```markdown
---
title: "[Condition] Treatment at Alimran Medical Center"
description: "Evidence-based [condition] treatment including [method 1], [method 2]. Specialist care by [doctor name]."
category: "[body region, e.g., Spine]"
image: "/images/treatments/[condition].jpg"
imageAlt: "[Descriptive alt text]"
reviewedBy: "Dr. Hussein Imran Mousa"
reviewedAt: 2026-08-15
source: "human-reviewed"
faqItems:
  - question: "What is [condition]?"
    answer: "[2–3 sentence definition]"
  - question: "What causes [condition]?"
    answer: "[List causes]"
  - question: "How is it diagnosed?"
    answer: "[Diagnostic procedure]"
  - question: "What is the recovery time?"
    answer: "[Recovery timeline]"
---

## What is [Condition]?

[2–3 sentence intro. Define the condition.]

## What are the symptoms?

[List symptoms using bullet points.]

## What causes [Condition]?

[Describe causes.]

## How is [Condition] diagnosed?

[Explain diagnostic procedures available at Alimran.]

## Treatment Options at Alimran

[Introduction to available treatments.]

### [Treatment Method 1]

[Description, recovery time, effectiveness.]

### [Treatment Method 2]

[Description, recovery time, effectiveness.]

## Recovery & Outlook

[Prognosis, timeline, rehabilitation.]

## Prevention & Self-Care

[Lifestyle modifications, exercises, prevention strategies.]

## References & Further Reading

1. [Link to PubMed article]
2. [Link to WHO guideline]
3. [ICD-10 code: XXX.X]

---

*Reviewed by Dr. Hussein Imran Mousa  
Last updated: August 15, 2026*
```

---

## Next Steps

1. **Week 3a:** Update 10 priority pages with FAQ schema + semantic restructuring
2. **Week 3b:** Expand to 20 pages
3. **Week 4:** Integrate with Arabic content (translation of structured Q&A)
4. **Ongoing:** Maintain review dates and update references quarterly

---

*Phase 3 Implementation Guide — LLM Content Optimization*  
*See IMPLEMENTATION_PLAN.md for timeline and dependencies*
