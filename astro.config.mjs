// @ts-check
// Copyright (c) 2026 Ali Mussa Imran — https://kaleem.dev
// All rights reserved. See LICENSE in the project root.
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import rehypeYouTube from "./src/lib/rehype-youtube.mjs";
import rehypeLazyImages from "./src/lib/rehype-lazy-images.mjs";
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
  // The `serialize` hook stamps every sitemap entry with `lastmod: <build time>`.
  // Google uses lastmod to decide when to re-crawl — without it, changes ship
  // silently and re-indexing lags. Build time is the honest signal for a
  // deploy: everything on the new site is at least as fresh as this build.
  //
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
      serialize(item) {
        return { ...item, lastmod: new Date().toISOString() };
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
    rehypePlugins: [rehypeYouTube, rehypeLazyImages],
  },
});
