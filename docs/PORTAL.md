# Captive-portal integration (deferred to Phase 3)

Once the site is content-complete, we can point the clinic's WiFi captive
portal at it — so that patients connecting to WiFi see the alimranmed.com
landing page **before** authenticating, and click a "Connect to Internet"
button on the site itself to complete login.

This document is the recipe. It's the same architecture we already shipped
for `kaleem.dev`; the code translated cleanly and is battle-tested.

## The flow

```
Phone joins WiFi
   ↓
Router shows CNA → routes to router-served login.html
   ↓
login.html JS immediately redirects to
   https://alimranmed.com/?portal=1#loginUrl=…&mac=…&target=…&error=…
   (pre-auth navigation, CNA stays open because alimranmed.com is walled-garden-allowed)
   ↓
Real site renders in the CNA — real DOM, real scroll
   ↓
Portal-mode script sees ?portal=1, reveals a fixed "Connect to Internet" bar
   ↓
User taps Connect → trial-login GET to RouterOS → auth succeeds → CNA closes
```

Everything scroll- or framing-related that plagues iframe portals goes away
because there is no framing.

## Two files to write, one to upload

### 1. `src/components/PortalBar.astro`

Fixed-bottom bar with error text + Connect button. Hidden by default; only
displays when the URL carries `?portal=1`.

```astro
---
import en from "../i18n/en.json";
import ar from "../i18n/ar.json";
const locale = (Astro.currentLocale ?? "en") as "en" | "ar";
const dict = (locale === "ar" ? ar : en) as Record<string, string>;
---

<div id="portal-bar" role="region" aria-label="WiFi Login">
  <div id="portal-error" hidden></div>
  <button id="portal-connect" type="button">Connect to Internet</button>
</div>

<script is:inline>
  (function () {
    var isPortal = new URLSearchParams(location.search).get("portal") === "1";
    if (!isPortal) return;
    document.documentElement.classList.add("is-portal");

    // Sensitive values live in the hash so they never hit server logs.
    var params = new URLSearchParams((location.hash || "").replace(/^#/, ""));
    var loginUrl = params.get("loginUrl") || "";
    var mac      = params.get("mac")      || "";
    var target   = params.get("target")   || "";
    var error    = params.get("error")    || "";

    var errEl = document.getElementById("portal-error");
    var btn   = document.getElementById("portal-connect");
    if (!btn) return;

    if (error && error.trim().length > 0) {
      errEl.textContent = error;
      errEl.hidden = false;
    }

    document.body.style.paddingBottom =
      "calc(env(safe-area-inset-bottom, 0px) + 96px)";

    btn.addEventListener("click", function () {
      if (!loginUrl) return;
      var url = loginUrl
        + (loginUrl.indexOf("?") >= 0 ? "&" : "?")
        + "dst=" + encodeURIComponent(target)
        + "&username=T-" + encodeURIComponent(mac);
      window.location.href = url;
    });
  })();
</script>

<style>
  #portal-bar { display: none; }
  :global(html.is-portal) #portal-bar {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;
    display: flex; flex-direction: column; align-items: center;
    gap: 0.5em;
    padding: 0.75em 1em calc(env(safe-area-inset-bottom, 0px) + 0.75em);
    background: #111;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.35);
  }
  #portal-error { color: #ff5252; font-weight: 700; font-size: 0.85rem; text-align: center; max-width: 90%; }
  #portal-connect {
    background: #00c853; color: #fff; border: none;
    padding: 0.9em 2.4em; font-size: 1rem; font-weight: 700;
    border-radius: 6px; cursor: pointer; min-width: 220px;
  }
  #portal-connect:hover, #portal-connect:focus { background: #00a844; }
</style>
```

Include it once in `src/layouts/BaseLayout.astro` right before `</body>`.

### 2. Router file `login.html`

Trivial redirect. Upload to MikroTik `flash/login.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="pragma" content="no-cache">
  <meta http-equiv="expires" content="-1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connecting…</title>
  <style>
    html, body { margin: 0; padding: 0; height: 100%; background: #f6f9fb;
      font-family: sans-serif; display: flex; align-items: center; justify-content: center;
      color: #0f6d8f; }
    .msg { text-align: center; padding: 1em; }
  </style>
</head>
<body>
  <div class="msg">
    <p>Loading Alimran Medical Center…</p>
    <noscript><a href="https://alimranmed.com/?portal=1">Continue</a></noscript>
  </div>
  <script>
    (function () {
      var hash = new URLSearchParams({
        loginUrl: '$(link-login-only)',
        mac:      '$(mac)',              // RAW, not $(mac-esc) — see gotcha below
        target:   '$(link-orig)',
        error:    '$(error)'
      });
      location.replace('https://alimranmed.com/?portal=1#' + hash.toString());
    })();
  </script>
</body>
</html>
```

### The `$(mac)` vs `$(mac-esc)` gotcha

**Use `$(mac)` (raw), NOT `$(mac-esc)`**. RouterOS's `-esc` variants are already
URL-escaped, and `URLSearchParams` escapes them a second time on serialize.
The value then survives one decode (URLSearchParams.get) but keeps a residual
encoding, which `encodeURIComponent` then re-doubles. RouterOS receives a
double-encoded username, doesn't recognise it as `T-<mac>` trial format, falls
through to CHAP, and returns *"did not send challenge response (try again,
enable JavaScript)"*.

Using raw `$(mac)` means each layer encodes exactly once and the final URL
matches the format RouterOS expects. Same fix applies to `$(link-orig)`.

## CSS opt-out (already prepared)

`src/styles/global.css` already scopes `overscroll-behavior-y: contain` to
`html:not(.is-embedded)`. When PortalBar adds `is-portal`, add it also to that
opt-out selector so the containment doesn't fight the bar:

```css
html:not(.is-embedded):not(.is-portal),
html:not(.is-embedded):not(.is-portal) body {
  overscroll-behavior-y: contain;
}
```

## Walled-garden checklist (do this before deploying)

`alimranmed.com` must be reachable pre-auth **and so must every asset it loads**:

- `alimranmed.com` (HTML)
- `alimranmed.com/_astro/*` (Astro bundles — CSS + JS)
- `alimranmed.com/images/*` (self-hosted images — must not point at `wp-content` on the old server)
- Any third-party font/analytics endpoints. Prefer to self-host or drop them.

Test with a fresh device: connect to WiFi, do NOT auth yet, browse to
`https://alimranmed.com/?portal=1#loginUrl=test`. Everything should load and
the Connect bar should appear.
