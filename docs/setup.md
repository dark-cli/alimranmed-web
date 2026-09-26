# Local development setup

## Prerequisites

- **Node.js 20 or newer** — the build uses ESM, native fetch, and `sharp` prebuilt binaries. Check with `node -v`.
- **npm 10 or newer** — comes with Node 20+.
- **git** — for the sitemap `<lastmod>` computation and normal source-control workflows.
- **A Chromium-based browser** (Chrome, Edge, Brave, Arc) — required by the CMS admin, which uses the File System Access API. Firefox and Safari won't load the admin.
- **ImageMagick** _(optional)_ — only if you plan to inspect or transcode images by hand. The build itself uses `sharp` (installed via npm) and doesn't need ImageMagick.

## Clone and install

```bash
git clone https://github.com/dark-cli/alimranmed-web.git
cd alimranmed-web
npm install
```

The install step installs `sharp` — that's a native module. On the first install
it downloads a prebuilt binary for your OS; if that fails (unusual firewall,
uncommon architecture) it will try to build from source, which needs a C toolchain.

## Run the dev server

```bash
npm run dev
```

Astro will print a local URL, typically `http://localhost:4321`. HMR is enabled — save any `.astro`, `.ts`, `.md`, or CSS file and the browser reloads.

Notes:
- **Content changes in `src/content/*.md` refresh instantly.**
- **Image variants are NOT generated in dev mode.** The optimizer only runs on `npm run build`. In dev, images fall back to their raw `.jpg`/`.png` source — you'll see the site work correctly but without WebP srcsets. This is deliberate to keep dev-server startup fast.
- **Fonts load from `/fonts/fonts.css` in dev too.** If you're offline, re-run `npm run fonts` after connecting.

## Build locally before pushing

**Always run a full local build before pushing to `main`.** Cloudflare Pages will
run the same build on every push; if it fails there, the site keeps the previous
deploy but you have to open the Cloudflare build log to diagnose.

```bash
npm run check    # full pipeline: image optimize + astro build + tsc + wrangler dry-run
```

Or just:

```bash
npm run build    # image optimize + astro build only
```

Successful output ends with `[build] Complete!`. Failed output shows the first
error inline.

## Preview the production build

```bash
npm run preview
```

This runs `astro build` then `wrangler dev` — a local server that mimics the
Cloudflare Workers runtime, including headers from `public/_headers` and
redirects from `public/_redirects`. Use this before a deploy if you've changed
anything about caching, routing, or edge behavior.

## What to expect on first run

- `node_modules/` — ~1.4 GB after install (`sharp` alone is ~200 MB per platform binary)
- `.astro/` — Astro's build cache, safe to delete anytime
- `dist/` — the actual site output, ~30 MB
- `public/optimized/` — generated WebP variants, ~16 MB — regenerated on every build

All four are gitignored except `public/optimized/manifest.json`, which is a stable
lookup table that `src/lib/image.ts` imports at SSR time.

## Common gotchas

**"Cannot find package `sharp`"** — did you run `npm install`? On Alpine Linux
you may need `apk add --no-cache libc6-compat`.

**"Astro dev server failed to start"** — port 4321 is in use. Kill the old process
(`lsof -i :4321`) or pass `--port 4322`.

**"CMS admin shows a blank white page"** — you're using Firefox or Safari.
Switch to Chrome/Edge/Brave.

**"Images look upscaled and blurry in the CMS preview"** — you added a source image
< 400 px wide. That's below the optimizer's threshold and it stays raw. Upload
a larger version.

**"TypeScript is complaining about `public/optimized/manifest.json`"** — the manifest
was rewritten by the optimizer but Astro cached the old shape. Delete `.astro/`
and restart the dev server.
