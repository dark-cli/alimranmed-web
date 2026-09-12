import { visit } from 'unist-util-visit';

export function remarkAutoAlt() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      // If alt text is empty, generate from filename
      if (!node.alt || node.alt.trim() === '') {
        const url = node.url;
        const filename = url.split('/').pop();

        // Extract meaningful part from filename (remove extensions, numbers, hyphens)
        const cleaned = filename
          .replace(/\.(jpg|jpeg|png|gif|svg|webp)$/i, '') // Remove extension
          .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
          .replace(/\d{4}-\d{2}-\d{2}/, '') // Remove dates
          .replace(/\d{10,}/, '') // Remove timestamps
          .replace(/\(.*?\)/g, '') // Remove parenthetical content
          .replace(/  +/g, ' ') // Collapse multiple spaces
          .trim();

        // Capitalize first letter
        const altText = cleaned.charAt(0).toUpperCase() + cleaned.slice(1) || 'Image';
        node.alt = altText;
      }
    });
  };
}
