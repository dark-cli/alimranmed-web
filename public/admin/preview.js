/*
 * Sveltia CMS preview templates — all collections.
 *
 * Registers live previews for:
 *   doctors    — PlainTemplate (sections only; hero is a block)
 *   treatments — ArticleLayout + unified section blocks
 *   services   — same as treatments
 *   blog       — same as treatments
 *   home / about / contact — PlainTemplate via files-collection keys
 *
 * Block renderers mirror the Astro components in src/components/blocks/.
 * CSS lives in preview.css (same file as before, with additions for the
 * unified block classes).
 *
 * Sync targets:
 *   src/components/blocks/*.astro — block markup + class names
 *   src/content.config.ts         — section type names
 */
(function () {
  "use strict";

  /* ── Theme toggle ────────────────────────────────────────────────────── */

  // Moon icon — shown in light mode
  var moonSvg = h("svg", { className: "pt-icon pt-moon", viewBox: "0 0 24 24", width: "18", height: "18",
    fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
    h("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
  );

  // Sun icon — shown in dark mode
  var sunSvg = h("svg", { className: "pt-icon pt-sun", viewBox: "0 0 24 24", width: "18", height: "18",
    fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
    h("circle", { cx: "12", cy: "12", r: "5" }),
    h("line", { x1: "12", y1: "1",  x2: "12", y2: "3" }),
    h("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
    h("line", { x1: "4.22",  y1: "4.22",  x2: "5.64",  y2: "5.64"  }),
    h("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
    h("line", { x1: "1",  y1: "12", x2: "3",  y2: "12" }),
    h("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
    h("line", { x1: "4.22",  y1: "19.78", x2: "5.64",  y2: "18.36" }),
    h("line", { x1: "18.36", y1: "5.64",  x2: "19.78", y2: "4.22"  })
  );

  function themeBtn(onToggle) {
    return h("button", {
      className: "preview-theme-btn",
      onClick: onToggle,
      title: "Toggle dark mode",
      "aria-label": "Toggle dark mode",
      type: "button",
    }, moonSvg, sunSvg);
  }

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function toArray(v) {
    if (!v) return [];
    if (typeof v.toJS === "function") return v.toJS();
    return Array.isArray(v) ? v : [];
  }

  function rewriteLinks(text) {
    if (!text) return "";
    return String(text).replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
      return '<a href="' + href + '">' + label + "</a>";
    });
  }

  var AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
  function toAr(n) {
    return String(n).replace(/[0-9]/g, function (c) { return AR_DIGITS[+c]; });
  }
  function padNum(n, isAr) {
    if (isAr) { var s = toAr(n); return s.length < 2 ? AR_DIGITS[0] + s : s; }
    return n < 10 ? "0" + n : String(n);
  }

  /* ── Block renderers ─────────────────────────────────────────────────── */

  function renderProse(s, key) {
    var paras = (s.body || "").split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
    var hasHeader = s.number || s.eyebrow || s.heading;
    var HeadingTag = s.headingLevel === "h3" ? "h3" : "h2";
    return h("section", { key: key, className: "prose-block", "data-variant": s.variant || "default" },
      hasHeader ? h("header", { className: "prose-head" + (s.number ? " prose-head--numbered" : "") },
        s.eyebrow ? h("p", { className: "prose-eyebrow" }, s.eyebrow) : null,
        s.number  ? h("span", { className: "prose-number" }, s.number) : null,
        s.heading ? h(HeadingTag, { className: "prose-heading" }, s.heading) : null
      ) : null,
      paras.map(function (p, i) {
        return h("p", { key: i, className: "p", dangerouslySetInnerHTML: { __html: rewriteLinks(p) } });
      })
    );
  }

  function renderHighlights(s, key) {
    var items = s.items || [];
    return h("section", { key: key, className: "highlights" },
      h("p", { className: "highlights-label" }, s.heading || "At a glance"),
      h("div", { className: "highlights-grid" },
        items.map(function (it, i) {
          return h("div", { key: i },
            h("p", { className: "hl-item-label" }, it.label || ""),
            h("p", { className: "hl-item-value" }, it.value || "")
          );
        })
      )
    );
  }

  function renderStats(s, key) {
    var items = s.items || [];
    return h("section", { key: key, className: "stats-block", "data-variant": s.variant || "default" },
      s.heading ? h("h2", { className: "stats-heading" }, s.heading) : null,
      s.intro   ? h("p",  { className: "stats-intro"   }, s.intro)   : null,
      h("div", { className: "stats-grid" },
        items.map(function (it, i) {
          return h("div", { key: i, className: "stats-cell" },
            h("p", { className: "stats-fig" }, it.value || ""),
            h("p", { className: "stats-lbl" }, it.label || "")
          );
        })
      )
    );
  }

  function renderFacts(s, key, isAr) {
    var items = s.items || [];
    return h("section", { key: key, className: "facts-block" },
      s.heading ? h("p", { className: "facts-title" }, s.heading) : null,
      h("div", { className: "facts-list" },
        items.map(function (f, i) {
          return h("div", { key: i, className: "fact-row" },
            h("span", { className: "fact-num" }, padNum(i + 1, isAr)),
            h("span", { className: "fact-text" }, f)
          );
        })
      )
    );
  }

  function renderListRows(s, key, isLast) {
    var items = s.items || [];
    var cls = "reg-section" + (isLast ? " reg-section-last" : "");
    return h("section", { key: key, className: cls },
      h("div", { className: "reg-wrap" },
        h("h2", { className: "reg-label" }, s.heading || ""),
        h("div", { className: "reg-body" },
          items.map(function (it, i) {
            return h("div", { key: i, className: "reg-row" },
              h("span", { className: "reg-period" }, it.label || ""),
              h("div", { className: "reg-text" },
                h("span", null, it.body || ""),
                it.subtitle ? h("span", { className: "reg-subtitle" }, it.subtitle) : null
              )
            );
          })
        )
      )
    );
  }

  function renderListWrap(s, key, isLast) {
    var items = s.items || [];
    var cls = "reg-section" + (isLast ? " reg-section-last" : "");
    return h("section", { key: key, className: cls },
      h("div", { className: "reg-wrap" },
        h("h2", { className: "reg-label" }, s.heading || ""),
        h("ul", { className: "reg-body reg-members" },
          items.map(function (it, i) {
            return h("li", { key: i },
              it.body || "",
              h("span", { className: "member-year" }, it.label || "")
            );
          })
        )
      )
    );
  }

  function renderListColumns(s, key, isLast) {
    var items = s.items || [];
    var cls = "reg-section" + (isLast ? " reg-section-last" : "");
    return h("section", { key: key, className: cls },
      h("div", { className: "reg-wrap" },
        h("h2", { className: "reg-label" }, s.heading || ""),
        h("div", { className: "reg-body reg-columns" },
          items.map(function (it, i) {
            return h("div", { key: i, className: "col-row" },
              h("span", { className: "reg-period" }, it.label || ""),
              h("div", { className: "reg-text" },
                h("span", null, it.body || ""),
                it.subtitle ? h("span", { className: "reg-subtitle" }, it.subtitle) : null
              )
            );
          })
        )
      )
    );
  }

  function renderList(s, key, isLast) {
    if (s.variant === "wrap")    return renderListWrap(s, key, isLast);
    if (s.variant === "columns") return renderListColumns(s, key, isLast);
    return renderListRows(s, key, isLast);
  }

  function renderQuote(s, key) {
    return h("blockquote", { key: key, className: "q" },
      h("p", { className: "q-text" }, s.text || ""),
      s.attribution ? h("footer", { className: "q-attr" }, s.attribution) : null
    );
  }

  function renderPanels(s, key) {
    var panels = s.panels || [];
    var minCol = panels.length <= 2 ? "255px" : "230px";
    return h("section", { key: key, className: "panels" },
      s.heading ? h("h2", { className: "panels-heading" }, s.heading) : null,
      s.intro   ? h("p",  { className: "panels-intro"   }, s.intro)   : null,
      h("div", { className: "panels-grid", style: { "--min-col": minCol } },
        panels.map(function (p, i) {
          var items = p.items || [];
          return h("div", { key: i, className: "panel" },
            p.eyebrow ? h("p", { className: "panel-eyebrow" }, p.eyebrow) : null,
            h("h3", { className: "panel-title" }, p.title || ""),
            p.subtitle ? h("p", { className: "panel-sub" }, p.subtitle) : null,
            items.length > 0 ? h("ul", { className: "panel-list" },
              items.map(function (it, j) {
                return h("li", { key: j, dangerouslySetInnerHTML: { __html: rewriteLinks(it) } });
              })
            ) : null
          );
        })
      ),
      s.note ? h("p", { className: "panels-note" }, s.note) : null
    );
  }

  function youtubeId(input) {
    var t = (input || "").trim();
    // Bare 11-char ID, possibly followed by ?si= or other tracking params
    var bare = t.match(/^([a-zA-Z0-9_-]{11})(?:[?#].*)?$/);
    if (bare) return bare[1];
    var m = t.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
            t.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
            t.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/) ||
            t.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : t;
  }

  function renderMediaItem(it, i, getAsset) {
    var src = it.src || "";
    if (it.kind === "image" && src && getAsset && !/^https?:\/\//.test(src)) {
      src = getAsset(src).toString();
    }
    var aspect = it.aspect || (it.kind === "image" ? null : "16/9");
    var frameStyle = aspect ? { aspectRatio: aspect } : {};
    var mediaEl;
    if (it.kind === "image") {
      mediaEl = h("img", { src: src, alt: it.alt || "", style: { width: "100%", display: "block" } });
    } else {
      // YouTube: CMS previews run in sandboxed iframes where YouTube blocks
      // iframe-within-iframe embeds (Error 153). Show the thumbnail + play
      // button instead — clicking opens the video on YouTube.
      var ytId = youtubeId(src);
      var thumb = "https://img.youtube.com/vi/" + ytId + "/hqdefault.jpg";
      var watchUrl = "https://www.youtube.com/watch?v=" + ytId;
      mediaEl = h("a", { href: watchUrl, target: "_blank", rel: "noopener",
                         style: { display: "block", position: "relative", lineHeight: 0, height: "100%" } },
        h("img", { src: thumb, alt: it.caption || "YouTube video",
                   style: { width: "100%", height: "100%", display: "block", objectFit: "cover" } }),
        h("div", { style: {
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.18)",
        }},
          h("svg", { viewBox: "0 0 68 48", width: "68", height: "48", "aria-hidden": "true" },
            h("rect", { x: 0, y: 0, width: 68, height: 48, rx: 10, fill: "#f00" }),
            h("polygon", { points: "27,14 27,34 47,24", fill: "#fff" })
          )
        )
      );
    }
    return h("figure", { key: i, className: "media" },
      h("div", { className: "media-frame", style: frameStyle }, mediaEl),
      it.caption ? h("figcaption", { className: "media-caption" },
        h("span", { className: "media-caption-label" }, "Figure"),
        h("span", { className: "media-caption-text" }, it.caption)
      ) : null
    );
  }

  function renderMedia(s, key, getAsset) {
    var items = toArray(s.items);
    var multi = items.length > 1;
    var gridStyle = multi
      ? { display: "grid", gridTemplateColumns: "repeat(" + items.length + ", 1fr)", gap: "1px" }
      : {};
    return h("section", { key: key, className: multi ? "media-block media-block--multi" : "media-block" },
      s.heading ? h("h2", { className: "media-heading" }, s.heading) : null,
      h("div", { className: "media-grid", style: gridStyle },
        items.map(function (it, i) { return renderMediaItem(it, i, getAsset); })
      )
    );
  }

  function renderPathway(s, key) {
    var groups = s.groups || [];
    return h("section", { key: key, className: "pw-block" },
      s.heading ? h("h2", { className: "pw-heading" }, s.heading) : null,
      s.intro   ? h("p",  { className: "pw-intro"   }, s.intro)   : null,
      h("div", { className: "pw-grid" },
        groups.map(function (g, i) {
          var items = g.items || [];
          return h("div", { key: i, className: "pw-group" },
            h("div", { className: "pw-head" },
              g.eyebrow ? h("span", { className: "pw-eyebrow" }, g.eyebrow) : null,
              h("h3", { className: "pw-title" }, g.title || "")
            ),
            h("div", { className: "pw-chips" },
              items.map(function (c, j) {
                return h("a", { key: j, className: "pw-chip", href: c.href || "#" }, c.name || "");
              })
            )
          );
        })
      )
    );
  }

  // image-row — specialised image gallery (was `row`).
  function renderImageRow(s, key, getAsset) {
    var items = s.items || [];
    var cols = s.columns || "auto";
    var gridCols = cols === "auto"
      ? "repeat(auto-fit, minmax(min(220px, 100%), 1fr))"
      : "repeat(" + cols + ", minmax(0, 1fr))";
    return h("section", { key: key, className: "row-block" },
      s.heading ? h("p", { className: "row-heading" }, s.heading) : null,
      h("div", { className: "row-grid", "data-cols": cols, style: { gridTemplateColumns: gridCols } },
        items.map(function (it, i) {
          var src = it.src || "";
          if (src && getAsset) src = getAsset(src).toString();
          var frameStyle = { aspectRatio: it.aspect || "4/3" };
          var figure = h("figure", { key: i, className: "row-cell" },
            h("div", { className: "row-frame", style: frameStyle },
              src ? h("img", { src: src, alt: it.alt || "" }) : null
            ),
            it.caption ? h("figcaption", { className: "row-caption" }, it.caption) : null
          );
          return it.href ? h("a", { className: "row-link", href: it.href }, figure) : figure;
        })
      )
    );
  }

  // Generic row — side-by-side layout holding any mix of child blocks.
  // Children are dispatched recursively through renderSection.
  function renderGenericRow(s, key, isAr, getAsset) {
    var items = toArray(s.items);
    var cols = s.columns || "auto";
    var gap = s.gap || "normal";
    var gridCols = cols === "auto"
      ? "repeat(auto-fit, minmax(min(260px, 100%), 1fr))"
      : "repeat(" + cols + ", minmax(0, 1fr))";
    var gapValue = gap === "tight" ? "12px" : gap === "wide" ? "clamp(40px, 5vw, 72px)" : "clamp(24px, 3vw, 40px)";
    return h("section", { key: key, className: "row-block", "data-cols": cols, "data-gap": gap, "data-align": s.align || "stretch" },
      s.heading ? h("p", { className: "row-heading" }, s.heading) : null,
      h("div", { className: "row-grid", style: { gridTemplateColumns: gridCols, gap: gapValue, alignItems: s.align || "stretch" } },
        items.map(function (child, i) {
          return h("div", { key: i, className: "row-cell" }, renderSection(child, i, false, isAr, getAsset));
        })
      )
    );
  }

  function renderColumn(s, key, isAr, getAsset) {
    var items = toArray(s.items);
    var gap = s.gap || "normal";
    var align = s.align || "stretch";
    var gapValue = gap === "tight" ? "10px" : gap === "wide" ? "clamp(32px, 4vw, 56px)" : "20px";
    var alignValue = align === "start" ? "flex-start"
                   : align === "end"   ? "flex-end"
                   : align === "center" ? "center"
                   : "stretch";
    return h("section", { key: key, className: "column-block", "data-gap": gap, "data-align": align },
      s.heading ? h("p", { className: "column-heading" }, s.heading) : null,
      h("div", { className: "column-stack", style: { display: "flex", flexDirection: "column", gap: gapValue, alignItems: alignValue } },
        items.map(function (child, i) {
          return h("div", { key: i, className: "column-cell" }, renderSection(child, i, false, isAr, getAsset));
        })
      )
    );
  }

  function renderButton(s, key) {
    var variant = s.variant || "primary";
    return h("a", { key: key, className: "btn btn-" + variant, href: s.href || "#" }, s.label || "");
  }

  function renderButtonRow(s, key) {
    var items = s.items || [];
    return h("div", {
      key: key,
      className: "button-row-block",
      "data-align": s.align || "start",
      "data-gap": s.gap || "tight",
    }, items.map(function (it, i) {
      var v = it.variant || "primary";
      return h("a", { key: i, className: "btn btn-" + v, href: it.href || "#" }, it.label || "");
    }));
  }

  function renderDoctorCredit(s, key, isAr, getAsset) {
    var src = s.avatar || "";
    if (src && getAsset) src = getAsset(src).toString();
    var lead = s.leadLabel || (isAr ? "بإشراف" : "Led by");
    var sep = isAr ? "، " : ", ";
    return h("div", { key: key, className: "credit" },
      src ? h("img", { className: "credit-avatar", src: src, alt: s.avatarAlt || s.name || "", width: 52, height: 52 }) : null,
      h("div", { className: "credit-body" },
        h("p", null, lead + " ", h("strong", null, s.name || ""), sep + (s.title || "")),
        (s.linkLabel && s.linkHref)
          ? h("a", { className: "credit-link", href: s.linkHref }, s.linkLabel)
          : null
      )
    );
  }

  function renderLabelTile(s, key) {
    return h("div", { key: key, className: "label-tile", "aria-hidden": "true" },
      h("p", null,
        s.label || "",
        s.sublabel ? h("br", null) : null,
        s.sublabel ? s.sublabel : null
      )
    );
  }

  function renderContactStrip(s, key) {
    var columns = toArray(s.columns);
    return h("section", { key: key, className: "strip" },
      (s.eyebrow || s.body) ? h("div", { className: "strip-copy" },
        s.eyebrow ? h("p", { className: "strip-eyebrow" }, s.eyebrow) : null,
        s.body    ? h("p", { className: "strip-body"    }, s.body)    : null
      ) : null,
      columns.map(function (col, i) {
        var items = toArray(col.items);
        return h("div", { key: i, className: "strip-col" },
          h("p", { className: "strip-label" }, col.label || ""),
          items.map(function (it, j) {
            return h("p", { key: j },
              it.href ? h("a", { href: it.href }, it.text || "") : (it.text || "")
            );
          })
        );
      })
    );
  }

  function renderChips(s, key) {
    var items = s.items || [];
    return h("section", { key: key, className: "chips-block" },
      s.heading ? h("p", { className: "chips-heading" }, s.heading) : null,
      h("div", { className: "chips-row" },
        items.map(function (c, i) {
          return h("span", { key: i, className: "chip" }, c || "");
        })
      )
    );
  }

  function renderFaq(s, key, isAr) {
    var items = s.items || [];
    var heading = s.heading || (isAr ? "أسئلة شائعة" : "Common questions");
    return h("section", { key: key, className: "faq-block" },
      h("h2", { className: "faq-heading" }, heading),
      h("dl", { className: "faq-list" },
        items.map(function (it, i) {
          return h("div", { key: i, className: "faq-item" },
            h("dt", { className: "faq-q" }, it.question || ""),
            h("dd", { className: "faq-a", dangerouslySetInnerHTML: { __html: rewriteLinks(it.answer || "") } })
          );
        })
      )
    );
  }

  var PLATFORM_ICON = {
    facebook:  "fa-brands fa-facebook-f",
    instagram: "fa-brands fa-instagram",
    youtube:   "fa-brands fa-youtube",
    telegram:  "fa-brands fa-telegram",
    tiktok:    "fa-brands fa-tiktok",
    twitter:   "fa-brands fa-twitter",
    x:         "fa-brands fa-x-twitter",
    linkedin:  "fa-brands fa-linkedin-in",
    whatsapp:  "fa-brands fa-whatsapp",
  };
  var PLATFORM_LABEL = {
    facebook: "Facebook", instagram: "Instagram", youtube: "YouTube",
    telegram: "Telegram", tiktok: "TikTok", twitter: "Twitter",
    x: "X (Twitter)", linkedin: "LinkedIn", whatsapp: "WhatsApp",
  };

  function renderSocialRow(s, key) {
    var items = s.items || [];
    return h("section", { key: key, className: "social-row-block" },
      s.heading ? h("p", { className: "social-row-heading" }, s.heading) : null,
      h("ul", { className: "social-row-list" },
        items.map(function (it, i) {
          var platform = it.platform || "facebook";
          var icon     = PLATFORM_ICON[platform] || PLATFORM_ICON.facebook;
          return h("li", { key: i },
            h("a", {
              href: it.href || "#",
              target: "_blank",
              rel: "noopener",
              "aria-label": it.label || PLATFORM_LABEL[platform] || platform,
            }, h("i", { className: icon, "aria-hidden": "true" }))
          );
        })
      )
    );
  }

  function renderMap(s, key) {
    var aspect = s.aspect || "16/9";
    return h("section", { key: key, className: "map-block" },
      s.heading ? h("h2", { className: "map-heading" }, s.heading) : null,
      h("div", { className: "map-frame", style: { aspectRatio: aspect } },
        h("iframe", {
          src: s.embedUrl || "",
          title: s.title || "",
          loading: "lazy",
          referrerPolicy: "no-referrer-when-downgrade",
          allowFullScreen: true,
        })
      )
    );
  }

  function renderCards(s, key) {
    var items = s.items || [];
    return h("section", { key: key, className: "cards-block" },
      h("p", { className: "cards-label" }, s.heading || "Related reading"),
      h("div", { className: "cards-grid" },
        items.map(function (path, i) {
          var parts      = (path || "").replace(/^\//, "").replace(/\/$/, "").split("/");
          var collection = parts[0] || "—";
          var slug       = parts[1] || path;
          var title      = slug.replace(/-/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
          return h("div", { key: i, className: "xcard" },
            h("div", { className: "xcard-top" },
              h("span", { className: "xcard-badge" }, collection)
            ),
            h("p", { className: "xcard-title" }, title),
            h("p", { className: "xcard-placeholder" }, path)
          );
        })
      )
    );
  }

  /* ── Article labels (mirrors src/lib/labels.ts) ─────────────────────── */

  var PREVIEW_LABELS = {
    treatments: {
      en: {
        home: "Home", collection: "Conditions",
        pathwayLabel: "Pathway", reviewedByLabel: "Reviewed by",
        reviewer: "Hussein Imran Mousa, consultant neurosurgeon",
        readingTimeLabel: "Reading time", lastReviewedLabel: "Last reviewed",
        tocLabel: "On this page", callLabel: "Discuss this",
        callBody: "Speak to the secretary about a consultation for this condition.",
        ctaHeading: "Book a consultation",
        ctaBody: "The secretary schedules first appointments during clinic hours; please have prior imaging, operative notes and a current medication list available.",
        noSections: "No sections yet.",
      },
      ar: {
        home: "الرئيسية", collection: "الحالات",
        pathwayLabel: "المسار", reviewedByLabel: "تمت المراجعة من قبل",
        reviewer: "الدكتور حسين عمران موسى، استشاري جراحة الأعصاب",
        readingTimeLabel: "وقت القراءة", lastReviewedLabel: "آخر مراجعة",
        tocLabel: "في هذه الصفحة", callLabel: "للاستفسار",
        callBody: "تحدث مع السكرتير لحجز استشارة حول هذه الحالة.",
        ctaHeading: "احجز استشارة",
        ctaBody: "يقوم السكرتير بجدولة المواعيد الأولى خلال ساعات العمل.",
        noSections: "لا توجد أقسام بعد.",
      },
    },
    services: {
      en: {
        home: "Home", collection: "Services",
        tocLabel: "On this page", callLabel: "Book now",
        callBody: "Speak to the secretary about this service.",
        ctaHeading: "Book a consultation",
        ctaBody: "The secretary schedules first appointments during clinic hours.",
        noSections: "No sections yet.",
      },
      ar: {
        home: "الرئيسية", collection: "الخدمات",
        tocLabel: "في هذه الصفحة", callLabel: "احجز الآن",
        callBody: "تحدث مع السكرتير حول هذه الخدمة.",
        ctaHeading: "احجز استشارة",
        ctaBody: "يقوم السكرتير بجدولة المواعيد الأولى خلال ساعات العمل.",
        noSections: "لا توجد أقسام بعد.",
      },
    },
    blog: {
      en: {
        home: "Home", collection: "Blog",
        reviewedByLabel: "Reviewed by",
        reviewer: "Hussein Imran Mousa, consultant neurosurgeon",
        readingTimeLabel: "Reading time", lastReviewedLabel: "Last reviewed",
        tocLabel: "On this page", callLabel: "Questions?",
        callBody: "Contact us to discuss this topic with our team.",
        ctaHeading: "Need more information?",
        ctaBody: "Reach out to our team for more details about the topics covered in this article.",
        noSections: "No sections yet.",
      },
      ar: {
        home: "الرئيسية", collection: "المدوّنة",
        reviewedByLabel: "تمت المراجعة من قبل",
        reviewer: "الدكتور حسين عمران موسى، استشاري جراحة الأعصاب",
        readingTimeLabel: "وقت القراءة", lastReviewedLabel: "آخر مراجعة",
        tocLabel: "في هذه الصفحة", callLabel: "أسئلة؟",
        callBody: "تواصل معنا لمناقشة هذا الموضوع مع فريقنا.",
        ctaHeading: "هل تحتاج إلى مزيد من المعلومات؟",
        ctaBody: "تواصل معنا للحصول على المزيد من التفاصيل.",
        noSections: "لا توجد أقسام بعد.",
      },
    },
  };

  /* ── Body markdown renderer ──────────────────────────────────────────── */
  // Legacy .md files still carry a raw markdown body below the frontmatter.
  // We parse it with marked (loaded from CDN in /admin/index.astro) and then
  // post-process the resulting HTML so YouTube-only paragraphs and standalone
  // images gain the same chrome as the Media block (border + caption strip).

  var YT_RE = /^(?:https?:)?\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{6,20})/;

  function ytIdFromHref(href) {
    if (!href) return null;
    var m = String(href).match(YT_RE);
    return m ? m[1] : null;
  }

  // Replace <p><a href="youtube…">…</a></p> with a media-frame iframe embed.
  function transformYouTube(html) {
    return html.replace(
      /<p>\s*<a[^>]*href="([^"]+)"[^>]*>[^<]*<\/a>\s*<\/p>/g,
      function (m, href) {
        var id = ytIdFromHref(href);
        if (!id) return m;
        return '<figure class="media body-media">'
          + '<div class="media-frame" style="aspect-ratio:16/9;">'
          + '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '"'
          + ' title="YouTube video" loading="lazy"'
          + ' referrerpolicy="strict-origin-when-cross-origin"'
          + ' allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"'
          + ' allowfullscreen></iframe>'
          + '</div></figure>';
      }
    );
  }

  // Replace <p><img …></p> with a media-frame figure. Preserves alt as caption.
  function transformImages(html) {
    return html.replace(
      /<p>\s*<img\s+([^>]*)\/?>\s*<\/p>/g,
      function (m, attrs) {
        var altM = attrs.match(/alt="([^"]*)"/);
        var alt  = altM ? altM[1] : "";
        var cap  = alt
          ? '<figcaption class="media-caption"><span class="media-caption-label">Figure</span><span class="media-caption-text">' + alt + '</span></figcaption>'
          : '';
        return '<figure class="media body-media">'
          + '<div class="media-frame"><img ' + attrs + '/></div>'
          + cap + '</figure>';
      }
    );
  }

  function renderBody(md, key) {
    if (!md || typeof md !== "string" || !md.trim()) return null;
    if (typeof window === "undefined" || !window.marked || !window.marked.parse) {
      // marked failed to load — fall back to plain paragraphs so preview still shows something.
      var paras = md.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
      return h("div", { key: key, className: "art-prose body-prose" },
        paras.map(function (p, i) {
          return h("p", { key: i, dangerouslySetInnerHTML: { __html: rewriteLinks(p) } });
        })
      );
    }
    var html = window.marked.parse(md, { breaks: true, gfm: true });
    html = transformYouTube(html);
    html = transformImages(html);
    return h("div", {
      key: key,
      className: "art-prose body-prose",
      dangerouslySetInnerHTML: { __html: html },
    });
  }

  /* ── Article preview helpers ─────────────────────────────────────────── */

  function buildPreviewToc(sections) {
    var toc = []; var n = 0;
    sections.forEach(function (s) {
      if (s && s.heading) { n++; toc.push({ id: "s-" + n, text: s.heading }); }
    });
    return toc;
  }

  function countWords(str) { return str ? str.trim().split(/\s+/).length : 0; }

  function estimateSectionWords(sections) {
    var total = 0;
    sections.forEach(function (s) {
      if (!s) return;
      ["body", "heading", "intro", "text"].forEach(function (k) { if (s[k]) total += countWords(s[k]); });
      if (Array.isArray(s.items)) s.items.forEach(function (it) {
        if (typeof it === "string") total += countWords(it);
        else if (it) ["body", "value", "label"].forEach(function (k) { if (it[k]) total += countWords(it[k]); });
      });
      if (Array.isArray(s.panels)) s.panels.forEach(function (p) {
        if (!p) return;
        if (p.title) total += countWords(p.title);
        if (Array.isArray(p.items)) p.items.forEach(function (it) { total += countWords(it); });
      });
    });
    return total;
  }

  function readingTimeStr(sections, isAr, extraBody) {
    var words = estimateSectionWords(sections) + countWords(extraBody || "");
    var mins  = Math.max(1, Math.round(words / 200));
    return isAr ? toAr(mins) + " دقائق" : mins + " min read";
  }

  function renderCrumbs(crumbs, isAr) {
    var sep = isAr ? "‹" : "›";
    var els = [];
    crumbs.forEach(function (c, i) {
      var last = i === crumbs.length - 1;
      els.push(last
        ? h("span", { key: "c" + i, className: "crumb-current" }, c.label)
        : h("a",    { key: "c" + i, className: "crumb-link", href: "#" }, c.label));
      if (!last) els.push(h("span", { key: "sep" + i, className: "crumb-sep", "aria-hidden": "true" }, sep));
    });
    return h("nav", { className: "crumbs" }, els);
  }

  /* ── Section dispatcher ──────────────────────────────────────────────── */

  function renderSection(s, i, isLast, isAr, getAsset) {
    if (!s || !s.type) return null;
    var key = "s" + i;
    switch (s.type) {
      case "prose":          return renderProse(s, key);
      case "highlights":     return renderHighlights(s, key);
      case "stats":          return renderStats(s, key);
      case "facts":          return renderFacts(s, key, isAr);
      case "list":           return renderList(s, key, isLast);
      case "quote":          return renderQuote(s, key);
      case "panels":         return renderPanels(s, key);
      case "media":          return renderMedia(s, key, getAsset);
      case "pathway":        return renderPathway(s, key);
      case "image-row":      return renderImageRow(s, key, getAsset);
      case "row":            return renderGenericRow(s, key, isAr, getAsset);
      case "column":         return renderColumn(s, key, isAr, getAsset);
      case "button":         return renderButton(s, key);
      case "button-row":     return renderButtonRow(s, key);
      case "doctor-credit":  return renderDoctorCredit(s, key, isAr, getAsset);
      case "label-tile":     return renderLabelTile(s, key);
      case "contact-strip":  return renderContactStrip(s, key);
      case "chips":          return renderChips(s, key);
      case "faq":            return renderFaq(s, key, isAr);
      case "social-row":     return renderSocialRow(s, key);
      case "map":            return renderMap(s, key);
      case "cards":          return renderCards(s, key);
      default:               return null;
    }
  }

  function lastListIndex(sections) {
    var idx = -1;
    sections.forEach(function (s, i) { if (s && s.type === "list") idx = i; });
    return idx;
  }

  /* ── Article preview (treatments / services / blog) ─────────────────── */

  function makeArticlePreview(locale, kind) {
    return createClass({
      getInitialState: function () { return { dark: false }; },
      render: function () {
        var self     = this;
        var entry    = this.props.entry;
        var getAsset = this.props.getAsset;
        var isAr     = locale === "ar";
        var L        = PREVIEW_LABELS[kind][locale];
        var toggle   = function (e) {
          var next = !self.state.dark;
          self.setState({ dark: next });
          var html = e.currentTarget.ownerDocument.documentElement;
          if (next) html.setAttribute("data-theme", "dark");
          else html.removeAttribute("data-theme");
        };

        var title       = entry.getIn(["data", "title"])       || "";
        var description = entry.getIn(["data", "description"]) || "";
        var category    = entry.getIn(["data", "category"])    || "";
        var dateRaw     = entry.getIn(["data", "publishedAt"]) || entry.getIn(["data", "updated"]) || "";
        var sections    = toArray(entry.getIn(["data", "sections"]));
        var bodyMd      = entry.getIn(["data", "body"]) || "";
        var llIdx       = lastListIndex(sections);

        var toc = buildPreviewToc(sections);
        var dateStr = dateRaw
          ? new Date(dateRaw).toLocaleDateString(isAr ? "ar-IQ" : "en-US", { month: "long", year: "numeric" })
          : "—";

        // Meta strip — treatments and blog only
        var meta = [];
        if (kind === "treatments") {
          if (category) meta.push({ label: L.pathwayLabel,      value: category });
          meta.push(     { label: L.reviewedByLabel,  value: L.reviewer });
          meta.push(     { label: L.readingTimeLabel, value: readingTimeStr(sections, isAr, bodyMd) });
          if (dateStr !== "—") meta.push({ label: L.lastReviewedLabel, value: dateStr });
        } else if (kind === "blog") {
          meta.push({ label: L.reviewedByLabel,  value: L.reviewer });
          meta.push({ label: L.readingTimeLabel, value: readingTimeStr(sections, isAr, bodyMd) });
          if (dateStr !== "—") meta.push({ label: L.lastReviewedLabel, value: dateStr });
        }

        // Breadcrumbs
        var crumbs = [{ label: L.home }, { label: L.collection }];
        if (category) crumbs.push({ label: category });

        var disclaimer = isAr
          ? "تقدم هذه الصفحة معلومات عامة حول " + title + " وليست بديلاً عن التقييم الطبي الفردي. إذا كانت أعراضك شديدة أو تزداد سوءاً، فاتصل بطبيب على الفور."
          : "This page provides general information about " + (title || "this condition").toLowerCase() + " and is not a substitute for individual medical assessment. If your symptoms are severe or worsening, contact a clinician promptly.";

        var sectionEls = sections.map(function (s, i) {
          return renderSection(s, i, i === llIdx, isAr, getAsset);
        }).filter(Boolean);

        return h("div", { className: "article-preview", dir: isAr ? "rtl" : "ltr", lang: locale },
          themeBtn(toggle),

          // ── Header band ──────────────────────────────────────────────
          h("section", { className: "art-head-band" },
            h("div", { className: "art-head-wrap" },
              renderCrumbs(crumbs, isAr),
              h("div", { className: "art-head-grid" },
                h("div", { className: "art-head-copy" },
                  h("h1", { className: "art-h1" }, title || (isAr ? "(بدون عنوان)" : "(untitled)")),
                  description ? h("p", { className: "art-standfirst" }, description) : null
                ),
                meta.length > 0 ? h("dl", { className: "art-meta" },
                  meta.map(function (m, i) {
                    return h("div", { key: i },
                      h("dt", null, m.label),
                      h("dd", null, m.value)
                    );
                  })
                ) : null
              )
            )
          ),

          // ── Body container ────────────────────────────────────────────
          h("div", { className: "art-container" },
            h("div", { className: "art-grid" },

              // Sidebar
              h("aside", { className: "art-aside" },
                toc.length >= 2 ? h("nav", { className: "art-toc" },
                  h("p",    { className: "art-toc-label" }, L.tocLabel),
                  h("span", { className: "art-toc-rule"  }),
                  toc.map(function (t, i) {
                    return h("a", { key: i, href: "#" + t.id }, t.text);
                  })
                ) : null,
                h("div", { className: "art-call-card" },
                  h("p", { className: "art-call-label" }, L.callLabel),
                  h("p", { className: "art-call-body"  }, L.callBody),
                  h("a", { className: "art-call-btn", href: "tel:+9647801926801", dir: "ltr" },
                    "+964-780-1926-801")
                )
              ),

              // Article body
              h("article", { className: "art-body" },
                sectionEls.length > 0 ? sectionEls : null,
                renderBody(bodyMd, "body"),
                (sectionEls.length === 0 && !bodyMd)
                  ? h("p", { style: { color: "var(--muted)", fontSize: "14px", paddingTop: "32px" } }, L.noSections)
                  : null,

                // CTA
                h("section", { className: "art-cta" },
                  h("div", null,
                    h("h2", null, L.ctaHeading),
                    h("p",  null, L.ctaBody)
                  ),
                  h("div", { className: "art-cta-buttons" },
                    h("a", { className: "art-cta-btn",         href: "tel:+9647801926801", dir: "ltr" }, "+964-780-1926-801"),
                    h("a", { className: "art-cta-btn art-cta-btn--sec", href: "tel:+9647706774773", dir: "ltr" }, "+964-770-6774-773")
                  )
                ),

                // Disclaimer
                h("p", { className: "art-disclaimer" }, disclaimer)
              )
            )
          )
        );
      }
    });
  }

  /* ── Registration ────────────────────────────────────────────────────── */
  // Collections are now unified (doctors / treatments / services / blog).
  // Each collection uses nested:depth and contains both en.md and ar.md.
  // The entry slug is the locale code ("en" or "ar"), so we detect it at render.

  // With `nested: subfolders: false`, the entry slug is the full folder path
  // (e.g. "als/en" or "surgery/vertebroplasty/ar"). The last path segment
  // is the locale filename. We also fall back to the entry's `path` field
  // if present.
  function detectLocale(entry) {
    var slug = (entry.get("slug") || "").toLowerCase();
    var path = (entry.get("path") || "").toLowerCase();
    var basis = path || slug;
    // Match ".../ar" or ".../ar.md" (with or without extension)
    return /(?:^|\/)ar(?:\.md)?$/.test(basis) ? "ar" : "en";
  }

  function makeArticlePreviewAuto(kind) {
    var enCls = makeArticlePreview("en", kind);
    var arCls = makeArticlePreview("ar", kind);
    return createClass({
      getInitialState: function () { return { dark: false }; },
      render: function () {
        var cls = detectLocale(this.props.entry) === "ar" ? arCls : enCls;
        return h(cls, this.props);
      }
    });
  }

  // Pages preview — a chrome-less article view that renders the sections
  // through the same block dispatcher the live site uses. Reuses the
  // existing `.article-preview` + `.art-container` + `.art-body` shell so
  // the preview picks up every block's production CSS (grid, typography,
  // responsive breakpoints) by inheritance. No sidebar TOC, no CTA — just
  // the sections, which is how home / about / contact / follow render in
  // production.
  function makePagesPreview() {
    return createClass({
      getInitialState: function () { return { dark: false }; },
      render: function () {
        var self     = this;
        var entry    = this.props.entry;
        var data     = entry && entry.get("data") ? entry.get("data").toJS() : {};
        var isAr     = detectLocale(entry) === "ar";
        var getAsset = this.props.getAsset;
        var sections = toArray(data.sections);
        var lastIdx  = lastListIndex(sections);

        var toggle = function (e) {
          var next = !self.state.dark;
          self.setState({ dark: next });
          var html = e.currentTarget.ownerDocument.documentElement;
          if (next) html.setAttribute("data-theme", "dark");
          else html.removeAttribute("data-theme");
        };

        var els = sections
          .map(function (s, i) { return renderSection(s, i, i === lastIdx, isAr, getAsset); })
          .filter(Boolean);

        return h("div", { className: "article-preview pages-preview", dir: isAr ? "rtl" : "ltr", lang: isAr ? "ar" : "en" },
          themeBtn(toggle),
          h("div", { className: "art-container" },
            h("article", { className: "art-body art-body--full" },
              els.length > 0
                ? els
                : h("p", { className: "art-empty" },
                    isAr ? "أضف أقسامًا لتظهر المعاينة." : "Add some sections to see the preview.")
            )
          )
        );
      }
    });
  }

  // Preview registration.
  //
  // Sveltia requires calling CMS.registerPreviewTemplate(<collection>, …)
  // per collection — there is no wildcard. We work around that by using
  // ONE function (makePagesPreview) that renders any sections-based page,
  // and registering it for every page-like collection. Adding a new
  // folder-based page later is a one-line edit here.
  //
  // The three article kinds get a dedicated preview because their chrome
  // is different: breadcrumbs, meta strip, sidebar TOC, inline CTA. If a
  // new "article-like" collection appeared, point it at makeArticlePreviewAuto.
  // If a new "page-like" collection appeared (hero + sections), point it
  // at makePagesPreview.
  // Doctors render through the same PlainTemplate as home/about/contact
  // (hero + CV + memberships are all sections), so the preview reuses
  // makePagesPreview — same chrome, same block dispatcher.
  CMS.registerPreviewTemplate("doctors",    makePagesPreview());
  CMS.registerPreviewTemplate("treatments", makeArticlePreviewAuto("treatments"));
  CMS.registerPreviewTemplate("services",   makeArticlePreviewAuto("services"));
  CMS.registerPreviewTemplate("blog",       makeArticlePreviewAuto("blog"));
  // `files` collections — Sveltia dispatches by `fileName ?? collectionName`,
  // so the key for a files-type entry is the file's `name:` field, not the
  // collection name. Our files collections (home + about) both use `name: en`
  // and `name: ar`, so one registration each handles every files collection
  // we have now and any future ones that follow the same locale convention.
  // Folder collections above are unaffected (their fileName is undefined, so
  // Sveltia falls back to the collection name — which is already registered).
  CMS.registerPreviewTemplate("en", makePagesPreview());
  CMS.registerPreviewTemplate("ar", makePagesPreview());
  CMS.registerPreviewStyle("/admin/preview.css");
})();
