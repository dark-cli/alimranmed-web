# Design tokens

The Alimran Clinic site uses a **custom design system**, not a third-party
component library. Everything visible on the site — colours, typography,
spacing, borders — traces back to a single set of CSS custom properties
defined in [`src/styles/global.css`](src/styles/global.css) and referenced
by every block component under `src/components/blocks/` (and the page-chrome
components under `src/components/`, `src/layouts/`).

This document is the human-readable reference for those tokens. The source of
truth is `global.css`; when it changes, update this doc too.

Related:
- [`design/HANDOFF.md`](design/HANDOFF.md) — the original designer's spec (if kept in-repo).
- [`/dev-blocks/`](src/pages/dev-blocks.astro) — live preview of every block widget.

---

## The rules the design is built on

Written at the top of `src/styles/global.css`. These are non-negotiable —
new components should not violate them.

1. **Two page backgrounds only.** `--white` (`#ffffff`) for page background; `--surface` (`#f4f7f8`) for tinted panels. Plus `--footer-bg` (`#101c22`) for the footer ink strip.
2. **No box-shadows anywhere.** Depth is expressed with 1px hairlines over surface tint, not with drop shadows.
3. **Radius: 2px on buttons only.** Everything else — cards, panels, images, tiles — is square-cornered.
4. **Font Awesome is not used** — icons are inline SVG.
5. Newsreader (serif) for display type; IBM Plex Sans for body text; IBM Plex Mono for eyebrows/labels/meta. Amiri + IBM Plex Sans Arabic swap in when `html[dir="rtl"]`.

---

## Colour

Values are the concrete hex from `global.css`. Dark-mode overrides live in the
same file under `html[data-theme="dark"]` — the token names stay the same;
only the values flip.

### Ink & body

| Token             | Light    | Dark     | Used for                                     |
| ----------------- | -------- | -------- | -------------------------------------------- |
| `--ink`           | `#101c22`| `#eaf0f4`| Primary headings and emphatic text           |
| `--body`          | `#3c4a52`| `#b8c3cc`| Body paragraph text                          |
| `--muted`         | `#77858c`| `#7f929a`| Metadata, captions, source lines, footers    |
| `--accent`        | `#0b5e78`| `#4bb3d4`| Links, chip borders, focus rings, numerals   |
| `--accent-hover`  | `#07445a`| `#6cc7e4`| Link hover                                   |
| `--selection`     | `#cfe4ea`| `#1e4a5c`| Text selection background                    |

### Surfaces & hairlines

| Token           | Light    | Dark     | Used for                                          |
| --------------- | -------- | -------- | ------------------------------------------------- |
| `--white`       | `#ffffff`| `#101c22`| Page background (in dark mode this becomes ink)   |
| `--surface`     | `#f4f7f8`| `#182631`| Tinted panels, highlight boxes, stats tile cells  |
| `--line`        | `#dde4e7`| `#22333c`| Standard hairlines and separators                 |
| `--line-soft`   | `#eef2f4`| `#1a2a33`| Subtler separators inside dense lists             |
| `--line-strong` | `#c7d4d9`| `#33454e`| Chip borders and outlines that need more presence |

### Footer

| Token             | Light    | Dark     | Used for                                    |
| ----------------- | -------- | -------- | ------------------------------------------- |
| `--footer-bg`     | `#101c22`| `#0b1418`| Footer ink strip                            |
| `--footer-text`   | `#d7e2e6`| `#d7e2e6`| Footer body text                            |
| `--footer-muted`  | `#a8b8bf`| `#a8b8bf`| Footer secondary text                       |
| `--footer-label`  | `#7f929a`| `#7f929a`| Footer column labels                        |
| `--footer-rule`   | `#22333c`| `#1a2a33`| Rules inside the footer                     |

---

## Typography

### Type stacks (Latin — LTR)

| Token             | Stack                                                                                       | Used for                                             |
| ----------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `--font-display`  | `"Newsreader", "Times New Roman", serif`                                                    | H1–H6, big stat figures, panel titles, quote text    |
| `--font-body`     | `"IBM Plex Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`     | Body paragraphs, list items, most descriptive text   |
| `--font-mono`     | `"IBM Plex Mono", ui-monospace, "SFMono-Regular", "Menlo", monospace`                       | Eyebrows, mono labels, period columns, meta lines    |

