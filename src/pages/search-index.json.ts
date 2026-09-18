/**
 * Site-wide search index — served at /search-index.json.
 *
 * Emitted once at build time. The Header search field fetches it lazily on
 * first keystroke, filters client-side, and shows grouped results.
 *
 * One flat array; each entry carries its locale so the client can filter to
 * the current language. Both languages ship in a single file so the browser
 * caches it once and the language switcher doesn't need a re-fetch.
 *
 * Shape:
 *   { locale, type, category, title, description, href }
 *
 * type is one of "treatment" | "service" | "blog" | "case" | "doctor" | "page"
 * — used to group results and pick a label ("Condition", "Procedure", …).
 */

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { topicOf, localeOf, localizedHref } from "../lib/i18n";

type Entry = {
  locale: "en" | "ar";
  type: "treatment" | "service" | "blog" | "case" | "doctor" | "page" | "static";
  category?: string;
  title: string;
  description: string;
  href: string;
};

export const GET: APIRoute = async () => {
  const entries: Entry[] = [];

  // ── Content collections ────────────────────────────────────────────
  const push = (opts: {
    e: { id: string; data: { title?: string; description?: string; category?: string } };
    type: Entry["type"];
    pathPrefix: string;
  }) => {
    const loc = localeOf(opts.e.id);
    if (!loc) return;
    const topic = topicOf(opts.e.id);
    entries.push({
      locale: loc,
      type: opts.type,
      category: opts.e.data.category,
      title: opts.e.data.title ?? topic,
      description: opts.e.data.description ?? "",
      href: localizedHref(`${opts.pathPrefix}/${topic}/`, loc),
    });
  };

  const treatments = await getCollection("treatments");
  treatments.forEach((e) => push({ e, type: "treatment", pathPrefix: "/treatments" }));

  const services = await getCollection("services");
  services.forEach((e) => push({ e, type: "service", pathPrefix: "/services" }));

  const blog = await getCollection("blog");
  blog.forEach((e) => push({ e, type: "blog", pathPrefix: "/blog" }));

  const cases = await getCollection("cases");
  cases.forEach((e) => push({ e, type: "case", pathPrefix: "/cases" }));

  const doctors = await getCollection("doctors");
  doctors.forEach((e) => push({ e, type: "doctor", pathPrefix: "/doctors" }));

  // ── Static top-level pages ─────────────────────────────────────────
  // These aren't in a collection; hardcode with localized titles so the
  // search hits Home / About / Contact / index pages too.
  const STATIC: { titleEn: string; titleAr: string; descEn: string; descAr: string; path: string }[] = [
    { titleEn: "Home", titleAr: "الرئيسية",
      descEn: "Alimran Medical Center — neurosurgery, spine and pain medicine in Basra.",
      descAr: "مركز العمران الطبي — جراحة الأعصاب والعمود الفقري وطب الألم في البصرة.",
      path: "/" },
    { titleEn: "About the clinic", titleAr: "عن العيادة",
      descEn: "Our mission, vision and values.",
      descAr: "رسالتنا ورؤيتنا وقيمنا.",
      path: "/about/" },
    { titleEn: "Contact", titleAr: "اتصل بنا",
      descEn: "Phone, address and clinic hours.",
      descAr: "الهاتف والعنوان وساعات العمل.",
      path: "/contact/" },
    { titleEn: "Conditions & Procedures", titleAr: "الحالات والإجراءات",
      descEn: "What we treat and the procedures we offer.",
      descAr: "ما نعالجه والإجراءات التي نقدمها.",
      path: "/conditions/" },
    { titleEn: "Blog", titleAr: "المدونة",
      descEn: "Articles on neurology, spine and pain medicine.",
      descAr: "مقالات حول جراحة الأعصاب والعمود الفقري وطب الألم.",
      path: "/blog/" },
    { titleEn: "Treatments A–Z", titleAr: "قائمة الحالات",
      descEn: "Full A–Z index of conditions we treat.",
      descAr: "قائمة أبجدية لجميع الحالات التي نعالجها.",
      path: "/treatments/" },
    { titleEn: "Services", titleAr: "الخدمات",
      descEn: "Full index of procedures and therapies we offer.",
      descAr: "قائمة كاملة بالإجراءات والعلاجات التي نقدمها.",
      path: "/services/" },
    { titleEn: "Cases", titleAr: "الحالات",
      descEn: "Patient case studies.",
      descAr: "دراسات حالات المرضى.",
      path: "/cases/" },
    { titleEn: "Doctors", titleAr: "الأطباء",
      descEn: "Our medical team.",
      descAr: "فريقنا الطبي.",
      path: "/doctors/" },
  ];
  for (const s of STATIC) {
    entries.push({ locale: "en", type: "static", title: s.titleEn, description: s.descEn, href: localizedHref(s.path, "en") });
    entries.push({ locale: "ar", type: "static", title: s.titleAr, description: s.descAr, href: localizedHref(s.path, "ar") });
  }

  return new Response(JSON.stringify({ entries }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};

// Static site build: pre-render this endpoint so it exists as a plain file.
export const prerender = true;
