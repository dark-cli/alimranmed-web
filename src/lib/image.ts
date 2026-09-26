/**
 * Responsive-image helper.
 *
 * Given the source path of an image that lives under /images/ (typically
 * the value stored in a content-frontmatter `photo`/`image` field), returns
 * the paths + srcset + intrinsic dimensions needed to render it responsively.
 *
 * The variants themselves are created at build time by
 * `scripts/optimize-images.mjs`, which also writes `public/optimized/manifest.json`
 * containing the intrinsic width/height of every optimized source. Reading
 * the manifest keeps this helper synchronous — nothing hits disk at SSR
 * time apart from the initial JSON import.
 *
 * If a source isn't in the manifest (e.g. it lives outside TARGET_DIRS in
 * the optimizer, or the build step didn't run), the helper falls back to
 * the raw source path so the page still renders — just without a srcset.
 */

import manifestData from "../../public/optimized/manifest.json" with { type: "json" };

interface ManifestEntry {
  mtime: number;
  width: number;
  height: number;
  variants: string[];
}
const manifest = manifestData as Record<string, ManifestEntry>;

// The optimizer emits these widths — keep them in sync.
const WIDTHS = [480, 800, 1200] as const;

export interface ImageVariants {
  /** Best `src` fallback (mid-tier variant). */
  src: string;
  /** Responsive srcset (`… 480w, … 800w, … 1200w`) or "" if no manifest match. */
  srcset: string;
  /** Original source path — used as the plain <img src> for browsers without WebP support. */
  fallback: string;
  /** Full-resolution WebP for the progressive HD upgrade (data-hires). */
  full?: string;
  /** Intrinsic width in pixels, if known. */
  width?: number;
  /** Intrinsic height in pixels, if known. */
  height?: number;
}

/**
 * Look up variants for a source image path (e.g. `/images/doctors/name.jpg`).
 *
 * The path should match the URL the source is served at (starts with `/`).
 * When the path isn't optimized, returns a minimal variant object pointing
 * at the source path so nothing breaks — the img still renders.
 */
export function imageVariants(sourcePath: string | undefined | null): ImageVariants | null {
  if (!sourcePath) return null;
  const entry = manifest[sourcePath];
  if (!entry) {
    return { src: sourcePath, srcset: "", fallback: sourcePath };
  }
  const withSuffix = (suffix: string) =>
    entry.variants.find((v) => v.endsWith(`-${suffix}.webp`));

  const srcsetParts: string[] = [];
  for (const w of WIDTHS) {
    const v = withSuffix(String(w));
    if (v) srcsetParts.push(`${v} ${w}w`);
  }
  const src = withSuffix("800") ?? withSuffix("1200") ?? withSuffix("480") ?? sourcePath;
  const full = withSuffix("full");

  return {
    src,
    srcset: srcsetParts.join(", "),
    fallback: sourcePath,
    full,
    width:  entry.width  || undefined,
    height: entry.height || undefined,
  };
}
