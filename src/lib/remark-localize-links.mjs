import { visit } from 'unist-util-visit';

/**
 * Remark plugin that localizes internal links based on the file's locale.
 *
 * Routing structure:
 * - English: /en/ prefix (e.g., /en/services/)
 * - Arabic: /ar/ prefix (e.g., /ar/services/)
 * - Root /: auto-redirects to device language or /en/ fallback
 *
 * For .../en.md files: add /en prefix
 * For .../ar.md files: add /ar prefix
 *
 * Smart handling: strips any existing language prefix (/en/, /ar/) and
 * reprocesses to match the current file's locale. This fixes hardcoded
 * language links that should be locale-aware.
 */
export function remarkLocalizeLinks() {
  return (tree, file) => {
    // Determine locale from file path: .../en.md or .../ar.md
    const locale = file.history?.[0]?.includes('/ar.md') ? 'ar' : 'en';

    visit(tree, ['link', 'definition'], (node) => {
      let url = node.url;

      // Only process URLs that start with / (internal links)
      if (url && url.startsWith('/') && !url.includes('://')) {
        // Skip anchor-only links
        if (url.includes('#')) return;

        // Strip any existing language prefix (/en/ or /ar/)
        // This normalizes hardcoded language links
        const strippedUrl = url.replace(/^\/(?:en|ar)(?=\/|$)/, '') || '/';

        // Apply the correct locale prefix based on current file's locale
        if (locale === 'ar') {
          // Arabic files: add /ar prefix
          if (strippedUrl === '/') {
            node.url = '/ar/';
          } else if (!strippedUrl.startsWith('/ar/')) {
            node.url = `/ar${strippedUrl}`;
          } else {
            node.url = strippedUrl;
          }
        } else {
          // English files: add /en prefix
          if (strippedUrl === '/') {
            node.url = '/en/';
          } else if (!strippedUrl.startsWith('/en/')) {
            node.url = `/en${strippedUrl}`;
          } else {
            node.url = strippedUrl;
          }
        }
      }
    });
  };
}
