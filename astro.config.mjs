// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import rehypeYouTube from "./src/lib/rehype-youtube.mjs";
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
    rehypePlugins: [rehypeYouTube],
  },
});