### Type stacks (Arabic — RTL, when `html[dir="rtl"]`)

The token names stay the same; the values swap. Weight, letter-spacing, and
line-height also change per-component via `html[dir="rtl"]` overrides so
Arabic reads at native rhythm rather than forced through Latin metrics.

| Token             | RTL value                                                          |
| ----------------- | ------------------------------------------------------------------ |
| `--font-display`  | `"Amiri", "Times New Roman", serif`                                |
| `--font-body`     | `"IBM Plex Sans Arabic", system-ui, "Segoe UI", sans-serif`        |
| `--font-mono`     | `"IBM Plex Sans Arabic", system-ui, sans-serif`                    |

### Heading sizes

Set globally on `h1`–`h4`. Weight 400 (regular), letter-spacing `-0.02em`,
line-height 1.08. RTL bumps to weight 700 with normal letter-spacing and
line-height 1.22 (Amiri needs the extra height).

| Element | Size (light + dark)               |
| ------- | --------------------------------- |
| `h1`    | `clamp(30px, 5vw, 52px)`          |
| `h2`    | `clamp(24px, 3.4vw, 34px)`        |
| `h3`    | `clamp(20px, 2.4vw, 26px)`        |
| `h4`    | `clamp(18px, 2vw, 21px)`          |

### Base body

`p` — 17px, line-height 1.65 (1.9 in RTL). `body` inherits IBM Plex Sans at 17px.

---

## Layout

| Token                | Value                              | Used for                                                       |
| -------------------- | ---------------------------------- | -------------------------------------------------------------- |
| `--page-max`         | `1180px`                           | The main content width cap. Every full-bleed section aligns to this container. |
| `--gutter`           | `24px`                             | Left/right page padding at all sizes                           |
| `--header-h`         | `72px`                             | Fixed header height (used by sticky offsets)                    |
| `--section-y`        | `clamp(48px, 6vw, 88px)`           | Vertical padding for a standard section                        |
| `--section-y-last`   | `clamp(56px, 7vw, 96px)`           | Extra bottom padding on the last section of a page             |
| `--hero-y`           | `clamp(44px, 5.5vw, 72px)`         | Vertical padding for hero bands                                |
| `--card-pad`         | `clamp(24px, 3vw, 32px)`           | Padding inside cards / hairline cells                          |
| `--col-gap`          | `clamp(32px, 4vw, 64px)`           | Gap between columns in multi-column layouts                    |

---

## Legacy aliases

The bottom of `global.css` defines aliases that point old variable names at
the current tokens (`--brand → --accent`, `--radius → 2px`, `--shadow-sm → none`,
etc.). These exist so pages we haven't rewritten in the new design language
still render correctly. New components should reference the primary tokens
listed above, never the legacy names.

When a legacy page gets rewritten in the new visual language, delete its
reference to the alias — the alias itself is safe to keep meanwhile.

---

## Utility helpers in `global.css`

Not tokens themselves, but reusable CSS patterns you can extend or match:

- **`.container`** — the standard content wrapper. Applies `--page-max` + `--gutter`.
- **`.grid-hairline`** — auto-fit grid where cells are separated by 1px hairlines (via `gap: 1px` and `background: var(--line)`). The visual pattern the block widgets use.
- **`.section-head`** — numbered section header (56px column for the mono number + a heading). Used for on-page TOC-linked sections.
- **`.register`** — sticky-label register (label column + content column). Used for CV-like structured content.
- **`html[dir="rtl"]`** — see [`src/styles/rtl-overrides.css`](src/styles/rtl-overrides.css) for the global overrides. Component-scoped RTL rules live inline in each `.astro` file (Astro strips global selectors from scoped styles otherwise).

---

## When you're building a new component

1. **Reference tokens, never hex values.** Use `var(--ink)` instead of `#101c22`.
2. **Follow the rules at the top.** No shadows. No radii except 2px on buttons. Square corners for cards and panels.
3. **Add RTL overrides inline.** Every component that uses `var(--font-mono)` or non-default weights needs a `:global(html[dir="rtl"]) .selector` rule that swaps to `var(--font-body)` at slightly larger size and drops uppercase transforms — Arabic doesn't tolerate them.
4. **Preview it in `/dev-blocks/`.** Every widget in `src/components/blocks/` has a preview there; add yours too before shipping.
