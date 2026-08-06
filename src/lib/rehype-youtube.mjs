/**
 * rehype plugin: replace <a href="https://youtube.com/watch?v=…">…</a> with an
 * embedded YouTube iframe wrapped in a responsive container.
 *
 * Matches whole-paragraph occurrences (the migrator emits each YouTube link on
 * its own line, so it becomes its own <p><a>…</a></p>). We swap the wrapping
 * paragraph for a <div class="yt-embed"> so it can be styled as a video card.
 */

import { visit } from "unist-util-visit";

const YT_RE = /^(?:https?:)?\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,20})/;

function extractId(href) {
  if (!href) return null;
  const m = String(href).match(YT_RE);
  return m ? m[1] : null;
}

export default function rehypeYouTube() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || node.tagName !== "p") return;

      // Look for a lone <a> child (allowing whitespace-only text siblings).
      const meaningful = node.children.filter(
        (c) => !(c.type === "text" && /^\s*$/.test(c.value)),
      );
      if (meaningful.length !== 1 || meaningful[0].type !== "element" || meaningful[0].tagName !== "a") return;

      const id = extractId(meaningful[0].properties?.href);
      if (!id) return;

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["yt-embed"] },
        children: [
          {
            type: "element",
            tagName: "iframe",
            properties: {
              src: `https://www.youtube-nocookie.com/embed/${id}`,
              title: "YouTube video",
              loading: "lazy",
              allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
              referrerpolicy: "strict-origin-when-cross-origin",
              allowfullscreen: true,
            },
            children: [],
          },
        ],
      };
    });
  };
}
