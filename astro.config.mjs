// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import rehypeYouTube from "./src/lib/rehype-youtube.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://alimranmed.com/",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ar"],
    routing: {
      prefixDefaultLocale: false,  // EN stays at /, AR at /ar/
    },
  },
  integrations: [sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  markdown: {
    rehypePlugins: [rehypeYouTube],
  },
});
