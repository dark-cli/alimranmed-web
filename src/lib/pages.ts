/**
 * Helpers for sections-based pages (home, about, future static pages).
 */

import { imageVariants } from "./image";

/**
 * Shallow-walk the sections tree looking for the first image inside a
 * `media` block. Used by routes that want to preload the above-the-fold
 * hero image via <link rel="preload">. Returns the raw `src` path or
 * undefined if there is no image.
 */
export function findFirstImageSrc(nodes: unknown): string | undefined {
  if (!Array.isArray(nodes)) return undefined;
  for (const n of nodes) {
    if (!n || typeof n !== "object") continue;
    const s = n as { type?: string; items?: unknown };
    if (s.type === "media" && Array.isArray(s.items)) {
      const img = s.items.find(
        (it: unknown) =>
          !!it &&
          typeof it === "object" &&
          (it as { kind?: string; src?: string }).kind === "image" &&
          typeof (it as { src?: string }).src === "string",
      ) as { src?: string } | undefined;
      if (img?.src) return img.src;
    }
    if (Array.isArray(s.items)) {
      const found = findFirstImageSrc(s.items);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Build the heroPreload prop for PlainTemplate from a sections array.
 * Returns undefined when the sections tree has no image to preload.
 */
export function heroPreloadFromSections(sections: unknown) {
  const src = findFirstImageSrc(sections);
  if (!src) return undefined;
  const img = imageVariants(src);
  if (!img?.srcset) return undefined;
  return {
    srcset: img.srcset,
    sizes: "(min-width: 980px) 50vw, 100vw",
    type: "image/webp",
  };
}
