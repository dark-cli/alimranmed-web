import { visit } from 'unist-util-visit';

/**
 * Remark plugin that localizes internal links based on the file's locale.
 * Converts relative paths like /services/ to /en/services/ or /ar/services/
 * based on whether the file is en.md or ar.md
 */
export function remarkLocalizeLinks() {
  return (tree, file) => {
    // Determine locale from file path: .../en.md or .../ar.md
    const locale = file.history?.[0]?.includes('/ar.md') ? 'ar' : 'en';

    visit(tree, ['link', 'definition'], (node) => {
      const url = node.url;

      // Only process relative URLs that start with /
      if (url && url.startsWith('/') && !url.includes('://')) {
        // Skip if already localized (contains /en/ or /ar/)
        if (!url.includes('/en/') && !url.includes('/ar/')) {
          // Skip external-looking paths and anchors
          if (!url.includes('#')) {
            node.url = `/${locale}${url}`;
          }
        }
      }
    });
  };
}
