# Media Conversion Guide — P1.2

**Goal:** Convert 419 existing images to AVIF (primary) + WebP (fallback) formats for better mobile performance.

**Timeline:** Can run in parallel with other Phase 1 tasks via batch scripts.

## Current State
- **Total images:** 419 files
- **Formats:** Mostly JPG with some PNG
- **Locations:**
  - `/public/images/home/` — 13 featured condition/service images
  - `/public/images/doctors/` — 2 doctor photos
  - `/public/images/legacy/` — 394+ legacy media from WordPress

## Strategy

### Option 1: Cloudflare Image Optimization (Recommended)
If the site is deployed on Cloudflare Workers (already configured in `astro.config.mjs`):

1. Enable Cloudflare Polish/Image Optimization in Cloudflare Dashboard
2. Set image format to "WebP" or "Auto" (serves AVIF to modern browsers, WebP/JPG to older ones)
3. Enable automatic optimization
4. **Result:** Images are optimized on-the-fly; no local conversion needed

**Pros:** No build-time processing, automatic based on browser capabilities  
**Cons:** Adds latency to first request if not cached

### Option 2: Batch Local Conversion (Parallel Option)
Use Node.js `sharp` library or ImageMagick for local conversion:

```bash
npm install sharp
```

Then run:

```js
// convert-images.mjs
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { dirname, extname, join } from 'path';
import { existsSync } from 'fs';

const INPUT_DIRS = [
  'public/images/home',
  'public/images/doctors',
  'public/images/legacy'
];

const FORMATS = {
  avif: { quality: 75, effort: 6 },
  webp: { quality: 80 },
  // Keep original JPG/PNG as fallback
};

async function convertImages() {
  for (const dir of INPUT_DIRS) {
    if (!existsSync(dir)) continue;
    
    const files = await readdir(dir);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    
    console.log(`Converting ${imageFiles.length} images in ${dir}`);
    
    for (const file of imageFiles) {
      const src = join(dir, file);
      const nameNoExt = file.replace(/\.[^.]+$/, '');
      
      try {
        // Convert to AVIF
        await sharp(src)
          .avif(FORMATS.avif)
          .toFile(join(dir, `${nameNoExt}.avif`));
        
        // Convert to WebP
        await sharp(src)
          .webp(FORMATS.webp)
          .toFile(join(dir, `${nameNoExt}.webp`));
        
        console.log(`✓ ${file}`);
      } catch (err) {
        console.error(`✗ ${file}:`, err.message);
      }
    }
  }
  console.log('Conversion complete!');
}

convertImages();
```

Run with: `node convert-images.mjs`

## Update Image References

After conversion, update image references to use responsive formats:

### Before (current):
```html
<img src="/images/home/Back-Pain.jpg" alt="Back pain" loading="lazy" width="200" height="150" />
```

### After (with multiple formats):
```html
<picture>
  <source srcset="/images/home/Back-Pain.avif" type="image/avif" />
  <source srcset="/images/home/Back-Pain.webp" type="image/webp" />
  <img src="/images/home/Back-Pain.jpg" alt="Back pain" loading="lazy" width="200" height="150" />
</picture>
```

**OR** use Astro's `Picture` component (recommended):

```astro
---
import { Picture } from 'astro:assets';
import BackPainImg from '../images/home/Back-Pain.jpg';
---

<Picture
  src={BackPainImg}
  alt="Back pain"
  widths={[200, 400, 600]}
  formats={['avif', 'webp']}
  loading="lazy"
/>
```

## Lighthouse Impact

**Expected results:**
- Images account for ~40% of page weight on mobile
- AVIF reduces size by 25-30% vs JPEG
- WebP reduces size by 15-20% vs JPEG
- **Estimated LCP improvement:** 8.1s → 5-6s (with preload + responsive sizing)

## Priority Images (for immediate conversion)

Convert these first as they're above-the-fold:
1. `/public/images/home/DSC_0054-1-1024x684.jpg` — Chiropractic service
2. `/public/images/home/1-1.jpg` — Frozen shoulder condition
3. `/public/images/home/SNHS-neck-pain-1.jpg` — Neck pain condition
4. `/public/images/home/tms-treatment-768.jpg` — Brain stimulation service
5. `/public/images/home/Can-Osteopathy-help-you-with-your-sport-injury-1.jpg` — Sports injuries
6. Doctor photos in `/public/images/doctors/`

## Verification

After conversion, run Lighthouse again to verify improvements:

```bash
npm run build
npm run preview
# Open http://localhost:3000 in Chrome DevTools → Lighthouse → Run audit (mobile)
```

Expected:
- Performance: 72 → 85+
- LCP: 8.1s → <4s (with all Phase 1 fixes)

## Notes

- **Fallback:** Always keep original JPG/PNG files as final fallback for ancient browsers
- **Caching:** Set long-term cache headers on converted assets (Cloudflare does this automatically)
- **Testing:** Test on real 4G devices or Chrome DevTools throttling to see true impact
- **File size:** Check disk usage after conversion; AVIF files can be stored separately or in a CDN origin

---

*Guide created: Phase 1.2 — Media Optimization*  
*See IMPLEMENTATION_PLAN.md for context*
