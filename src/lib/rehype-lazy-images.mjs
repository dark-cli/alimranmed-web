/**
 * rehype plugin: lazy-load markdown images. The first image in a document is
 * left eager because migrated articles lead with an image, which is usually
 * the page's LCP element; lazy-loading it would delay LCP.
 */

import { visit } from "unist-util-visit";

export default function rehypeLazyImages() {
  return (tree) => {
    let first = true;
    visit(tree, "element", (node) => {
      if (node.tagName !== "img") return;
      node.properties ??= {};
      node.properties.decoding ??= "async";
      if (first) {
        first = false;
        return;
      }
      node.properties.loading ??= "lazy";
    });
  };
}
