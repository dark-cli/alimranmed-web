# CMS — Sveltia admin

The site uses [Sveltia CMS](https://sveltiacms.app/) — a browser-based,
Git-based CMS. It reads and writes the same Markdown files under `src/content/`
that Astro builds from. No database, no runtime, no separate backend.

The admin lives at **`/admin/`**.

---

## Opening the admin

**In local development:**

```bash
npm run dev
```

Then visit [http://localhost:4321/admin/](http://localhost:4321/admin/) in **Chrome, Edge, or Brave**.

1. Click **"Work with Local Repository"**
2. Pick the `alimranmed-web` folder when prompted
3. Grant read/write permission

The admin now reads and writes files directly to your local disk. Changes
appear in `src/content/…` immediately — you can commit them from your usual
git tool.

**In production:**

The `/admin/` route is deployed at `https://alimran.clinic/admin/`, but with
the current setup **the "Work with Local Repository" button is the only usable
option**. GitHub-based authentication is not yet configured (see Limitations
below).

## Browser requirements

Sveltia uses the **File System Access API** to read/write local files. That API
is only implemented in **Chromium-based browsers**:

- ✅ Chrome, Edge, Brave, Arc, Opera
- ❌ Firefox
- ❌ Safari (both desktop and iOS)
- ❌ Mobile browsers in general

If you open the admin in an unsupported browser, you'll see a blank page or a
"Not supported" message.

---

## What you can do

### Create, edit, delete articles

The sidebar lists every collection: **Doctors, Treatments, Services, Blog, Cases, Pages**. Click one to see the tree of topics. Each topic folder contains an `en` and `ar` entry — click either to open the editor.

The editor is a form generated from the schema in `public/admin/config.yml`:

- Text fields for `title`, `description`, category, etc.
- Rich dropdowns for enums (source: `legacy-wp` / `human-reviewed` / …).
- A **Sections** list at the bottom for block widgets (see below).
- A live preview pane on the right that renders the article as it will appear on the site.

Save = click **Save** in the top-right. Sveltia writes the file to disk.

### Build blocks visually

The **Sections** field is the interesting part. Click **"Add Sections"** and pick a widget type from the dropdown:

- **Prose** — text with a heading
- **Highlights (At a glance)** — 2–4 key facts
- **Stats** — big numbers
- **Facts** — numbered list of facts
- **List** — with layout picker (rows / wrap / columns)
- **Pull Quote**
- **Panels** — comparison or options grid
- **Media** — image or YouTube
- **Pathway** — grouped links
- **Row** — image row
- **Cards** — related links

Each widget has its own inline form. Drag the ⋮⋮ handle to reorder blocks.

The rendered preview to the right updates as you type (including RTL flow and Arabic fonts on Arabic entries).

### Upload images

Any image field or Media block has an **"Upload"** button. Uploaded files land
in `public/images/` (or a scoped subfolder if the field configures one — e.g.,
doctor portraits go into `public/images/doctors/`).

**After uploading, run `npm run build` locally at least once before pushing.**
This generates the WebP variants (see [`image-optimization.md`](image-optimization.md)).
If you push without building, Cloudflare's build will still generate them — but
you won't have seen the result locally first.

### Preview in a real browser

The CMS preview pane approximates the site but isn't pixel-perfect (fonts load
from `/fonts/fonts.css` inside a sandboxed iframe; some interactions are stubbed).
For the real thing:

1. Save your edits in the CMS
2. Open the site in another tab: `http://localhost:4321/en/…` (or `/ar/…`)
3. Astro's dev server hot-reloads on file save

---

## Limitations

1. **No cloud auth.** The admin only supports "Work with Local Repository" today. To add GitHub or GitLab auth so non-technical people can edit from anywhere, update `public/admin/config.yml`'s `backend:` section from `github` (placeholder) to a real repo + OAuth app configured via [Sveltia's docs](https://sveltiacms.app/en/docs/authentication).

2. **File System Access API only in Chromium.** If your author uses Firefox or Safari, they can't use the admin at all until you enable cloud auth (see above).

3. **No draft / preview branch workflow.** Every save writes to disk. If you're using local mode, that means writing to your working copy — commit when you're happy. There's no "save as draft, publish later" flow.

4. **No revision history in the CMS UI.** Git is the revision history — use `git log src/content/treatments/als/en.md` to see changes.

5. **Media picker shows every image under `public/images/`.** No search, no folder-nav shortcuts. If uploading a lot, expect scrolling. Variants under `public/optimized/` are correctly hidden.

6. **Widgets are defined in two places.** The Astro-side (`src/content.config.ts`) and the CMS-side (`public/admin/config.yml`) must stay in sync. If you add a new block type, update both, plus its `src/components/blocks/*.astro` component. See [`ai/SKILL.md`](ai/SKILL.md) for the checklist.

7. **The live preview uses its own render (`public/admin/preview.js`).** If a block looks perfect on the site but weird in the CMS preview, the preview template needs updating (`public/admin/preview.js` is a standalone JS rendition of the same widgets). File it as an issue — it's not a data problem.

---

## Editing the CMS config itself

`public/admin/config.yml` defines every field, widget, and collection the admin
shows. If you want to:

- Add a field to a collection → edit the collection's `fields:` list AND add the same field to `src/content.config.ts` (Zod schema).
- Add a new block type → add a new entry under `types:` in the `_sections_field` anchor AND add a Zod object for it in `content.config.ts` AND add a dispatch case in `src/components/blocks/Sections.astro` AND write the component under `src/components/blocks/`.
- Change how a block previews → edit `public/admin/preview.js`.

The schema is the single-source-of-truth question mark. See
[`ai/SKILL.md#adding-a-new-block-type`](ai/SKILL.md#adding-a-new-block-type)
for the exact steps.
