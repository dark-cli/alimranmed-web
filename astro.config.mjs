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
  integrations: [sitemap()],
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
