/**
 * Link checker — crawls all internal pages recursively, checks all external links.
 *
 * Internal links: followed recursively starting from BASE_URL.
 * External links: HEAD request only (no crawl), reports non-2xx.
 *
 * Usage:
 *   node scripts/check-links.mjs [base-url]
 *   node scripts/check-links.mjs http://localhost:4321
 */

const BASE_URL = process.argv[2] || "http://localhost:4321";
const CONCURRENCY = 8;
const TIMEOUT_MS = 10_000;

const visited = new Set();        // internal URLs already crawled
const externalChecked = new Set();// external URLs already checked

const broken = [];   // { url, foundOn, status, reason }
const warnings = []; // { url, foundOn, status, reason } — redirects, etc.

function isInternal(href) {
  try {
    const u = new URL(href, BASE_URL);
    return u.origin === new URL(BASE_URL).origin;
  } catch { return false; }
}

function normalise(href, base) {
  try {
    const u = new URL(href, base);
    u.hash = "";
    return u.href;
  } catch { return null; }
}

async function fetchWithTimeout(url, options = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Extract all href/src links from an HTML string. */
function extractLinks(html, pageUrl) {
  const links = new Set();
  const re = /(?:href|src)=["']([^"'#][^"']*)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw || raw.startsWith("data:") || raw.startsWith("javascript:")) continue;
    // Skip double-percent-encoded Arabic fragments from legacy content (false positives)
    if (raw.includes("%25%d") || raw.includes("%25%D")) continue;
    const abs = normalise(raw, pageUrl);
    if (abs) links.add(abs);
  }
  return links;
}

/** Queue of tasks with bounded concurrency. */
async function pool(tasks, concurrency) {
  const iter = tasks[Symbol.iterator]();
  const workers = Array.from({ length: concurrency }, async () => {
    for (let next = iter.next(); !next.done; next = iter.next()) {
      await next.value();
    }
  });
  await Promise.all(workers);
}

/** Crawl one internal page: fetch HTML, record broken links, return new links. */
async function crawlPage(url) {
  let res;
  try {
    res = await fetchWithTimeout(url);
  } catch (e) {
    broken.push({ url, foundOn: url, status: 0, reason: e.message });
    return [];
  }

  if (res.status >= 400) {
    broken.push({ url, foundOn: url, status: res.status, reason: res.statusText });
    return [];
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("text/html")) return [];

  const html = await res.text();
  const found = extractLinks(html, url);
  const newInternal = [];

  for (const link of found) {
    if (isInternal(link)) {
      if (!visited.has(link)) newInternal.push(link);
    } else {
      if (!externalChecked.has(link)) {
        externalChecked.add(link);
        checkExternal(link, url); // fire-and-forget, collected below
      }
    }
  }

  return newInternal;
}

const externalPromises = [];

function checkExternal(url, foundOn) {
  const p = (async () => {
    // Skip mailto: tel: etc.
    if (!/^https?:\/\//.test(url)) return;
    // Skip production domain — canonical/hreflang tags point there legitimately
    if (/^https?:\/\/alimran\.clinic\//.test(url)) return;
    try {
      const res = await fetchWithTimeout(url, {
        method: "HEAD",
        headers: { "User-Agent": "AlimranLinkChecker/1.0" },
        redirect: "follow",
      });
      if (res.status >= 400) {
        broken.push({ url, foundOn, status: res.status, reason: res.statusText });
      } else if (res.status >= 300) {
        warnings.push({ url, foundOn, status: res.status, reason: res.statusText });
      }
    } catch (e) {
      broken.push({ url, foundOn, status: 0, reason: e.message });
    }
  })();
  externalPromises.push(p);
}

/** BFS crawl with bounded concurrency. */
async function crawl() {
  const start = normalise(BASE_URL + "/en/", BASE_URL);
  let frontier = [start];
  visited.add(start);

  while (frontier.length > 0) {
    const batch = frontier.splice(0);
    const nextLinks = [];

    await pool(batch.map(url => async () => {
      const links = await crawlPage(url);
      for (const l of links) {
        if (!visited.has(l)) {
          visited.add(l);
          nextLinks.push(l);
        }
      }
    }), CONCURRENCY);

    frontier = nextLinks;
    process.stdout.write(`\r  crawled ${visited.size} pages, ${externalChecked.size} external links checked...`);
  }

  // Wait for all external checks to settle
  await Promise.all(externalPromises);
  process.stdout.write("\n");
}

console.log(`\nLink checker — ${BASE_URL}\n${"─".repeat(50)}`);
const t0 = Date.now();
await crawl();
const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

console.log(`\nDone in ${elapsed}s — ${visited.size} internal pages, ${externalChecked.size} external links\n`);

if (broken.length === 0 && warnings.length === 0) {
  console.log("✅  No broken links found.\n");
  process.exit(0);
}

if (broken.length > 0) {
  console.log(`❌  BROKEN (${broken.length})\n`);
  for (const b of broken) {
    const status = b.status ? `HTTP ${b.status}` : `ERR: ${b.reason}`;
    console.log(`  [${status}]  ${b.url}`);
    console.log(`           found on: ${b.foundOn}\n`);
  }
}

if (warnings.length > 0) {
  console.log(`⚠️   WARNINGS (${warnings.length})\n`);
  for (const w of warnings) {
    console.log(`  [HTTP ${w.status}]  ${w.url}`);
    console.log(`           found on: ${w.foundOn}\n`);
  }
}

process.exit(broken.length > 0 ? 1 : 0);
