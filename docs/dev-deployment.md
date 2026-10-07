# Deployment

The site lives on **Cloudflare Pages** with Workers as the runtime. There is no
staging environment — every push to `main` deploys straight to production.

Repo: [dark-cli/alimranmed-web](https://github.com/dark-cli/alimranmed-web)
Live URL: [alimran.clinic](https://alimran.clinic/)

---

## The deploy loop

```
edit → npm run build → git commit → git push origin main → Cloudflare Pages picks up push
                                                          → runs `npm run build` in the cloud
                                                          → publishes dist/ to the edge (5–10 min)
```

**Local build is not optional.** Always run `npm run build` on your machine before pushing:

- It catches TypeScript errors, broken imports, and content-schema violations that would fail the Cloudflare build too.
- If the local build breaks, you can iterate for free. A failed cloud build eats a Cloudflare Pages CI slot and leaves you diagnosing from log tail alone.
- If the local build succeeds, the cloud build almost always succeeds too.

---

## Watching the deploy

After `git push`, the deploy typically takes **5–10 minutes**:

1. GitHub receives the push
2. Cloudflare Pages webhook fires
3. Cloudflare provisions a build container, clones the repo, runs `npm install`
4. `npm run build` runs (image optimizer + astro build)
5. `dist/` is uploaded to the edge
6. The public URL flips to the new version

You can watch progress at [dash.cloudflare.com](https://dash.cloudflare.com/) →
Workers & Pages → alimranmed-web → Deployments.

## When the site doesn't update after ~10 minutes

Something failed. Open the Cloudflare Pages deployment view:

1. Click the failed deployment
2. Read the **"Build logs"** tab
3. Look for the first red line — usually a `[ERROR]` from Astro or a stack trace from `sharp`

Most common failure modes:

| Log message | Cause | Fix |
|---|---|---|
| `ZodError` on a content entry | Frontmatter shape doesn't match `src/content.config.ts` | Reproduce locally with `npm run build`; the log names the file and field. Fix the frontmatter. |
| `Cannot resolve module ".../foo.astro"` | Renamed/deleted a component but forgot to update an import | Grep the repo for the old name, update all callers. |
| `Sharp: Input file is missing` | Content references an image that isn't committed | Add the image to `public/images/…` and commit. |
| `Sharp: Input buffer contains unsupported image format` | An uploaded file is corrupted or not actually a JPG/PNG | Re-export from source; verify with `identify path/to/file`. |
| Build hangs > 15 min | Cloudflare runner stuck | Retry from the dashboard's **"Retry deployment"** button. |

If none of the above match: run `npm run build` locally — the error is almost
always reproducible.

## Rolling back

Cloudflare Pages keeps every previous successful deploy indefinitely.
To roll back:

1. Deployments tab → find the good deployment
2. Three-dot menu → **"Rollback to this deployment"**

This is instant (a few seconds). It doesn't touch git; the repo still holds the
broken commit. Fix the code in a new commit before re-deploying.

---

## Cloudflare environment settings

The Pages project uses these settings (already configured — listed here for
disaster-recovery reference):

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node.js version | 20 |
| Environment variables | `CF_PAGES_BRANCH` (auto), `WORKERS_CI_GIT_DEPTH=0` |

**`WORKERS_CI_GIT_DEPTH=0`** is important. Without it, Cloudflare shallow-clones
the repo (depth=1) and the sitemap `<lastmod>` computation collapses to the
deploy commit for every URL. Setting it to 0 fetches the full history so per-file
dates are real.

## Domain and DNS

- **`alimran.clinic`** — apex, Cloudflare-managed. A/AAAA records point at the Pages project.
- **`www.alimran.clinic`** — CNAME → apex.
- HTTPS is Cloudflare Universal SSL (free tier, auto-renewed).
- HTTP → HTTPS is enforced at the edge.
- The old WordPress site at `alimranmed.com` is a **separate zone** and stays live during a migration window. See `public/_redirects` for the URL map.

---

## Manual deploys

You can also deploy from your machine (skips GitHub):

```bash
npm run build
npx wrangler deploy
```

This bypasses the automated flow and requires `wrangler login` first. Use it only
for emergency hotfixes when GitHub is unavailable — normally, `git push` is the
correct path.

## Legacy WordPress redirects

The clinic previously ran two WordPress sites: `alimranmed.com` (English) and
`ar.alimranmed.com` (Arabic). Both have negligible external inbound traffic
outside of the clinic's own Facebook posts.

The plan for handling the transition:

1. **Google Search Console** — file a "Change of address" from the two old
   properties to `alimran.clinic`. Google transfers the ranking automatically
   once the migration is verified.
2. **Old-site fallback redirect** — install a single `.htaccess` rule on the
   old Apache servers that catches *every* old URL and redirects to the new
   site's home with the old URL passed as a query parameter:
   ```
   RewriteRule ^(.*)$ https://alimran.clinic/?legacy=$1 [R=301,L]
   ```
3. **Client-side rescue on the new site** — when `?legacy=<slug>` is present,
   open the site's search modal pre-filled with a topic guess derived from the
   old slug. That way, even if an article was renamed or moved, the user lands
   on something relevant instead of a 404.

This is deliberately preferable to a hard-coded 634-line per-URL redirect map:
the old nav will keep drifting, but the search-fallback stays robust forever.
The rescue script isn't built yet — flag it as future work when the old sites
are actually decommissioned.

## What NOT to commit

- `dist/` — build output, gitignored
- `.astro/` — build cache
- `public/optimized/*.webp` — regenerated on every build (gitignored except the manifest)
- `node_modules/`
- `.env*` — secrets, if any get added later
- `package-lock.json` — currently tracked (see `.gitignore` note), but don't hand-edit it

If you accidentally commit any of these, they'll deploy fine but bloat the repo.
Use `git rm --cached <file>` to remove without deleting locally.
