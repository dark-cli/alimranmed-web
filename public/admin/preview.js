/*
 * Sveltia CMS preview templates — all collections.
 *
 * Registers live previews for:
 *   doctors_en / doctors_ar   — CvHero + unified section blocks
 *   treatments_en / _ar       — ArticleLayout + unified section blocks
 *   services_en / _ar         — same as treatments
 *   blog_en / _ar             — same as treatments
 *
 * Block renderers mirror the Astro components in src/components/blocks/.
 * CSS lives in preview.css (same file as before, with additions for the
 * unified block classes).
 *
 * Sync targets:
 *   src/components/blocks/*.astro      — block markup + class names
 *   src/components/doctor/CvHero.astro — hero markup
 *   src/content.config.ts              — section type names
 */
(function () {
  "use strict";

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
    return h("section", { key: key, className: "prose-block" },
      s.heading ? h("h2", { className: "prose-heading" }, s.heading) : null,
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
    return h("section", { key: key, className: "stats-block" },
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

  function renderMedia(s, key, getAsset) {
    var src = s.src || "";
    if (s.kind === "image" && src && getAsset) {
      src = getAsset(src).toString();
    }
    var frameStyle = s.aspect ? { aspectRatio: s.aspect } : {};
    var mediaEl;
    if (s.kind === "image") {
      mediaEl = h("img", { src: src, alt: s.alt || "", style: { width: "100%", display: "block" } });
    } else if (s.kind === "video") {
      mediaEl = h("video", { src: src, controls: true, style: { width: "100%" } });
    } else {
      mediaEl = h("div", { style: { background: "#111", color: "#fff", padding: "24px", fontSize: "13px" } }, "YouTube: " + src);
    }
    return h("figure", { key: key, className: "media" },
      h("div", { className: "media-frame", style: frameStyle }, mediaEl),
      s.caption ? h("figcaption", { className: "media-caption" },
        h("span", { className: "media-caption-label" }, "Figure"),
        h("span", { className: "media-caption-text" }, s.caption)
      ) : null
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

  function renderRow(s, key, getAsset) {
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

  function renderCards(s, key) {
    var slugs = s.slugs || [];
    return h("section", { key: key, className: "cards-block" },
      h("p", { className: "cards-title" }, s.heading || "Related reading"),
      h("div", { className: "cards-grid" },
        slugs.map(function (slug, i) {
          return h("span", { key: i, className: "card" },
            h("p", { className: "card-cat" }, "—"),
            h("p", { className: "card-name" }, slug)
          );
        })
      )
    );
  }

  /* ── Section dispatcher ──────────────────────────────────────────────── */

  function renderSection(s, i, isLast, isAr, getAsset) {
    if (!s || !s.type) return null;
    var key = "s" + i;
    switch (s.type) {
      case "prose":      return renderProse(s, key);
      case "highlights": return renderHighlights(s, key);
      case "stats":      return renderStats(s, key);
      case "facts":      return renderFacts(s, key, isAr);
      case "list":       return renderList(s, key, isLast);
      case "quote":      return renderQuote(s, key);
      case "panels":     return renderPanels(s, key);
      case "media":      return renderMedia(s, key, getAsset);
      case "pathway":    return renderPathway(s, key);
      case "row":        return renderRow(s, key, getAsset);
      case "cards":      return renderCards(s, key);
      default:           return null;
    }
  }

  function lastListIndex(sections) {
    var idx = -1;
    sections.forEach(function (s, i) { if (s && s.type === "list") idx = i; });
    return idx;
  }

  /* ── Doctor preview ──────────────────────────────────────────────────── */

  function renderHero(ctx, key) {
    return h("section", { key: key, className: "cv-head-band" },
      h("div", { className: "cv-head" },
        h("div", { className: "cv-head-copy" },
          h("p",  { className: "cv-eyebrow" }, ctx.heroEyebrow || ""),
          h("h1", { className: "cv-h1"      }, ctx.heroHeadline || ctx.fullName || ""),
          h("p",  { className: "cv-lede"    }, ctx.heroLede || ""),
          ctx.titles.length > 0 ? h("div", { className: "cv-chips" },
            ctx.titles.map(function (c, i) { return h("span", { key: i, className: "cv-chip" }, c); })
          ) : null
        ),
        ctx.photoSrc ? h("img", { className: "cv-portrait-img", src: ctx.photoSrc, alt: ctx.photoAlt || ctx.fullName || "" }) : null
      )
    );
  }

  function makeDocPreview(locale) {
    return createClass({
      render: function () {
        var entry    = this.props.entry;
        var getAsset = this.props.getAsset;
        var isAr     = locale === "ar";

        var fullName     = entry.getIn(["data", "fullName"]) || "";
        var photoAlt     = entry.getIn(["data", "photoAlt"]) || "";
        var photoField   = entry.getIn(["data", "photo"]);
        var titles       = toArray(entry.getIn(["data", "titles"]));
        var heroEyebrow  = entry.getIn(["data", "heroEyebrow"]) || "";
        var heroHeadline = entry.getIn(["data", "heroHeadline"]) || "";
        var heroLede     = entry.getIn(["data", "heroLede"]) || "";
        var sections     = toArray(entry.getIn(["data", "sections"]));

        var photoSrc = photoField ? (getAsset ? getAsset(photoField).toString() : photoField) : null;
        var llIdx    = lastListIndex(sections);

        var elements = [renderHero({
          fullName: fullName, photoSrc: photoSrc, photoAlt: photoAlt,
          titles: titles, heroEyebrow: heroEyebrow,
          heroHeadline: heroHeadline, heroLede: heroLede
        }, "hero")];

        sections.forEach(function (s, i) {
          var el = renderSection(s, i, i === llIdx, isAr, getAsset);
          if (el) elements.push(el);
        });

        return h("div", { className: "doctor-preview", dir: isAr ? "rtl" : "ltr", lang: locale }, elements);
      }
    });
  }

  /* ── Article preview (treatments / services / blog) ─────────────────── */

  function makeArticlePreview(locale) {
    return createClass({
      render: function () {
        var entry    = this.props.entry;
        var getAsset = this.props.getAsset;
        var isAr     = locale === "ar";

        var title       = entry.getIn(["data", "title"])       || "";
        var description = entry.getIn(["data", "description"]) || "";
        var category    = entry.getIn(["data", "category"])    || "";
        var sections    = toArray(entry.getIn(["data", "sections"]));
        var llIdx       = lastListIndex(sections);

        var sectionEls = sections.map(function (s, i) {
          return renderSection(s, i, i === llIdx, isAr, getAsset);
        }).filter(Boolean);

        return h("div", { className: "article-preview", dir: isAr ? "rtl" : "ltr", lang: locale },
          h("section", { className: "art-head-band" },
            h("div", { className: "art-head-wrap" },
              category ? h("p", { className: "art-eyebrow" }, category) : null,
              h("h1", { className: "art-h1" }, title || (isAr ? "(بدون عنوان)" : "(untitled)")),
              description ? h("p", { className: "art-standfirst" }, description) : null
            )
          ),
          h("div", { className: "art-container" },
            h("article", { className: "art-body-full" },
              sectionEls.length > 0
                ? sectionEls
                : h("p", { style: { color: "var(--muted)", fontSize: "14px" } },
                    isAr ? "لا توجد أقسام بعد." : "No sections yet.")
            )
          )
        );
      }
    });
  }

  /* ── Registration ────────────────────────────────────────────────────── */

  CMS.registerPreviewTemplate("doctors_en",    makeDocPreview("en"));
  CMS.registerPreviewTemplate("doctors_ar",    makeDocPreview("ar"));
  CMS.registerPreviewTemplate("treatments_en", makeArticlePreview("en"));
  CMS.registerPreviewTemplate("treatments_ar", makeArticlePreview("ar"));
  CMS.registerPreviewTemplate("services_en",   makeArticlePreview("en"));
  CMS.registerPreviewTemplate("services_ar",   makeArticlePreview("ar"));
  CMS.registerPreviewTemplate("blog_en",       makeArticlePreview("en"));
  CMS.registerPreviewTemplate("blog_ar",       makeArticlePreview("ar"));
  CMS.registerPreviewStyle("/admin/preview.css");
})();
