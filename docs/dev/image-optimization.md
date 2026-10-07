# Image optimization pipeline

Every image on the site is served in **four sizes as WebP** — 480w, 800w, 1200w,
and a full-resolution version — via `<img srcset>`. Images are generated at
build time; the CMS never sees them; authors never hand-write srcset strings.

---

## The pipeline in one diagram

```
Author uploads:
public/images/doctors/name.jpg        (5000×3750 source)
                    ↓
        `npm run build` (or Cloudflare Pages build)
                    ↓
        scripts/optimize-images.mjs
                    ↓
public/optimized/images/doctors/
    name-480.webp                     (14 KB)
    name-800.webp                     (32 KB)
    name-1200.webp                    (61 KB)
    name-full.webp                    (native size, high quality)
public/optimized/manifest.json         (adds: {"/images/doctors/name.jpg": {…}})
                    ↓
        Astro build renders pages
                    ↓
Every <Image src="/images/doctors/name.jpg" /> component
    calls imageVariants() → reads manifest.json
    → emits <img src srcset sizes width height data-hires>
```

---

## The pieces

### `scripts/optimize-images.mjs`

The build-time optimizer. Runs as an npm `prebuild` script — automatic before
every `npm run build`.

- Walks `public/images/` recursively.
- Skips any image narrower than 400 px (icons, avatars, small thumbnails).
- For every other JPG or PNG: emits 480w/800w/1200w/full WebP variants into `public/optimized/images/<same-subpath>/<name>-{w}.webp`.
- Uses `sharp` with quality 78 for responsive sizes, quality 92 for `-full`.
- Never upscales — a 600 px source produces `-480` and `-full`; the 800 and 1200 variants are omitted (they'd be upscaled and worse-looking than the source).
- Writes `public/optimized/manifest.json` mapping every source path → variant paths + intrinsic width/height.
- **Incremental:** re-running skips images whose source mtime matches the manifest.
- **Prunes stale entries:** if you delete a source image, its variants are removed on next run.

### `public/optimized/manifest.json`

The lookup table. Committed to git as a seed (starts as `{}`, overwritten by
every build). Structure:

```json
{
  "/images/doctors/hussein-imran-mousa.jpg": {
    "mtime": 1786009319003,
    "width":  2000,
    "height": 1500,
    "variants": [
      "/optimized/images/doctors/hussein-imran-mousa-480.webp",
      "/optimized/images/doctors/hussein-imran-mousa-800.webp",
      "/optimized/images/doctors/hussein-imran-mousa-1200.webp",
      "/optimized/images/doctors/hussein-imran-mousa-full.webp"
    ]
  }
}
```

### `src/lib/image.ts`

The SSR helper. Reads `manifest.json` at module load time (import), exports:

```ts
imageVariants("/images/doctors/name.jpg")
// →
// {
//   src:      "/optimized/images/doctors/name-800.webp",
//   srcset:   "…-480.webp 480w, …-800.webp 800w, …-1200.webp 1200w",
//   fallback: "/images/doctors/name.jpg",     // for <img src>
//   full:     "/optimized/images/doctors/name-full.webp",
//   width:    2000,
//   height:   1500
// }
```

If the source isn't in the manifest (too small, external URL, added since last
build), returns a fallback shape with just `{src, srcset: "", fallback}` so the
`<img>` still renders.

### `src/components/Image.astro`

The universal image component. Every rendered `<img>` on the site goes through
it (except the tiny 156-px avatar, the `<picture>` fallback img, and OG/Twitter
meta tags).

```astro
<Image
  src="/images/doctors/hussein-imran-mousa.jpg"
  alt="Consultant portrait"
  sizes="(min-width: 720px) 40vw, 100vw"
/>
```

Emits:

```html
<img
  src="/optimized/images/doctors/hussein-imran-mousa-800.webp"
  srcset="…480.webp 480w, …800.webp 800w, …1200.webp 1200w"
  sizes="(min-width: 720px) 40vw, 100vw"
  alt="Consultant portrait"
  width="2000" height="1500"
  loading="lazy" decoding="async"
/>
```

The `sizes` attribute is the *layout hint* — how wide the image will be
displayed at each viewport size. The browser uses it plus the srcset to pick
which variant to fetch.

### `src/lib/rehype-responsive-images.mjs`

Rehype plugin that upgrades legacy markdown body images. Any `<img src="/images/…">`
in a rendered `.md` body gets the same srcset/sizes/width/height/data-hires
injected. No author effort — every legacy WordPress blog image now uses WebP
variants automatically.

### Progressive HD swap (BaseLayout)

For hero images marked `hires=true`, `BaseLayout.astro` includes a small script
that:

1. Waits for `load` + browser idle
2. Preloads the `-full.webp` variant with `new Image()`
3. Swaps `img.src` to the full-quality version once it arrives

Effect: the initial render uses the srcset variant (fast); after the page is
interactive, the hero silently upgrades to full quality. No layout shift.

---

## What authors actually need to know

**Very little.** Upload a JPG or PNG through the CMS. That's the whole workflow.

Things worth remembering:

- **≥ 400 px wide** or the optimizer skips it. Below that it renders as a plain `<img>`.
- **Source stays at its original path.** `public/images/doctors/name.jpg` is what the CMS shows, references, and stores. Optimized variants live under `public/optimized/` — you should never link to them by hand.
- **After uploading, build locally once** so the optimizer runs. Otherwise Cloudflare's build will run it — the site works either way but you don't see the result until deploy.

---

## Adding a new folder for optimization

By default the optimizer walks all of `public/images/`. If you add a new
subfolder (e.g. `public/images/testimonies/`), any images ≥ 400 px inside it
are picked up automatically on next build. No config change.

To **exclude** a folder from optimization, edit `scripts/optimize-images.mjs`
and add a check in `walk()` — currently it uses the `ROOT_DIR = "images"`
constant and a simple recursive walk.

---

## Regenerating variants from scratch

Occasionally useful (e.g., after changing WIDTHS or QUALITY):

```bash
rm -rf public/optimized/images public/optimized/manifest.json
echo "{}" > public/optimized/manifest.json
npm run build
```

The build re-runs the optimizer on every source. Expect ~30 seconds for the
current ~120 images.
