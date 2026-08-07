/**
 * The 6-item top navbar. Every real clinic navbar looks like this — Mayo,
 * Cleveland Clinic, Johns Hopkins all top out around 5–7 items. Individual
 * treatment/service pages are reached via the category landing pages listed
 * in the dropdowns, not by cramming 100+ items into the header.
 *
 * The exhaustive taxonomy still lives in `navigation.ts` — it drives the
 * legacy-URL redirect map, sitemap ordering, and any "all pages" listing.
 * Header display uses this file.
 *
 * Each item and column has both English (`label`) and Arabic (`labelAr`).
 * Header.astro picks the right one based on the current locale, falling
 * back to English when Arabic isn't provided.
 */

export interface HeaderNavItem {
  label: string;
  labelAr?: string;
  href: string;
  columns?: HeaderNavColumn[];   // when set, item renders as mega-menu
}

export interface HeaderNavColumn {
  label: string;
  labelAr?: string;
  href?: string;                 // heading may be a link or plain text
  items: HeaderNavLink[];
}

export interface HeaderNavLink {
  label: string;
  labelAr?: string;
  href: string;
}

export const HEADER_NAV: HeaderNavItem[] = [
  { label: "Home", labelAr: "الرئيسية", href: "/" },

  {
    label: "Conditions",
    labelAr: "الحالات",
    href: "/treatments/",
    columns: [
      {
        label: "Pain",
        labelAr: "الألم",
        href: "/treatments/pain/",
        items: [
          { label: "Headaches",              labelAr: "الصداع",                 href: "/treatments/headaches/" },
          { label: "Neck pain",              labelAr: "ألم الرقبة",             href: "/treatments/neck-pain/" },
          { label: "Back pain",              labelAr: "ألم الظهر",              href: "/treatments/back-pain/" },
          { label: "Sciatica",               labelAr: "عرق النسا",              href: "/treatments/sciatica/" },
          { label: "Frozen shoulder",        labelAr: "الكتف المتجمدة",         href: "/treatments/frozen-shoulder/" },
          { label: "Knee pain",              labelAr: "ألم الركبة",             href: "/treatments/knee-pain/" },
          { label: "Fibromyalgia",           labelAr: "الألم العضلي الليفي",    href: "/treatments/fibromyalgia/" },
          { label: "All pain conditions →",  labelAr: "جميع حالات الألم ←",     href: "/treatments/pain/" },
        ],
      },
      {
        label: "Brain",
        labelAr: "الدماغ",
        href: "/treatments/brain/",
        items: [
          { label: "Stroke",                 labelAr: "السكتة الدماغية",        href: "/treatments/stroke/" },
          { label: "Brain tumor",            labelAr: "ورم الدماغ",             href: "/treatments/brain-tumor/" },
          { label: "Epilepsy & seizures",    labelAr: "الصرع والنوبات",         href: "/treatments/epilepsy-seizures/" },
          { label: "Head injury",            labelAr: "إصابة الرأس",            href: "/treatments/head-injury/" },
          { label: "Bell's palsy",           labelAr: "شلل بيل",                href: "/treatments/bells-palsy/" },
          { label: "All brain conditions →", labelAr: "جميع حالات الدماغ ←",    href: "/treatments/brain/" },
        ],
      },
      {
        label: "Spine",
        labelAr: "العمود الفقري",
        href: "/treatments/spine/",
        items: [
          { label: "Herniated disc",         labelAr: "الانزلاق الغضروفي",      href: "/treatments/herniated-disc/" },
          { label: "Scoliosis",              labelAr: "الجنف",                  href: "/treatments/scoliosis/" },
          { label: "Kyphosis",               labelAr: "الحداب",                 href: "/treatments/kyphosis/" },
          { label: "Spinal cord injury",     labelAr: "إصابة النخاع الشوكي",    href: "/treatments/spinal-cord-injury/" },
          { label: "Whiplash",               labelAr: "إصابة العنق",            href: "/treatments/whiplash/" },
          { label: "All spine conditions →", labelAr: "جميع حالات العمود ←",    href: "/treatments/spine/" },
        ],
      },
      {
        label: "More",
        labelAr: "المزيد",
        items: [
          { label: "Motor disorders",        labelAr: "اضطرابات الحركة",        href: "/treatments/motor-disorders/" },
          { label: "Pediatric neurosurgery", labelAr: "جراحة الأعصاب للأطفال",  href: "/treatments/pediatric-neurosurgery/" },
          { label: "Neurogenic bladder",     labelAr: "المثانة العصبية",        href: "/treatments/neurogenic-bladder/" },
          { label: "Parkinson's disease",    labelAr: "مرض باركنسون",           href: "/treatments/parkinsons-disease/" },
          { label: "Multiple sclerosis",     labelAr: "التصلب المتعدد",         href: "/treatments/multiple-sclerosis/" },
          { label: "Full A–Z index →",       labelAr: "الفهرس الكامل ←",        href: "/treatments/" },
        ],
      },
    ],
  },

  {
    label: "Services",
    labelAr: "الخدمات",
    href: "/services/",
    columns: [
      {
        label: "Rehabilitation & Therapy",
        labelAr: "التأهيل والعلاج",
        items: [
          { label: "Rehabilitation",         labelAr: "التأهيل الطبي",           href: "/services/rehabilitation/" },
          { label: "Physiotherapy",          labelAr: "العلاج الطبيعي",          href: "/services/physiotherapy/" },
          { label: "Chiropractic",           labelAr: "الكيروبراكتيك",           href: "/services/chiropractic/" },
          { label: "Acupuncture",            labelAr: "الوخز بالإبر",            href: "/services/acupuncture/" },
          { label: "Exercises",              labelAr: "التمارين",                href: "/services/exercises/" },
        ],
      },
      {
        label: "Pain Management",
        labelAr: "إدارة الألم",
        items: [
          { label: "Interventional pain",    labelAr: "علاج الألم التداخلي",     href: "/services/pain-management/" },
          { label: "Radiofrequency",         labelAr: "الترددات الراديوية",      href: "/services/radiofrequency/" },
          { label: "Steroid injection",      labelAr: "حقن الكورتيزون",          href: "/services/steroid-injection/" },
          { label: "Ozone therapy",          labelAr: "علاج الأوزون",            href: "/services/ozone-therapy/" },
          { label: "BOTOX",                  labelAr: "البوتوكس",                href: "/services/botox/" },
        ],
      },
      {
        label: "Advanced Care",
        labelAr: "الرعاية المتقدمة",
        items: [
          { label: "Brain stimulation",      labelAr: "التحفيز الدماغي",         href: "/services/brain-stimulation/" },
          { label: "Surgery",                labelAr: "الجراحة",                 href: "/services/surgery/" },
          { label: "Regenerative medicine",  labelAr: "الطب التجديدي",           href: "/services/regenerative-medicine/" },
          { label: "Fitness",                labelAr: "اللياقة البدنية",         href: "/services/fitness/" },
          { label: "All services →",         labelAr: "جميع الخدمات ←",          href: "/services/" },
        ],
      },
    ],
  },

  { label: "Doctors", labelAr: "الأطباء", href: "/doctors/" },
  { label: "About",   labelAr: "من نحن",  href: "/about/" },
  { label: "Contact", labelAr: "اتصل بنا", href: "/contact/" },
];

/** Pick the label for the current locale, falling back to English. */
export function navLabel<T extends { label: string; labelAr?: string }>(
  item: T,
  locale: "en" | "ar",
): string {
  if (locale === "ar" && item.labelAr) return item.labelAr;
  return item.label;
}
