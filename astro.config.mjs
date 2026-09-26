// @ts-check
// Copyright (c) 2026 Ali Mussa Imran — https://kaleem.dev
// All rights reserved. See LICENSE in the project root.
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import rehypeYouTube from "./src/lib/rehype-youtube.mjs";
import rehypeLazyImages from "./src/lib/rehype-lazy-images.mjs";
import rehypeResponsiveImages from "./src/lib/rehype-responsive-images.mjs";
import { remarkLocalizeLinks } from "./src/lib/remark-localize-links.mjs";
import { remarkAutoAlt } from "./src/lib/remark-auto-alt.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://alimran.clinic/",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ar"],
    routing: {
      prefixDefaultLocale: false,  // Manual routing: EN at /en/, AR at /ar/
    },
  },
  // Trailing slash is enforced so /en → /en/ (301, via _redirects) matches the
  // slug used everywhere else in the codebase.
  trailingSlash: "always",
  integrations: [
    sitemap({
      // `/` is a 301 to /en/ at the edge; redirects don't belong in a sitemap.
      // /admin/ (CMS) and /{locale}/dev-blocks/ (widget preview) are internal.
      filter: (page) => {
        const path = new URL(page).pathname;
        return path !== "/" && !path.startsWith("/admin/") && !/^\/(en|ar)\/dev-blocks\//.test(path);
      },
    }),
  ],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  markdown: {
    remarkPlugins: [remarkAutoAlt, remarkLocalizeLinks],
    // Order matters: rehypeResponsiveImages upgrades <img src> to WebP
    // srcset first; rehypeLazyImages then flips loading=eager on the LCP.
    // rehypeYouTube runs last since it replaces whole <p>s and doesn't
    // interact with images.
    rehypePlugins: [rehypeResponsiveImages, rehypeLazyImages, rehypeYouTube],
  },
});
