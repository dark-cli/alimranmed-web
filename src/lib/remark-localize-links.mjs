import { visit } from 'unist-util-visit';

/**
 * Remark plugin that localizes internal links based on the file's locale.
 * Converts relative paths like /services/ to /en/services/ or /ar/services/
 * based on whether the file is en.md or ar.md.
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

        // Strip existing language prefix if present
        // This handles hardcoded /en/... or /ar/... links
        const strippedUrl = url.replace(/^\/(?:en|ar)(?=\/|$)/, '') || '/';

        // If the URL was already localized to a different locale, normalize it
        if (strippedUrl !== url) {
          // Reprocess the stripped URL with the current locale
          url = strippedUrl;
        }

        // Now apply the current locale prefix if needed
        if (!url.includes('/en/') && !url.includes('/ar/')) {
          if (locale === 'ar' && url !== '/ar') {
            node.url = `/ar${url}`;
          } else if (locale === 'en') {
            // English URLs don't get a /en prefix (default locale)
            node.url = url;
          } else {
            node.url = `/${locale}${url}`;
          }
        } else {
          // URL already has language prefix, just use the normalized version
          node.url = url;
        }
      }
    });
  };
}
