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

  function renderHero(s, ctx, key) {
    var titles = ctx.titles;
    return h("section", { key: key, className: "cv-head-band" },
      h("div", { className: "cv-head" },
        h("div", { className: "cv-head-copy" },
          h("p", { className: "cv-eyebrow" }, s.eyebrow || ""),
          h("h1", { className: "cv-h1" }, s.headline || ctx.fullName || ""),
          h("p", { className: "cv-lede" }, s.lede || ""),
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

  var DoctorPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var getAsset = this.props.getAsset;

      // Pull top-level fields once as plain JS.
      var fullName    = entry.getIn(["data", "fullName"]) || "";
      var photoAlt    = entry.getIn(["data", "photoAlt"]) || "";
      var photoField  = entry.getIn(["data", "photo"]);
      var titles      = toArray(entry.getIn(["data", "titles"]));
      var memberships = toArray(entry.getIn(["data", "memberships"]));
      var membershipsHeading = entry.getIn(["data", "membershipsHeading"]) || "Memberships";
      var sections    = toArray(entry.getIn(["data", "sections"]));

      // Resolve photo through getAsset so relative paths from Sveltia's media
      // library resolve (blob URLs while unsaved, absolute paths after save).
      var photoSrc = photoField
        ? (getAsset ? getAsset(photoField).toString() : photoField)
        : null;

      var ctx = {
        fullName: fullName,
        photoSrc: photoSrc,
        photoAlt: photoAlt,
        titles: titles
      };

      // Mirror DoctorSections.astro: memberships render after the second
      // cv_timeline (typically Education). Fall back to end of list.
      var timelineCount = 0;
      var membershipsInsertAfter = sections.length - 1;
      sections.forEach(function (s, i) {
        if (s && s.type === "cv_timeline") {
          timelineCount++;
          if (timelineCount === 2) membershipsInsertAfter = i;
        }
      });

      // Build an ordered list that includes an injected memberships block.
      var items = [];
      sections.forEach(function (s, i) {
        items.push({ kind: "section", s: s, idx: i });
        if (i === membershipsInsertAfter && memberships.length > 0) {
          items.push({ kind: "memberships" });
        }
      });

      // Last "register-style" element gets extra bottom padding.
      var lastRegisterIdx = -1;
      items.forEach(function (it, i) {
        if (it.kind === "memberships") lastRegisterIdx = i;
        else if (it.s && (it.s.type === "cv_timeline" || it.s.type === "cv_publications")) {
          lastRegisterIdx = i;
        }
      });

      var elements = items.map(function (it, i) {
        var isLast = i === lastRegisterIdx;
        if (it.kind === "memberships") {
          return renderMemberships(memberships, membershipsHeading, "m", isLast);
        }
        var s = it.s || {};
        var key = "s" + it.idx;
        if (s.type === "cv_hero")         return renderHero(s, ctx, key);
        if (s.type === "cv_stats")        return renderStats(s, key);
        if (s.type === "cv_timeline")     return renderTimeline(s, key, isLast);
        if (s.type === "cv_publications") return renderPublications(s, key, isLast);
        return null;
      });

      return h("div", { className: "doctor-preview" }, elements);
    }
  });

  CMS.registerPreviewTemplate("doctors_en", DoctorPreview);
  CMS.registerPreviewTemplate("doctors_ar", DoctorPreview);
  CMS.registerPreviewStyle("/admin/preview.css");
})();
