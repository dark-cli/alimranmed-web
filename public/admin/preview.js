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

  function readingTimeStr(sections, isAr) {
    var mins = Math.max(1, Math.round(estimateSectionWords(sections) / 200));
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
      getInitialState: function () { return { dark: false }; },
      render: function () {
        var self     = this;
        var entry    = this.props.entry;
        var getAsset = this.props.getAsset;
        var isAr     = locale === "ar";
        var toggle   = function (e) {
          var next = !self.state.dark;
          self.setState({ dark: next });
          var html = e.currentTarget.ownerDocument.documentElement;
          if (next) html.setAttribute("data-theme", "dark");
          else html.removeAttribute("data-theme");
        };

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

        elements.unshift(themeBtn(toggle));
        return h("div", { className: "doctor-preview", dir: isAr ? "rtl" : "ltr", lang: locale }, elements);
      }
    });
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
          meta.push(     { label: L.readingTimeLabel, value: readingTimeStr(sections, isAr) });
          if (dateStr !== "—") meta.push({ label: L.lastReviewedLabel, value: dateStr });
        } else if (kind === "blog") {
          meta.push({ label: L.reviewedByLabel,  value: L.reviewer });
          meta.push({ label: L.readingTimeLabel, value: readingTimeStr(sections, isAr) });
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
                sectionEls.length > 0
                  ? sectionEls
                  : h("p", { style: { color: "var(--muted)", fontSize: "14px", paddingTop: "32px" } }, L.noSections),

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

  CMS.registerPreviewTemplate("doctors_en",    makeDocPreview("en"));
  CMS.registerPreviewTemplate("doctors_ar",    makeDocPreview("ar"));
  CMS.registerPreviewTemplate("treatments_en", makeArticlePreview("en", "treatments"));
  CMS.registerPreviewTemplate("treatments_ar", makeArticlePreview("ar", "treatments"));
  CMS.registerPreviewTemplate("services_en",   makeArticlePreview("en", "services"));
  CMS.registerPreviewTemplate("services_ar",   makeArticlePreview("ar", "services"));
  CMS.registerPreviewTemplate("blog_en",       makeArticlePreview("en", "blog"));
  CMS.registerPreviewTemplate("blog_ar",       makeArticlePreview("ar", "blog"));
  CMS.registerPreviewStyle("/admin/preview.css");
})();
