import { visit } from 'unist-util-visit';

/**
 * Remark plugin that localizes internal links based on the file's locale.
 *
 * Routing structure:
 * - English: /en/ prefix (e.g., /en/services/)
 * - Arabic: /ar/ prefix (e.g., /ar/services/)
 * - Turkish: /tr/ prefix (e.g., /tr/services/)
 * - Root /: auto-redirects to device language or /en/ fallback
 *
 * For .../en.md files: add /en prefix
 * For .../ar.md files: add /ar prefix
 * For .../tr.md files: add /tr prefix
 *
 * Smart handling: strips any existing language prefix (/en/, /ar/) and
 * reprocesses to match the current file's locale. This fixes hardcoded
 * language links that should be locale-aware.
 */
export function remarkLocalizeLinks() {
  return (tree, file) => {
    // Determine locale from file path: .../en.md, .../ar.md or .../tr.md
    const m = (file.history?.[0] ?? '').match(/\/(ar|tr)\.md$/);
    const locale = m ? m[1] : 'en';

    visit(tree, ['link', 'definition'], (node) => {
      let url = node.url;

      // Only process URLs that start with / (internal links)
      if (url && url.startsWith('/') && !url.includes('://')) {
        // Skip anchor-only links
        if (url.includes('#')) return;

        // Strip any existing language prefix (/en/, /ar/ or /tr/)
        // This normalizes hardcoded language links
        const strippedUrl = url.replace(/^\/(?:en|ar|tr)(?=\/|$)/, '') || '/';

        // Apply the current file's locale prefix
        node.url = strippedUrl === '/' ? `/${locale}/` : `/${locale}${strippedUrl}`;
      }
    });
  };
}
