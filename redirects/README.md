# Old WordPress sites → alimran.clinic

`alimranmed.com.htaccess` and `ar.alimranmed.com.htaccess` hold the 301 rules
for each old host. They cover every URL in both old sitemaps (tested against
Apache with the WordPress rewrite block in place): 634 go to the matching new
page, the rest (test pages, "Hello world", sample pages, menus) go to the
locale home. WP uploads go to `/images/legacy/` with the same paths.

## Move order

1. On each old host, paste its file's rules **above** `# BEGIN WordPress` in
   `.htaccess`. Spot-check a few old URLs in a browser.
2. Search Console → old property → Settings → Change of address →
   `alimran.clinic`. Google checks that the old home page 301s to the new one,
   so step 1 must be live first. Do it for both old properties.
3. Keep the old domains and redirects live for at least a year.

## Regenerating

`node scripts/generate-legacy-htaccess.mjs` rebuilds both files from the
`legacyUrl` frontmatter plus `legacy-extra.json` (reviewed old path → new
path for URLs whose slug changed). Re-run it after renaming or removing a
page that an old URL points to.
