# Alimran Medical Center — Website

Production site: **[alimran.clinic](https://alimran.clinic/)**

Bilingual (English + Arabic) clinical website for a neurosurgery, pain-medicine
and rehabilitation practice in Basra, Iraq. Content is authored through a
browser-based CMS; the build is a static Astro export served by Cloudflare Workers.

---

## Quick start

```bash
git clone https://github.com/dark-cli/alimranmed-web.git
cd alimranmed-web
npm install
npm run dev     # local preview at http://localhost:4321
```

To open the CMS admin: run `npm run dev`, then visit
[http://localhost:4321/admin/](http://localhost:4321/admin/) in **Chrome, Edge
or Brave** (the CMS uses the File System Access API — Firefox and Safari
are not supported). Click "Work with Local Repository" and pick the project
folder. The CMS reads and writes the same content files under `src/content/`
that the site builds from.

Everything else — deploys, CMS features, content authoring, the block widgets,
the image pipeline, and the AI collaborator brief — is in **[`docs/`](docs/)**.

---

## Documentation map

Docs are split by audience. **Manual** files (`docs/manual-*.md`) are
written for the site owner / editor / content writer. **Developer**
files (`docs/dev-*.md`) cover the code, build, and deploy pipeline.

### User manual

| File | Purpose |
|---|---|
| [`docs/manual-installation.md`](docs/manual-installation.md) | **Start here** — step-by-step first-time setup for the site owner / editor |
| [`docs/manual-cms.md`](docs/manual-cms.md) | Using the Sveltia admin — features and limitations |
| [`docs/manual-writing-guide.md`](docs/manual-writing-guide.md) | The three ways to write content, including the AI-assisted route |
| [`docs/manual-content-authoring.md`](docs/manual-content-authoring.md) | How to write articles: frontmatter, voice, bilingual policy |
| [`docs/manual-sections.md`](docs/manual-sections.md) | All block/widget types with syntax + examples |

### Developer

| File | Purpose |
|---|---|
| [`docs/dev-setup.md`](docs/dev-setup.md) | Local development setup + prerequisites (developer quick-reference) |
| [`docs/dev-project-structure.md`](docs/dev-project-structure.md) | Where every file type lives and why |
| [`docs/dev-deployment.md`](docs/dev-deployment.md) | Cloudflare Pages workflow, build logs, rollback |
| [`docs/dev-image-optimization.md`](docs/dev-image-optimization.md) | How the WebP variant pipeline works |
| [`docs/dev-scripts.md`](docs/dev-scripts.md) | Utility scripts: link checks, font updates, redirects |
| [`docs/dev-tokens.md`](docs/dev-tokens.md) | Design-system tokens (colours, type, spacing) |
| [`docs/ai/SKILL.md`](docs/ai/SKILL.md) | Brief for AI collaborators — how to work on this project |

---

## Stack

- **[Astro 5](https://astro.build/)** — static site generator, TypeScript
- **[Sveltia CMS](https://sveltiacms.app/)** — browser-based Git CMS
- **[Cloudflare Workers/Pages](https://developers.cloudflare.com/pages/)** — hosting + edge
- **[Sharp](https://sharp.pixelplumbing.com/)** — build-time image optimization
- **Self-hosted fonts** — Newsreader, IBM Plex, Amiri, IBM Plex Sans Arabic

## License

Copyright © 2026 Ali Mussa Imran. All rights reserved. See `LICENSE`.
