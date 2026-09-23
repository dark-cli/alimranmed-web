/*
 * Sveltia CMS preview template for doctor collections.
 *
 * Renders the same HTML structure as src/components/doctor/*.astro so the
 * preview pane in the editor matches the real /en/doctors/<slug>/ page.
 *
 * Kept in a plain ES5 <script> so it can be loaded directly by
 * public/admin/index.astro without a build step. The globals `CMS`,
 * `h` (React.createElement), and `createClass` come from the Sveltia bundle.
 *
 * Sync target: src/components/doctor/DoctorSections.astro (block dispatch
 * logic) and src/components/doctor/Cv*.astro (per-block markup + classes).
 */
(function () {
  "use strict";

  // Convert an Immutable.js value (what Decap/Sveltia hand us) to plain JS.
  // Handles undefined/null so we can .map safely.
  function toArray(v) {
    if (!v) return [];
    if (typeof v.toJS === "function") return v.toJS();
    return v;
  }

  // Hero is standalone (not a section) — rendered from the doctor's
  // top-level heroEyebrow / heroHeadline / heroLede fields, matching
  // DoctorSections.astro's behaviour.
  function renderHero(ctx, key) {
    var titles = ctx.titles;
    return h("section", { key: key, className: "cv-head-band" },
      h("div", { className: "cv-head" },
        h("div", { className: "cv-head-copy" },
          h("p", { className: "cv-eyebrow" }, ctx.heroEyebrow || ""),
          h("h1", { className: "cv-h1" }, ctx.heroHeadline || ctx.fullName || ""),
          h("p", { className: "cv-lede" }, ctx.heroLede || ""),
          titles.length > 0 && h("div", { className: "cv-chips" },
            titles.map(function (c, i) {
              return h("span", { key: i, className: "cv-chip" }, c);
            })
          )
        ),
        ctx.photoSrc && h("img", {
          className: "cv-portrait-img",
          src: ctx.photoSrc,
          alt: ctx.photoAlt || ctx.fullName || ""
        })
      )
    );
  }

  function renderStats(s, key) {
    var items = s.items || [];
    return h("section", { key: key, className: "cv-stats" },
      h("div", { className: "cv-stats-grid" },
        items.map(function (item, i) {
          return h("div", { key: i, className: "cv-stat-cell" },
            h("p", { className: "cv-stat-fig" }, item.fig || ""),
            h("p", { className: "cv-stat-desc" }, item.desc || "")
          );
        })
      )
    );
  }

  function renderTimeline(s, key, isLast) {
    var rows = s.rows || [];
    var cls = "reg-section" + (isLast ? " reg-section-last" : "");
    return h("section", { key: key, className: cls },
      h("div", { className: "reg-wrap" },
        h("h2", { className: "reg-label" }, s.heading || ""),
        h("div", { className: "reg-body" },
          rows.map(function (row, i) {
            return h("div", { key: i, className: "reg-row" },
              h("span", { className: "reg-period" }, row.period || ""),
              h("span", { className: "reg-text" }, row.body || "")
            );
          })
        )
      )
    );
  }

  function renderMemberships(items, heading, key, isLast) {
    var cls = "reg-section" + (isLast ? " reg-section-last" : "");
    return h("section", { key: key, className: cls },
      h("div", { className: "reg-wrap" },
        h("h2", { className: "reg-label" }, heading),
        h("ul", { className: "reg-body reg-members" },
          items.map(function (m, i) {
            return h("li", { key: i },
              m.name || "",
              h("span", { className: "member-year" }, m.year || "")
            );
          })
        )
      )
    );
  }

  function renderPublications(s, key, isLast) {
    var items = s.items || [];
    var cls = "reg-section" + (isLast ? " reg-section-last" : "");
    return h("section", { key: key, className: cls },
      h("div", { className: "reg-wrap" },
        h("h2", { className: "reg-label" }, s.heading || ""),
        h("ol", { className: "reg-body reg-pubs" },
          items.map(function (pub, i) {
            return h("li", { key: i },
              h("span", { className: "reg-period reg-period-wide" }, pub.year || ""),
              h("span", null,
                h("span", { className: "pub-title" }, pub.title || ""),
                h("span", { className: "pub-source" }, pub.source || "")
              )
            );
          })
        )
      )
    );
  }

  // Factory so we can register two templates that share the same render logic
  // but each knows its own locale (for RTL + Arabic fonts in the preview).
  function makePreview(locale) {
    return createClass({
      render: function () {
        return renderDoctorPreview(this.props, locale);
      }
    });
  }

  function renderDoctorPreview(props, locale) {
    var entry = props.entry;
    var getAsset = props.getAsset;
    var isAr = locale === "ar";

    // Pull top-level fields once as plain JS.
    var fullName     = entry.getIn(["data", "fullName"]) || "";
    var photoAlt     = entry.getIn(["data", "photoAlt"]) || "";
    var photoField   = entry.getIn(["data", "photo"]);
    var titles       = toArray(entry.getIn(["data", "titles"]));
    var heroEyebrow  = entry.getIn(["data", "heroEyebrow"]) || "";
    var heroHeadline = entry.getIn(["data", "heroHeadline"]) || "";
    var heroLede     = entry.getIn(["data", "heroLede"]) || "";
    var sections     = toArray(entry.getIn(["data", "sections"]));

    // Resolve photo through getAsset so relative paths from Sveltia's media
    // library resolve (blob URLs while unsaved, absolute paths after save).
    var photoSrc = photoField
      ? (getAsset ? getAsset(photoField).toString() : photoField)
      : null;

    var ctx = {
      fullName: fullName,
      photoSrc: photoSrc,
      photoAlt: photoAlt,
      titles: titles,
      heroEyebrow: heroEyebrow,
      heroHeadline: heroHeadline,
      heroLede: heroLede
    };

    // Last register-style block gets isLast for its bottom padding.
    var lastRegisterIdx = -1;
    sections.forEach(function (s, i) {
      if (s && (s.type === "cv_timeline" || s.type === "cv_memberships" || s.type === "cv_publications")) {
        lastRegisterIdx = i;
      }
    });

    // Hero renders first, unconditionally. Then sections loop.
    var elements = [renderHero(ctx, "hero")];
    sections.forEach(function (s, i) {
      var isLast = i === lastRegisterIdx;
      var key = "s" + i;
      if (!s) return;
      if (s.type === "cv_stats")        elements.push(renderStats(s, key));
      else if (s.type === "cv_timeline")     elements.push(renderTimeline(s, key, isLast));
      else if (s.type === "cv_memberships")  elements.push(renderMemberships(s.items || [], s.heading || "", key, isLast));
      else if (s.type === "cv_publications") elements.push(renderPublications(s, key, isLast));
    });

    // dir="rtl" on the wrapper flips the preview iframe's direction and
    // triggers the [dir="rtl"] font-stack + weight overrides in preview.css.
    return h("div", {
      className: "doctor-preview",
      dir: isAr ? "rtl" : "ltr",
      lang: locale
    }, elements);
  }

  CMS.registerPreviewTemplate("doctors_en", makePreview("en"));
  CMS.registerPreviewTemplate("doctors_ar", makePreview("ar"));
  CMS.registerPreviewStyle("/admin/preview.css");
})();
